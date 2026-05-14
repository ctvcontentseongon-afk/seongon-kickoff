"use client";

import { useEffect, useState } from "react";
import type { ProjectRecord } from "@/lib/db";

export default function HistoryPanel() {
  const [history, setHistory] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => setHistory(d.history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 bg-[#FF6B35] rounded-full" />
        <h3 className="font-bold text-gray-800 text-sm">Lịch sử đã tạo</h3>
        <span className="ml-auto text-xs text-gray-400">{history.length} dự án gần nhất</span>
      </div>
      <div className="space-y-2">
        {history.map((item, i) => (
          <div key={item.id ?? i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
              <svg className="h-3.5 w-3.5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.project_title}</p>
              <p className="text-xs text-gray-400">{item.client_name} · {item.industry}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString("vi-VN")
                  : ""}
              </p>
              <p className="text-xs text-[#FF6B35] font-medium">{item.slides_count} slides</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
