"use client";

import { useState, useRef, useCallback } from "react";
import type { ProjectInfo } from "@/types";

interface Props {
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
  onSubmit: () => void;
  loading: boolean;
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

export default function ProjectForm({ data, onChange, onSubmit, loading }: Props) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extractedFile, setExtractedFile] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [filledCount, setFilledCount] = useState(0);

  const briefInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ProjectInfo, value: string) =>
    onChange({ ...data, [key]: value });

  async function processFile(file: File) {
    setExtracting(true);
    setExtractError("");
    setExtractedFile("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi trích xuất");

      const { extracted, fileName } = json;
      const merged = { ...data };
      let count = 0;

      (Object.keys(extracted) as (keyof ProjectInfo)[]).forEach((key) => {
        if (extracted[key] && extracted[key].toString().trim()) {
          (merged as Record<string, string>)[key] = extracted[key];
          count++;
        }
      });

      onChange(merged);
      setExtractedFile(fileName);
      setFilledCount(count);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setExtracting(false);
    }
  }

  const handleBriefFile = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!["txt", "md", "docx", "csv"].includes(ext)) {
        setExtractError("Chỉ hỗ trợ file .txt, .md, .docx");
        return;
      }
      await processFile(file);
    },
    [data, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleBriefFile(file);
    },
    [handleBriefFile]
  );

  return (
    <div className="space-y-6">
      {/* ── Upload zone ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brief upload */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-[#FF6B35]/10 rounded flex items-center justify-center">
              <svg className="h-3 w-3 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-700">Tải file Brief lên — AI tự điền thông tin</p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
              dragging
                ? "border-[#FF6B35] bg-orange-50"
                : extractedFile
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-[#FF6B35]/50 hover:bg-orange-50/30"
            }`}
            onClick={() => briefInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={briefInputRef}
              type="file"
              accept=".txt,.md,.docx,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleBriefFile(f);
                e.target.value = "";
              }}
            />

            {extracting ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <svg className="animate-spin h-6 w-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-xs text-[#FF6B35] font-semibold">AI đang đọc file...</p>
              </div>
            ) : extractedFile ? (
              <div className="flex flex-col items-center gap-1 py-1">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-green-700">{filledCount} trường đã điền tự động</p>
                <p className="text-[10px] text-gray-500 truncate max-w-full">{extractedFile}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); briefInputRef.current?.click(); }}
                  className="text-[10px] text-[#FF6B35] hover:underline mt-0.5"
                >
                  Đổi file khác
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-2">
                <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs text-gray-500">
                  <span className="text-[#FF6B35] font-semibold">Kéo thả file</span> hoặc click để chọn
                </p>
                <p className="text-[10px] text-gray-400">.txt · .docx · .md</p>
              </div>
            )}
          </div>

          {extractError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{extractError}</p>
          )}
        </div>

        {/* Template upload */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-[#1A1A2E]/10 rounded flex items-center justify-center">
              <svg className="h-3 w-3 text-[#1A1A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-700">Mẫu Slide Kickoff</p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
              templateName
                ? "border-[#1A1A2E]/40 bg-[#1A1A2E]/5"
                : "border-gray-200 hover:border-[#1A1A2E]/30 hover:bg-gray-50/60"
            }`}
            onClick={() => templateInputRef.current?.click()}
          >
            <input
              ref={templateInputRef}
              type="file"
              accept=".pptx,.ppt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setTemplateName(f.name);
                e.target.value = "";
              }}
            />

            {templateName ? (
              <div className="flex flex-col items-center gap-1 py-1">
                <div className="w-8 h-8 bg-[#1A1A2E] rounded-lg flex items-center justify-center mx-auto">
                  <svg className="h-4 w-4 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-[#1A1A2E]">Mẫu đã chọn</p>
                <p className="text-[10px] text-gray-500 truncate max-w-full">{templateName}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); templateInputRef.current?.click(); }}
                  className="text-[10px] text-[#FF6B35] hover:underline mt-0.5"
                >
                  Đổi mẫu khác
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-2">
                <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <p className="text-xs text-gray-500">
                  <span className="text-[#1A1A2E] font-semibold">Upload mẫu PPTX</span> của SEONGON
                </p>
                <p className="text-[10px] text-gray-400">.pptx · .ppt</p>
              </div>
            )}
          </div>

          {!templateName && (
            <p className="text-[10px] text-gray-400 text-center px-2">
              Mặc định: SEONGON Standard Template (Navy + Orange)
            </p>
          )}
        </div>
      </div>

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
