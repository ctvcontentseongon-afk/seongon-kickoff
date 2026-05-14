"use client";

import type { PresentationContent } from "@/types";
import { useState } from "react";

interface Props {
  content: PresentationContent;
  onReset: () => void;
}

export default function ExportPanel({ content, onReset }: Props) {
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<{
    driveLink?: string;
    fileName?: string;
    mode?: string;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleExport() {
    setExporting(true);
    setError("");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi khi xuất file");
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("json")) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback: download trực tiếp
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SEONGON_Kickoff_${content.clientName}.pptx`;
        a.click();
        URL.revokeObjectURL(url);
        setResult({ mode: "download", fileName: `SEONGON_Kickoff_${content.clientName}.pptx` });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Slides", value: "13" },
          { label: "Từ khóa chính", value: String(content.keywordsAudience.primaryKeywords.length) },
          { label: "Công việc T1", value: String(content.actionPlan.month1.tasks.length) },
          { label: "KPIs", value: String(content.kpis.length) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1A1A2E] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#FF6B35]">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Export button */}
      {!result && (
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 px-6 bg-[#1A1A2E] hover:bg-[#16213E] disabled:bg-gray-400 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-3 shadow-lg"
        >
          {exporting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang tạo file PowerPoint & upload...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất PowerPoint (.pptx)
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">Lỗi xuất file</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-800">File đã được tạo thành công!</p>
              {result.fileName && (
                <p className="text-sm text-green-600">{result.fileName}</p>
              )}
            </div>
          </div>

          {result.driveLink && (
            <a
              href={result.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#FF6B35] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Mở trên Google Drive
            </a>
          )}

          {result.driveLink && (
            <div className="bg-white rounded-lg p-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-xs text-gray-500 break-all">{result.driveLink}</p>
              <button
                onClick={() => navigator.clipboard.writeText(result.driveLink!)}
                className="ml-auto text-xs text-[#FF6B35] font-semibold flex-shrink-0 hover:underline"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Tạo dự án mới
      </button>
    </div>
  );
}
