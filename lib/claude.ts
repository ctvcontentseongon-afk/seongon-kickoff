import Groq from "groq-sdk";
import type { ProjectInfo, PresentationContent } from "@/types";

export async function generateKickoffContent(
  project: ProjectInfo
): Promise<PresentationContent> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY chưa được cấu hình trong .env.local");

  const groq = new Groq({ apiKey });

  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const prompt = `Bạn là chuyên gia SEO tại SEONGON agency Việt Nam. Tạo nội dung kickoff SEO cho dự án sau:

Khách hàng: ${project.clientName} | Website: ${project.website} | Lĩnh vực: ${project.industry}
Mục tiêu: ${project.businessGoals} | Từ khóa: ${project.targetKeywords}
Đối tượng: ${project.targetAudience} | Đối thủ: ${project.competitors}
Vấn đề: ${project.currentIssues} | Ngân sách: ${project.budget} | Timeline: ${project.timeline}
PM: ${project.projectManager || "PM SEONGON"} | SEO Lead: ${project.seoLead || "SEO Specialist"}
Ghi chú: ${project.additionalNotes}

Trả về JSON hợp lệ (chỉ JSON, không markdown, không giải thích):
{"projectTitle":"tên dự án ngắn","clientName":"${project.clientName}","date":"${today}","agenda":{"items":["mục 1","mục 2","mục 3","mục 4","mục 5","mục 6","mục 7"]},"clientOverview":{"companyDescription":"2-3 câu mô tả công ty","keyFacts":["fact1","fact2","fact3","fact4"],"goals":["goal1","goal2","goal3"]},"currentSituation":{"websiteStatus":"đánh giá website","strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3","w4"],"opportunities":["o1","o2","o3"]},"keywordsAudience":{"primaryKeywords":["kw1","kw2","kw3","kw4","kw5","kw6"],"secondaryKeywords":["kw1","kw2","kw3","kw4","kw5","kw6"],"audienceProfile":{"demographics":"mô tả demographic","interests":["i1","i2","i3","i4"],"searchBehavior":"mô tả hành vi"}},"competitorAnalysis":{"mainCompetitors":[{"name":"đối thủ 1","strengths":"điểm mạnh"},{"name":"đối thủ 2","strengths":"điểm mạnh"}],"competitiveGaps":["gap1","gap2","gap3"],"ourAdvantages":["adv1","adv2","adv3"]},"seoStrategy":{"technical":["t1","t2","t3","t4"],"onPage":["op1","op2","op3","op4"],"content":["c1","c2","c3","c4"],"linkBuilding":["lb1","lb2","lb3"]},"actionPlan":{"month1":{"title":"Tháng 1: Audit & Nền tảng","tasks":[{"task":"công việc 1","deliverable":"kết quả 1","priority":"Cao"},{"task":"công việc 2","deliverable":"kết quả 2","priority":"Cao"},{"task":"công việc 3","deliverable":"kết quả 3","priority":"Trung"},{"task":"công việc 4","deliverable":"kết quả 4","priority":"Trung"},{"task":"công việc 5","deliverable":"kết quả 5","priority":"Thấp"}]},"month2_3":{"title":"Tháng 2-3: Triển khai & Tối ưu","tasks":[{"task":"công việc 1","deliverable":"kết quả 1","priority":"Cao"},{"task":"công việc 2","deliverable":"kết quả 2","priority":"Cao"},{"task":"công việc 3","deliverable":"kết quả 3","priority":"Trung"},{"task":"công việc 4","deliverable":"kết quả 4","priority":"Trung"},{"task":"công việc 5","deliverable":"kết quả 5","priority":"Thấp"}]}},"kpis":[{"metric":"Organic Traffic","current":"baseline","target3m":"mục tiêu 3T","target6m":"mục tiêu 6T"},{"metric":"Từ khóa Top 10","current":"hiện tại","target3m":"3T","target6m":"6T"},{"metric":"Organic Leads/Tháng","current":"hiện tại","target3m":"3T","target6m":"6T"},{"metric":"Technical SEO Score","current":"hiện tại","target3m":"3T","target6m":"6T"}],"timeline":{"phases":[{"phase":"Giai đoạn 1: Nền tảng","duration":"Tháng 1","milestones":["m1","m2","m3"]},{"phase":"Giai đoạn 2: Tăng tốc","duration":"Tháng 2-3","milestones":["m1","m2","m3"]},{"phase":"Giai đoạn 3: Tối ưu","duration":"Tháng 4-6","milestones":["m1","m2","m3"]}]},"team":{"members":[{"role":"Account Manager","name":"${project.projectManager || "PM SEONGON"}","responsibilities":["Quản lý dự án & KPI","Báo cáo định kỳ khách hàng"]},{"role":"SEO Lead","name":"${project.seoLead || "SEO Specialist"}","responsibilities":["Chiến lược SEO tổng thể","Audit & technical fixes"]},{"role":"Content Writer","name":"Content Team","responsibilities":["Sản xuất nội dung chuẩn SEO","Tối ưu on-page"]},{"role":"Technical SEO","name":"Dev Team","responsibilities":["Xử lý lỗi kỹ thuật","Tăng tốc website"]}]}}

Điền nội dung tiếng Việt thực tế, cụ thể cho lĩnh vực ${project.industry}. Không giữ nguyên text mẫu.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4096,
  });

  const text = completion.choices[0]?.message?.content || "";

  // Tìm JSON block và làm sạch
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI không trả về JSON hợp lệ");

  let raw = jsonMatch[0];
  // Xóa control characters không hợp lệ trong JSON
  raw = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ");

  try {
    return JSON.parse(raw) as PresentationContent;
  } catch {
    // Thử parse lại với JSON5-style fix: cắt tại dấu phẩy thừa
    const fixed = raw
      .replace(/,\s*([}\]])/g, "$1")   // trailing commas
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'); // unquoted keys
    return JSON.parse(fixed) as PresentationContent;
  }
}
