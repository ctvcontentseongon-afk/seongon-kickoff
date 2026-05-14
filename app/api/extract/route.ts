import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let text = "";

    if (["txt", "md", "csv"].includes(ext)) {
      text = await file.text();
    } else if (ext === "docx") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: "Định dạng chưa hỗ trợ. Vui lòng dùng .txt, .md hoặc .docx" },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "File không có nội dung văn bản" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY chưa cấu hình");

    const groq = new Groq({ apiKey });

    const prompt = `Đọc tài liệu SEO brief/proposal/hợp đồng dưới đây và trích xuất thông tin dự án.
Trả về JSON với đúng các trường này (chuỗi rỗng nếu không tìm thấy thông tin):

{"clientName":"","website":"","industry":"","businessGoals":"","targetKeywords":"","targetAudience":"","competitors":"","currentIssues":"","budget":"","timeline":"","projectManager":"","seoLead":"","additionalNotes":""}

Hướng dẫn trích xuất:
- clientName: tên công ty / khách hàng
- website: URL website chính
- industry: ngành nghề / lĩnh vực kinh doanh
- businessGoals: mục tiêu kinh doanh cụ thể
- targetKeywords: từ khóa SEO mục tiêu, cách nhau bằng dấu phẩy
- targetAudience: mô tả đối tượng khách hàng mục tiêu
- competitors: tên hoặc website đối thủ cạnh tranh
- currentIssues: vấn đề SEO hiện tại của website
- budget: ngân sách dự án
- timeline: thời gian thực hiện
- projectManager: tên Account Manager / Project Manager
- seoLead: tên SEO Lead / Specialist
- additionalNotes: thông tin bổ sung, yêu cầu đặc biệt

TÀI LIỆU CẦN ĐỌC:
${text.slice(0, 8000)}

Chỉ trả về JSON hợp lệ, không markdown, không giải thích.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI không thể trích xuất thông tin từ file này" },
        { status: 422 }
      );
    }

    const raw = jsonMatch[0]
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
      .replace(/,\s*([}\]])/g, "$1");

    const extracted = JSON.parse(raw);
    return NextResponse.json({ extracted, fileName: file.name });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    console.error("[/api/extract]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
