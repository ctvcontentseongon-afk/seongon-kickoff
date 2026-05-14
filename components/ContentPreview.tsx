"use client";

import { useState } from "react";
import type { PresentationContent } from "@/types";

interface Props {
  content: PresentationContent;
}

/* ── Slide thumbnail wrapper (16:9) ────────────────────────────────── */
function SlideThumbnail({
  num,
  title,
  bg = "white",
  children,
  active,
  onClick,
}: {
  num: number;
  title: string;
  bg?: "white" | "gray" | "navy";
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  const bgClass =
    bg === "navy"
      ? "bg-[#1A1A2E]"
      : bg === "gray"
      ? "bg-[#F5F5F5]"
      : "bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
        active
          ? "border-[#FF6B35] shadow-lg shadow-orange-100 scale-[1.01]"
          : "border-gray-200 hover:border-[#FF6B35]/40 hover:shadow-md"
      }`}
    >
      {/* Slide header bar */}
      <div className="bg-[#1A1A2E] flex items-center gap-2 px-2.5 py-1.5">
        <div className="w-0.5 h-3.5 bg-[#FF6B35] rounded-full flex-shrink-0" />
        <span className="text-white text-[9px] font-bold flex-1 truncate">{title}</span>
        <span className="text-[#FF6B35] text-[9px] font-mono">{num}</span>
      </div>
      {/* Slide body */}
      <div
        className={`${bgClass} p-2.5`}
        style={{ aspectRatio: "4/2.4" }}
      >
        {children}
      </div>
    </button>
  );
}

function MiniTag({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-[8px] font-medium text-white truncate max-w-[80px]"
      style={{ backgroundColor: color }}
      title={text}
    >
      {text}
    </span>
  );
}

function MiniList({ items, limit = 3 }: { items: string[]; limit?: number }) {
  return (
    <ul className="space-y-0.5">
      {items.slice(0, limit).map((item, i) => (
        <li key={i} className="flex items-start gap-1 text-[8px] text-gray-600 leading-tight">
          <span className="text-[#FF6B35] flex-shrink-0 mt-0.5">•</span>
          <span className="line-clamp-1">{item}</span>
        </li>
      ))}
      {items.length > limit && (
        <li className="text-[8px] text-gray-400">+{items.length - limit} nữa...</li>
      )}
    </ul>
  );
}

/* ── Detail panel (right side) ─────────────────────────────────────── */
function DetailPanel({ content, slide }: { content: PresentationContent; slide: number }) {
  switch (slide) {
    case 1:
      return (
        <div className="space-y-4">
          <div className="bg-[#1A1A2E] rounded-xl p-5 text-center">
            <p className="text-[#FF6B35] text-xs font-black tracking-widest mb-2">SEONGON · KICKOFF MEETING</p>
            <h2 className="text-white text-2xl font-black leading-tight">{content.projectTitle}</h2>
            <p className="text-[#FF6B35] text-base mt-2 font-semibold">{content.clientName}</p>
            <p className="text-gray-400 text-sm mt-1">{content.date}</p>
          </div>
          <p className="text-xs text-gray-500 text-center">Slide 1 — Cover</p>
        </div>
      );

    case 2:
      return (
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Nội dung buổi Kickoff</p>
          <div className="grid grid-cols-2 gap-2">
            {content.agenda.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-3">
          <p className="text-sm italic text-gray-600">{content.clientOverview.companyDescription}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-[#FF6B35] uppercase mb-2">Điểm nổi bật</p>
              <ul className="space-y-1">
                {content.clientOverview.keyFacts.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-[#FF6B35]">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-[#FF6B35] uppercase mb-2">Mục tiêu KD</p>
              <ul className="space-y-1">
                {content.clientOverview.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-[#FF6B35]">•</span>{g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-3">
          <p className="text-xs italic text-gray-600">{content.currentSituation.websiteStatus}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "ĐIỂM MẠNH", items: content.currentSituation.strengths, color: "bg-green-500", text: "text-green-700" },
              { label: "ĐIỂM YẾU", items: content.currentSituation.weaknesses, color: "bg-red-500", text: "text-red-600" },
              { label: "CƠ HỘI SEO", items: content.currentSituation.opportunities, color: "bg-[#FF6B35]", text: "text-orange-600" },
            ].map(({ label, items, color, text }) => (
              <div key={label} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className={`${color} px-2 py-1`}>
                  <p className="text-white text-[10px] font-bold text-center">{label}</p>
                </div>
                <ul className="p-2 space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className={`text-[10px] ${text} flex items-start gap-1`}>
                      <span>•</span><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-[#FF6B35] uppercase mb-2">Từ khóa chính</p>
            <div className="flex flex-wrap gap-1.5">
              {content.keywordsAudience.primaryKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-[#1A1A2E] text-white text-xs rounded font-medium">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F3460] uppercase mb-2">Từ khóa phụ</p>
            <div className="flex flex-wrap gap-1.5">
              {content.keywordsAudience.secondaryKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-[#0F3460] text-white text-xs rounded font-medium">{kw}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-600 mb-1">Đối tượng mục tiêu</p>
            <p className="text-xs text-gray-600">{content.keywordsAudience.audienceProfile.demographics}</p>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1A1A2E]">
                  <th className="px-3 py-2 text-left text-white font-semibold">Đối thủ</th>
                  <th className="px-3 py-2 text-left text-white font-semibold">Điểm mạnh SEO</th>
                </tr>
              </thead>
              <tbody>
                {content.competitorAnalysis.mainCompetitors.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-1.5 font-semibold text-gray-800">{c.name}</td>
                    <td className="px-3 py-1.5 text-gray-600">{c.strengths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-[#FF6B35] mb-1">Khoảng trống cạnh tranh</p>
              <ul className="space-y-0.5">
                {content.competitorAnalysis.competitiveGaps.map((g, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-[#FF6B35]">•</span>{g}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-green-600 mb-1">Lợi thế của chúng ta</p>
              <ul className="space-y-0.5">
                {content.competitorAnalysis.ourAdvantages.map((a, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-green-500">•</span>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "KỸ THUẬT SEO", items: content.seoStrategy.technical, color: "#1A1A2E" },
            { label: "ON-PAGE SEO", items: content.seoStrategy.onPage, color: "#0F3460" },
            { label: "CHIẾN LƯỢC NỘI DUNG", items: content.seoStrategy.content, color: "#FF6B35" },
            { label: "LINK BUILDING", items: content.seoStrategy.linkBuilding, color: "#27AE60" },
          ].map(({ label, items, color }) => (
            <div key={label} className="rounded-lg overflow-hidden border border-gray-100">
              <div className="px-2.5 py-1.5" style={{ backgroundColor: color }}>
                <p className="text-white text-[10px] font-bold">{label}</p>
              </div>
              <ul className="p-2 space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-[10px] text-gray-600 flex gap-1"><span style={{ color }}>•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 8:
    case 9: {
      const plan = slide === 8 ? content.actionPlan.month1 : content.actionPlan.month2_3;
      const headerColor = slide === 8 ? "#1A1A2E" : "#0F3460";
      return (
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-700">{plan.title}</p>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: headerColor }}>
                  <th className="px-2 py-1.5 text-white text-left font-semibold w-6">#</th>
                  <th className="px-2 py-1.5 text-white text-left font-semibold">Công việc</th>
                  <th className="px-2 py-1.5 text-white text-left font-semibold">Kết quả bàn giao</th>
                  <th className="px-2 py-1.5 text-white text-center font-semibold w-14">Ưu tiên</th>
                </tr>
              </thead>
              <tbody>
                {plan.tasks.map((t, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-2 py-1.5 text-gray-500 text-center">{i + 1}</td>
                    <td className="px-2 py-1.5 font-semibold text-gray-800">{t.task}</td>
                    <td className="px-2 py-1.5 text-gray-600">{t.deliverable}</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        t.priority === "Cao" ? "bg-red-100 text-red-600" :
                        t.priority === "Trung" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 10:
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2">
            {content.kpis.map((kpi, i) => {
              const colors = ["#FF6B35", "#0F3460", "#27AE60", "#8E44AD"];
              const color = colors[i] || "#FF6B35";
              return (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-100 text-center">
                  <div className="px-1 py-1.5" style={{ backgroundColor: color }}>
                    <p className="text-white text-[8px] font-bold leading-tight">{kpi.metric}</p>
                  </div>
                  <div className="p-1.5 space-y-1 bg-gray-50">
                    <div>
                      <p className="text-[8px] text-gray-500">Hiện tại</p>
                      <p className="text-xs font-bold text-gray-800">{kpi.current}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-0.5">
                      <p className="text-[8px] text-gray-500">3 tháng</p>
                      <p className="text-xs font-bold" style={{ color }}>{kpi.target3m}</p>
                    </div>
                    <div className="bg-orange-50 rounded p-0.5">
                      <p className="text-[8px] text-gray-500">6 tháng</p>
                      <p className="text-xs font-bold" style={{ color }}>{kpi.target6m}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 11:
      return (
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#FF6B35]" />
            <div className="grid grid-cols-3 gap-2 relative">
              {content.timeline.phases.map((phase, i) => {
                const colors = ["#FF6B35", "#0F3460", "#27AE60"];
                const color = colors[i] || "#FF6B35";
                return (
                  <div key={i} className="text-center">
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold relative z-10"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-100 shadow-sm text-left">
                      <p className="text-[10px] font-bold text-gray-800 leading-tight">{phase.phase}</p>
                      <p className="text-[9px] font-bold mb-1" style={{ color }}>{phase.duration}</p>
                      <ul className="space-y-0.5">
                        {phase.milestones.map((m, j) => (
                          <li key={j} className="text-[9px] text-gray-600">✓ {m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

    case 12:
      return (
        <div className="grid grid-cols-2 gap-3">
          {content.team.members.map((member, i) => {
            const colors = ["#FF6B35", "#0F3460", "#27AE60", "#8E44AD", "#1A1A2E"];
            const color = colors[i % colors.length];
            return (
              <div key={i} className="bg-gray-50 rounded-xl p-3 flex gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800">{member.name}</p>
                  <p className="text-[10px] font-semibold mb-1" style={{ color }}>{member.role}</p>
                  <ul className="space-y-0.5">
                    {member.responsibilities.map((r, j) => (
                      <li key={j} className="text-[10px] text-gray-600">• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      );

    case 13:
      return (
        <div className="bg-[#1A1A2E] rounded-xl p-6 text-center space-y-3">
          <p className="text-[#FF6B35] text-2xl font-black">SEONGON</p>
          <p className="text-white text-xl font-bold">Cảm ơn Quý khách hàng!</p>
          <div className="h-px bg-[#FF6B35] w-20 mx-auto" />
          <p className="text-[#FF6B35] text-lg font-bold">Q & A</p>
          <p className="text-gray-400 text-sm">Hỏi đáp & Thảo luận</p>
          <p className="text-gray-500 text-xs">www.seongon.com · hello@seongon.com</p>
        </div>
      );

    default:
      return null;
  }
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function ContentPreview({ content }: Props) {
  const [activeSlide, setActiveSlide] = useState(1);
  const [view, setView] = useState<"slides" | "summary">("slides");

  const slides = [
    { num: 1, title: "Cover — Trang bìa", bg: "navy" as const },
    { num: 2, title: "Agenda — Nội dung buổi họp", bg: "gray" as const },
    { num: 3, title: "Thông tin Khách hàng", bg: "white" as const },
    { num: 4, title: "Phân tích Hiện trạng", bg: "gray" as const },
    { num: 5, title: "Từ khóa & Đối tượng", bg: "white" as const },
    { num: 6, title: "Phân tích Đối thủ", bg: "gray" as const },
    { num: 7, title: "Chiến lược SEO Tổng thể", bg: "white" as const },
    { num: 8, title: `Kế hoạch: ${content.actionPlan.month1.title}`, bg: "gray" as const },
    { num: 9, title: `Kế hoạch: ${content.actionPlan.month2_3.title}`, bg: "gray" as const },
    { num: 10, title: "KPIs & Mục tiêu", bg: "white" as const },
    { num: 11, title: "Lộ trình Thực hiện", bg: "gray" as const },
    { num: 12, title: "Đội ngũ Dự án", bg: "white" as const },
    { num: 13, title: "Cảm ơn / Q&A", bg: "navy" as const },
  ];

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setView("slides")}
          className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === "slides" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Xem 13 Slides
        </button>
        <button
          type="button"
          onClick={() => setView("summary")}
          className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === "summary" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tóm tắt Nội dung
        </button>
      </div>

      {view === "slides" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Slide thumbnails column */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {slides.map(({ num, title, bg }) => (
              <SlideThumbnail
                key={num}
                num={num}
                title={title}
                bg={bg}
                active={activeSlide === num}
                onClick={() => setActiveSlide(num)}
              >
                {/* Mini preview content per slide */}
                {num === 1 && (
                  <div className="h-full flex flex-col justify-center pl-1">
                    <p className="text-[7px] text-[#FF6B35] font-black">SEONGON</p>
                    <p className="text-[8px] text-white font-bold leading-tight line-clamp-2">{content.projectTitle}</p>
                    <p className="text-[7px] text-[#FF6B35] mt-0.5">{content.clientName}</p>
                  </div>
                )}
                {num === 2 && (
                  <div className="space-y-0.5">
                    {content.agenda.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[6px] text-[#FF6B35] font-bold w-3">0{i+1}</span>
                        <span className="text-[7px] text-gray-600 line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {num === 3 && (
                  <div className="space-y-1">
                    <p className="text-[7px] text-gray-500 italic line-clamp-2">{content.clientOverview.companyDescription}</p>
                    <div className="flex flex-wrap gap-0.5">
                      {content.clientOverview.goals.slice(0,2).map((g,i) => (
                        <MiniTag key={i} text={g.slice(0,20)} color="#FF6B35" />
                      ))}
                    </div>
                  </div>
                )}
                {num === 4 && (
                  <div className="grid grid-cols-3 gap-0.5 h-full">
                    {[
                      { label:"MẠNH", color:"#27AE60", items: content.currentSituation.strengths },
                      { label:"YẾU", color:"#E74C3C", items: content.currentSituation.weaknesses },
                      { label:"CƠ HỘI", color:"#FF6B35", items: content.currentSituation.opportunities },
                    ].map(({label,color,items}) => (
                      <div key={label} className="rounded overflow-hidden">
                        <div className="text-center py-0.5" style={{backgroundColor:color}}>
                          <span className="text-[6px] text-white font-bold">{label}</span>
                        </div>
                        <div className="bg-white p-0.5">
                          {items.slice(0,2).map((item,i) => (
                            <p key={i} className="text-[6px] text-gray-600 line-clamp-1">• {item}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {num === 5 && (
                  <div className="flex flex-wrap gap-0.5 content-start">
                    {content.keywordsAudience.primaryKeywords.slice(0,6).map((kw,i) => (
                      <MiniTag key={i} text={kw} color="#1A1A2E" />
                    ))}
                    {content.keywordsAudience.secondaryKeywords.slice(0,4).map((kw,i) => (
                      <MiniTag key={i} text={kw} color="#0F3460" />
                    ))}
                  </div>
                )}
                {num === 6 && (
                  <div className="space-y-0.5">
                    {content.competitorAnalysis.mainCompetitors.slice(0,3).map((c,i) => (
                      <div key={i} className="flex items-center gap-1 bg-white rounded px-1 py-0.5">
                        <span className="text-[7px] font-bold text-gray-800 truncate">{c.name}</span>
                      </div>
                    ))}
                    <MiniList items={content.competitorAnalysis.competitiveGaps} limit={2} />
                  </div>
                )}
                {num === 7 && (
                  <div className="grid grid-cols-2 gap-0.5">
                    {[
                      {l:"Kỹ thuật",c:"#1A1A2E"},
                      {l:"On-page",c:"#0F3460"},
                      {l:"Nội dung",c:"#FF6B35"},
                      {l:"Links",c:"#27AE60"},
                    ].map(({l,c}) => (
                      <div key={l} className="rounded px-1 py-0.5" style={{backgroundColor:c+'15'}}>
                        <p className="text-[7px] font-bold" style={{color:c}}>{l}</p>
                      </div>
                    ))}
                  </div>
                )}
                {(num === 8 || num === 9) && (
                  <div className="space-y-0.5">
                    {(num===8 ? content.actionPlan.month1 : content.actionPlan.month2_3).tasks.slice(0,3).map((t,i) => {
                      const pc = t.priority==="Cao" ? "text-red-600" : t.priority==="Trung" ? "text-yellow-700" : "text-green-600";
                      return (
                        <div key={i} className="flex items-center gap-1">
                          <span className="text-[6px] text-gray-400 w-3">{i+1}.</span>
                          <span className="text-[7px] text-gray-700 flex-1 line-clamp-1">{t.task}</span>
                          <span className={`text-[6px] px-0.5 rounded font-bold ${pc}`}>{t.priority}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {num === 10 && (
                  <div className="flex gap-1">
                    {content.kpis.map((kpi,i) => {
                      const cs=["#FF6B35","#0F3460","#27AE60","#8E44AD"];
                      return (
                        <div key={i} className="flex-1 rounded overflow-hidden">
                          <div className="py-0.5" style={{backgroundColor:cs[i]}}>
                            <p className="text-[6px] text-white text-center font-bold leading-none px-0.5 line-clamp-1">{kpi.metric}</p>
                          </div>
                          <div className="bg-gray-50 p-0.5 text-center">
                            <p className="text-[7px] font-bold" style={{color:cs[i]}}>{kpi.target6m}</p>
                            <p className="text-[6px] text-gray-400">6T</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {num === 11 && (
                  <div className="flex items-center gap-1">
                    {content.timeline.phases.map((phase,i) => {
                      const cs=["#FF6B35","#0F3460","#27AE60"];
                      return (
                        <div key={i} className="flex-1 text-center">
                          <div className="w-4 h-4 rounded-full mx-auto mb-0.5 flex items-center justify-center text-white text-[7px] font-bold" style={{backgroundColor:cs[i]}}>{i+1}</div>
                          <p className="text-[6px] text-gray-600 line-clamp-2">{phase.phase}</p>
                          <p className="text-[6px] font-bold" style={{color:cs[i]}}>{phase.duration}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {num === 12 && (
                  <div className="flex flex-wrap gap-1">
                    {content.team.members.slice(0,4).map((m,i) => {
                      const cs=["#FF6B35","#0F3460","#27AE60","#8E44AD"];
                      return (
                        <div key={i} className="flex items-center gap-0.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{backgroundColor:cs[i%cs.length]}}>
                            {m.name.charAt(0)}
                          </div>
                          <span className="text-[7px] text-gray-600">{m.role}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {num === 13 && (
                  <div className="flex flex-col items-center justify-center h-full gap-0.5">
                    <p className="text-[9px] text-[#FF6B35] font-black">SEONGON</p>
                    <p className="text-[8px] text-white font-bold">Cảm ơn!</p>
                    <p className="text-[8px] text-[#FF6B35] font-bold">Q & A</p>
                  </div>
                )}
              </SlideThumbnail>
            ))}
          </div>

          {/* Detail view */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
              <div className="bg-[#1A1A2E] px-4 py-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF6B35] text-white text-xs font-black flex items-center justify-center">
                  {activeSlide}
                </span>
                <p className="text-white text-sm font-bold">
                  {slides.find(s => s.num === activeSlide)?.title}
                </p>
                <span className="ml-auto text-gray-500 text-xs">Slide {activeSlide}/13</span>
              </div>
              <div className="p-4">
                <DetailPanel content={content} slide={activeSlide} />
              </div>
              <div className="px-4 pb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSlide(Math.max(1, activeSlide - 1))}
                  disabled={activeSlide === 1}
                  className="flex-1 py-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 border border-gray-200 rounded-lg transition-colors font-medium"
                >
                  ← Slide trước
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide(Math.min(13, activeSlide + 1))}
                  disabled={activeSlide === 13}
                  className="flex-1 py-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 border border-gray-200 rounded-lg transition-colors font-medium"
                >
                  Slide tiếp →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary view */
        <div className="space-y-4">
          <div className="bg-[#1A1A2E] rounded-xl p-5 text-center">
            <p className="text-[#FF6B35] text-xs font-black tracking-widest mb-1">SEONGON · KICKOFF MEETING</p>
            <h2 className="text-white text-xl font-black">{content.projectTitle}</h2>
            <p className="text-[#FF6B35] text-base mt-1">{content.clientName} · {content.date}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A1A2E] px-4 py-2.5 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF6B35] rounded-full" />
                <p className="text-white text-xs font-bold">Từ khóa SEO ({content.keywordsAudience.primaryKeywords.length + content.keywordsAudience.secondaryKeywords.length})</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {content.keywordsAudience.primaryKeywords.map((kw,i) => (
                    <span key={i} className="px-2 py-1 bg-[#1A1A2E] text-white text-xs rounded font-medium">{kw}</span>
                  ))}
                  {content.keywordsAudience.secondaryKeywords.map((kw,i) => (
                    <span key={i} className="px-2 py-1 bg-[#0F3460]/80 text-white text-xs rounded">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A1A2E] px-4 py-2.5 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF6B35] rounded-full" />
                <p className="text-white text-xs font-bold">KPIs Mục tiêu</p>
              </div>
              <div className="p-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1.5 text-left text-gray-600 font-semibold">Chỉ số</th>
                      <th className="px-2 py-1.5 text-center text-gray-600 font-semibold">3T</th>
                      <th className="px-2 py-1.5 text-center text-gray-600 font-semibold">6T</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.kpis.map((kpi,i) => (
                      <tr key={i} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                        <td className="px-2 py-1.5 font-medium text-gray-700">{kpi.metric}</td>
                        <td className="px-2 py-1.5 text-center font-semibold text-[#FF6B35]">{kpi.target3m}</td>
                        <td className="px-2 py-1.5 text-center font-bold text-[#0F3460]">{kpi.target6m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A1A2E] px-4 py-2.5 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF6B35] rounded-full" />
                <p className="text-white text-xs font-bold">Chiến lược SEO</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { label:"Kỹ thuật", items: content.seoStrategy.technical, color:"#1A1A2E" },
                  { label:"On-page", items: content.seoStrategy.onPage, color:"#0F3460" },
                  { label:"Nội dung", items: content.seoStrategy.content, color:"#FF6B35" },
                  { label:"Link building", items: content.seoStrategy.linkBuilding, color:"#27AE60" },
                ].map(({label,items,color}) => (
                  <div key={label}>
                    <p className="text-xs font-bold mb-1" style={{color}}>{label}</p>
                    <ul className="space-y-0.5">
                      {items.slice(0,3).map((item,i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1"><span style={{color}}>•</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A1A2E] px-4 py-2.5 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF6B35] rounded-full" />
                <p className="text-white text-xs font-bold">Đội ngũ & Timeline</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {content.team.members.map((m,i) => {
                    const cs=["#FF6B35","#0F3460","#27AE60","#8E44AD","#1A1A2E"];
                    return (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor:cs[i%cs.length]}}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{m.name}</p>
                          <p className="text-[10px] font-medium" style={{color:cs[i%cs.length]}}>{m.role}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  {content.timeline.phases.map((phase,i) => {
                    const cs=["#FF6B35","#0F3460","#27AE60"];
                    return (
                      <div key={i} className="flex-1 rounded-lg p-2 text-center" style={{backgroundColor:cs[i]+'15'}}>
                        <p className="text-[10px] font-bold" style={{color:cs[i]}}>{phase.duration}</p>
                        <p className="text-[9px] text-gray-600 leading-tight">{phase.phase}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
