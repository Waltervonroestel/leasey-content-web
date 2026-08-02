import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });

const SID = '1DFQqb9Su_bjhJ7sJicDsUN4PRKhAJRh0blr45DXm-SQ';
const TAB = 'Timesheet Q2 2026';

function row(date, project, activity, hrs, comment) {
  return [date, project, activity, String(hrs), comment, String(hrs)];
}

// Clear weeks 6-10 first (rows 63-69, 73-78, 82-87, 91-96, 100-106)
const clearRanges = [
  `'${TAB}'!A63:F69`,
  `'${TAB}'!A73:F78`,
  `'${TAB}'!A82:F87`,
  `'${TAB}'!A91:F96`,
  `'${TAB}'!A100:F106`,
];
for (const r of clearRanges) {
  await sheets.spreadsheets.values.clear({ spreadsheetId: SID, range: r });
}
console.log('Cleared weeks 6-10');

// Week 6 (July 1-3, Wed-Fri): 16 hrs in 3 days
const w6 = [
  row('July 1st', 'Content Audit', 'Analysed the Clusterización 2026 sheet (242 URLs): classified pages by work type (Rewrite, Optimise, Landing), cross-referenced with GSC data', 3.0, 'Identified 55 pages for priority rewrite, 10 for optimisation, 5 landing pages'),
  row('July 1st', 'Content Audit', 'Deep-dive into the 55 priority rewrite pages: documented current state, ranking keywords, redirect dependencies, and consolidation targets', 2.5, 'Each page mapped to its pillar, cluster, and target author'),
  row('July 2nd', 'WordPress Audit', 'Reviewed all 40+ existing drafts in WordPress: catalogued by status, topic overlap, and publish-readiness', 3.0, 'First pass to identify duplicates, obsolete posts, and consolidation opportunities'),
  row('July 2nd', 'WordPress Audit', 'Categorised each draft by action (delete, combine, rewrite, keep); documented decisions with rationale', 2.5, 'Cross-referenced with Clusterización findings'),
  row('July 3rd', 'WordPress Cleanup', 'Deleted 7 redundant/obsolete drafts; combined 3 overlapping scenario pages into unified Google Docs', 3.0, 'Each doc follows content system rules (British English, sourced data, author attribution)'),
  row('July 3rd', 'WordPress Cleanup', 'Began rewriting individual scenario pages with updated positioning and product facts', 2.0, 'Aligned with canonical product data from leasey.ai'),
];

// Week 7 (July 7-11, Mon-Fri): 16 hrs in 5 days
const w7 = [
  row('July 7th', 'WordPress Cleanup', 'Completed rewrite of 7 individual scenario pages with updated positioning and product facts', 3.0, 'Aligned with canonical product data from leasey.ai'),
  row('July 8th', 'WordPress Cleanup', 'Improved 10 tool/resource pages, combined 2 redundant tools; prepared 5 publish-ready posts with centralised tracker sheet', 3.0, 'Tracker links each piece to its Google Doc and target URL'),
  row('July 9th', 'Content Framework', 'Documented 18 quality rules + 4 critical rules as rewrite brief; integrated Dan Koe\'s persuasion framework (Three Tensions, 5 Levers, Schwartz awareness) into the content system', 3.5, 'Created governing documents for all 55 rewrites'),
  row('July 10th', 'Landing Pages', 'Wrote content for listing-guides hub (43 city pages) and legal hub (17 lease clauses) with SEO structure and internal linking', 3.5, 'Each hub serves as pillar for its content cluster'),
  row('July 11th', 'Landing Pages', 'Wrote content for benefits hub (11 stakeholder personas) and tools hub (7 calculators) with persuasion framework', 3.0, 'Mapped to awareness phases per content system'),
];

// Week 8 (July 14-17, Tue-Fri, Monday holiday): 16 hrs in 4 days
const w8 = [
  row('July 14th', 'Landing Pages', 'Wrote content for compare hub (competitive comparison table across 7 competitors); verified competitor features and pricing via web research', 4.0, 'Confirmed data for LetHub, Hemlane, Funnel Leasing, Knock CRM, others'),
  row('July 15th', 'Landing Pages', 'Extracted design system from leasey.ai (colours, typography, spacing, components) and created Lovable-ready prompts for all 5 hubs', 4.0, 'Design system documented for consistent branding across all tools'),
  row('July 16th', 'Source Verification', 'Verified stats and hyperlinks across existing blog articles against official sources; corrected Census figure (7.2%), RealPage (94.8%), Ring/Amazon year (2022), Illinois statute (765 ILCS 721)', 3.5, 'Each stat traced to its primary source URL'),
  row('July 17th', 'Content Quality Audit', 'Audited articles for fabricated stats and unsourced data; deleted 3 circular citations (Pew 54%, Entrata 60%, Calgary +171%); purged invented percentages across 55 files', 3.5, 'Zero tolerance: no stat without a verifiable source'),
  row('July 17th', 'Team Meeting', 'Team sync with Carlos, Juan, Alejandra, and Daniel to review content progress, blog template requirements, and lead magnet roadmap', 1.0, 'Discussed blog categorisation for Daniel and lead magnet priorities'),
];

// Week 9 (July 21-24, Tue-Fri, Monday holiday): 16 hrs in 4 days — 6 rows max
const w9 = [
  row('July 21st', 'Content Standardisation', 'Corrected British English spelling, removed all em-dashes, added missing author bio boxes; created brief template with mandatory Target Keywords section. Weekly sync with Alejandra to review keyword targets and publishing priorities', 3.0, 'Aligned on add-only strategy for Tenant Credit Check and AI Virtual Assistants'),
  row('July 21st', 'Author Profiles', 'Created E-E-A-T author bio pages for Juan Leal (CEO/CPO) and Carlos Leal (COO): LinkedIn-linked bios, expertise areas, and author schema for SEO authority', 1.0, 'Blocker from SEO audit: all blog posts need real author attribution'),
  row('July 22nd', 'Pillar Page', 'Wrote the Centralized Leasing pillar page (destination for 128 redirects): full rewrite with H1 optimisation, author bio, internal linking', 3.5, 'Critical blocker: 128 pages redirect to this URL'),
  row('July 23rd', 'Content Briefs', 'Wrote English briefs for Tenant Credit Check optimisation (add-only, 62 ranking keywords, comparison table, FAQ) and AI Virtual Assistants rewrite (target keywords table, proposed structure). Categorised all 242 site URLs into 5 blog clusters for Daniel', 3.0, 'Briefs for Alejandra\'s approval; blog clusters for developer template'),
  row('July 24th', 'Lead Magnets', 'Designed Tenant Screening Criteria Builder (Cluster 3): state-specific compliance logic, slider-based criteria, downloadable PDF policy; wrote Lovable prompt with full UX spec', 3.0, 'Interactive tool with legal warnings per state'),
  row('July 24th', 'Lead Magnets', 'Designed Rent Benchmark Report (Cluster 4): sourced data for 12 metros (8 US + 4 Canada); created Lead Magnets tracking sheet mapping all 5 clusters with descriptions and URLs', 2.5, 'Sources: Apartment List, RealPage, CMHC, Rentals.ca, RentCafe'),
];

// Week 10: NOT USED — lead magnets go into week 9 (July 23-24)
const w10 = [];

// Write all weeks
const writes = [
  { range: `'${TAB}'!A63:F68`, values: w6 },
  { range: `'${TAB}'!A73:F77`, values: w7 },
  { range: `'${TAB}'!A82:F86`, values: w8 },
  { range: `'${TAB}'!A91:F96`, values: w9 },
];

for (const w of writes) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID,
    range: w.range,
    valueInputOption: 'RAW',
    requestBody: { values: w.values },
  });
  console.log('Written:', w.range, `(${w.values.length} rows)`);
}

console.log('\nVerification:');
console.log('Week 6:', w6.reduce((s, r) => s + parseFloat(r[3]), 0), 'hrs');
console.log('Week 7:', w7.reduce((s, r) => s + parseFloat(r[3]), 0), 'hrs');
console.log('Week 8:', w8.reduce((s, r) => s + parseFloat(r[3]), 0), 'hrs');
console.log('Week 9:', w9.reduce((s, r) => s + parseFloat(r[3]), 0), 'hrs');
if (w10.length) console.log('Week 10:', w10.reduce((s, r) => s + parseFloat(r[3]), 0), 'hrs');
console.log('\nDone! Open: https://docs.google.com/spreadsheets/d/' + SID + '/edit?gid=70172581');
