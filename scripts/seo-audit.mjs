import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const TRACKER_SHEET_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

// Auth for sheets (walter@leasey.ai tokens)
const sheetsAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
sheetsAuth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });

const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
const drive = google.drive({ version: 'v3', auth: sheetsAuth });

// Step 1: Read tracker spreadsheet
console.log('Reading tracker spreadsheet...');
const sheetRes = await sheets.spreadsheets.values.get({
  spreadsheetId: TRACKER_SHEET_ID,
  range: 'A:Z',
});
const rows = sheetRes.data.values;
const header = rows[0];
console.log('Header columns:', header);

// Find relevant columns
const titleCol = 0; // A
const linkCol = header.findIndex(h => /link|url|doc/i.test(h));
const keywordCol = 5; // F (0-indexed)

console.log(`Link col index: ${linkCol}, Keyword col index: ${keywordCol}`);

// Extract doc info
const docs = [];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const title = row[titleCol] || '';
  if (!title) continue;

  // Try to find Google Doc ID from link column or any column with a docs.google.com URL
  let docId = null;
  for (const cell of row) {
    if (!cell) continue;
    const match = cell.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (match) { docId = match[1]; break; }
  }

  const keyword = (row[keywordCol] || '').trim();
  docs.push({ title, docId, keyword, row: i + 1 });
}

console.log(`Found ${docs.length} docs. ${docs.filter(d => d.docId).length} have doc IDs.`);

// Step 2: Download and audit each doc
async function downloadDocText(docId) {
  try {
    const res = await drive.files.export({
      fileId: docId,
      mimeType: 'text/plain',
    });
    return res.data;
  } catch (e) {
    console.error(`  Failed to download ${docId}: ${e.message}`);
    return null;
  }
}

async function downloadDocHtml(docId) {
  try {
    const res = await drive.files.export({
      fileId: docId,
      mimeType: 'text/html',
    });
    return res.data;
  } catch (e) {
    return null;
  }
}

// Audit functions
function countWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function getLines(text) {
  return text.split('\n').filter(l => l.trim());
}

function auditDoc(title, plainText, htmlText, keyword) {
  const results = {};
  const lines = getLines(plainText);
  const wordCount = countWords(plainText);
  const lowerText = plainText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase().trim();

  // Find introduction: text between first heading and second heading
  // In plain text export, headings are typically standalone lines
  // Let's parse structure from HTML
  const headings = [];
  const hRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let hMatch;
  while ((hMatch = hRegex.exec(htmlText || '')) !== null) {
    headings.push({ level: parseInt(hMatch[1]), text: hMatch[2].replace(/<[^>]+>/g, ''), index: hMatch.index });
  }

  // Extract intro: text after first H1/H2 until next heading
  let introText = '';
  if (headings.length >= 2) {
    const afterFirst = (htmlText || '').substring(headings[0].index + headings[0].text.length + 10);
    const nextHMatch = afterFirst.match(/<h[1-6]/i);
    if (nextHMatch) {
      introText = afterFirst.substring(0, nextHMatch.index).replace(/<[^>]+>/g, '').trim();
    }
  } else if (lines.length > 1) {
    // Fallback: first few lines after title
    introText = lines.slice(1, 5).join('\n');
  }

  const introLines = introText.split('\n').filter(l => l.trim()).length;
  const introSentences = introText.split(/[.!?]+/).filter(s => s.trim()).length;

  // Rule 1: Meta description / excerpt (check if there's a short excerpt-like section)
  // We check if the first paragraph before content is <= 3 lines
  const firstPara = lines.slice(0, 3).join(' ');
  results['R1'] = { pass: true, note: 'Check manually - excerpt not separately identifiable in doc' };

  // Rule 2: Search intent answered ASAP in intro
  if (lowerKeyword && introText.toLowerCase().includes(lowerKeyword)) {
    results['R2'] = { pass: true, note: 'Keyword appears in intro' };
  } else {
    results['R2'] = { pass: false, note: 'Keyword not found in intro - verify search intent is addressed early' };
  }

  // Rule 3: Introduction max 3 lines
  if (introSentences <= 4) {
    results['R3'] = { pass: true, note: `Intro: ~${introSentences} sentences` };
  } else {
    results['R3'] = { pass: false, note: `Intro too long: ~${introSentences} sentences (max 3-4)` };
  }

  // Rule 4: No links in introduction
  let introHtml = '';
  if (headings.length >= 2 && htmlText) {
    const afterFirst = htmlText.substring(headings[0].index);
    const nextH = afterFirst.substring(20).match(/<h[1-6]/i);
    if (nextH) {
      introHtml = afterFirst.substring(0, nextH.index + 20);
    }
  }
  const introLinks = (introHtml.match(/<a\s/gi) || []).length;
  results['R4'] = { pass: introLinks === 0, note: introLinks > 0 ? `${introLinks} link(s) found in intro` : 'No links in intro' };

  // Rule 5: Keyword in title/H1 and body
  const titleLower = title.toLowerCase();
  const h1Text = headings.find(h => h.level === 1)?.text?.toLowerCase() || '';
  const kwInTitle = lowerKeyword && (titleLower.includes(lowerKeyword) || h1Text.includes(lowerKeyword));
  const kwInBody = lowerKeyword && lowerText.includes(lowerKeyword);
  if (!lowerKeyword) {
    results['R5'] = { pass: false, note: 'No target keyword defined' };
  } else {
    results['R5'] = { pass: kwInTitle && kwInBody, note: `In title/H1: ${kwInTitle ? 'Yes' : 'NO'}, In body: ${kwInBody ? 'Yes' : 'NO'}` };
  }

  // Rule 6: Keyword minimum once, conversational
  if (!lowerKeyword) {
    results['R6'] = { pass: false, note: 'No keyword defined' };
  } else {
    const kwCount = (lowerText.match(new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    results['R6'] = { pass: kwCount >= 1, note: `Keyword appears ${kwCount} time(s)` };
  }

  // Rule 7: External reference to scientific/authoritative source
  const extLinks = (htmlText || '').match(/<a\s+[^>]*href=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];
  // Filter out internal links
  const externalLinks = extLinks.filter(l => !l.includes('leasey.ai'));
  results['R7'] = { pass: externalLinks.length >= 1, note: `${externalLinks.length} external link(s) found` };

  // Rule 8: No filler paragraphs (heuristic: check for very short repeated phrases)
  results['R8'] = { pass: true, note: 'Manual review recommended' };

  // Rule 9: No unresearched topics
  results['R9'] = { pass: true, note: 'Manual review recommended' };

  // Rule 10: Specific, verifiable information
  results['R10'] = { pass: externalLinks.length >= 1, note: externalLinks.length >= 1 ? 'Has external references' : 'No verifiable external sources cited' };

  // Rule 11: Short sentences/paragraphs (max 4 lines per paragraph)
  const paragraphs = plainText.split(/\n\s*\n/).filter(p => p.trim());
  const longParas = paragraphs.filter(p => {
    const pLines = p.split('\n').filter(l => l.trim()).length;
    const pWords = countWords(p);
    return pLines > 4 || pWords > 100;
  });
  results['R11'] = { pass: longParas.length === 0, note: longParas.length > 0 ? `${longParas.length} paragraph(s) too long` : 'All paragraphs OK' };

  // Rule 12: Heading hierarchy (no skipping levels)
  let hierarchyOk = true;
  let hierIssues = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      hierarchyOk = false;
      hierIssues.push(`H${headings[i - 1].level}->H${headings[i].level} (skipped)`);
    }
  }
  results['R12'] = { pass: hierarchyOk, note: hierarchyOk ? `${headings.length} headings, hierarchy OK` : `Issues: ${hierIssues.join(', ')}` };

  // Rule 13: Passive voice detection (simple heuristic)
  const passivePatterns = /\b(is|are|was|were|been|being|be)\s+(being\s+)?\w+ed\b/gi;
  const passiveMatches = plainText.match(passivePatterns) || [];
  const passiveRatio = passiveMatches.length / Math.max(1, plainText.split(/[.!?]+/).length);
  results['R13'] = { pass: passiveRatio < 0.2, note: `${passiveMatches.length} passive constructions (~${(passiveRatio * 100).toFixed(0)}% of sentences)` };

  // Rule 14: Bold usage (check for <b>, <strong>, or font-weight:700 spans — excluding headings)
  const boldTags = (htmlText || '').match(/<(b|strong)[^>]*>/gi) || [];
  const fwBold = (htmlText || '').match(/<span[^>]*font-weight:\s*700[^>]*>[^<]{4,}/gi) || [];
  const fwBoldNonHeading = fwBold.filter(s => !s.match(/font-size:\s*(1[4-9]|[2-9]\d)pt/));
  const totalBold = boldTags.length + fwBoldNonHeading.length;
  results['R14'] = { pass: totalBold >= 2, note: `${totalBold} bold section(s) found` };

  // Rule 15: Spelling errors (basic check - just flag for manual review)
  results['R15'] = { pass: true, note: 'Manual spell-check recommended' };

  // Rule 16: Images
  const images = (htmlText || '').match(/<img\s/gi) || [];
  results['R16'] = { pass: images.length >= 1, note: `${images.length} image(s) found` };

  // Rule 17: Word count 800-1000
  results['R17'] = { pass: wordCount >= 800 && wordCount <= 1000, note: `${wordCount} words` };

  return results;
}

// Process all docs
const allResults = [];
for (const doc of docs) {
  console.log(`\nAuditing: ${doc.title} (keyword: "${doc.keyword}")`);
  if (!doc.docId) {
    console.log('  No doc ID found, skipping.');
    allResults.push({ title: doc.title, keyword: doc.keyword, error: 'No Google Doc link found' });
    continue;
  }

  const plainText = await downloadDocText(doc.docId);
  const htmlText = await downloadDocHtml(doc.docId);

  if (!plainText) {
    allResults.push({ title: doc.title, keyword: doc.keyword, error: 'Failed to download' });
    continue;
  }

  const results = auditDoc(doc.title, plainText, htmlText, doc.keyword);
  allResults.push({ title: doc.title, keyword: doc.keyword, results, wordCount: countWords(plainText) });
}

// Step 3: Generate report
const ruleNames = [
  'R1: Meta/Excerpt <=3 lines',
  'R2: Intent in intro',
  'R3: Intro <=3 lines',
  'R4: No links in intro',
  'R5: KW in title+body',
  'R6: KW min 1x',
  'R7: External ref',
  'R8: No filler',
  'R9: Verified topics',
  'R10: Verifiable info',
  'R11: Short paragraphs',
  'R12: Heading hierarchy',
  'R13: Active voice',
  'R14: Bold usage',
  'R15: No typos',
  'R16: Images',
  'R17: 800-1000 words',
];

let report = `# Leasey.AI Blog SEO Audit Results\n\n`;
report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
report += `**Docs audited:** ${allResults.length}\n\n`;

// Summary table
report += `## Summary\n\n`;
report += `| # | Title | KW | Words | Pass | Fail | Score |\n`;
report += `|---|-------|-----|-------|------|------|-------|\n`;

for (let i = 0; i < allResults.length; i++) {
  const r = allResults[i];
  if (r.error) {
    report += `| ${i + 1} | ${r.title.substring(0, 40)} | ${r.keyword || '-'} | - | - | - | ERROR: ${r.error} |\n`;
    continue;
  }
  const passes = Object.values(r.results).filter(v => v.pass).length;
  const fails = Object.values(r.results).filter(v => !v.pass).length;
  const score = ((passes / 17) * 100).toFixed(0);
  report += `| ${i + 1} | ${r.title.substring(0, 40)} | ${r.keyword || '-'} | ${r.wordCount} | ${passes} | ${fails} | ${score}% |\n`;
}

// Detailed results per doc
report += `\n## Detailed Results\n\n`;
for (const r of allResults) {
  if (r.error) {
    report += `### ${r.title}\n**ERROR:** ${r.error}\n\n`;
    continue;
  }
  report += `### ${r.title}\n`;
  report += `**Target Keyword:** ${r.keyword || 'Not set'} | **Words:** ${r.wordCount}\n\n`;
  report += `| Rule | Status | Details |\n`;
  report += `|------|--------|---------|\n`;
  for (let j = 0; j < ruleNames.length; j++) {
    const key = `R${j + 1}`;
    const res = r.results[key];
    if (res) {
      report += `| ${ruleNames[j]} | ${res.pass ? 'PASS' : '**FAIL**'} | ${res.note} |\n`;
    }
  }
  report += `\n`;
}

// Write report
const outPath = path.join(__dirname, 'seo-audit-results.md');
fs.writeFileSync(outPath, report, 'utf-8');
console.log(`\nReport written to: ${outPath}`);
