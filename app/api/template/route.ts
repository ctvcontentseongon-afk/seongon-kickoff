import { NextRequest, NextResponse } from "next/server";
import type { TemplateColors } from "@/types";

export const maxDuration = 30;

/* ── Color helpers ─────────────────────────────────────────────────── */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
  return ((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase();
}

function adjustBrightness(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.max(0, Math.round(r * factor))),
    Math.min(255, Math.max(0, Math.round(g * factor))),
    Math.min(255, Math.max(0, Math.round(b * factor)))
  );
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* ── XML color extraction ──────────────────────────────────────────── */
function extractTagColor(xml: string, tag: string): string | null {
  const re = new RegExp(`<a:${tag}[\\s>][\\s\\S]{0,300}?</a:${tag}>`, "i");
  const m = xml.match(re);
  if (!m) return null;
  const inner = m[0];

  const srgb = inner.match(/srgbClr[^>]*val="([A-Fa-f0-9]{6})"/i);
  if (srgb) return srgb[1].toUpperCase();

  const sys = inner.match(/sysClr[^>]*lastClr="([A-Fa-f0-9]{6})"/i);
  if (sys) return sys[1].toUpperCase();

  return null;
}

async function parseTheme(buffer: Buffer): Promise<TemplateColors | null> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const JSZip = require("jszip") as {
    loadAsync: (b: Buffer) => Promise<{
      files: Record<string, unknown>;
      file: (k: string) => { async: (t: "text") => Promise<string> };
    }>;
  };

  let zip: Awaited<ReturnType<typeof JSZip.loadAsync>>;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    return null;
  }

  // Find theme XML
  const themeKey = Object.keys(zip.files).find((f) =>
    /ppt\/theme\/theme\d+\.xml$/i.test(f)
  );
  if (!themeKey) return null;

  const xml: string = await zip.file(themeKey).async("text");

  const raw: Record<string, string | null> = {};
  for (const tag of ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6"]) {
    raw[tag] = extractTagColor(xml, tag);
  }

  // --- Choose primary dark color ---
  // Prefer dk2 if it's genuinely dark (luminance < 0.15)
  // Otherwise fall back to accent colors that are dark, then dk1
  let primary: string | null = null;
  const candidates = [raw.dk2, raw.dk1, raw.accent2, raw.accent3];
  for (const c of candidates) {
    if (c && luminance(c) < 0.25) {
      primary = c;
      break;
    }
  }
  // Last resort: just use dk2 or dk1 whatever they are
  primary = primary ?? raw.dk2 ?? raw.dk1 ?? "1A1A2E";

  // --- Choose accent (bright) color ---
  // Prefer accent1; skip if it's too dark or too close to primary
  let accent: string | null = null;
  for (const tag of ["accent1", "accent2", "accent3", "accent4", "accent5", "accent6"]) {
    const c = raw[tag];
    if (!c) continue;
    const lum = luminance(c);
    if (lum > 0.05 && lum < 0.85) {
      // Not pure black or pure white
      accent = c;
      break;
    }
  }
  accent = accent ?? "FF6B35";

  return {
    primary,
    primaryMid: adjustBrightness(primary, 0.85),
    primaryLight: adjustBrightness(primary, 1.4),
    accent,
    fileName: "",
  };
}

/* ── Route handler ─────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pptx", "ppt"].includes(ext ?? "")) {
      return NextResponse.json({ error: "Chỉ hỗ trợ file .pptx / .ppt" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const colors = await parseTheme(buffer);

    if (!colors) {
      return NextResponse.json(
        { error: "Không đọc được theme từ file này" },
        { status: 422 }
      );
    }

    colors.fileName = file.name;
    return NextResponse.json({ colors });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Lỗi không xác định";
    console.error("[/api/template]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
