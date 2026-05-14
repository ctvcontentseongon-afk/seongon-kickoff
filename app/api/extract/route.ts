import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

/** Convert public share links to their plain-text/export equivalents */
function resolveUrl(raw: string): { fetchUrl: string; label: string } {
  // Google Docs: /document/d/{ID}/...
  const gdoc = raw.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (gdoc) {
    return {
      fetchUrl: `https://docs.google.com/document/d/${gdoc[1]}/export?format=txt`,
      label: "Google Docs",
    };
  }

  // Google Sheets: /spreadsheets/d/{ID}/...
  const gsheet = raw.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (gsheet) {
    return {
      fetchUrl: `https://docs.google.com/spreadsheets/d/${gsheet[1]}/export?format=csv`,
      label: "Google Sheets",
    };
  }

  // Google Drive file: /file/d/{ID}/view
  const gdrive = raw.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdrive) {
    return {
      fetchUrl: `https://drive.google.com/uc?export=download&id=${gdrive[1]}`,
      label: "Google Drive",
    };
  }

  // Google Drive open link: /open?id=...
  const gopen = raw.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (gopen) {
    return {
      fetchUrl: `https://drive.google.com/uc?export=download&id=${gopen[1]}`,
      label: "Google Drive",
    };
  }

  return { fetchUrl: raw, label: new URL(raw).hostname };
}

/** Strip HTML tags and decode common entities */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|h[1-6]|li|tr|td|th)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const AI_PROMPT = (text: string) => `Đọc tài liệu SEO brief/proposal/hợp đồng dưới đây và trích xuất thông tin dự án.
Trả về JSON với đúng các trường này (chuỗi rỗng nếu không tìm thấy):

{"clientName":"","website":"","industry":"","businessGoals":"","targetKeywords":"","targetAudience":"","competitors":"","currentIssues":"","budget":"","timeline":"","projectManager":"","seoLead":"","additionalNotes":""}

Hướng dẫn:
- clientName: tên công ty / khách hàng
- website: URL website chính
- industry: ngành nghề / lĩnh vực
- businessGoals: mục tiêu kinh doanh cụ thể
- targetKeywords: từ khóa SEO mục tiêu, cách nhau bằng dấu phẩy
- targetAudience: mô tả đối tượng khách hàng mục tiêu
- competitors: tên/website đối thủ cạnh tranh
- currentIssues: vấn đề SEO hiện tại
- budget: ngân sách
- timeline: thời gian thực hiện
- projectManager: tên Account / Project Manager
- seoLead: tên SEO Lead / Specialist
- additionalNotes: ghi chú bổ sung

TÀI LIỆU:
${text.slice(0, 8000)}

Chỉ trả về JSON hợp lệ, không markdown, không giải thích.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw: string = (body.url || "").trim();

    if (!raw || !/^https?:\/\//i.test(raw)) {
      return NextResponse.json(
        { error: "URL không hợp lệ. Phải bắt đầu bằng http:// hoặc https://" },
        { status: 400 }
      );
    }

    const { fetchUrl, label } = resolveUrl(raw);

    let response: Response;
    try {
      response = await fetch(fetchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "text/html,text/plain,*/*;q=0.9",
        },
        // @ts-ignore - Node 18+ supports this
        signal: AbortSignal.timeout(15000),
        redirect: "follow",
      });
    } catch {
      return NextResponse.json(
        { error: "Không thể kết nối đến URL. Kiểm tra link còn hiệu lực không." },
        { status: 422 }
      );
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: `Link chưa mở quyền truy cập (${response.status}). Hãy đặt quyền "Anyone with the link can view".` },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { error: `Server trả về lỗi ${response.status}. Thử lại hoặc dùng link khác.` },
        { status: 422 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const raw_text = await response.text();
    const text = contentType.includes("text/html") ? htmlToText(raw_text) : raw_text;

    if (text.trim().length < 30) {
      return NextResponse.json(
        { error: "Nội dung trang quá ngắn hoặc trống. Hãy đảm bảo link mở đúng quyền." },
        { status: 422 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY chưa cấu hình");

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: AI_PROMPT(text) }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI không thể trích xuất thông tin từ nội dung này" },
        { status: 422 }
      );
    }

    const cleaned = jsonMatch[0]
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
      .replace(/,\s*([}\]])/g, "$1");

    const extracted = JSON.parse(cleaned);
    return NextResponse.json({ extracted, sourceLabel: label, url: raw });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    console.error("[/api/extract]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
