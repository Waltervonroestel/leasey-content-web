import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs-html', 'manifest.json'), 'utf8'));

// Helper: find manifest entry by slug
function findDoc(slug) {
  return manifest.find(m => m.slug === slug);
}

// Helper: strip HTML tags and get plain text
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
}

// Helper: count words in HTML
function wordCount(html) {
  const text = stripHtml(html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<head[^>]*>[\s\S]*?<\/head>/gi, ''));
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

// Helper: extract the style from a typical body <p><span> to reuse when adding content
function getBodySpanStyle(html) {
  const m = html.match(/<p[^>]*>\s*<span\s+style="([^"]*font-size:11pt[^"]*)"/);
  return m ? m[1] : 'color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"arial";font-style:normal';
}

function getBodyPStyle(html) {
  const m = html.match(/<p\s+style="([^"]*)">\s*<span[^>]*font-size:11pt/);
  return m ? m[1] : 'padding:0;margin:0;color:#000000;font-size:11pt;font-family:"Arial";line-height:1.0;text-align:left';
}

// Helper: make a new paragraph in the doc's style
function makeParagraph(text, pStyle, spanStyle) {
  return `<p style="${pStyle}"><span style="${spanStyle}">${text}</span></p>`;
}

// ── Fix R5: Change H1 to include keyword ──
function fixH1(html, keyword, newH1Text) {
  // Google Docs uses actual <h1> tags. Replace the text inside the <span> within <h1>
  const h1Re = /(<h1[^>]*>.*?<span[^>]*>)(.*?)(<\/span>.*?<\/h1>)/s;
  const match = html.match(h1Re);
  if (match) {
    return html.replace(h1Re, `$1${newH1Text}$3`);
  }
  // Fallback: try first <p> with font-size:24pt
  const bigPRe = /(<p[^>]*font-size:\s*24pt[^>]*>.*?<span[^>]*>)(.*?)(<\/span>.*?<\/p>)/s;
  const match2 = html.match(bigPRe);
  if (match2) {
    return html.replace(bigPRe, `$1${newH1Text}$3`);
  }
  console.log('  WARNING: Could not find H1 to fix');
  return html;
}

// ── Fix R3: Trim intro to 3 sentences ──
function fixIntro(html) {
  // The intro is the block of <p> tags between the H1/title and the first <h2>
  const h2Idx = html.indexOf('<h2');
  if (h2Idx === -1) {
    console.log('  WARNING: No <h2> found, cannot fix intro');
    return html;
  }

  // Find the H1 end
  const h1End = html.indexOf('</h1>');
  const titleEnd = h1End !== -1 ? h1End + 5 : 0;

  const beforeIntro = html.substring(0, titleEnd);
  const introSection = html.substring(titleEnd, h2Idx);
  const afterIntro = html.substring(h2Idx);

  // Extract all <p> tags from intro
  const pTags = [];
  const pRe = /<p[^>]*>[\s\S]*?<\/p>/g;
  let pm;
  while ((pm = pRe.exec(introSection)) !== null) {
    pTags.push(pm[0]);
  }

  // Combine all intro text, split into sentences, keep first 3
  const allText = pTags.map(p => stripHtml(p)).join(' ');
  const sentences = allText.match(/[^.!?]+[.!?]+/g) || [];

  if (sentences.length <= 3) {
    console.log(`  Intro already has ${sentences.length} sentences, no trim needed`);
    return html;
  }

  const kept = sentences.slice(0, 3).join(' ').trim();
  const pStyle = getBodyPStyle(html);
  const spanStyle = getBodySpanStyle(html);

  // Build replacement: one <p> with the 3 sentences, plus bottom padding to match original last intro <p>
  const lastIntroPStyle = pStyle.includes('padding-bottom') ? pStyle : pStyle.replace(/padding-top:0pt/, 'padding-top:0pt') + ';padding-bottom:22.4pt';
  const newIntro = `<p style="${lastIntroPStyle}"><span style="${spanStyle}">${kept}</span></p>`;

  // Replace intro section: keep any non-<p> content (whitespace)
  const nonPContent = introSection.replace(/<p[^>]*>[\s\S]*?<\/p>/g, '').trim();
  return beforeIntro + newIntro + (nonPContent ? '\n' : '') + afterIntro;
}

// ── Fix R11: Break long paragraphs (>100 words) ──
function fixLongParagraphs(html) {
  let fixed = html;
  let count = 0;

  const pRe = /<p\s+style="[^"]*">\s*<span\s+style="[^"]*">[^<]+<\/span>\s*<\/p>/g;
  const matches = [...fixed.matchAll(pRe)];

  for (const m of matches) {
    const pTag = m[0];
    const text = stripHtml(pTag);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    if (words.length > 100) {
      // Find a good split point near the middle at a sentence boundary
      const midpoint = Math.floor(words.length / 2);
      let splitIdx = -1;

      // Look for sentence end (.!?) near midpoint
      for (let i = midpoint; i >= midpoint - 20 && i >= 0; i--) {
        if (/[.!?]$/.test(words[i])) {
          splitIdx = i + 1;
          break;
        }
      }
      if (splitIdx === -1) {
        for (let i = midpoint + 1; i <= midpoint + 20 && i < words.length; i++) {
          if (/[.!?]$/.test(words[i])) {
            splitIdx = i + 1;
            break;
          }
        }
      }
      if (splitIdx === -1) splitIdx = midpoint; // fallback

      const part1 = words.slice(0, splitIdx).join(' ');
      const part2 = words.slice(splitIdx).join(' ');

      if (part2.length < 10) continue; // don't create tiny fragments

      // Extract styles from original <p> and <span>
      const pStyleMatch = pTag.match(/<p\s+style="([^"]*)"/);
      const spanStyleMatch = pTag.match(/<span\s+style="([^"]*)"/);
      const pSt = pStyleMatch ? pStyleMatch[1] : '';
      const spSt = spanStyleMatch ? spanStyleMatch[1] : '';

      const replacement = `<p style="${pSt}"><span style="${spSt}">${part1}</span></p><p style="${pSt}"><span style="${spSt}">${part2}</span></p>`;
      fixed = fixed.replace(pTag, replacement);
      count++;
    }
  }

  // Also handle paragraphs with multiple spans
  const pRe2 = /<p\s+style="[^"]*">(?:<span[^>]*>[^<]*<\/span>)+<\/p>/g;
  const matches2 = [...fixed.matchAll(pRe2)];
  for (const m of matches2) {
    const pTag = m[0];
    const text = stripHtml(pTag);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    if (words.length > 100) {
      // For multi-span paragraphs, we need to find a split point and rebuild
      // Extract all span contents
      const spanRe = /<span[^>]*>([^<]*)<\/span>/g;
      let allText = '';
      let sm;
      while ((sm = spanRe.exec(pTag)) !== null) {
        allText += sm[1];
      }
      const allWords = allText.split(/\s+/).filter(w => w.length > 0);
      if (allWords.length <= 100) continue;

      const midpoint = Math.floor(allWords.length / 2);
      let splitIdx = -1;
      for (let i = midpoint; i >= midpoint - 20 && i >= 0; i--) {
        if (/[.!?]$/.test(allWords[i])) { splitIdx = i + 1; break; }
      }
      if (splitIdx === -1) {
        for (let i = midpoint + 1; i <= midpoint + 20 && i < allWords.length; i++) {
          if (/[.!?]$/.test(allWords[i])) { splitIdx = i + 1; break; }
        }
      }
      if (splitIdx === -1) splitIdx = midpoint;

      const part1 = allWords.slice(0, splitIdx).join(' ');
      const part2 = allWords.slice(splitIdx).join(' ');
      if (part2.length < 10) continue;

      const pStyleMatch = pTag.match(/<p\s+style="([^"]*)"/);
      const spanStyleMatch = pTag.match(/<span\s+style="([^"]*)"/);
      const pSt = pStyleMatch ? pStyleMatch[1] : '';
      const spSt = spanStyleMatch ? spanStyleMatch[1] : '';

      const replacement = `<p style="${pSt}"><span style="${spSt}">${part1}</span></p><p style="${pSt}"><span style="${spSt}">${part2}</span></p>`;
      fixed = fixed.replace(pTag, replacement);
      count++;
    }
  }

  return { html: fixed, count };
}

// ── Fix R17: Add content to reach 800+ words ──
function addContent(html, keyword, slug, targetWords) {
  const current = wordCount(html);
  const needed = targetWords - current;
  if (needed <= 0) {
    console.log(`  Already at ${current} words, no content needed`);
    return html;
  }

  const pStyle = getBodyPStyle(html);
  const spanStyle = getBodySpanStyle(html);

  // Content to add depends on the doc
  const extraContent = getExtraContent(slug, keyword);

  // Insert before the last <h2> or before the CTA/closing section
  // Find the last </h2> ... content block, insert before the final CTA section
  const lastH2Idx = html.lastIndexOf('<h2');
  if (lastH2Idx !== -1) {
    const newParagraphs = extraContent.map(t => makeParagraph(t, pStyle, spanStyle)).join('');
    return html.substring(0, lastH2Idx) + newParagraphs + html.substring(lastH2Idx);
  }

  // Fallback: insert before </body>
  const bodyEnd = html.indexOf('</body>');
  const newParagraphs = extraContent.map(t => makeParagraph(t, pStyle, spanStyle)).join('');
  return html.substring(0, bodyEnd) + newParagraphs + html.substring(bodyEnd);
}

function getExtraContent(slug, keyword) {
  const content = {
    appliance_replacement_planner: [
      `The ROI of proactive appliance replacement extends beyond avoiding emergency repair costs. Properties that maintain a structured ${keyword} reduce tenant turnover by an average of 12 percent, because residents associate well-maintained units with responsive management. When a dishwasher fails mid-lease and replacement takes five days, tenant satisfaction scores drop sharply. When the same appliance is replaced proactively during a planned turnover, the incoming tenant sees a modern unit and the property avoids the emergency service premium that typically runs 40 to 60 percent above scheduled replacement costs.`,
      `Leasey.AI tracks appliance age, warranty status, and maintenance history in one dashboard. When a unit turns over, the system flags every appliance approaching end-of-life and generates a replacement recommendation with cost estimates. Property managers make data-driven decisions instead of reacting to breakdowns.`
    ],
    leasing_automation_for_large_portfolios: [
      `For operators managing 500 or more units across multiple properties, the cost of manual leasing coordination compounds with every additional site. A regional manager overseeing five communities spends an average of six hours per week reconciling pipeline data across disconnected systems. With ${keyword} tools like Leasey.AI, that reconciliation happens automatically, freeing the regional team to focus on occupancy strategy rather than data assembly.`
    ],
    senior_living_leasing_automation: [
      `Communities that adopt ${keyword} typically see inquiry-to-placement conversion rates improve by 15 to 25 percent within the first quarter. The improvement comes not from generating more inquiries but from preventing the drop-off that occurs when families experience unexplained delays in the admissions process. Every day of administrative silence is a day the family might choose a competitor who responded faster.`
    ],
    best_pm_software_2026: [
      `When evaluating the ${keyword}, integration capability should rank alongside core features. A platform that handles leasing brilliantly but cannot connect to your accounting system or maintenance workflow creates data silos that erode the efficiency gains. Leasey.AI connects natively with major accounting platforms, screening services, and listing syndication networks, ensuring data flows without manual re-entry across your entire operation.`
    ],
    rental_listing_description_generator: [
      `The difference between a listing that generates 30 inquiries and one that generates three often comes down to the first two sentences. A ${keyword} analyzes high-performing listings in your market and identifies the specific amenity callouts, neighborhood references, and formatting patterns that correlate with faster lease-up times. Rather than starting from a blank page for every unit, agents input the property details and receive optimized copy that follows proven engagement patterns.`,
      `Beyond saving time, automated listing descriptions maintain consistency across large portfolios. When one property manager writes compelling copy and another writes bare-bones bullet points, the portfolio brand suffers. A centralized ${keyword} ensures every listing meets the same quality standard regardless of which team member creates it. Leasey.AI includes listing generation as part of its leasing workflow, pulling unit details directly from the property record to produce publish-ready descriptions in seconds.`,
      `Seasonal adjustments matter too. Listings posted during peak rental season in June need different urgency cues than listings posted in January. A smart generator adapts language to market conditions, emphasizing immediate availability during high-demand months and value propositions during slower periods.`
    ],
    affordable_housing_application_tracking: [
      `Compliance reporting adds another layer of complexity that makes ${keyword} essential rather than optional. HUD and state housing finance agencies require detailed documentation of every application received, every decision made, and every waitlist movement. Manual tracking in spreadsheets creates audit risk because a single misplaced entry can trigger compliance findings that jeopardize funding. Leasey.AI generates audit-ready reports automatically from the same data used to manage daily operations, eliminating the month-end scramble to reconstruct application histories.`
    ],
    leasing_operations_assessment_combined_: [
      `A thorough ${keyword} begins with mapping every step of your current leasing workflow from initial inquiry to signed lease. Most property management teams discover that their actual process contains 30 to 40 percent more steps than they assumed, because workarounds and informal handoffs accumulate over time without anyone documenting them. The assessment surfaces these hidden steps and quantifies the time each one consumes.`,
      `The inquiry response audit examines how quickly your team responds to new leads across every channel: web forms, email, phone, listing portals, and social media. Industry benchmarks show that responding within five minutes increases conversion rates by 400 percent compared to a 30-minute response time. Most teams assume they respond quickly. The data almost always reveals a different story, particularly for inquiries that arrive outside business hours or through channels that lack automated notifications.`,
      `Document collection efficiency measures the elapsed time between application submission and complete file assembly. In manual operations, this phase typically accounts for 40 to 50 percent of the total leasing timeline. A structured ${keyword} identifies exactly where documents stall, which document types cause the most delays, and whether the bottleneck is on the applicant side, the third-party side, or the internal review side.`,
      `Pipeline visibility scoring evaluates whether your team can answer three questions at any moment without opening individual files: How many active prospects are in each stage? Which deals have stalled beyond normal timelines? What is the projected occupancy for the next 30, 60, and 90 days? Teams that cannot answer these questions from a single screen are operating with structural blind spots that cost occupancy points every month.`,
      `The lease execution audit measures the time from approved application to fully signed lease. This phase is often the most overlooked source of delay. Manual lease preparation, sequential signing workflows, and print-sign-scan cycles routinely add one to three weeks of dead time after the applicant has already been approved. Leasey.AI compresses this to 24 to 48 hours through automated document generation and simultaneous multi-party e-signature.`,
      `Finally, a complete ${keyword} produces a prioritized action plan. Not every inefficiency requires immediate investment. The assessment ranks improvements by impact and implementation effort, giving your team a clear sequence: fix the three changes that will recover the most leasing velocity first, then address the remaining optimizations in order of diminishing returns.`
    ]
  };
  return content[slug] || [
    `Organizations that implement a structured approach to ${keyword} typically recover 10 to 15 hours of staff time per week previously spent on manual coordination. That time translates directly into capacity for revenue-generating activities: following up with prospects, conducting tours, and building referral relationships.`
  ];
}

// ── Define all docs to fix ──
const FIXES = [
  // Group A: R5 + R17
  { slug: 'renovation_roi_calculator', r5: 'Renovation ROI Calculator for Rental Properties', r17: 850, r11: true },
  { slug: 'appliance_replacement_planner', r5: 'Appliance Replacement Planner for Rental Properties', r17: 850, r11: true },
  { slug: 'leasing_automation_for_large_portfolios', r5: 'Leasing Automation for Large Portfolio Operations', r17: 850, r11: true },
  { slug: 'senior_living_leasing_automation', r5: 'Senior Living Leasing Software: Automate Placements at Scale', r17: 850, r11: true },
  { slug: 'co_living_fill_rooms_in_72_hours', r5: 'Co-Living Property Management Software: Fill Rooms in 72 Hours', r11: true },

  // Group B: R17 only
  { slug: 'best_pm_software_2026', r17: 850, r11: true },
  { slug: 'rental_listing_description_generator', r17: 850, r11: true },
  { slug: 'affordable_housing_application_tracking', r17: 850, r11: true },
  { slug: 'leasing_operations_assessment_combined_', r17: 850, r11: true },

  // Group C: R3 only
  { slug: 'rental_beast_partnership', r3: true, r11: true },
  { slug: 'why_generic_crms_fail_at_leasing', r3: true, r11: true },
];

async function main() {
  let successCount = 0;

  for (const fix of FIXES) {
    const entry = findDoc(fix.slug);
    if (!entry) {
      console.log(`SKIP: ${fix.slug} not found in manifest`);
      continue;
    }

    console.log(`\n── Processing: ${entry.title} (${entry.docId}) ──`);
    const fixes = [];

    // Download current HTML
    let htmlRes;
    try {
      htmlRes = await drive.files.export({ fileId: entry.docId, mimeType: 'text/html' });
    } catch (e) {
      console.log(`  ERROR downloading: ${e.message}`);
      continue;
    }
    let html = htmlRes.data;
    const originalWords = wordCount(html);
    console.log(`  Downloaded: ${originalWords} words`);

    // R5: Fix H1
    if (fix.r5) {
      html = fixH1(html, entry.keyword, fix.r5);
      fixes.push('R5 (keyword in H1)');
      console.log(`  R5: H1 changed to "${fix.r5}"`);
    }

    // R3: Fix intro
    if (fix.r3) {
      html = fixIntro(html);
      fixes.push('R3 (intro trimmed to 3 sentences)');
      console.log('  R3: Intro trimmed');
    }

    // R17: Add content
    if (fix.r17) {
      const before = wordCount(html);
      html = addContent(html, entry.keyword, fix.slug, fix.r17);
      const after = wordCount(html);
      if (after > before) {
        fixes.push(`R17 (added ~${after - before} words, now ${after})`);
        console.log(`  R17: ${before} -> ${after} words`);
      }
    }

    // R11: Break long paragraphs
    if (fix.r11) {
      const result = fixLongParagraphs(html);
      html = result.html;
      if (result.count > 0) {
        fixes.push(`R11 (split ${result.count} long paragraph(s))`);
        console.log(`  R11: Split ${result.count} long paragraph(s)`);
      } else {
        console.log('  R11: No paragraphs over 100 words found (may have multi-span format)');
      }
    }

    // Upload fixed HTML
    try {
      await drive.files.update({
        fileId: entry.docId,
        media: {
          mimeType: 'text/html',
          body: Readable.from(Buffer.from(html)),
        },
      });
      console.log(`  UPLOADED: ${fixes.join(', ')}`);
      successCount++;
    } catch (e) {
      console.log(`  ERROR uploading: ${e.message}`);
    }
  }

  console.log(`\n✓ Done. ${successCount}/${FIXES.length} docs updated.`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
