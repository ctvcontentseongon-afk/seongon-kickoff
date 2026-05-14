"use client";

import { useState } from "react";
import ProjectForm from "@/components/ProjectForm";
import ContentPreview from "@/components/ContentPreview";
import ExportPanel from "@/components/ExportPanel";
import HistoryPanel from "@/components/HistoryPanel";
import type { ProjectInfo, PresentationContent } from "@/types";

type Step = "form" | "preview" | "export";

const EMPTY_FORM: ProjectInfo = {
  clientName: "",
  website: "",
  industry: "",
  businessGoals: "",
  targetKeywords: "",
  targetAudience: "",
  competitors: "",
  currentIssues: "",
  budget: "",
  timeline: "",
  projectManager: "",
  seoLead: "",
  additionalNotes: "",
};

const STEPS = [
  { id: "form", label: "Nhập thông tin" },
  { id: "preview", label: "Xem trước nội dung" },
  { id: "export", label: "Xuất & Chia sẻ" },
];

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<ProjectInfo>(EMPTY_FORM);
  const [content, setContent] = useState<PresentationContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể tạo nội dung");
      setContent(data.content);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setStep("form");
    setContent(null);
    setFormData(EMPTY_FORM);
    setError("");
  }

  const currentStepIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#1A1A2E] border-b border-[#FF6B35]/20 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">S</span>
            </div>
            <div>
              <p className="text-white font-black text-base leading-none">SEONGON</p>
              <p className="text-gray-400 text-xs leading-none mt-0.5">Kickoff Generator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    s.id === step
                      ? "bg-[#FF6B35] text-white"
                      : i < currentStepIdx
                      ? "bg-green-600/20 text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  {i < currentStepIdx ? (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                  )}
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <svg className="h-3 w-3 text-gray-600 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        {step === "form" && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
              <span className="text-[#FF6B35] text-xs font-semibold">Powered by Claude AI</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-3">
              SEO Kickoff Presentation
              <span className="block text-[#FF6B35]">tạo tự động bằng AI</span>
            </h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Nhập thông tin dự án → AI phân tích & tạo nội dung chuyên nghiệp → Xuất PowerPoint sẵn sàng trình bày
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700">Đã xảy ra lỗi</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Thông tin Dự án SEO</h2>
                <p className="text-xs text-gray-500 mt-0.5">Điền đầy đủ để AI tạo nội dung chính xác hơn</p>
              </div>
            </div>
            <ProjectForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              loading={generating}
            />
          </div>
          <HistoryPanel />
        )}

        {/* Step: Preview */}
        {step === "preview" && content && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Xem trước nội dung</h2>
                <p className="text-sm text-gray-500 mt-0.5">AI đã tạo nội dung cho 13 slides — kiểm tra trước khi xuất</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("form")}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors font-medium"
                >
                  ← Sửa lại
                </button>
                <button
                  onClick={() => setStep("export")}
                  className="px-4 py-2 text-sm bg-[#FF6B35] hover:bg-orange-600 text-white rounded-lg transition-colors font-bold shadow-sm"
                >
                  Xuất PowerPoint →
                </button>
              </div>
            </div>
            <ContentPreview content={content} />
            <div className="flex justify-end">
              <button
                onClick={() => setStep("export")}
                className="px-6 py-3 bg-[#FF6B35] hover:bg-orange-600 text-white rounded-xl transition-colors font-bold shadow-lg shadow-orange-100 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Xuất file PowerPoint
              </button>
            </div>
          </div>
        )}

        {/* Step: Export */}
        {step === "export" && content && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("preview")}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Xuất & Chia sẻ</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Tạo file .pptx và upload lên Google Drive
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-[#1A1A2E] rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{content.projectTitle}</p>
                  <p className="text-sm text-gray-500">{content.clientName} · 13 slides · SEONGON Template</p>
                </div>
              </div>
              <ExportPanel content={content} onReset={handleReset} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <p className="text-center text-xs text-gray-400">
          © 2025 SEONGON · Internal Tool · Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
