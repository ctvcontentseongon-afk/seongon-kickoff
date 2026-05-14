# SEONGON Kickoff Generator

Web app tự động tạo PowerPoint Kickoff Meeting cho dự án SEO bằng Claude AI.

## Tính năng
- Nhập thông tin dự án qua form trực quan
- AI (Claude Opus) tự động tạo nội dung 13 slides chuyên nghiệp (Tiếng Việt)
- Xuất file `.pptx` theo SEONGON template
- Upload lên Google Drive và sinh link chia sẻ công khai

## Cài đặt

### 1. Cài Node.js
Tải từ https://nodejs.org (LTS version)

### 2. Cài dependencies
```bash
cd seongon-kickoff
npm install
```

### 3. Cấu hình biến môi trường
```bash
cp .env.example .env.local
```

Điền vào `.env.local`:

**Anthropic API Key** — lấy tại https://console.anthropic.com
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Google Drive Service Account:**
1. Google Cloud Console → IAM & Admin → Service Accounts → Tạo mới
2. Tạo Key JSON → tải về → copy toàn bộ nội dung vào:
```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```
3. Tạo folder Drive → Share với email service account (Editor) → copy Folder ID:
```
GOOGLE_DRIVE_FOLDER_ID=1BxiMVs0XRA5nF...
```

> Nếu không cấu hình Google Drive → file vẫn download được trực tiếp về máy.

### 4. Chạy

```bash
npm run dev      # Development: http://localhost:3000
npm run build && npm start   # Production
```

## Cấu trúc

```
app/api/generate/    Claude AI → JSON nội dung
app/api/export/      JSON → PPTX → Google Drive
lib/claude.ts        Anthropic SDK prompt
lib/pptx.ts          SEONGON template builder (13 slides)
lib/drive.ts         Google Drive upload + public link
components/          Form, Preview, ExportPanel
```

## 13 Slides được tạo

Cover · Agenda · Thông tin KH · Hiện trạng · Từ khóa & Audience · Đối thủ · Chiến lược SEO · Action Plan T1 · Action Plan T2-3 · KPIs · Timeline · Team · Q&A
