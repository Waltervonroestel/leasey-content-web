// Build CSA v2 - condensed for Carlos feedback
// Cuts ~50% length, merges repetition, keeps concrete actions, leaves SEO/AEO light (Alejandra will expand).
// Run: node build-csa-v2.js
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const npmRoot = execSync('npm root -g').toString().trim();
const docx = require(path.join(npmRoot, 'docx'));
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, PageNumber,
} = docx;

const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;
const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  if (typeof text === 'string') {
    return new Paragraph({
      spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
      alignment: opts.alignment, heading: opts.heading,
      children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size, color: opts.color })],
    });
  }
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
    alignment: opts.alignment, heading: opts.heading, children: text,
  });
}
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, pageBreakBefore: true,
    children: [new TextRun({ text, bold: true, size: 32, color: "1F3864" })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: "2E75B6" })],
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
    children: typeof text === 'string' ? [new TextRun(text)] : text,
  });
}
function num(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
    children: typeof text === 'string' ? [new TextRun(text)] : text,
  });
}
function cell(content, opts = {}) {
  const paragraphs = Array.isArray(content) ? content
    : [new Paragraph({ spacing: { after: 0 }, alignment: opts.alignment,
        children: [new TextRun({ text: String(content), bold: opts.bold, size: 20 })] })];
  return new TableCell({
    borders: cellBorders, margins: cellMargins,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: paragraphs,
  });
}
function buildTable(columnWidths, headerCells, rows) {
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const header = new TableRow({
    tableHeader: true,
    children: headerCells.map((text, i) => new TableCell({
      borders: cellBorders, margins: cellMargins,
      width: { size: columnWidths[i], type: WidthType.DXA },
      shading: { fill: "1F3864", type: ShadingType.CLEAR },
      children: [new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })] })],
    })),
  });
  const bodyRows = rows.map(row => new TableRow({
    children: row.map((c, i) => cell(c, { width: columnWidths[i] })),
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths, rows: [header, ...bodyRows],
  });
}

// COVER + TOC
const cover = [
  new Paragraph({ spacing: { before: 2400, after: 240 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "LEASEY.AI", bold: true, size: 52, color: "1F3864" })] }),
  new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Current State Assessment", bold: true, size: 40, color: "2E75B6" })] }),
  new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Content", size: 32, color: "595959" })] }),
  new Paragraph({ spacing: { after: 1200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Condensed draft, June 16, 2026", italics: true, size: 22, color: "808080" })] }),
  new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "For", size: 22 })] }),
  new Paragraph({ spacing: { after: 40 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Juan Leal, ", bold: true, size: 26 }), new TextRun({ text: "CEO and CPO", size: 22 })] }),
  new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Carlos Leal, ", bold: true, size: 26 }), new TextRun({ text: "COO", size: 22 })] }),
  new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "By", size: 22 })] }),
  new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Walter Von Roestel, ", bold: true, size: 26 }), new TextRun({ text: "Content Lead", size: 22, color: "595959" })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const toc = [
  new Paragraph({ spacing: { after: 360 },
    children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: "1F3864" })] }),
  ...[
    "1. Executive Summary",
    "2. Where content stands today",
    "3. What content should look like",
    "4. Channels: where we are and the first move on each",
    "5. SEO and AEO at a glance",
    "6. Conclusion, open questions, and roadmap",
  ].map(t => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, size: 24 })] })),
  new Paragraph({ children: [new PageBreak()] }),
];

// 1. EXECUTIVE SUMMARY (condensed)
const sec1 = [
  h1("1. Executive Summary"),
  p([new TextRun({ text: "Leasey's content engine is paused, not broken. Strategy, voice, topics, and audience are correct. What is missing is publication." })]),
  num([new TextRun({ text: "Inventory is ready. ", bold: true }),
    new TextRun({ text: "9 repressed announcements plus 15 client-quote angles plus extensions of pages that already rank, roughly 48 concrete pieces for 60 to 75 days of calendar." })]),
  num([new TextRun({ text: "Demand is already there. ", bold: true }),
    new TextRun({ text: "2,352 clicks and 585K impressions in 90 days on leasey.ai. We rank for the category queries and leak on click-through." })]),
  num([new TextRun({ text: "Highest-leverage channel is idle. ", bold: true }),
    new TextRun({ text: "Carlos's LinkedIn outperforms the company page with one post per month. Activating it is a weekly approval window, not a project." })]),
  h2("Five moves this week"),
  num("Publish SingleKey announcement (blog + Carlos LinkedIn + Reddit changelog)."),
  num("Reactivate Carlos's LinkedIn with one founder-voice post tied to Canadian-first."),
  num("Publish Ivan's four already-drafted Reddit changelogs in r/LeaseyAI."),
  num("Decide blog.leasey.ai: invest or sunset (39 clicks in 90 days)."),
  num("Lock the founder review session for the final CSA, Jun 23 to 27."),
];

// 2. WHERE CONTENT STANDS TODAY (consolidated)
const sec2 = [
  h1("2. Where content stands today"),
  p("The diagnostic, in three frames: voice, inventory, traction."),

  h2("2.1 Voice: three eras live on the site"),
  buildTable([2200, 4500, 2660],
    ["Era", "What it is", "Status"],
    [
      ["Era 1 (2023)", "\"Goofy\" agency voice. Written for a different ICP (small landlord). Lives in older blog posts and all 12 blog.leasey.ai city guides.", "Deprecated. Do not replicate."],
      ["Era 2 (current)", "Operator B2B voice on the live blog. Second person, question hook, problem-solution, scannable. CTA: \"Schedule a call with Leasey.AI\".", "Active. Standard for blog, PR, company LinkedIn."],
      ["Era 3 (founders)", "Carlos: direct, max 3 sentences per paragraph, never \"Excited to announce\". Juan: ~60 words, product milestones, technical precision.", "Documented but barely exercised in 2026."],
    ]
  ),

  h2("2.2 Inventory: what we have and what is repressed"),
  buildTable([3000, 1700, 4660],
    ["Asset class", "Count", "Where / state"],
    [
      ["Blog posts (operator)", "30+", "leasey.ai/blog, mix of Era 1 and Era 2"],
      ["Renter city guides", "12", "blog.leasey.ai, all Era 1"],
      ["Free tools / calculators", "4+", "leasey.ai/resources/tools/"],
      ["Resource + research articles", "Many", "leasey.ai/resources/"],
      ["Case studies", "1", "Goldwynn only"],
      ["LinkedIn posts (90 days)", "Very few", "Company page + Carlos + Juan, all under-active"],
      ["Reddit r/LeaseyAI posts", "0", "Subreddit exists; Ivan drafted 4 unpublished"],
      ["Press releases", "0 confirmed public", "9 repressed announcements waiting"],
    ]
  ),
  p([new TextRun({ text: "The 2025 repressed backlog. ", bold: true }),
    new TextRun({ text: "Zillow syndication, Facebook Marketplace syndication, centralised messaging, ID verification, Calendar v2.0, showing confirmation dashboard, billing tab, SingleKey integration, Rental Beast partnership. Three formats each (blog + LinkedIn + Reddit) = 27 pieces of justified content sitting on the shelf." })]),

  h2("2.3 Traction: what is already working"),
  p("From Google Search Console, 90 days on leasey.ai. Top pages by clicks:"),
  buildTable([5360, 2000, 2000],
    ["Page", "Clicks 90d", "Impressions 90d"],
    [
      ["Homepage", "857", "26,598"],
      ["Security deposit calculator", "112", "12,074"],
      ["\"Best PMS, 4 popular options\" blog", "90", "83,185"],
      ["\"Hidden gems on Facebook Marketplace\"", "73", "18,554"],
      ["Facebook Marketplace FAQ blog", "68", "26,004"],
      ["Toronto lease takeover article", "62", "5,189"],
      ["\"Complete guide to FB Marketplace\"", "53", "17,020"],
      ["Marketplace Syndication feature page", "31", "5,577"],
      ["Tenant income qualification calculator", "31", "14,674"],
      ["Complete guide to lease takeover", "27", "13,937"],
    ]
  ),
  p([new TextRun({ text: "Three patterns. ", bold: true }),
    new TextRun({ text: "Facebook Marketplace is our biggest cluster (3 of the top 10). Free tools convert (2 calculators in the top 10). Long-form comparison wins on impressions (the \"Best PMS\" article alone has 83K impressions, near the entire calculator set combined)." })]),
  p([new TextRun({ text: "What is not working. ", bold: true }),
    new TextRun({ text: "blog.leasey.ai (39 clicks / 90 days), LinkedIn (~0), r/LeaseyAI (0 posts), press (0 outbound)." })]),

];

// 3. WHAT CONTENT SHOULD LOOK LIKE
const sec3 = [
  h1("3. What content should look like"),
  p([new TextRun({ text: "Principle that comes first. ", bold: true }),
    new TextRun({ text: "Every piece must either bring in qualified operators or move a deal forward. If it does neither, it is not written. Inbound is 100% of acquisition; every blog, LinkedIn post, and Reddit reply lives under that constraint." })]),

  h2("3.1 Four content clusters, anchored to what already ranks"),
  p("Four broad clusters give writers room for fresh angles instead of churning out variations of eight specific topics. Each is tied to content that is already earning clicks or impressions today."),
  buildTable([2200, 3500, 3660],
    ["Cluster", "Covers", "What it builds on"],
    [
      [
        "The modern leasing funnel",
        "Listings, leads, showings, screening. Syndication, Facebook Marketplace, ID verification, showing coordination, lead qualification.",
        "Already 3 of the top 10 pages (Hidden Gems 73 clicks, FB Marketplace FAQ 68, Complete Guide 53, plus the feature page at 31). The FB Marketplace syndication and SingleKey announcements land here.",
      ],
      [
        "AI in property management",
        "Where AI fits in a PM's day, agent-vs-widget, fair housing, compliance, the buyer's evaluation framework.",
        "\"AI property management software\" gets 279 impressions at position 45.4. \"Automated leasing\" gets 70 impressions at position 26. Demand exists; we are below page 2. Highest AEO upside.",
      ],
      [
        "Operating a Canadian rental business",
        "Market signals, RTA/RTB shifts, lease-up tactics, partnerships (SingleKey, Rental Beast), regional supply data.",
        "Toronto lease takeover (62 clicks, 5,189 impressions) and the broader lease takeover guide prove the Canadian angle converts. Carlos's natural ground.",
      ],
      [
        "Inside Leasey (founder POV + clients)",
        "What we are building and why, lessons from real clients, observations from operator conversations.",
        "Goldwynn case study is the only proof asset today. Carlos's LinkedIn outperforms the company page despite posting once a month. Highest upside per piece.",
      ],
    ]
  ),
  p([new TextRun({ text: "Comparison content runs underneath all four. ", italics: true }),
    new TextRun({ text: "The \"Best PMS\" article alone has 83K impressions over 90 days. Each cluster produces at least one comparison piece per quarter." })]),
  p([new TextRun({ text: "Categories we do not write. ", bold: true }),
    new TextRun({ text: "US tax content (1031, etc.), single-family landlord tips, generic productivity. All off-positioning." })]),

  h2("3.2 Voice rules that apply everywhere"),
  bullet("British English, Oxford comma, \"Leasey.AI\" stylisation, no em-dashes."),
  bullet("Insight-led: every external statistic names its source in the text (Yardi, RBC, StatCan, Frontdesk Research)."),
  bullet("Anchor to real operator scenarios: \"154-unit lease-up in 60 days\" beats \"a large multifamily building\"."),
  bullet("CTA: \"Schedule a call\", pointing to leasey.ai/get-started/."),
  bullet("Every blog links to at least one feature page or tool."),

  p([new TextRun({ text: "Format by channel: ", bold: true }),
    new TextRun({ text: "blog uses long-form authority + how-to + product announcement + case study, all in Era 2 voice. Press release per partnership (inverted pyramid, founder quote, sourced context). r/LeaseyAI is changelog-only. Community subs and FB Groups are value-first replies with a one-mention cap. LinkedIn cadence and post shape live in Section 4." })]),
];

// 4. CHANNELS (consolidated, no 9 subsections)
const sec4 = [
  h1("4. Channels: where we are and the first move on each"),
  p("Compact view: status today, first move, owner. The detailed routine sits in the 90-day calendar deliverable."),
  buildTable([2000, 2600, 3360, 1400],
    ["Channel", "Status today", "First move", "Owner"],
    [
      ["LinkedIn company", "\"Under-active\" per guide. Most reach lives on founder profiles.", "Reactivate with the SingleKey partnership announcement.", "Walter + Marketing"],
      ["Carlos LinkedIn", "8,000+ followers. Posting ~1 per month.", "One TEREZ-style operator observation this week. Lock Friday 15-min approval window.", "Walter drafts, Carlos approves"],
      ["Juan LinkedIn", "2,000+ followers. Posts even less.", "One product moment per week from the repressed backlog (Calendar v2.0 or showing confirmation).", "Walter drafts, Juan approves"],
      ["r/LeaseyAI", "Subreddit exists, 0 official posts. 4 drafts from Ivan ready.", "Publish the 4 drafts this month. Then every product ship gets a 1-2 paragraph changelog.", "Walter"],
      ["Reddit communities", "Zero presence on r/PropertyManagement, r/Landlord, r/REI, r/RealEstateTechnology.", "Build baseline karma in r/PropertyManagement, then 1 helpful comment per day across the 4 subs.", "Walter (as person, not company)"],
      ["Facebook Groups", "Zero presence on the 4 target groups.", "Walter joins this week, observes month 1, helpful replies month 2. 60-90 day initiative.", "Walter (as person)"],
      ["Press releases", "Zero outbound. 9 repressed announcements waiting.", "Send SingleKey press release to MultifamilyBiz + Multifamily Press in the same week the blog goes up.", "Walter"],
      ["Operator blog", "~30 posts, mix of Era 1 and Era 2. Top traffic property.", "Use it as the primary venue for the repressed backlog. One announcement blog per week, Era 2 voice.", "Walter"],
      ["blog.leasey.ai", "12 city guides, Era 1 voice, 39 clicks / 90 days.", "Founder decision required: invest or sunset. See Section 6.", "Founders"],
    ]
  ),
];

// 5. SEO + AEO (LIGHT, Alejandra expands)
const sec5 = [
  h1("5. SEO and AEO at a glance"),
  p([new TextRun({ text: "Scope. ", bold: true, italics: true }),
    new TextRun({ text: "Summary view from the content side. Detailed technical assessment (rewrites, schema, AEO scorecard methodology, prioritised action plan) sits with Alejandra in her companion document.", italics: true })]),

  h2("5.1 SEO snapshot, 90 days on leasey.ai"),
  buildTable([3000, 2000, 4360],
    ["Metric", "Number", "Read"],
    [
      ["Clicks 90d", "2,352", "Healthy inbound baseline."],
      ["Impressions 90d", "585,188", "Gap is click-through, not reach."],
      ["Highest-impression blog", "83,185 (Best PMS)", "0.11% CTR. Title rewrite is the single biggest move."],
      ["Branded query position", "leasey at 6.7", "Should be top 3. Competitors taking traffic."],
    ]
  ),

  h2("5.2 The blind spots"),
  buildTable([3000, 1500, 1300, 3560],
    ["Query", "Imp 90d", "Pos", "What is happening"],
    [
      ["ai property management software", "279", "45.4", "Page 5. Cornerstone piece needed."],
      ["automated leasing", "70 (28d)", "26", "Page 3. Our category language."],
      ["rental listing syndication", "413", "16.1", "Page 2. Page not strong enough."],
      ["lease takeover apartment", "331", "10.9", "Page 1, near-zero CTR. Title problem."],
    ]
  ),

  h2("5.3 AEO"),
  p("Infrastructure is more built than it looks (/llm-info/, SEO Knowledge Base, AI bot policy). Measurement layer is missing."),
  p([new TextRun({ text: "Proposed baseline. ", bold: true }),
    new TextRun({ text: "5 engines (ChatGPT, Claude, Perplexity, Google AIO, Gemini) by 10 priority queries. Run in the week of Jun 16. Becomes the quarterly benchmark." })]),
  p([new TextRun({ text: "Lowest-effort highest-value fix. ", bold: true }),
    new TextRun({ text: "FAQPage schema. One-time implementation, permanent benefit. Alejandra plus dev." })]),
];

// 6. CONCLUSION, OPEN QUESTIONS, ROADMAP (merged, neutral tone)
const sec6 = [
  h1("6. Conclusion, open questions, and roadmap"),

  h2("Conclusion"),
  p("Leasey's content engine is paused, not broken. The strategy, voice, topics, and audience are correct. What is missing is publication."),
  p("Three facts shape the next 90 days:"),
  num([new TextRun({ text: "Inventory is ready. ", bold: true }),
    new TextRun({ text: "9 repressed announcements plus 15 client-quote angles plus extensions of pages that already rank. Roughly 48 concrete pieces, enough for 60 to 75 days without inventing." })]),
  num([new TextRun({ text: "We already rank for the queries we care about. ", bold: true }),
    new TextRun({ text: "585K impressions per quarter. We are leaking clicks on titles, not losing share of demand." })]),
  num([new TextRun({ text: "The highest-leverage channel is idle. ", bold: true }),
    new TextRun({ text: "Carlos's LinkedIn outperforms the company page despite one post per month. Activating it is a weekly approval window, not a project." })]),

  h2("Open questions for the founders"),
  p("Five decisions that shape what the 90-day calendar can commit to:"),
  num([new TextRun({ text: "blog.leasey.ai: invest or sunset. ", bold: true }),
    new TextRun({ text: "39 clicks in 90 days. Need a call this month." })]),
  num([new TextRun({ text: "Founder LinkedIn approval cadence. ", bold: true }),
    new TextRun({ text: "Proposed Friday 15-minute window for Carlos and Juan to approve, edit, or kill the week's drafts." })]),
  num([new TextRun({ text: "Validity of pillar 5 (compliance-aware AI). ", bold: true }),
    new TextRun({ text: "Of 8 client testimonials, zero mention compliance. Keep as a research-led bet or retire and double down on the four pillars clients cite." })]),
  num([new TextRun({ text: "Aquilini as a public reference. ", bold: true }),
    new TextRun({ text: "Strongest institutional credibility we have. Proposed cap: one mention per quarter, one PR pitch in 90 days." })]),
  num([new TextRun({ text: "Testimonial outreach to silent clients. ", bold: true }),
    new TextRun({ text: "13 active clients without quote. A coordinated CS-led ask in July could triple proof inventory. Owner to confirm." })]),

  h2("Roadmap to end of June"),
  p([new TextRun({ text: "Week of Jun 16 to 20. ", bold: true })]),
  bullet("Finalise this CSA. Revised draft to Juan and Carlos by Jun 19."),
  bullet("Publish SingleKey announcement (blog + Carlos LinkedIn + Reddit changelog)."),
  bullet("Publish first of Ivan's drafted Reddit posts (Calendar v2.0)."),
  bullet("Join the four Facebook Groups. Observation phase begins."),
  bullet("Run AEO baseline scorecard (5 engines, 10 queries)."),
  p([new TextRun({ text: "Week of Jun 23 to 27. ", bold: true })]),
  bullet("Founder review session for final CSA."),
  bullet("Decide blog.leasey.ai and pillar 5."),
  bullet("Approve founder LinkedIn cadence + Friday window."),
  bullet("Publish second repressed announcement."),
  bullet("Publish the remaining three Reddit changelogs."),
  bullet("Deliver the 90-day calendar (Jun 30 deadline)."),
  p([new TextRun({ text: "Hand-offs to Alejandra. ", bold: true }),
    new TextRun({ text: "Title and meta rewrites (\"Best PMS\", lease takeover), FAQPage schema, branded entity fix, new cornerstone pieces for AI category queries. Full prioritised list lives in her document." })]),
];

const doc = new Document({
  creator: "Walter Von Roestel",
  title: "Leasey.AI Content CSA - Condensed",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 15840 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Leasey.AI Content CSA, condensed, Jun 16, 2026, page ", size: 18, color: "808080" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" }),
        ],
      })] }),
    },
    children: [
      ...cover, ...toc,
      ...sec1, ...sec2, ...sec3, ...sec4, ...sec5, ...sec6,
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, "Leasey-Content-CSA-Condensed-2026-06-16.docx");
  fs.writeFileSync(out, buf);
  console.log("Wrote", out, buf.length, "bytes");
});
