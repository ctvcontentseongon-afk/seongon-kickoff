"use client";

import { useState, useRef } from "react";
import type { ProjectInfo, TemplateColors } from "@/types";

interface Props {
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
  onSubmit: () => void;
  loading: boolean;
  onTemplateColors?: (colors: TemplateColors | null) => void;
}

const FIELDS: {
  key: keyof ProjectInfo;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}[] = [
  { key: "clientName", label: "Tên Khách hàng *", placeholder: "Ví dụ: Công ty TNHH ABC", required: true },
  { key: "website", label: "Website *", placeholder: "https://example.com", required: true },
  { key: "industry", label: "Lĩnh vực / Ngành *", placeholder: "Ví dụ: Thương mại điện tử, Bất động sản...", required: true },
  { key: "businessGoals", label: "Mục tiêu Kinh doanh", placeholder: "Tăng doanh thu, mở rộng thị trường...", textarea: true },
  { key: "targetKeywords", label: "Từ khóa Mục tiêu", placeholder: "Liệt kê các từ khóa chính (cách nhau bằng dấu phẩy)", textarea: true },
  { key: "targetAudience", label: "Đối tượng Khách hàng", placeholder: "Mô tả đối tượng mục tiêu (tuổi, giới tính, hành vi...)", textarea: true },
  { key: "competitors", label: "Đối thủ Cạnh tranh", placeholder: "Liệt kê website đối thủ (cách nhau bằng dấu phẩy)", textarea: true },
  { key: "currentIssues", label: "Vấn đề Hiện tại", placeholder: "Các vấn đề SEO hiện tại cần giải quyết...", textarea: true },
  { key: "budget", label: "Ngân sách", placeholder: "Ví dụ: 15,000,000 VNĐ/tháng" },
  { key: "timeline", label: "Thời gian Dự án", placeholder: "Ví dụ: 6 tháng (01/2025 - 06/2025)" },
  { key: "projectManager", label: "Account / Project Manager", placeholder: "Tên PM phụ trách dự án" },
  { key: "seoLead", label: "SEO Lead", placeholder: "Tên SEO Specialist phụ trách" },
  { key: "additionalNotes", label: "Ghi chú Thêm", placeholder: "Yêu cầu đặc biệt, thông tin bổ sung...", textarea: true },
];

const SOURCE_HINTS = [
  { icon: "📄", name: "Google Docs", hint: "Chia sẻ → Anyone with the link → Viewer" },
  { icon: "📊", name: "Google Sheets", hint: "Chia sẻ → Anyone with the link → Viewer" },
  { icon: "📁", name: "Google Drive", hint: "Chuột phải → Get link → Anyone with the link" },
  { icon: "🌐", name: "Trang web bất kỳ", hint: "URL công khai, không cần đăng nhập" },
];

export default function ProjectForm({ data, onChange, onSubmit, loading, onTemplateColors }: Props) {
  const [urlInput, setUrlInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extractedSource, setExtractedSource] = useState<{ label: string; url: string } | null>(null);
  const [filledCount, setFilledCount] = useState(0);
  const [templateName, setTemplateName] = useState("");
  const [templateParsing, setTemplateParsing] = useState(false);
  const [templateError, setTemplateError] = useState("");
  const [templateParsed, setTemplateParsed] = useState<TemplateColors | null>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ProjectInfo, value: string) =>
    onChange({ ...data, [key]: value });

  async function handleExtractUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setExtractError("URL phải bắt đầu bằng https://");
      return;
    }

    setExtracting(true);
    setExtractError("");
    setExtractedSource(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi trích xuất");

      const { extracted, sourceLabel, url: sourceUrl } = json;
      const merged = { ...data };
      let count = 0;

      (Object.keys(extracted) as (keyof ProjectInfo)[]).forEach((key) => {
        const val = extracted[key]?.toString().trim();
        if (val) {
          (merged as Record<string, string>)[key] = val;
          count++;
        }
      });

      onChange(merged);
      setExtractedSource({ label: sourceLabel, url: sourceUrl });
      setFilledCount(count);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── URL input section ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#FF6B35]/10 rounded flex items-center justify-center">
            <svg className="h-3 w-3 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.778-5.657a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-700">Nhập link tài liệu — AI tự đọc & điền thông tin</p>
        </div>

        {/* Source type hints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SOURCE_HINTS.map(({ icon, name, hint }) => (
            <div key={name} className="bg-gray-50 rounded-lg px-2.5 py-2 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700">{icon} {name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{hint}</p>
            </div>
          ))}
        </div>

        {/* URL input + button */}
        {extractedSource ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-800">Đọc {extractedSource.label} thành công!</p>
              <p className="text-xs text-green-600 truncate">{extractedSource.url}</p>
              <p className="text-xs text-green-700 mt-0.5">{filledCount} trường đã được điền tự động</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setExtractedSource(null);
                setUrlInput("");
                setFilledCount(0);
              }}
              className="text-xs text-green-700 hover:text-green-900 font-semibold flex-shrink-0 border border-green-300 rounded-lg px-2.5 py-1 hover:bg-green-100 transition-colors"
            >
              Đổi link
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.778-5.657a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setExtractError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleExtractUrl(); } }}
                placeholder="https://docs.google.com/document/d/... hoặc link bất kỳ"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>
            <button
              type="button"
              onClick={handleExtractUrl}
              disabled={extracting || !urlInput.trim()}
              className="px-4 py-2.5 bg-[#FF6B35] hover:bg-orange-600 disabled:bg-orange-200 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 flex-shrink-0"
            >
              {extracting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đọc...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Đọc link
                </>
              )}
            </button>
          </div>
        )}

        {extractError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <svg className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-red-700 leading-relaxed">{extractError}</p>
          </div>
        )}
      </div>

      {/* ── Template upload ── */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-[#1A1A2E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="h-4 w-4 text-[#1A1A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-700">Mẫu Slide Kickoff</p>
            <p className="text-[10px] text-gray-400 truncate">
              {templateParsed
                ? `✓ Đọc màu thành công — ${templateParsed.fileName}`
                : templateName
                ? templateName
                : "SEONGON Standard (Navy + Orange)"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => templateInputRef.current?.click()}
            disabled={templateParsing}
            className="text-xs text-[#FF6B35] hover:text-orange-700 font-semibold flex-shrink-0 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors disabled:opacity-50"
          >
            {templateParsing ? "Đang đọc..." : templateName ? "Đổi mẫu" : "Upload .pptx"}
          </button>
          <input
            ref={templateInputRef}
            type="file"
            accept=".pptx,.ppt"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setTemplateName(f.name);
              setTemplateError("");
              setTemplateParsing(true);
              setTemplateParsed(null);
              onTemplateColors?.(null);
              try {
                const fd = new FormData();
                fd.append("file", f);
                const res = await fetch("/api/template", { method: "POST", body: fd });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || "Lỗi đọc template");
                const colors: TemplateColors = json.colors;
                setTemplateParsed(colors);
                onTemplateColors?.(colors);
              } catch (err) {
                setTemplateError(err instanceof Error ? err.message : "Lỗi");
              } finally {
                setTemplateParsing(false);
              }
            }}
          />
        </div>

        {/* Color preview strip */}
        {templateParsed && (
          <div className="px-4 pb-3 flex items-center gap-3">
            <div className="flex gap-1.5 items-center">
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: `#${templateParsed.primary}` }}
                title={`Primary: #${templateParsed.primary}`}
              />
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: `#${templateParsed.primaryMid}` }}
              />
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: `#${templateParsed.primaryLight}` }}
              />
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: `#${templateParsed.accent}` }}
                title={`Accent: #${templateParsed.accent}`}
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Màu này sẽ được dùng trong file PowerPoint xuất ra
            </p>
          </div>
        )}

        {templateError && (
          <p className="px-4 pb-2 text-[10px] text-red-500">{templateError}</p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">Kiểm tra & chỉnh sửa thông tin</span>
        </div>
      </div>

      {/* ── Form fields ── */}
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map(({ key, label, placeholder, required, textarea }) => (
            <div key={key} className={textarea ? "md:col-span-2" : ""}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}
                {data[key] && (
                  <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-normal text-green-600">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    đã điền
                  </span>
                )}
              </label>
              {textarea ? (
                <textarea
                  value={data[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  required={required}
                  rows={3}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition ${
                    data[key] ? "border-green-300 bg-green-50/30" : "border-gray-200"
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={data[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  required={required}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
                    data[key] ? "border-green-300 bg-green-50/30" : "border-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || extracting}
          className="w-full py-3.5 px-6 bg-[#FF6B35] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-3 shadow-lg shadow-orange-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI đang phân tích và tạo nội dung...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tạo nội dung Kickoff với AI
            </>
          )}
        </button>
      </form>
    </div>
  );
}
