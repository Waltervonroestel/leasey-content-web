import { google } from "googleapis";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const OPTIMISATION_SHEET_ID = process.env.OPTIMISATION_SHEET_ID || "";
// Tab name within the Calendar spreadsheet. Override with CALENDAR_TAB env var
// if you rename it in Google Sheets.
// "Content Calendar v2" is the live editorial calendar: 91 rows, 3 Aug to
// 23 Oct 2026, and the one whose drafts were corrected on 1 August. The old
// "content calendar" tab still exists and still holds a June schedule, which is
// what this app was showing until now.
export const CALENDAR_TAB = process.env.CALENDAR_TAB || "Content Calendar v2";

function sheetsClient() {
  const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
  return google.sheets({ version: "v4", auth: o });
}

export const sheetsConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_SHEETS_REFRESH_TOKEN);

// ── Simple in-process cache (5 min TTL) ──────────────────────────────────────
type Entry = { at: number; data: unknown };
const CACHE = new Map<string, Entry>();
const TTL_MS = 5 * 60 * 1000;
async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;
  const data = await fn();
  CACHE.set(key, { at: Date.now(), data });
  return data;
}

// ── Calendar (95 pieces from the editorial calendar sheet) ───────────────────
export type CalendarRow = {
  month: number; week: number; date: string; day: string;
  channel: string; voice: string; title: string; track: string;
  pillar: string; phase: string; status: string; docLink: string;
  sheetRow: number; // 1-based row number in the spreadsheet (incl. header row at 1)
};
export async function listCalendarRows(): Promise<CalendarRow[]> {
  if (!CALENDAR_SHEET_ID || !sheetsConfigured()) return [];
  return cached(`cal:${CALENDAR_SHEET_ID}`, async () => {
    const r = await sheetsClient().spreadsheets.values.get({ spreadsheetId: CALENDAR_SHEET_ID, range: `${CALENDAR_TAB}!A:N` });
    const allRows = r.data.values || [];

    // The two tabs do not share a shape. The old one starts with Month/Week and
    // puts the date in column C; v2 puts the date in column A and carries a
    // banner row above its header. Rather than hardcode one, find the header row
    // and read the columns by name, so renaming a tab or reordering columns does
    // not silently produce a calendar of empty rows.
    const norm = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim().toLowerCase();
    const headerIdx = allRows.findIndex((row) => row.some((c) => /publication date|^date$/.test(norm(c))));
    if (headerIdx < 0) return [];

    const header = allRows[headerIdx].map(norm);
    const col = (...names: string[]) => {
      for (const n of names) {
        const i = header.findIndex((h) => h === n || h.startsWith(n));
        if (i >= 0) return i;
      }
      return -1;
    };
    const idx = {
      month: col("month"),
      week: col("week"),
      date: col("publication date", "date"),
      day: col("day"),
      channel: col("social network", "channel"),
      voice: col("responsible", "voice"),
      track: col("track"),
      title: col("title of the blog", "working title", "title"),
      pillar: col("pillar"),
      phase: col("awareness phase", "phase"),
      status: col("status"),
      docLink: col("copy / draft doc", "doc link", "draft doc"),
    };
    const get = (row: string[], i: number) => (i >= 0 ? row[i] || "" : "");

    return allRows
      .slice(headerIdx + 1)
      .map((row, i) => ({ row, sheetRow: headerIdx + 2 + i }))
      .filter(({ row }) => get(row, idx.date))
      .map(({ row, sheetRow }) => ({
        month: +(get(row, idx.month) || 0),
        week: +(get(row, idx.week) || 0),
        date: get(row, idx.date),
        day: get(row, idx.day),
        channel: get(row, idx.channel),
        voice: get(row, idx.voice),
        track: get(row, idx.track),
        title: get(row, idx.title),
        pillar: get(row, idx.pillar),
        phase: get(row, idx.phase),
        status: get(row, idx.status),
        docLink: get(row, idx.docLink),
        sheetRow,
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  });
}

// ── Clusterización 2026: la hoja maestra ────────────────────────────────────
//
// Es la que mantiene el equipo y la única que se actualiza. Antes esto leía una
// hoja aparte con una foto de junio, así que el panel envejecía sin avisar.
//
// La pestaña buena es "Optimizacion + Clusters (Daniel)": trae lo mismo que las
// otras más meta title, meta description y cluster, que es lo que hace falta
// para decidir sin abrir la hoja.
//
// Dos avisos que vienen de haberse equivocado con ellos:
//   - "Visitas GSC" son CLICS, no impresiones. Un número unas veinte veces más
//     pequeño. Leerlo como impresiones llevó a marcar para borrar páginas que
//     estaban funcionando.
//   - "Visitas GA4" son sesiones. Tampoco son impresiones.
// Los campos se llaman aquí por lo que contienen para que no vuelva a pasar.
const CLUSTER_SHEET_ID =
  process.env.CLUSTER_SHEET_ID || "1g5HW6gK1jfJdlt8U6E13KAQ75z5gax5uw3j1f-ia1dI";
export const CLUSTER_TAB = process.env.CLUSTER_TAB || "Optimizacion + Clusters (Daniel)";

export type OptRow = {
  url: string;
  ga4Visits: number;
  gscClicks: number;
  /** false cuando la hoja dice NA: sin medir, que no es lo mismo que cero. */
  hasData: boolean;
  ranks: string;
  keywordCount: number;
  keywords: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  action: string;
  primary: string;
  secondary: string;
  decision: string;
  work: string;
  cluster: string;
  // Se conservan para no romper lo que ya leía estos nombres.
  priority: string;
  owner: string;
};

// Las celdas de métrica traen "NA" cuando no hay dato, y "NA" no es cero: una
// página sin medir no es una página sin tráfico. Con +("NA") sale NaN, que al
// serializar a JSON se convierte en null y arrastra a null cualquier suma que
// lo toque, así que un cluster entero aparecía sin clics por una sola fila.
//
// Se devuelve 0 para poder sumar, y se guarda aparte si el dato existía.
const num = (v: unknown): number => {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const measured = (v: unknown) => /^\s*\d/.test(String(v ?? ""));

export async function listOptimisationRows(): Promise<OptRow[]> {
  if (!sheetsConfigured()) return [];
  return cached(`cluster:${CLUSTER_SHEET_ID}`, async () => {
    const r = await sheetsClient().spreadsheets.values.get({
      spreadsheetId: CLUSTER_SHEET_ID,
      range: `${CLUSTER_TAB}!A:O`,
    });
    const rows = (r.data.values || []).slice(1);
    return rows
      .filter((row) => row[0] && String(row[0]).includes("/"))
      .map((row) => ({
        url: row[0] || "",
        ga4Visits: num(row[1]),
        gscClicks: num(row[2]),
        // Sin esto, "0 clics" y "nunca se midió" se ven igual en el panel, y
        // solo uno de los dos justifica borrar una página.
        hasData: measured(row[1]) || measured(row[2]),
        ranks: row[3] || "",
        keywordCount: num(row[4]),
        keywords: row[5] || "",
        content: row[6] || "",
        metaTitle: row[7] || "",
        metaDescription: row[8] || "",
        action: row[9] || "",
        primary: row[10] || "",
        secondary: row[11] || "",
        decision: row[12] || "",
        work: row[13] || "",
        cluster: row[14] || "",
        // "Trabajo" es quién y qué hay que hacer: es lo más cercano a un dueño.
        priority: row[13] || "",
        owner: row[13] || "",
      }));
  });
}

export const sheetUrls = () => ({
  calendar: `https://docs.google.com/spreadsheets/d/${CALENDAR_SHEET_ID}/edit`,
  optimisation: `https://docs.google.com/spreadsheets/d/${OPTIMISATION_SHEET_ID}/edit`,
});

// ── Write helpers ────────────────────────────────────────────────────────────
// Ensures a sheet tab exists, then appends rows to it.
async function ensureSheet(spreadsheetId: string, title: string) {
  const s = sheetsClient();
  const meta = await s.spreadsheets.get({ spreadsheetId });
  const exists = (meta.data.sheets || []).some((sh) => sh.properties?.title === title);
  if (!exists) {
    await s.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    });
  }
}

export async function appendToSheet(spreadsheetId: string, tabTitle: string, rows: (string | number)[][]) {
  if (!sheetsConfigured()) return;
  await ensureSheet(spreadsheetId, tabTitle);
  const s = sheetsClient();
  await s.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabTitle}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows },
  });
  // Bust cache
  CACHE.delete(`log:${spreadsheetId}:${tabTitle}`);
}

export async function readSheetTab(spreadsheetId: string, tabTitle: string): Promise<string[][]> {
  if (!sheetsConfigured()) return [];
  return cached(`log:${spreadsheetId}:${tabTitle}`, async () => {
    try {
      const s = sheetsClient();
      const r = await s.spreadsheets.values.get({ spreadsheetId, range: `${tabTitle}!A:Z` });
      return (r.data.values || []) as string[][];
    } catch {
      return [];
    }
  }) as Promise<string[][]>;
}
