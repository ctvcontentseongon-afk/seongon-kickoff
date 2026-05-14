import PptxGenJS from "pptxgenjs";
import type { PresentationContent } from "@/types";

const C = {
  orange: "FF6B35",
  navy: "1A1A2E",
  navyMid: "16213E",
  navyLight: "0F3460",
  white: "FFFFFF",
  lightGray: "F5F5F5",
  textDark: "2D2D2D",
  textMid: "555555",
  green: "27AE60",
  yellow: "F39C12",
  red: "E74C3C",
};

function addSlideHeader(
  slide: PptxGenJS.Slide,
  slideNum: number,
  title: string
) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.1,
    fill: { color: C.navy },
  });
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 0.08,
    h: 1.1,
    fill: { color: C.orange },
  });
  slide.addText(title, {
    x: 0.25,
    y: 0.12,
    w: 8.5,
    h: 0.7,
    fontSize: 24,
    bold: true,
    color: C.white,
    fontFace: "Arial",
  });
  slide.addText(`${slideNum}`, {
    x: 9.0,
    y: 0.2,
    w: 0.6,
    h: 0.5,
    fontSize: 13,
    color: C.orange,
    align: "right",
    fontFace: "Arial",
  });
  slide.addShape("rect", {
    x: 0,
    y: 6.9,
    w: "100%",
    h: 0.1,
    fill: { color: C.orange },
  });
}

function addBulletSection(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  w: number,
  h: number,
  header: string,
  items: string[],
  headerColor = C.orange
) {
  slide.addText(header, {
    x,
    y,
    w,
    h: 0.38,
    fontSize: 11,
    bold: true,
    color: headerColor,
    fontFace: "Arial",
  });
  const bullets = items.map((item) => ({
    text: item,
    options: { bullet: { type: "bullet" as const }, fontSize: 10, color: C.textDark, fontFace: "Arial" },
  }));
  slide.addText(bullets, {
    x,
    y: y + 0.38,
    w,
    h: h - 0.38,
    valign: "top",
    fontFace: "Arial",
  });
}

export async function buildPresentation(
  content: PresentationContent
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SEONGON";
  pptx.company = "SEONGON";
  pptx.title = content.projectTitle;

  // ── Slide 1: Cover ──────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.navy },
    });
    slide.addShape("rect", {
      x: 0, y: 0, w: 0.5, h: "100%",
      fill: { color: C.orange },
    });
    slide.addShape("rect", {
      x: 0.5, y: 4.8, w: "100%", h: 2.2,
      fill: { color: C.navyMid, transparency: 30 },
    });

    slide.addText("SEONGON", {
      x: 0.7, y: 0.5, w: 4, h: 0.7,
      fontSize: 28, bold: true, color: C.orange, fontFace: "Arial",
    });
    slide.addText("SEO Agency", {
      x: 0.7, y: 1.1, w: 4, h: 0.4,
      fontSize: 13, color: C.white, fontFace: "Arial",
    });
    slide.addShape("line", {
      x: 0.7, y: 1.6, w: 3, h: 0,
      line: { color: C.orange, width: 1.5 },
    });

    slide.addText("KICKOFF MEETING", {
      x: 0.7, y: 1.9, w: 9, h: 0.6,
      fontSize: 14, bold: true, color: C.orange,
      charSpacing: 4, fontFace: "Arial",
    });
    slide.addText(content.projectTitle, {
      x: 0.7, y: 2.55, w: 8.8, h: 1.5,
      fontSize: 36, bold: true, color: C.white,
      fontFace: "Arial", breakLine: false,
    });
    slide.addText(content.clientName, {
      x: 0.7, y: 4.15, w: 8, h: 0.55,
      fontSize: 20, color: C.orange, fontFace: "Arial",
    });
    slide.addText(content.date, {
      x: 0.7, y: 4.75, w: 6, h: 0.4,
      fontSize: 12, color: C.lightGray, fontFace: "Arial",
    });
    slide.addText("Confidential — SEONGON © 2025", {
      x: 0, y: 6.8, w: "100%", h: 0.3,
      fontSize: 9, color: "888888", align: "center", fontFace: "Arial",
    });
  }

  // ── Slide 2: Agenda ──────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 2, "Nội dung buổi Kickoff");

    content.agenda.items.forEach((item, i) => {
      const col = i < 4 ? 0 : 1;
      const row = i % 4;
      const x = col === 0 ? 0.4 : 5.4;
      const y = 1.4 + row * 1.2;

      slide.addShape("rect", {
        x, y, w: 4.5, h: 0.95,
        fill: { color: C.white },
        shadow: { type: "outer", blur: 4, offset: 2, angle: 45, color: "CCCCCC", opacity: 0.4 },
      });
      slide.addShape("rect", {
        x, y, w: 0.08, h: 0.95,
        fill: { color: C.orange },
      });
      slide.addText(`0${i + 1}`, {
        x: x + 0.18, y: y + 0.08, w: 0.55, h: 0.4,
        fontSize: 20, bold: true, color: C.orange, fontFace: "Arial",
      });
      slide.addText(item, {
        x: x + 0.75, y: y + 0.15, w: 3.55, h: 0.65,
        fontSize: 11, color: C.textDark, valign: "middle", fontFace: "Arial",
      });
    });
  }

  // ── Slide 3: Client Overview ────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.white },
    });
    addSlideHeader(slide, 3, "Thông tin Khách hàng");

    slide.addText(content.clientOverview.companyDescription, {
      x: 0.4, y: 1.25, w: 9.2, h: 0.8,
      fontSize: 12, color: C.textMid, fontFace: "Arial",
      italic: true,
    });

    addBulletSection(
      slide, 0.4, 2.15, 4.4, 2.4,
      "ĐIỂM NỔI BẬT", content.clientOverview.keyFacts
    );
    addBulletSection(
      slide, 5.2, 2.15, 4.4, 2.4,
      "MỤC TIÊU KINH DOANH", content.clientOverview.goals
    );

    slide.addShape("line", {
      x: 4.9, y: 2.1, w: 0, h: 2.5,
      line: { color: "DDDDDD", width: 1 },
    });
  }

  // ── Slide 4: Current Situation ──────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 4, "Phân tích Hiện trạng Website");

    slide.addText(content.currentSituation.websiteStatus, {
      x: 0.4, y: 1.25, w: 9.2, h: 0.7,
      fontSize: 11, color: C.textMid, fontFace: "Arial", italic: true,
    });

    const boxes = [
      { label: "ĐIỂM MẠNH", items: content.currentSituation.strengths, color: C.green, x: 0.35 },
      { label: "ĐIỂM YẾU", items: content.currentSituation.weaknesses, color: C.red, x: 3.55 },
      { label: "CƠ HỘI SEO", items: content.currentSituation.opportunities, color: C.orange, x: 6.75 },
    ];

    boxes.forEach(({ label, items, color, x }) => {
      slide.addShape("rect", {
        x, y: 2.05, w: 3.0, h: 4.5,
        fill: { color: C.white },
        shadow: { type: "outer", blur: 3, offset: 2, angle: 45, color: "BBBBBB", opacity: 0.3 },
      });
      slide.addShape("rect", {
        x, y: 2.05, w: 3.0, h: 0.45,
        fill: { color },
      });
      slide.addText(label, {
        x, y: 2.05, w: 3.0, h: 0.45,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });
      const bullets = items.map((item) => ({
        text: `• ${item}`,
        options: { breakLine: true },
      }));
      slide.addText(items.map(i => `• ${i}`).join("\n"), {
        x: x + 0.1, y: 2.6, w: 2.8, h: 3.8,
        fontSize: 10, color: C.textDark, valign: "top", fontFace: "Arial",
      });
    });
  }

  // ── Slide 5: Keywords & Audience ────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.white },
    });
    addSlideHeader(slide, 5, "Từ khóa Mục tiêu & Đối tượng Khách hàng");

    slide.addText("TỪ KHÓA CHÍNH", {
      x: 0.4, y: 1.2, w: 4.5, h: 0.35,
      fontSize: 11, bold: true, color: C.orange, fontFace: "Arial",
    });
    content.keywordsAudience.primaryKeywords.forEach((kw, i) => {
      const x = 0.4 + (i % 2) * 2.2;
      const y = 1.65 + Math.floor(i / 2) * 0.45;
      slide.addShape("rect", {
        x, y, w: 2.0, h: 0.35,
        fill: { color: C.navy },
      });
      slide.addText(kw, {
        x, y, w: 2.0, h: 0.35,
        fontSize: 9, color: C.white, align: "center", valign: "middle", fontFace: "Arial",
      });
    });

    slide.addText("TỪ KHÓA PHỤ", {
      x: 5.1, y: 1.2, w: 4.5, h: 0.35,
      fontSize: 11, bold: true, color: C.navyLight, fontFace: "Arial",
    });
    content.keywordsAudience.secondaryKeywords.forEach((kw, i) => {
      const x = 5.1 + (i % 2) * 2.2;
      const y = 1.65 + Math.floor(i / 2) * 0.45;
      slide.addShape("rect", {
        x, y, w: 2.0, h: 0.35,
        fill: { color: C.navyLight },
      });
      slide.addText(kw, {
        x, y, w: 2.0, h: 0.35,
        fontSize: 9, color: C.white, align: "center", valign: "middle", fontFace: "Arial",
      });
    });

    slide.addShape("line", {
      x: 0.4, y: 4.0, w: 9.2, h: 0,
      line: { color: "DDDDDD", width: 1 },
    });

    slide.addText("HỒ SƠ ĐỐI TƯỢNG MỤC TIÊU", {
      x: 0.4, y: 4.15, w: 9, h: 0.35,
      fontSize: 11, bold: true, color: C.orange, fontFace: "Arial",
    });
    slide.addText(`Demographics: ${content.keywordsAudience.audienceProfile.demographics}`, {
      x: 0.4, y: 4.55, w: 9.2, h: 0.4,
      fontSize: 10, color: C.textMid, fontFace: "Arial",
    });
    addBulletSection(
      slide, 0.4, 5.0, 4.5, 1.5,
      "Sở thích & Nhu cầu", content.keywordsAudience.audienceProfile.interests
    );
    slide.addText(`Hành vi tìm kiếm: ${content.keywordsAudience.audienceProfile.searchBehavior}`, {
      x: 5.1, y: 5.05, w: 4.5, h: 1.3,
      fontSize: 10, color: C.textDark, fontFace: "Arial",
    });
  }

  // ── Slide 6: Competitor Analysis ────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 6, "Phân tích Đối thủ Cạnh tranh");

    slide.addText("ĐỐI THỦ CHÍNH", {
      x: 0.4, y: 1.2, w: 5.5, h: 0.35,
      fontSize: 11, bold: true, color: C.orange, fontFace: "Arial",
    });

    const rows: PptxGenJS.TableRow[] = [
      [
        { text: "Đối thủ", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10 } },
        { text: "Điểm mạnh SEO", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10 } },
      ],
      ...content.competitorAnalysis.mainCompetitors.map((c) => [
        { text: c.name, options: { bold: true, fontSize: 10, color: C.textDark } },
        { text: c.strengths, options: { fontSize: 10, color: C.textMid } },
      ]),
    ];

    slide.addTable(rows, {
      x: 0.4, y: 1.6, w: 5.5,
      border: { pt: 0.5, color: "DDDDDD" },
      rowH: 0.45,
      fontFace: "Arial",
    });

    addBulletSection(
      slide, 6.2, 1.2, 3.5, 2.5,
      "KHOẢNG TRỐNG CẠNH TRANH", content.competitorAnalysis.competitiveGaps
    );
    addBulletSection(
      slide, 6.2, 3.85, 3.5, 2.5,
      "LỢI THẾ CỦA CHÚNG TA", content.competitorAnalysis.ourAdvantages, C.green
    );
  }

  // ── Slide 7: SEO Strategy ───────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.white },
    });
    addSlideHeader(slide, 7, "Chiến lược SEO Tổng thể");

    const quadrants = [
      { label: "KỸ THUẬT SEO", items: content.seoStrategy.technical, x: 0.35, y: 1.2, color: C.navy },
      { label: "ON-PAGE SEO", items: content.seoStrategy.onPage, x: 5.15, y: 1.2, color: C.navyLight },
      { label: "CHIẾN LƯỢC NỘI DUNG", items: content.seoStrategy.content, x: 0.35, y: 4.05, color: C.orange },
      { label: "LINK BUILDING", items: content.seoStrategy.linkBuilding, x: 5.15, y: 4.05, color: "27AE60" },
    ];

    quadrants.forEach(({ label, items, x, y, color }) => {
      slide.addShape("rect", {
        x, y, w: 4.55, h: 2.6,
        fill: { color: C.lightGray },
        shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "CCCCCC", opacity: 0.3 },
      });
      slide.addShape("rect", {
        x, y, w: 4.55, h: 0.42,
        fill: { color },
      });
      slide.addText(label, {
        x, y, w: 4.55, h: 0.42,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });
      slide.addText(items.map(i => `• ${i}`).join("\n"), {
        x: x + 0.15, y: y + 0.5, w: 4.25, h: 2.0,
        fontSize: 10, color: C.textDark, valign: "top", fontFace: "Arial",
      });
    });
  }

  // ── Slide 8: Action Plan Month 1 ────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 8, `Kế hoạch Hành động: ${content.actionPlan.month1.title}`);

    const priorityColor = (p: string) =>
      p === "Cao" ? C.red : p === "Trung" ? C.yellow : C.green;

    const rows: PptxGenJS.TableRow[] = [
      [
        { text: "#", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10, align: "center" } },
        { text: "Công việc", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10 } },
        { text: "Kết quả bàn giao", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10 } },
        { text: "Ưu tiên", options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10, align: "center" } },
      ],
      ...content.actionPlan.month1.tasks.map((t, i) => [
        { text: `${i + 1}`, options: { fontSize: 10, align: "center" as const, color: C.textDark } },
        { text: t.task, options: { fontSize: 10, color: C.textDark, bold: true } },
        { text: t.deliverable, options: { fontSize: 10, color: C.textMid } },
        { text: t.priority, options: { fontSize: 10, align: "center" as const, bold: true, color: priorityColor(t.priority) } },
      ]),
    ];

    slide.addTable(rows, {
      x: 0.4, y: 1.3, w: 9.2,
      border: { pt: 0.5, color: "DDDDDD" },
      rowH: 0.55,
      fontFace: "Arial",
      colW: [0.4, 3.5, 4.0, 1.0],
    });
  }

  // ── Slide 9: Action Plan Month 2-3 ──────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 9, `Kế hoạch Hành động: ${content.actionPlan.month2_3.title}`);

    const priorityColor = (p: string) =>
      p === "Cao" ? C.red : p === "Trung" ? C.yellow : C.green;

    const rows: PptxGenJS.TableRow[] = [
      [
        { text: "#", options: { bold: true, color: C.white, fill: { color: C.navyLight }, fontSize: 10, align: "center" } },
        { text: "Công việc", options: { bold: true, color: C.white, fill: { color: C.navyLight }, fontSize: 10 } },
        { text: "Kết quả bàn giao", options: { bold: true, color: C.white, fill: { color: C.navyLight }, fontSize: 10 } },
        { text: "Ưu tiên", options: { bold: true, color: C.white, fill: { color: C.navyLight }, fontSize: 10, align: "center" } },
      ],
      ...content.actionPlan.month2_3.tasks.map((t, i) => [
        { text: `${i + 1}`, options: { fontSize: 10, align: "center" as const, color: C.textDark } },
        { text: t.task, options: { fontSize: 10, color: C.textDark, bold: true } },
        { text: t.deliverable, options: { fontSize: 10, color: C.textMid } },
        { text: t.priority, options: { fontSize: 10, align: "center" as const, bold: true, color: priorityColor(t.priority) } },
      ]),
    ];

    slide.addTable(rows, {
      x: 0.4, y: 1.3, w: 9.2,
      border: { pt: 0.5, color: "DDDDDD" },
      rowH: 0.55,
      fontFace: "Arial",
      colW: [0.4, 3.5, 4.0, 1.0],
    });
  }

  // ── Slide 10: KPIs ──────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.white },
    });
    addSlideHeader(slide, 10, "KPIs & Mục tiêu");

    const kpiColors = [C.orange, C.navyLight, C.green, "8E44AD"];
    content.kpis.forEach((kpi, i) => {
      const x = 0.35 + i * 2.35;
      const color = kpiColors[i] || C.orange;

      slide.addShape("rect", {
        x, y: 1.3, w: 2.1, h: 5.3,
        fill: { color: C.lightGray },
        shadow: { type: "outer", blur: 4, offset: 2, angle: 45, color: "BBBBBB", opacity: 0.4 },
      });
      slide.addShape("rect", {
        x, y: 1.3, w: 2.1, h: 0.5,
        fill: { color },
      });
      slide.addText(kpi.metric, {
        x, y: 1.3, w: 2.1, h: 0.5,
        fontSize: 9, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });

      [
        { label: "Hiện tại", value: kpi.current, bg: "EEEEEE" },
        { label: "Mục tiêu 3T", value: kpi.target3m, bg: "FFF3ED" },
        { label: "Mục tiêu 6T", value: kpi.target6m, bg: "FFF3ED" },
      ].forEach(({ label, value, bg }, j) => {
        const ry = 2.0 + j * 1.55;
        slide.addShape("rect", {
          x: x + 0.1, y: ry, w: 1.9, h: 1.4,
          fill: { color: bg },
        });
        slide.addText(label, {
          x: x + 0.1, y: ry + 0.1, w: 1.9, h: 0.3,
          fontSize: 8, color: C.textMid, align: "center", fontFace: "Arial",
        });
        slide.addText(value, {
          x: x + 0.1, y: ry + 0.42, w: 1.9, h: 0.75,
          fontSize: 13, bold: true, color: j === 0 ? C.textDark : color,
          align: "center", valign: "middle", fontFace: "Arial",
        });
      });
    });
  }

  // ── Slide 11: Timeline ──────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.lightGray },
    });
    addSlideHeader(slide, 11, "Lộ trình Thực hiện");

    const phaseColors = [C.orange, C.navyLight, C.green];
    const phases = content.timeline.phases;
    const colW = 9.4 / phases.length;

    slide.addShape("line", {
      x: 0.4, y: 2.15, w: 9.2, h: 0,
      line: { color: C.orange, width: 2 },
    });

    phases.forEach((phase, i) => {
      const x = 0.4 + i * colW;
      const color = phaseColors[i] || C.orange;

      slide.addShape("ellipse", {
        x: x + colW / 2 - 0.25, y: 1.9,
        w: 0.5, h: 0.5,
        fill: { color },
        line: { color: C.white, width: 1.5 },
      });
      slide.addText(`${i + 1}`, {
        x: x + colW / 2 - 0.25, y: 1.9,
        w: 0.5, h: 0.5,
        fontSize: 14, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });

      slide.addShape("rect", {
        x: x + 0.1, y: 1.15, w: colW - 0.2, h: 0.65,
        fill: { color },
      });
      slide.addText(phase.phase, {
        x: x + 0.1, y: 1.15, w: colW - 0.2, h: 0.65,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });
      slide.addText(phase.duration, {
        x: x + 0.1, y: 2.55, w: colW - 0.2, h: 0.4,
        fontSize: 10, bold: true, color: color,
        align: "center", fontFace: "Arial",
      });

      slide.addShape("rect", {
        x: x + 0.1, y: 3.05, w: colW - 0.2, h: 3.5,
        fill: { color: C.white },
        shadow: { type: "outer", blur: 3, offset: 1, angle: 45, color: "CCCCCC", opacity: 0.3 },
      });
      slide.addText(phase.milestones.map(m => `✓ ${m}`).join("\n"), {
        x: x + 0.2, y: 3.15, w: colW - 0.4, h: 3.3,
        fontSize: 10, color: C.textDark, valign: "top", fontFace: "Arial",
      });
    });
  }

  // ── Slide 12: Team ──────────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.white },
    });
    addSlideHeader(slide, 12, "Đội ngũ Dự án");

    const members = content.team.members;
    const perRow = Math.min(members.length, 5);
    const cardW = 9.4 / perRow;

    members.forEach((member, i) => {
      const x = 0.4 + i * cardW;
      const colors = [C.orange, C.navyLight, C.green, "8E44AD", C.navy];
      const color = colors[i % colors.length];

      slide.addShape("rect", {
        x, y: 1.3, w: cardW - 0.15, h: 5.2,
        fill: { color: C.lightGray },
        shadow: { type: "outer", blur: 4, offset: 2, angle: 45, color: "BBBBBB", opacity: 0.4 },
      });
      slide.addShape("ellipse", {
        x: x + (cardW - 0.15) / 2 - 0.55, y: 1.45,
        w: 1.1, h: 1.1,
        fill: { color },
      });
      slide.addText(member.name.charAt(0).toUpperCase(), {
        x: x + (cardW - 0.15) / 2 - 0.55, y: 1.45,
        w: 1.1, h: 1.1,
        fontSize: 26, bold: true, color: C.white,
        align: "center", valign: "middle", fontFace: "Arial",
      });
      slide.addText(member.name, {
        x, y: 2.65, w: cardW - 0.15, h: 0.45,
        fontSize: 11, bold: true, color: C.textDark,
        align: "center", fontFace: "Arial",
      });
      slide.addText(member.role, {
        x, y: 3.1, w: cardW - 0.15, h: 0.35,
        fontSize: 9, color: color, bold: true,
        align: "center", fontFace: "Arial",
      });
      slide.addText(member.responsibilities.map(r => `• ${r}`).join("\n"), {
        x: x + 0.15, y: 3.55, w: cardW - 0.45, h: 2.7,
        fontSize: 9, color: C.textMid, valign: "top", fontFace: "Arial",
      });
    });
  }

  // ── Slide 13: Thank You ──────────────────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.navy },
    });
    slide.addShape("rect", {
      x: 0, y: 0, w: "100%", h: 0.1,
      fill: { color: C.orange },
    });
    slide.addShape("rect", {
      x: 0, y: 6.9, w: "100%", h: 0.1,
      fill: { color: C.orange },
    });

    slide.addText("SEONGON", {
      x: 0, y: 1.5, w: "100%", h: 0.8,
      fontSize: 36, bold: true, color: C.orange,
      align: "center", fontFace: "Arial",
    });
    slide.addText("Cảm ơn Quý khách hàng!", {
      x: 0, y: 2.5, w: "100%", h: 0.7,
      fontSize: 28, bold: true, color: C.white,
      align: "center", fontFace: "Arial",
    });
    slide.addShape("line", {
      x: 3.5, y: 3.35, w: 3, h: 0,
      line: { color: C.orange, width: 1.5 },
    });
    slide.addText("Q & A", {
      x: 0, y: 3.6, w: "100%", h: 0.55,
      fontSize: 22, color: C.orange, bold: true,
      align: "center", fontFace: "Arial",
    });
    slide.addText("Hỏi đáp & Thảo luận", {
      x: 0, y: 4.25, w: "100%", h: 0.45,
      fontSize: 14, color: "AAAAAA",
      align: "center", fontFace: "Arial",
    });
    slide.addText("www.seongon.com  |  hello@seongon.com", {
      x: 0, y: 5.5, w: "100%", h: 0.4,
      fontSize: 12, color: "888888",
      align: "center", fontFace: "Arial",
    });
  }

  const buffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  return buffer;
}
