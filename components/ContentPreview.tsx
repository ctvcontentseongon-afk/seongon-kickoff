"use client";

import type { PresentationContent } from "@/types";

interface Props {
  content: PresentationContent;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-[#1A1A2E] px-4 py-2.5 flex items-center gap-2">
        <div className="w-1 h-5 bg-[#FF6B35] rounded-full" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function TagList({ items, color = "orange" }: { items: string[]; color?: "orange" | "navy" | "green" }) {
  const cls =
    color === "navy"
      ? "bg-[#0F3460] text-white"
      : color === "green"
      ? "bg-green-600 text-white"
      : "bg-[#FF6B35] text-white";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <span className="text-[#FF6B35] mt-0.5 flex-shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ContentPreview({ content }: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#1A1A2E] rounded-xl p-5 text-center">
        <p className="text-[#FF6B35] text-xs font-bold tracking-widest mb-1">SEONGON</p>
        <h2 className="text-white text-xl font-bold">{content.projectTitle}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {content.clientName} · {content.date}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agenda */}
        <Section title="Agenda">
          <ol className="space-y-1.5">
            {content.agenda.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Section>

        {/* Client Overview */}
        <Section title="Thông tin Khách hàng">
          <p className="text-sm text-gray-600 italic mb-3">{content.clientOverview.companyDescription}</p>
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#FF6B35] uppercase">Mục tiêu</p>
            <BulletList items={content.clientOverview.goals} />
          </div>
        </Section>

        {/* Keywords */}
        <Section title="Từ khóa Mục tiêu">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-[#FF6B35] uppercase mb-2">Từ khóa chính</p>
              <TagList items={content.keywordsAudience.primaryKeywords} color="navy" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F3460] uppercase mb-2">Từ khóa phụ</p>
              <TagList items={content.keywordsAudience.secondaryKeywords} color="orange" />
            </div>
          </div>
        </Section>

        {/* Current Situation */}
        <Section title="Hiện trạng Website">
          <p className="text-sm text-gray-600 italic mb-3">{content.currentSituation.websiteStatus}</p>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="text-xs font-bold text-green-600 uppercase mb-1">Điểm mạnh</p>
              <BulletList items={content.currentSituation.strengths} />
            </div>
            <div>
              <p className="text-xs font-bold text-red-500 uppercase mb-1">Điểm yếu</p>
              <BulletList items={content.currentSituation.weaknesses} />
            </div>
          </div>
        </Section>

        {/* SEO Strategy */}
        <Section title="Chiến lược SEO">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Kỹ thuật", items: content.seoStrategy.technical, color: "#1A1A2E" },
              { label: "On-Page", items: content.seoStrategy.onPage, color: "#0F3460" },
              { label: "Nội dung", items: content.seoStrategy.content, color: "#FF6B35" },
              { label: "Link Building", items: content.seoStrategy.linkBuilding, color: "#27AE60" },
            ].map(({ label, items, color }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-bold mb-1.5" style={{ color }}>{label}</p>
                <ul className="space-y-0.5">
                  {items.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-xs text-gray-600">• {item}</li>
                  ))}
                  {items.length > 3 && (
                    <li className="text-xs text-gray-400">+{items.length - 3} thêm...</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* KPIs */}
        <Section title="KPIs & Mục tiêu">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#1A1A2E] text-white">
                  <th className="px-2 py-1.5 text-left font-semibold">Chỉ số</th>
                  <th className="px-2 py-1.5 text-center font-semibold">Hiện tại</th>
                  <th className="px-2 py-1.5 text-center font-semibold">3 tháng</th>
                  <th className="px-2 py-1.5 text-center font-semibold">6 tháng</th>
                </tr>
              </thead>
              <tbody>
                {content.kpis.map((kpi, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-2 py-1.5 font-medium text-gray-700">{kpi.metric}</td>
                    <td className="px-2 py-1.5 text-center text-gray-500">{kpi.current}</td>
                    <td className="px-2 py-1.5 text-center font-semibold text-[#FF6B35]">{kpi.target3m}</td>
                    <td className="px-2 py-1.5 text-center font-bold text-[#0F3460]">{kpi.target6m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Team */}
      <Section title="Đội ngũ Dự án">
        <div className="flex flex-wrap gap-3">
          {content.team.members.map((member, i) => {
            const colors = ["#FF6B35", "#0F3460", "#27AE60", "#8E44AD", "#1A1A2E"];
            const color = colors[i % colors.length];
            return (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 flex-1 min-w-[160px]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{member.name}</p>
                  <p className="text-xs font-medium" style={{ color }}>{member.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
