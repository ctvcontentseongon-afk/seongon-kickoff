import { NextRequest, NextResponse } from "next/server";
import { buildPresentation } from "@/lib/pptx";
import { uploadToDrive } from "@/lib/drive";
import type { PresentationContent } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { content }: { content: PresentationContent } = await req.json();

    const buffer = await buildPresentation(content);

    const useGoogleDrive = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (useGoogleDrive) {
      const safeName = content.clientName
        .replace(/[^a-zA-Z0-9À-ỹ\s]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      const fileName = `SEONGON_Kickoff_${safeName}_${date}.pptx`;

      const { fileId, driveLink } = await uploadToDrive(buffer, fileName);
      return NextResponse.json({ driveLink, fileId, fileName, mode: "drive" });
    }

    // Fallback: trả về file trực tiếp để download
    const safeFileName = content.clientName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9_\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_") || "Project";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `SEONGON_Kickoff_${safeFileName}_${dateStr}.pptx`;

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    console.error("[/api/export]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 60;
