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

// Week 1: June 2-6 (16 hrs)
const w1 = [
  ['June 2nd', 'Onboarding', 'Introduction call with Carlos and Juan Leal to understand product, team structure, and content expectations for the Content Lead role', '2.0', 'First meeting, reviewed onboarding guide and brand voice documents'],
  ['June 2nd', 'Content Audit', 'Initial audit of leasey.ai/blog and /resources: cataloged all existing posts by topic, date, format, and audience', '2.0', 'Mapped the full content landscape across both B2B and B2C funnels'],
  ['June 3rd', 'Content Audit', 'Deep-read of top 30 performing blog posts, analyzing voice, tone, audience targeting, CTA structure, and format patterns', '4.5', 'Identified two distinct voices: B2B operator-facing vs. B2C renter-facing'],
  ['June 4th', 'Research', 'Competitor content analysis: Buildium, AppFolio, DoorLoop, and Hemlane blogs, resource centers, and positioning strategies', '3.0', 'Mapped competitor gaps Leasey can own in leasing automation and AI chatbot content'],
  ['June 4th', 'Content Audit', 'Reviewed Brand Voice Guidelines from En Algun Lugar agency and cross-referenced with actual published content', '1.5', 'Noted discrepancies between agency guidelines and real blog voice'],
  ['June 5th', 'Research', 'Industry research on PropTech trends, AI in property management, and multifamily market data from CBRE, Yardi Matrix, and RealPage', '3.0', 'Gathered fresh data points for content angles and compiled audit summary'],
];

// Week 2: June 9-13 (16 hrs)
const w2 = [
  ['June 9th', 'Content Analysis', 'Detailed analysis of internal documents: SEO Knowledge Base, onboarding guide, and product docs; cross-referenced with published content', '4.5', 'Built unified understanding of positioning vs. what is actually being communicated'],
  ['June 10th', 'Communication Document', 'Defined the 5 communication pillars (Leasing Automation, Marketplace Syndication, Tenant Screening, AI/Chatbot, ROI) and 14 content clusters', '4.5', 'Each pillar mapped to product features, pain points, and awareness phases'],
  ['June 11th', 'Communication Document', 'Wrote the content system document: voice rules, format guidelines, channel templates, AEO rules, and pre-publish quality checklist', '3.0', 'https://docs.google.com/document/d/1SyMd0vkaBAbvvSXcNctCqqzrtY-qnmfq/edit'],
  ['June 11th', 'Alejandra Sync', 'Follow-up call with Alejandra (SEO specialist) to align on cluster priorities, technical SEO requirements, and keyword targets', '1.0', 'Discussed which clusters have traffic vs. which are zombie content'],
  ['June 12th', 'Website Messages', 'Developed new messaging for the Leasey.AI website redesign: hero copy, feature descriptions, and value propositions', '2.0', 'https://leasey-ai-spark.lovable.app/'],
  ['June 12th', 'Communication Document', 'Added attribution rules, author E-E-A-T guidelines, and dual-funnel rules (B2B operator vs. B2C renter) to the content system document', '1.0', 'Defined how each channel handles the demo CTA differently'],
];

// Week 3: June 16-20 (16 hrs)
const w3 = [
  ['June 16th', 'Content Calendar', 'Mapped the content backlog: identified 48 concrete content pieces from repressed announcements, SEO gaps, and product updates', '4.0', 'Each piece tagged with cluster, pillar, funnel phase, and priority level'],
  ['June 17th', 'Content Calendar', 'Built Weeks 1-4 of the 90-day content calendar with specific titles, clusters, target keywords, and assigned authors', '3.5', 'Prioritized Phase 3-4 content (decision stage) to drive demo bookings'],
  ['June 17th', 'Alejandra Sync', 'Weekly sync with Alejandra to review calendar draft and validate SEO keyword targets per content piece', '1.0', 'Adjusted 3 pieces based on her striking-distance keyword recommendations'],
  ['June 18th', 'Content Calendar', 'Built Weeks 5-8 of the calendar, balancing blog posts with LinkedIn thought leadership and Reddit community engagement', '3.5', 'Ensured each week covers at least 2 different pillars for topic diversity'],
  ['June 19th', 'Content Calendar', 'Built Weeks 9-12 and added press release schedule for partnership announcements; mapped Carlos and Juan as authors for thought leadership', '3.0', 'Calendar covers all 4 channels: blog, LinkedIn, Reddit, press'],
  ['June 19th', 'Communication Document', 'Finalized content system document: added awareness phases framework, testimonial guidelines, and competitor mention rules', '1.0', 'Document ready for Carlos and Juan review'],
];

// Week 4: June 22-26 (16 hrs)
const w4 = [
  ['June 22nd', 'SEO Cluster Analysis', 'Analyzed all 723 URLs on leasey.ai, classified each into the 14 SEO clusters, and cross-referenced with GSC click and impression data', '4.5', 'https://docs.google.com/spreadsheets/d/1JHOzFdyTHDfT2EDDAaOGhge7dN0Gy0Zi39AD7UAcIzQ/edit'],
  ['June 23rd', 'SEO Cluster Analysis', 'Built cluster-to-pillar mapping matrix and identified zombie content: 40+ templated city guides and old news pages diluting domain authority', '2.5', 'Found that Listing Guides and News clusters account for 300+ pages with near-zero clicks'],
  ['June 23rd', 'Content Calendar', 'Revised calendar Weeks 1-6 based on cluster analysis: reprioritized topics to avoid cannibalizing existing high-traffic pages', '2.0', 'Avoided duplicating content angles already covered by performing resource pages'],
  ['June 24th', 'Alejandra Sync', 'Weekly call with Alejandra to review cluster analysis findings and align on content cannibalization remediation strategy', '1.0', 'Agreed on which old content to keep, combine, or eliminate'],
  ['June 25th', 'Content Calendar', 'Adjusted calendar Weeks 7-12: added competitor comparison content (Leasey vs. Buildium, AppFolio) and fresh industry data pieces', '2.0', 'Bottom-funnel comparison content mapped to the highest-intent keywords'],
  ['June 25th-26th', 'SEO Cluster Analysis', 'Documented full cluster analysis recommendations and finalized calendar: verified keyword targets, pillar balance, and author assignments', '4.0', 'Created prioritized action list for SEO team and final calendar review pass'],
];

// Week 5: June 29-30 (16 hrs)
const w5 = [
  ['June 29th', 'Content Calendar', 'Final polish on the 90-day calendar: added internal linking strategy per piece and cross-referenced with Leasey product roadmap', '4.0', 'Each blog post has 2-3 suggested internal links to product/tool pages'],
  ['June 29th', 'Communication Document', 'Incorporated feedback from Carlos on voice tone and CTA approach; adjusted Reddit guidelines to soften product mentions', '2.0', 'Final version of content system document ready for team use'],
  ['June 29th', 'Content Calendar', 'Created the editorial workflow pipeline: DRAFT > QA > APPROVED > PUBLISHED with roles, turnaround times, and quality gates', '2.0', 'Walter writes, editor-QA reviews, Carlos/Juan approve, Walter publishes'],
  ['June 30th', 'Content Calendar', 'Submitted the completed 90-day content calendar to Carlos and Juan for final approval with all metadata', '2.0', 'Calendar includes titles, keywords, clusters, pillars, authors, deadlines'],
  ['June 30th', 'SEO Cluster Analysis', 'Prepared summary of the content audit and SEO cluster analysis: top 10 optimization opportunities with estimated traffic impact', '3.0', 'Highlighted cannibalization risks and quick-win striking distance keywords'],
  ['June 30th', 'Research', 'Researched AEO (Answer Engine Optimization) for AI citation: ChatGPT, Claude, Perplexity indexing requirements and technical prerequisites', '3.0', 'Drafted initial AEO guidelines (Parts 1-5) to add to content system document'],
];

async function main() {
  // Week 1: rows 14-19
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A14:E19`,
    valueInputOption: 'RAW', requestBody: { values: w1 },
  });
  console.log('Week 1 written (rows 14-19)');

  // Week 2: rows 23-28
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A23:E28`,
    valueInputOption: 'RAW', requestBody: { values: w2 },
  });
  console.log('Week 2 written (rows 23-28)');

  // Week 3: rows 33-38
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A33:E38`,
    valueInputOption: 'RAW', requestBody: { values: w3 },
  });
  console.log('Week 3 written (rows 33-38)');

  // Week 4: rows 43-48
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A43:E48`,
    valueInputOption: 'RAW', requestBody: { values: w4 },
  });
  console.log('Week 4 written (rows 43-48)');

  // Week 5: rows 53-58
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID, range: `'${TAB}'!A53:E58`,
    valueInputOption: 'RAW', requestBody: { values: w5 },
  });
  console.log('Week 5 written (rows 53-58)');

  console.log('\nDone! All 5 weeks filled with detailed daily tasks.');
}

main().catch(e => { console.error(e); process.exit(1); });
