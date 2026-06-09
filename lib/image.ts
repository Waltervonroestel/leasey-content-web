import sharp from "sharp";

// Genera imágenes de marca por código (SVG a PNG). El "brief" se arma interno
// a partir del contenido: no se le pide nada al usuario, el outcome es el PNG.

const BLUE = "#1f6feb";
const TEAL = "#0ea5a4";
const INK = "#0f1b2d";
const BG = "#f6f8fb";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) lines.push(line.trim());
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line.trim());
  return lines;
}

export interface ImageSpec {
  kind: "cover" | "hero" | "carousel-slide";
  title: string;
  subtitle?: string;
  eyebrow?: string;
  heroNumber?: string;
  source?: string;
  slideIndex?: number;
  slideTotal?: number;
}

function svgFor(spec: ImageSpec): { svg: string; w: number; h: number } {
  if (spec.kind === "hero") {
    const w = 1200, h = 1200;
    const num = esc(spec.heroNumber || "");
    const label = wrap(spec.title, 28).slice(0, 3);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="#e9f0f8"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <rect x="0" y="0" width="14" height="${h}" fill="${BLUE}"/>
      <rect x="80" y="120" width="120" height="8" fill="${TEAL}"/>
      <text x="80" y="${h / 2 - 40}" font-family="Arial, sans-serif" font-size="280" font-weight="800" fill="${BLUE}">${num}</text>
      ${label.map((l, i) => `<text x="84" y="${h / 2 + 110 + i * 64}" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="${INK}">${esc(l)}</text>`).join("")}
      ${spec.source ? `<text x="84" y="${h - 90}" font-family="Arial, sans-serif" font-size="30" fill="#5b6b7f">${esc(spec.source)}</text>` : ""}
      <text x="84" y="${h - 44}" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${INK}">leasey.ai</text>
    </svg>`;
    return { svg, w, h };
  }
  if (spec.kind === "carousel-slide") {
    const w = 1080, h = 1080;
    const title = wrap(spec.title, 22).slice(0, 5);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" fill="${INK}"/>
      <rect x="0" y="0" width="${w}" height="12" fill="${BLUE}"/>
      ${spec.eyebrow ? `<text x="72" y="120" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${TEAL}">${esc(spec.eyebrow)}</text>` : ""}
      ${spec.heroNumber ? `<text x="68" y="360" font-family="Arial, sans-serif" font-size="200" font-weight="800" fill="#ffffff">${esc(spec.heroNumber)}</text>` : ""}
      ${title.map((l, i) => `<text x="72" y="${(spec.heroNumber ? 470 : 200) + i * 70}" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join("")}
      ${spec.source ? `<text x="72" y="${h - 120}" font-family="Arial, sans-serif" font-size="28" fill="#9fb2c8">${esc(spec.source)}</text>` : ""}
      <text x="72" y="${h - 70}" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">leasey<tspan fill="${BLUE}">.ai</tspan></text>
      ${spec.slideTotal ? `<text x="${w - 140}" y="${h - 70}" font-family="Arial, sans-serif" font-size="28" fill="#9fb2c8">${spec.slideIndex}/${spec.slideTotal}</text>` : ""}
    </svg>`;
    return { svg, w, h };
  }
  // cover 1600x900
  const w = 1600, h = 900;
  const title = wrap(spec.title.split(/[:(]/)[0].trim(), 30).slice(0, 3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="#e3ecf6"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect x="0" y="0" width="${w}" height="14" fill="${BLUE}"/>
    <rect x="90" y="150" width="120" height="8" fill="${TEAL}"/>
    ${spec.eyebrow ? `<text x="90" y="130" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${BLUE}">${esc(spec.eyebrow.toUpperCase())}</text>` : ""}
    ${title.map((l, i) => `<text x="90" y="${300 + i * 90}" font-family="Arial, sans-serif" font-size="76" font-weight="800" fill="${INK}">${esc(l)}</text>`).join("")}
    ${spec.subtitle ? `<text x="92" y="${300 + title.length * 90 + 40}" font-family="Arial, sans-serif" font-size="34" fill="#5b6b7f">${esc(spec.subtitle.slice(0, 70))}</text>` : ""}
    <text x="90" y="${h - 60}" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${INK}">leasey<tspan fill="${BLUE}">.ai</tspan></text>
    <circle cx="${w - 120}" cy="${h - 120}" r="40" fill="${TEAL}" opacity="0.25"/>
    <circle cx="${w - 200}" cy="${h - 120}" r="40" fill="${BLUE}" opacity="0.2"/>
  </svg>`;
  return { svg, w, h };
}

export async function renderImage(spec: ImageSpec): Promise<Buffer> {
  const { svg } = svgFor(spec);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
