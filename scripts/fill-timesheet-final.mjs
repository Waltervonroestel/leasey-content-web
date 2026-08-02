import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: o });

const SID = '1DFQqb9Su_bjhJ7sJicDsUN4PRKhAJRh0blr45DXm-SQ';
const TAB = 'Timesheet Q2 2026';

const w1 = [
  ['June 2nd', 'Content Audit', 'Initial audit of leasey.ai/blog: cataloged all existing blog posts by topic, publish date, format, and target audience', '4.0', 'First pass through the blog to understand current content landscape'],
  ['June 3rd', 'Voice Analysis', 'Deep-read of top performing blog posts analyzing voice, tone, audience targeting, CTA structure, and format differences', '4.0', 'Identified two distinct voices: B2B operator-facing vs. B2C renter-facing'],
  ['June 4th', 'Research', 'Market trends research: PropTech industry landscape, AI adoption in property management, and multifamily market dynamics', '4.5', 'Initial research without specific competitor or client context yet'],
  ['June 5th', 'Research', 'Broad market investigation: rental market data from CBRE, Yardi Matrix, and RealPage; identified key trends in leasing automation', '3.5', 'Gathered data points and market context to prepare for onboarding call'],
];

const w2 = [
  ['June 9th', 'Onboarding', 'Onboarding call with Carlos and Juan Leal to understand product, team structure, ICPs, competitors, and content expectations', '2.0', 'Received onboarding guide, SEO Knowledge Base, and brand documents'],
  ['June 9th', 'Content Analysis', 'Detailed analysis of internal documents received in onboarding: SEO Knowledge Base, onboarding guide, and product documentation', '2.0', 'Cross-referenced internal positioning with findings from Week 1 blog audit'],
  ['June 10th', 'Voice Analysis', 'Studied Carlos and Juan\'s writing style through their LinkedIn posts and internal documents to define founder voice guidelines', '2.0', 'Documented voice patterns for thought leadership content'],
  ['June 10th', 'Positioning', 'Defined the 5 positioning pillars (Leasing Automation, Marketplace Syndication, Tenant Screening, AI/Chatbot, ROI) with supporting data', '2.0', 'Each pillar mapped to product features, audience pain points, and competitor gaps'],
  ['June 11th', 'Communication Document', 'Defined 14 content clusters and mapped them to awareness phases (1-5) to ensure balanced funnel coverage', '2.5', 'Clusters organized by topic, funnel stage, and priority level'],
  ['June 11th', 'Communication Document', 'Wrote the content system document: voice rules, format guidelines, channel templates, and pre-publish quality checklist', '2.5', 'https://docs.google.com/document/d/1SyMd0vkaBAbvvSXcNctCqqzrtY-qnmfq/edit'],
  ['June 12th', 'Website Messages', 'Developed new messaging for the Leasey.AI website redesign: homepage hero copy, headline, and value proposition', '2.0', 'First version, homepage only'],
  ['June 12th', 'Repressed Backlog', 'Audited the backlog of 2025 announcements that were never published: partnerships, product launches, and feature updates', '1.0', 'Cataloged each piece with publish-readiness status and priority'],
];

const w3 = [
  ['June 16th', 'Client Analysis', 'Deep-dive analysis of real Leasey clients: segmented by size, geography, and use case; counted feature mentions across testimonials', '2.5', 'Identified which client stories anchor which positioning pillar'],
  ['June 16th', 'Content Calendar', 'Mapped the content backlog: identified 48 concrete content pieces from repressed announcements, SEO gaps, and product updates', '2.0', 'Each piece tagged with cluster, pillar, funnel phase, and priority level'],
  ['June 17th', 'Content Calendar', 'Built Weeks 1-4 of the 90-day content calendar with specific titles, clusters, target keywords, and assigned authors', '3.0', 'Prioritized Phase 3-4 content (decision stage) to drive demo bookings'],
  ['June 17th', 'Alejandra Sync', 'Weekly sync with Alejandra to review calendar draft and validate SEO keyword targets per content piece', '1.0', 'Adjusted 3 pieces based on her striking-distance keyword recommendations'],
  ['June 18th', 'Content Calendar', 'Built Weeks 5-8 of the calendar, balancing blog posts with LinkedIn thought leadership and Reddit community engagement', '2.5', 'Ensured each week covers at least 2 different pillars for topic diversity'],
  ['June 18th', 'Website Messages', 'Developed messaging for all remaining website tabs (features, integrations, pricing, marketplace) and About Us page', '3.5', 'Juan requested full site messaging after reviewing homepage version'],
  ['June 19th', 'Content Calendar', 'Built Weeks 9-12 and added press release schedule for partnership announcements; mapped Carlos and Juan as authors for thought leadership', '1.5', 'Calendar covers all 4 channels: blog, LinkedIn, Reddit, press'],
];

const w4 = [
  ['June 22nd', 'Competitor Map', 'Built the full competitor map: direct (Funnel Leasing, Knock CRM), indirect (Buildium, AppFolio), and semantic competitors with keywords', '3.0', 'Documented what each competitor covers and what Leasey should NOT claim against them'],
  ['June 23rd', 'GSC Analysis', 'Analyzed Google Search Console data: identified striking-distance keywords, untapped queries, and low-CTR pages with high impressions', '3.0', 'Used real GSC data to prioritize which content to write and which to refresh'],
  ['June 23rd', 'Content Calendar', 'Revised calendar Weeks 1-6 based on GSC analysis: reprioritized topics to target striking-distance keywords', '2.0', 'Avoided duplicating content angles already covered by performing resource pages'],
  ['June 24th', 'Alejandra Sync', 'Weekly call with Alejandra to review GSC findings and align on content priorities based on search performance data', '1.0', 'Agreed on which keywords to target with new content vs. refreshing old pages'],
  ['June 25th', 'Content Calendar', 'Adjusted calendar Weeks 7-12: added competitor comparison content (Leasey vs. Buildium, AppFolio) and fresh industry data pieces', '2.0', 'Bottom-funnel comparison content mapped to the highest-intent keywords'],
  ['June 25th', 'US Market Analysis', 'Researched dual-market positioning (Canada + US): Sun Belt metrics, CBRE/Yardi data sources, and rule to not mix CAN/US data in same piece', '2.5', 'Canadian-first is the differentiator; US is the volume market'],
  ['June 26th', 'Awareness Phases', 'Developed the 5-phase awareness framework defining what content to create per funnel stage, with rule to prioritize Phase 3-4', '2.5', 'Framework ensures content mix drives demos, not just top-of-funnel traffic'],
];

const w5 = [
  ['June 29th', 'Content Calendar', 'Final polish on the 90-day content calendar', '3.5', 'Verified pillar balance and alignment with product roadmap across all 12 weeks'],
  ['June 29th', 'AEO Research', 'Analyzed HubSpot article on ChatGPT indexing: extracted key findings on AI crawler behavior, domain authority signals, and citation patterns', '2.5', 'Key finding: 350K+ referring domains = 8.4 AI citations vs. 1.6 for sites under 2.5K'],
  ['June 29th', 'AEO Guidelines', 'Wrote AEO Content Guidelines (Parts 1-7): structured data rules, FAQ formatting, AI crawler prerequisites, robots.txt, SSR, IndexNow', '4.0', 'Comprehensive guide for getting Leasey cited by ChatGPT, Claude, Perplexity, and Gemini'],
  ['June 30th', 'SEO Cluster Analysis', 'Prepared summary of content audit findings: top optimization opportunities, cannibalization risks, and zombie content recommendations', '3.5', 'Highlighted which old content to keep, combine, or eliminate'],
  ['June 30th', 'Communication Document', 'Added AEO guidelines as Part 7 to the content system document and updated pre-publish checklist with AI indexing verification steps', '2.5', 'Two new checklist items: raw HTML verification and ChatGPT indexing check'],
];

async function main() {
  // Clear old data rows first (rows 14-19, 23-29, 33-39, 43-49, 53-59)
  const ranges = ['A14:E19', 'A23:E29', 'A33:E39', 'A43:E49', 'A53:E59'];
  for (const range of ranges) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SID,
      range: `'${TAB}'!${range}`,
    });
  }
  console.log('Cleared old data');

  // Week 1: rows 14-17 (4 tasks)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A14:E17`,
    valueInputOption: 'RAW', requestBody: { values: w1 },
  });
  console.log('Week 1 written (4 tasks, 16 hrs)');

  // Week 2: rows 23-30 (8 tasks) — need to check if there's room
  // Week 2 has rows 23-29 available (7 slots). We have 8 tasks.
  // Let's use 23-30 but first check if row 30 is the total row
  // From the original data, row 30 is the total row. So we have 23-29 = 7 slots for 8 tasks.
  // We need to use all 7 rows. Combine the two June 11th tasks.
  const w2compact = [
    w2[0], w2[1], w2[2], w2[3],
    ['June 11th', 'Communication Document', 'Defined 14 content clusters mapped to awareness phases; wrote the content system document with voice rules, format guidelines, and quality checklist', '5.0', 'https://docs.google.com/document/d/1SyMd0vkaBAbvvSXcNctCqqzrtY-qnmfq/edit'],
    w2[6], w2[7],
  ];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A23:E29`,
    valueInputOption: 'RAW', requestBody: { values: w2compact },
  });
  console.log('Week 2 written (7 tasks, 16 hrs)');

  // Week 3: rows 33-39 (7 slots, 7 tasks)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A33:E39`,
    valueInputOption: 'RAW', requestBody: { values: w3 },
  });
  console.log('Week 3 written (7 tasks, 16 hrs)');

  // Week 4: rows 43-49 (7 slots, 7 tasks)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A43:E49`,
    valueInputOption: 'RAW', requestBody: { values: w4 },
  });
  console.log('Week 4 written (7 tasks, 16 hrs)');

  // Week 5: rows 53-57 (5 tasks)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A53:E57`,
    valueInputOption: 'RAW', requestBody: { values: w5 },
  });
  console.log('Week 5 written (5 tasks, 16 hrs)');

  console.log('\nDone! 5 weeks, 80 hours total.');
}

main().catch(e => { console.error(e); process.exit(1); });
