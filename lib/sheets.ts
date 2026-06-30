import { google } from "googleapis";

const CALENDAR_SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const OPTIMISATION_SHEET_ID = process.env.OPTIMISATION_SHEET_ID || "";

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
  channel: string; voice: string; title: string;
  pillar: string; phase: string; status: string; docLink: string;
  sheetRow: number; // 1-based row number in the spreadsheet (incl. header row at 1)
};
export async function listCalendarRows(): Promise<CalendarRow[]> {
  if (!CALENDAR_SHEET_ID || !sheetsConfigured()) return [];
  return cached(`cal:${CALENDAR_SHEET_ID}`, async () => {
    const r = await sheetsClient().spreadsheets.values.get({ spreadsheetId: CALENDAR_SHEET_ID, range: "Sheet1!A:L" });
    const allRows = (r.data.values || []);
    // Map preserving the original sheet row (header at row 1, data starts at row 2)
    return allRows
      .slice(1)
      .map((row, i) => ({ row, sheetRow: i + 2 }))
      .filter(({ row }) => row[2]) // has date
      .map(({ row, sheetRow }) => ({
        month: +(row[0] || 0), week: +(row[1] || 0), date: row[2] || "", day: row[3] || "",
        channel: row[4] || "", voice: row[5] || "", title: row[6] || "",
        pillar: row[7] || "", phase: row[8] || "", status: row[9] || "", docLink: row[10] || "",
        sheetRow,
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  });
}

// ── Optimisation map (723 old URLs with cluster + pillar + action + owner) ──
export type OptRow = {
  priority: string; cluster: string; url: string;
  ga4: number; gsc: number;
  primary: string; secondary: string;
  action: string; owner: string;
};
export async function listOptimisationRows(): Promise<OptRow[]> {
  if (!OPTIMISATION_SHEET_ID || !sheetsConfigured()) return [];
  return cached(`opt:${OPTIMISATION_SHEET_ID}`, async () => {
    const r = await sheetsClient().spreadsheets.values.get({ spreadsheetId: OPTIMISATION_SHEET_ID, range: "Optimisation map!A:I" });
    const rows = (r.data.values || []).slice(1);
    return rows
      .filter((row) => row[2])
      .map((row) => ({
        priority: row[0] || "", cluster: row[1] || "", url: row[2] || "",
        ga4: +(row[3] || 0), gsc: +(row[4] || 0),
        primary: row[5] || "", secondary: row[6] || "",
        action: row[7] || "", owner: row[8] || "",
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
