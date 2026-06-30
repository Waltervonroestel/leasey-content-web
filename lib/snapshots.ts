// GSC weekly snapshots: a permanent history we control.
// Each row = one weekly snapshot of headline GSC metrics + per-query data.
// Stored in a "GSC Snapshots" tab of the Calendar sheet.

import { appendToSheet, readSheetTab, sheetsConfigured } from "@/lib/sheets";

const SHEET_ID = process.env.CALENDAR_SHEET_ID || "";
const TAB = "GSC Snapshots";
const QUERY_TAB = "GSC Snapshots Queries";

const HEADER = ["Date", "Days", "Clicks", "Impressions", "CTR", "Avg Position", "Unique Queries"];
const QUERY_HEADER = ["Date", "Query", "Clicks", "Impressions", "Position"];

export interface SnapshotRow {
  date: string;        // ISO YYYY-MM-DD
  days: number;        // window in days (e.g. 28)
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  uniqueQueries: number;
}

export async function listSnapshots(): Promise<SnapshotRow[]> {
  if (!sheetsConfigured()) return [];
  const rows = await readSheetTab(SHEET_ID, TAB);
  return rows
    .filter((r) => r[0] && r[0] !== "Date")
    .map((r) => ({
      date: r[0],
      days: Number(r[1] || 28),
      clicks: Number(r[2] || 0),
      impressions: Number(r[3] || 0),
      ctr: Number(r[4] || 0),
      avgPosition: Number(r[5] || 0),
      uniqueQueries: Number(r[6] || 0),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function appendSnapshot(snap: SnapshotRow): Promise<void> {
  if (!sheetsConfigured()) return;
  const existing = await readSheetTab(SHEET_ID, TAB);
  if (existing.length === 0) await appendToSheet(SHEET_ID, TAB, [HEADER]);
  await appendToSheet(SHEET_ID, TAB, [[
    snap.date, snap.days, snap.clicks, snap.impressions,
    snap.ctr.toFixed(5), snap.avgPosition.toFixed(2), snap.uniqueQueries,
  ]]);
}

export interface QuerySnapshotRow {
  date: string;
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

export async function appendQuerySnapshots(rows: QuerySnapshotRow[]): Promise<void> {
  if (!sheetsConfigured() || rows.length === 0) return;
  const existing = await readSheetTab(SHEET_ID, QUERY_TAB);
  if (existing.length === 0) await appendToSheet(SHEET_ID, QUERY_TAB, [QUERY_HEADER]);
  // Append in chunks of 500 to stay friendly with the Sheets API
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500).map((r) => [r.date, r.query, r.clicks, r.impressions, r.position.toFixed(2)]);
    await appendToSheet(SHEET_ID, QUERY_TAB, batch);
  }
}

export async function listQuerySnapshots(): Promise<QuerySnapshotRow[]> {
  if (!sheetsConfigured()) return [];
  const rows = await readSheetTab(SHEET_ID, QUERY_TAB);
  return rows
    .filter((r) => r[0] && r[0] !== "Date")
    .map((r) => ({
      date: r[0],
      query: r[1] || "",
      clicks: Number(r[2] || 0),
      impressions: Number(r[3] || 0),
      position: Number(r[4] || 0),
    }));
}
