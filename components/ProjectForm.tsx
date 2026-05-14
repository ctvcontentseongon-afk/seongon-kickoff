"use client";

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
  {
    key: "clientName",
    label: "Tên Khách hàng *",
    placeholder: "Ví dụ: Công ty TNHH ABC",
    required: true,
  },
  {
    key: "website",
    label: "Website *",
    placeholder: "https://example.com",
    required: true,
  },
  {
    key: "industry",
    label: "Lĩnh vực / Ngành *",
    placeholder: "Ví dụ: Thương mại điện tử, Bất động sản, Giáo dục...",
    required: true,
  },
  {
    key: "businessGoals",
    label: "Mục tiêu Kinh doanh",
    placeholder: "Tăng doanh thu, mở rộng thị trường, tăng nhận diện thương hiệu...",
    textarea: true,
  },
  {
    key: "targetKeywords",
    label: "Từ khóa Mục tiêu",
    placeholder: "Liệt kê các từ khóa chính (cách nhau bằng dấu phẩy)",
    textarea: true,
  },
  {
    key: "targetAudience",
    label: "Đối tượng Khách hàng",
    placeholder: "Mô tả đối tượng mục tiêu (tuổi, giới tính, hành vi, nhu cầu...)",
    textarea: true,
  },
  {
    key: "competitors",
    label: "Đối thủ Cạnh tranh",
    placeholder: "Liệt kê website đối thủ (cách nhau bằng dấu phẩy hoặc xuống dòng)",
    textarea: true,
  },
  {
    key: "currentIssues",
    label: "Vấn đề Hiện tại",
    placeholder: "Các vấn đề SEO hiện tại cần giải quyết...",
    textarea: true,
  },
  {
    key: "budget",
    label: "Ngân sách",
    placeholder: "Ví dụ: 15,000,000 VNĐ/tháng",
  },
  {
    key: "timeline",
    label: "Thời gian Dự án",
    placeholder: "Ví dụ: 6 tháng (01/2025 - 06/2025)",
  },
  {
    key: "projectManager",
    label: "Account / Project Manager",
    placeholder: "Tên PM phụ trách dự án",
  },
  {
    key: "seoLead",
    label: "SEO Lead",
    placeholder: "Tên SEO Specialist phụ trách",
  },
  {
    key: "additionalNotes",
    label: "Ghi chú Thêm",
    placeholder: "Yêu cầu đặc biệt, thông tin bổ sung...",
    textarea: true,
  },
];

export default function ProjectForm({ data, onChange, onSubmit, loading }: Props) {
  const update = (key: keyof ProjectInfo, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FIELDS.map(({ key, label, placeholder, required, textarea }) => (
          <div
            key={key}
            className={textarea ? "md:col-span-2" : ""}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {label}
            </label>
            {textarea ? (
              <textarea
                value={data[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                required={required}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition"
              />
            ) : (
              <input
                type="text"
                value={data[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
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
  );
}
