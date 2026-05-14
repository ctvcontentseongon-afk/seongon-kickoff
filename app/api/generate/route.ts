import { NextRequest, NextResponse } from "next/server";
import { generateKickoffContent } from "@/lib/claude";
import { saveProjectHistory } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import type { ProjectInfo } from "@/types";

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  // Rate limiting: 10 lần/phút per IP
  const ip = getClientIp(req);
  const { allowed, remaining } = rateLimit(`generate:${ip}`, 10);
  if (!allowed) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu. Vui lòng đợi 1 phút rồi thử lại." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await req.json();
    const project: ProjectInfo = {
      clientName: sanitize(body.clientName ?? ""),
      website: sanitize(body.website ?? ""),
      industry: sanitize(body.industry ?? ""),
      businessGoals: sanitize(body.businessGoals ?? ""),
      targetKeywords: sanitize(body.targetKeywords ?? ""),
      targetAudience: sanitize(body.targetAudience ?? ""),
      competitors: sanitize(body.competitors ?? ""),
      currentIssues: sanitize(body.currentIssues ?? ""),
      budget: sanitize(body.budget ?? ""),
      timeline: sanitize(body.timeline ?? ""),
      projectManager: sanitize(body.projectManager ?? ""),
      seoLead: sanitize(body.seoLead ?? ""),
      additionalNotes: sanitize(body.additionalNotes ?? ""),
    };

    if (!project.clientName || !project.website || !project.industry) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: tên khách hàng, website, lĩnh vực" },
        { status: 400 }
      );
    }

    const content = await generateKickoffContent(project);

    // Lưu lịch sử vào database (bất đồng bộ, không block response)
    saveProjectHistory({
      client_name: content.clientName,
      website: project.website,
      industry: project.industry,
      project_title: content.projectTitle,
      slides_count: 13,
    }).catch(() => {}); // Lỗi DB không ảnh hưởng app

    return NextResponse.json(
      { content },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
