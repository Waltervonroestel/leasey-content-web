// Build Current State Assessment - Content (revised 2026-06-16)
// Run: node build-csa.js
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const npmRoot = execSync('npm root -g').toString().trim();
const docx = require(path.join(npmRoot, 'docx'));
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak,
  TabStopType, TabStopPosition, ExternalHyperlink, PageNumber,
} = docx;

// ---- helpers ----
const PAGE_W = 12240;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  if (typeof text === 'string') {
    return new Paragraph({
      spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
      alignment: opts.alignment,
      heading: opts.heading,
      children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size, color: opts.color })],
    });
  }
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
    alignment: opts.alignment,
    heading: opts.heading,
    children: text,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    pageBreakBefore: true,
    children: [new TextRun({ text, bold: true, size: 32, color: "1F3864" })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, color: "2E75B6" })],
  });
}
function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22 })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: typeof text === 'string' ? [new TextRun(text)] : text,
  });
}
function num(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 80 },
    children: typeof text === 'string' ? [new TextRun(text)] : text,
  });
}

function cell(content, opts = {}) {
  const widthDxa = opts.width;
  const paragraphs = Array.isArray(content)
    ? content
    : [new Paragraph({
        spacing: { after: 0 },
        alignment: opts.alignment,
        children: [new TextRun({ text: String(content), bold: opts.bold, size: 20 })],
      })];
  return new TableCell({
    borders: cellBorders,
    margins: cellMargins,
    width: { size: widthDxa, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: paragraphs,
  });
}

function buildTable(columnWidths, headerCells, rows) {
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const fixedHeader = new TableRow({
    tableHeader: true,
    children: headerCells.map((text, i) => new TableCell({
      borders: cellBorders,
      margins: cellMargins,
      width: { size: columnWidths[i], type: WidthType.DXA },
      shading: { fill: "1F3864", type: ShadingType.CLEAR },
      children: [new Paragraph({
        spacing: { after: 0 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })],
      })],
    })),
  });
  const bodyRows = rows.map(row => new TableRow({
    children: row.map((c, i) => cell(c, { width: columnWidths[i] })),
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths,
    rows: [fixedHeader, ...bodyRows],
  });
}

// ---- content ----
const cover = [
  new Paragraph({
    spacing: { before: 2400, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "LEASEY.AI", bold: true, size: 52, color: "1F3864" })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Current State Assessment", bold: true, size: 40, color: "2E75B6" })],
  }),
  new Paragraph({
    spacing: { after: 600 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Content", size: 32, color: "595959" })],
  }),
  new Paragraph({
    spacing: { after: 1200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Revised draft - June 16, 2026", italics: true, size: 22, color: "808080" })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "For", size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Juan Leal, ", bold: true, size: 26 }), new TextRun({ text: "CEO and CPO", size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 600 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Carlos Leal, ", bold: true, size: 26 }), new TextRun({ text: "COO", size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "By", size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Walter Von Roestel", bold: true, size: 26 })],
  }),
  new Paragraph({
    spacing: { after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Content Lead", size: 22, color: "595959" })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// TOC manual
const toc = [
  new Paragraph({
    spacing: { before: 0, after: 360 },
    children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: "1F3864" })],
  }),
  ...[
    "1. Executive Summary",
    "2. How content has been",
    "3. How content should be",
    "4. Distribution today, and where it needs to go",
    "5. Search demand at a glance",
    "6. AEO: where Leasey shows up in AI search",
    "7. Open questions for the founders",
    "8. Roadmap to end of June",
    "9. Conclusion",
  ].map(t => new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: t, size: 24 })],
  })),
  new Paragraph({ children: [new PageBreak()] }),
];

// Section 1: Executive Summary
const sec1 = [
  h1("1. Executive Summary"),
  p([
    new TextRun({ text: "One line: ", bold: true }),
    new TextRun({ text: "Leasey.AI's content channels are dormant despite a strong inbound funnel; the fix is not a new strategy, it is publishing what we already have and turning the founder profiles back on." }),
  ]),
  h3("The five things that matter for content"),
  p([new TextRun({ text: "1. The founder profiles are the most powerful channel we own, and they are silent.", bold: true })]),
  bullet("\"The founders' personal profiles have more reach than the company page.\""),
  bullet("Carlos has 8,000+ followers and posts roughly once a month. Juan has 2,000+ and posts even less."),
  bullet("Target cadence per the guide: 3 posts per week from the company page, 1-2 per week from each founder."),
  bullet("Real cadence today: near zero."),
  p([new TextRun({ text: "2. Nine 2025 announcements are sitting unpublished.", bold: true })]),
  bullet("Repressed list: Zillow direct syndication, Facebook Marketplace direct syndication, centralised messaging, ID verification, Calendar v2.0, showing confirmation dashboard, billing tab update, SingleKey integration, Rental Beast partnership."),
  bullet("Each is worth a blog, a LinkedIn post, and where applicable a Reddit changelog."),
  bullet("At three pieces per announcement, that is 27 pieces of content already justified by product reality."),
  bullet("The fastest content win available is a publishing schedule for these, not net new ideas."),
  p([new TextRun({ text: "3. Voice has been a moving target; it should not be anymore.", bold: true })]),
  bullet("Three voice eras live on the site right now: the 2023 \"goofy\" agency voice, the current B2B operator-facing voice, and the founder voices on LinkedIn."),
  bullet("Do not replicate the 2023 voice."),
  bullet("The team has the templates needed to standardise on Era 2 (operator B2B) and the two founder voices. We just need to apply them consistently."),
  p([new TextRun({ text: "4. The search demand already exists and confirms our positioning.", bold: true })]),
  bullet("705 clicks and 151,000 impressions in 28 days on www.leasey.ai (Google Search Console). 2,352 clicks and 585,000 impressions over 90 days."),
  bullet("The site ranks for the category-defining queries (best property management software, automated leasing, rental syndication) but for several of them with close-to-zero click-through."),
  bullet("Demand is here, our topics are correct."),
  p([new TextRun({ text: "5. We have a complete inventory of what to publish next.", bold: true })]),
  bullet("Repressed backlog (9 items) and client deep-dive angles (15 items) together yield roughly 48 concrete pieces, already mapped to four broad themes (see Section 3.2)."),
  bullet("That is enough inventory for 60 to 75 days of the 90-day calendar without inventing anything new."),
  h3("What I am recommending we act on this week"),
  num("Publish the first repressed announcement. Suggested first: SingleKey screening integration. Three pieces (blog, LinkedIn from Carlos, Reddit changelog)."),
  num("Reactivate Carlos on LinkedIn. One founder-voice post this week. Topic: an observation from a real operator conversation that ties to the Canadian-first positioning."),
  num("Publish Ivan's four already-drafted Reddit posts in r/LeaseyAI. Drafts exist and only need a re-read."),
  num("Decide on blog.leasey.ai. 39 clicks in 90 days. Either we invest with new posts and internal linking, or we sunset the subdomain."),
  num("Lock the founder review session for the final CSA between Jun 23 and Jun 27."),
];

// Section 2
const sec2 = [
  h1("2. How content has been"),
  p("This is the diagnostic: what exists, in what voice, on what cadence, and what has actually worked."),
  h2("2.1 Three voice eras still live on the site"),
  h3("Era 1 - Playful 2023 (En Algun Lugar Estudio)"),
  p("Where it lives today: older posts at www.leasey.ai/blog/ (Tenant Taming, Unleash Your Inner Wizard, Tea on Student Rentals), all 12 posts at blog.leasey.ai/."),
  p("The 2023 brand voice document says: \"Blogs should be written in a fun, conversational, casual tone. Get goofy, use metaphors, and toss a meme in there every once in a while.\""),
  p("The ICP that voice was written for: \"male, 40+, not tech savvy, lazy, disorganised, managing 100-300 properties.\""),
  p("That is a different ICP than the enterprise and mid-market multifamily we serve today. The Onboarding Guide is explicit: do not replicate this era. But the posts are still indexed and still set tone expectations for new readers landing from search."),
  h3("Era 2 - Current B2B operator-facing (the live voice)"),
  p("Where it lives: the recent posts on www.leasey.ai/blog/ (Property Managers' Complete Guide to Facebook Marketplace, The Future of Your Rental Business, FAQs About Property Management Software)."),
  p("Voice characteristics, sampled verbatim from the live blog:"),
  bullet("Second person (\"you\"), addressing the property manager directly."),
  bullet("Question or pain hook in the first two lines (\"Still posting Facebook Marketplace listings one by one?\")."),
  bullet("Problem-solution framing from line one."),
  bullet("Professional but approachable, light metaphors occasionally."),
  bullet("Numbered steps, comparison tables, scannable structure."),
  bullet("Leasey woven in mid-article, not just at the bottom."),
  bullet("\"Schedule a call with Leasey.AI\" is the house CTA phrasing."),
  p("This is the active voice for blog, press release, and the LinkedIn company page. The template is repeatable."),
  h3("Era 3 - Founder voices on LinkedIn"),
  bullet([
    new TextRun({ text: "Carlos: ", bold: true }),
    new TextRun({ text: "direct opener, max 3 sentences per paragraph, founder-authentic, never \"Excited to announce\", bilingual Colombia/Canada context referenced naturally." }),
  ]),
  bullet([
    new TextRun({ text: "Juan: ", bold: true }),
    new TextRun({ text: "technical accuracy, around 60 words per post, leads with product milestones not relationship check-ins." }),
  ]),
  p("Both voices are documented but barely exercised in 2026."),

  h2("2.2 Content inventory at a glance"),
  buildTable(
    [2200, 1700, 2860, 2600],
    ["Content type", "Approximate count", "Where", "Voice era"],
    [
      ["Operator-facing blog posts", "30+", "www.leasey.ai/blog/", "Mix of Era 1 and Era 2"],
      ["Renter city guides", "12", "blog.leasey.ai/", "All Era 1"],
      ["Free tools (calculators)", "4+", "www.leasey.ai/resources/tools/", "Era 2"],
      ["Resource articles", "many", "www.leasey.ai/resources/", "Era 2"],
      ["Research articles", "a handful", "/resources/research/", "Era 2, authoritative"],
      ["Case studies", "1 confirmed (Goldwynn)", "/resources/testimonials/", "Era 2"],
      ["Press releases", "unknown", "To confirm if any are public", "n/a"],
      ["LinkedIn posts (company + founders)", "very few in last 90 days", "linkedin.com/company/leaseyai + founder profiles", "Era 3 inactive"],
      ["Reddit r/LeaseyAI posts", "0 published", "r/LeaseyAI", "n/a"],
    ]
  ),

  h2("2.3 The 2025 repressed backlog (the most important inventory)"),
  num("Zillow direct syndication launch."),
  num("Facebook Marketplace direct syndication."),
  num("Centralised messaging system."),
  num("ID verification for showings and applications."),
  num("Calendar View v2.0 (split layout, overlap tooltips)."),
  num("Showing confirmation dashboard (SMS workflow)."),
  num("Billing tab update (transaction filters, invoice downloads)."),
  num("SingleKey tenant screening integration."),
  num("Rental Beast partnership."),
  p([
    new TextRun({ text: "Each one is a blog post, a LinkedIn post and, where applicable, a Reddit r/LeaseyAI changelog. " }),
    new TextRun({ text: "27 pieces of content that the product team has already justified by shipping the feature or signing the partnership. ", bold: true }),
    new TextRun({ text: "Most of the work is editorial, not strategic." }),
  ]),

  h2("2.4 What has actually worked on the operator-facing site"),
  p("From Google Search Console (90 days, www.leasey.ai). These are the pages that have brought the most clicks:"),
  buildTable(
    [5360, 2000, 2000],
    ["Page", "Clicks 90d", "Impressions 90d"],
    [
      ["Homepage", "857", "26,598"],
      ["Security deposit calculator", "112", "12,074"],
      ["\"Best PMS - 4 popular options\" blog", "90", "83,185"],
      ["\"Hidden gems on Facebook Marketplace\"", "73", "18,554"],
      ["Facebook Marketplace FAQ blog", "68", "26,004"],
      ["Toronto lease takeover article", "62", "5,189"],
      ["\"Complete guide to FB Marketplace\" blog", "53", "17,020"],
      ["Marketplace Syndication feature page", "31", "5,577"],
      ["Tenant income qualification calculator", "31", "14,674"],
      ["Complete guide to property lease takeover", "27", "13,937"],
    ]
  ),
  h3("Three patterns to keep in mind"),
  num([
    new TextRun({ text: "Facebook Marketplace content is our biggest cluster. ", bold: true }),
    new TextRun({ text: "Three of the top ten pages. The repressed announcement on direct syndication slots cleanly into this cluster." }),
  ]),
  num([
    new TextRun({ text: "The free tools convert. ", bold: true }),
    new TextRun({ text: "Two calculators in the top ten. Tools are content too, and they are working." }),
  ]),
  num([
    new TextRun({ text: "Long-form comparison content outperforms everything else by impression volume. ", bold: true }),
    new TextRun({ text: "The \"Best PMS 4 popular options\" article has 83K impressions over 90 days, almost as much as every free tool combined." }),
  ]),

  h2("2.5 What has not worked"),
  bullet([new TextRun({ text: "blog.leasey.ai ", bold: true }), new TextRun({ text: "generated 39 clicks across 12 renter-focused city guides in 90 days. That subdomain is effectively dormant." })]),
  bullet([new TextRun({ text: "The LinkedIn channels ", bold: true }), new TextRun({ text: "(company page, Carlos, Juan) have produced near zero in the same window." })]),
  bullet([new TextRun({ text: "r/LeaseyAI ", bold: true }), new TextRun({ text: "has not had a single official post yet." })]),
  bullet([new TextRun({ text: "No press release has gone out ", bold: true }), new TextRun({ text: "despite nine repressed announcements waiting." })]),

  h2("2.6 What I take away from \"how it has been\""),
  num("We have a working voice template (Era 2 operator-facing). We do not need to invent it; we need to apply it consistently."),
  num("We have a publishing problem, not a content problem. The content debt is concentrated and well-defined."),
  num("The Facebook Marketplace cluster is a topical authority we should keep building on; it is already converting."),
  num("blog.leasey.ai is at a decision point that founders need to make."),
  num("The founder profiles are the most underused asset by an order of magnitude."),
];

// Section 3 with NEW 3.2
const sec3 = [
  h1("3. How content should be"),
  p("The prescription. Topics, formats, voice, and the principles that decide what we publish and what we don't."),
  h2("3.1 The principle that comes first"),
  p([new TextRun({ text: "Content has to either bring in qualified operators or move a deal forward. ", bold: true }), new TextRun({ text: "Brand awareness is a side effect, not the goal." })]),
  p("Per the Onboarding Guide and the SEO Knowledge Base, 100% of Leasey's client acquisition is inbound through SEO and content. That means every piece needs to be earning its keep against one of three outcomes:"),
  num("Rank for, or reinforce, a category-defining search query (e.g. \"property management software\", \"automated leasing\", \"rental syndication\")."),
  num("Build authority on a positioning pillar where we want to lead (Canadian-first, agent-not-widget, all-in-one, compliance-aware)."),
  num("Move a qualified operator further down the funnel toward \"Schedule a call\"."),
  p("If a piece does not do at least one of those, it does not get written."),

  h2("3.2 The themes we should be writing about"),
  p("Four broad clusters. The point of keeping them broad is to give each writer room to find a fresh angle every time, instead of churning out variations of the same eight specific topics. Each cluster is anchored to a positioning pillar AND tied to content that is already earning clicks or impressions today, so we are doubling down on proven territory rather than guessing."),
  buildTable(
    [2300, 3500, 3560],
    ["Theme cluster", "What it covers", "What it builds on (already working)"],
    [
      [
        "The modern leasing funnel",
        "How operators run listings, leads, showings and screening end to end. Syndication, Facebook Marketplace, ID verification, tenant screening, showings coordination, lead qualification.",
        "The Facebook Marketplace cluster is already three of our top ten pages (Hidden Gems 73 clicks, FB Marketplace FAQ 68 clicks, Complete Guide 53 clicks, plus the Marketplace Syndication feature page at 31 clicks). The repressed FB Marketplace direct syndication announcement and the SingleKey screening integration land directly into this cluster.",
      ],
      [
        "AI in property management",
        "Where AI actually fits in a PM's day, agent-vs-widget, fair housing, compliance, the buyer's evaluation framework.",
        "\"AI property management software\" gets 279 impressions at position 45.4 and \"automated leasing\" 70 impressions at position 26. We have the demand, we are below page 2. This cluster is what closes that gap, and it carries the highest AEO upside per the Section 6 test plan.",
      ],
      [
        "Operating a Canadian rental business",
        "Market signals, regulatory shifts, lease-up tactics, partnerships and tools the Canadian operator cares about. SingleKey, Rental Beast, RTA/RTB, regional supply data.",
        "The Toronto lease takeover article (62 clicks, 5,189 impressions) and the broader lease takeover guide (27 clicks) prove the Canadian angle converts. Pillar 4. Carlos's natural ground and the territory where US-based PropTech does not compete.",
      ],
      [
        "Inside Leasey (founder POV + client stories)",
        "What we are building and why, lessons from real clients, observations from operator conversations. TEREZ, Goldwynn, Aquilini and the rest.",
        "The single Goldwynn case study is the only proof asset in this cluster today, and Carlos's LinkedIn already outperforms the company page despite posting once a month. This is the asset class with the most upside per piece, not the most volume, and it is LinkedIn-native, not blog-native.",
      ],
    ]
  ),
  p([
    new TextRun({ text: "A fifth area runs underneath all four clusters: long-form comparison content ", italics: true }),
    new TextRun({ text: "(\"Best PMS - 4 popular options\" alone has 83K impressions over 90 days, more than every free tool combined). Each cluster should produce at least one comparison-format piece per quarter, because that is the format that earns the impression volume on this site." }),
  ]),
  p("The 90-day calendar will rotate across the four clusters so no single one dominates, and inside each cluster the angle changes every time (a feature post, then a market post, then a client story, then a founder reflection)."),
  p([new TextRun({ text: "Categories we should explicitly not write about:", bold: true })]),
  bullet("US tax content (1031 exchange and similar). The site picks up the impressions but they do not convert."),
  bullet("Single-family landlord tips at the \"5 properties or fewer\" level. That was the 2023 ICP."),
  bullet("Generic productivity or \"future of work\" topics. Off-positioning."),

  h2("3.3 Formats by channel"),
  p("Different channels reward different shapes. The 90-day strategy will commit specific cadences; this is the format-template intent."),
  h3("Blog (www.leasey.ai/blog)"),
  bullet([new TextRun({ text: "Long-form authority piece ", bold: true }), new TextRun({ text: "(1,200-2,000 words): for cornerstone topics (Best PMS, Fair Housing AI, Canadian leasing). One per month is enough if the quality is high." })]),
  bullet([new TextRun({ text: "Practical guide / how-to ", bold: true }), new TextRun({ text: "(800-1,200 words): for cluster-building (how to advertise on FB Marketplace at scale, how to syndicate listings, how to qualify leads). Two per month." })]),
  bullet([new TextRun({ text: "Product announcement blog ", bold: true }), new TextRun({ text: "(600-900 words): for each repressed item. Anchored to operator outcomes, not feature lists. One every other week until the backlog clears." })]),
  bullet([new TextRun({ text: "Case study ", bold: true }), new TextRun({ text: "(800-1,200 words): per signed client. TEREZ and Goldwynn are the priority refresh and Carlos has the relationships. Quarterly cadence." })]),
  p("All blog content uses the Era 2 voice template (second person, question hook, problem-solution, numbered steps, woven Leasey mentions, \"Schedule a call\" CTA)."),
  h3("LinkedIn"),
  buildTable(
    [2200, 2660, 4500],
    ["Profile", "Cadence target (per Onboarding Guide)", "Post shape"],
    [
      ["Company page", "3 per week", "Product announcements, data points, case study moments, partnership news."],
      ["Carlos", "1-2 per week", "Founder observations from real client conversations, market reflections, strategic comments."],
      ["Juan", "1-2 per week", "Product milestone notes around 60 words, technical observations, PropTech industry data."],
    ]
  ),
  h3("Reddit"),
  bullet([new TextRun({ text: "r/LeaseyAI (owned): ", bold: true }), new TextRun({ text: "software changelog format only. Title pattern: Leasey.AI [Feature] - [what it does in one line]. 1-2 paragraph body. Honest about limitations. Never promotional. Cadence: every product update, organically." })]),
  bullet([new TextRun({ text: "Community subs (r/PropertyManagement, r/Landlord, r/RealEstateInvesting, r/RealEstateTechnology): ", bold: true }), new TextRun({ text: "value-first replies and the occasional original post answering a real operator question. Maximum one Leasey mention per thread. Cadence: ongoing presence, not a publishing calendar." })]),
  h3("Facebook Groups"),
  p("Four target groups (Property Management Network, Canadian Property Managers, Landlords of Canada, Apartment Owners Association). Same rules as Reddit communities: value first, one mention max, no direct promo. Walter participates as a person, not as the company."),
  h3("Press releases"),
  p("Format: inverted pyramid, dateline (NY / Vancouver / Toronto), founder quote (Juan for product/technical, Carlos for strategy/relationship), market context with a sourced datapoint, boilerplate. Distribution targets already researched (MultifamilyBiz, Multifamily Press, Multi-Housing News, Multifamily Dive, Multifamily Insiders)."),
  p("Trigger: each confirmed partnership in the repressed backlog (SingleKey, Rental Beast, Duuo, Sure, DoorInsight) deserves a real press release."),

  h2("3.4 The voice rules that apply everywhere"),
  p("These are the non-negotiables that the system enforces via the editor-qa step:"),
  num([new TextRun({ text: "British English ", bold: true }), new TextRun({ text: "throughout (neighbourhood, organised, centralise)." })]),
  num([new TextRun({ text: "Oxford comma ", bold: true }), new TextRun({ text: "required." })]),
  num([new TextRun({ text: "\"Leasey.AI\" stylisation ", bold: true }), new TextRun({ text: "in body copy." })]),
  num([new TextRun({ text: "No em-dashes. ", bold: true }), new TextRun({ text: "Use commas, parentheses, or periods." })]),
  num([new TextRun({ text: "Insight-led, ", bold: true }), new TextRun({ text: "with attribution. Every external statistic names its source in the text." })]),
  num([new TextRun({ text: "Real operator anchors. ", bold: true }), new TextRun({ text: "\"154-unit lease-up in 60 days\" beats \"a large multifamily building\"." })]),
  num([new TextRun({ text: "The CTA is always \"Schedule a call\", ", bold: true }), new TextRun({ text: "pointing to leasey.ai/get-started/." })]),

  h2("3.5 What I want to be more deliberate about"),
  p("Three things the historical content has done inconsistently:"),
  num([new TextRun({ text: "Naming sources for every statistic. ", bold: true }), new TextRun({ text: "Anyone can write \"studies show\". Naming Yardi, Frontdesk Research, RBC, StatCan in the text is what builds AI-citation credibility and human trust." })]),
  num([new TextRun({ text: "Anchoring to real client outcomes. ", bold: true }), new TextRun({ text: "TEREZ, Goldwynn, Three Shores, Apartment Hub are referenced sparingly. Each one is a permission to cite a number. The system has them documented; we should use them more." })]),
  num([new TextRun({ text: "Internal linking discipline. ", bold: true }), new TextRun({ text: "Every blog should link to at least one feature page or tool. The Onboarding Guide flags this; Era 1 posts often do not." })]),

  h2("3.6 What I take away from \"how it should be\""),
  num("We standardise on Era 2 voice across blog, PR, and the company LinkedIn page; Era 3 voices for the two founder profiles."),
  num("We work the existing themes first, doubling down on what already ranks (FB Marketplace, comparison content, Canadian-first lease takeover). We are not chasing new audiences."),
  num("Cadence beats cleverness. 3 LinkedIn posts a week from the company page, 1-2 from each founder, one blog per week, and the Reddit changelog as products ship."),
  num("Anything from the repressed backlog gets all three formats (blog, LinkedIn, Reddit) in the same week."),
  num("Every piece earns its keep against one of the three outcomes in Section 3.1, or it doesn't get written."),
];

// Section 4
const sec4 = [
  h1("4. Distribution today, and where it needs to go"),
  p("For every channel: where we stand now, what the Onboarding Guide asks of us, and what I think the right first move is."),

  h2("4.1 LinkedIn company page"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "linkedin.com/company/leaseyai. Described in the Onboarding Guide as \"under-active\". Recent posts are sparse and most of the reach lives on the founder profiles, not here." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "3 posts per week, with the company voice (we, not I; institutional but direct; benefit-concrete)." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Reactivate with the SingleKey announcement. It is a partnership, which fits the company voice better than a founder voice. It also dogfoods Canadian-first messaging." })]),

  h2("4.2 Carlos's LinkedIn"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "8,000+ followers. Posting roughly once a month. The posts that do go out are honest and well-received (year-end reflections, hiring notes, co-founder spotlights for Juan). Per the Onboarding Guide, his reach beats the company page." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "1-2 founder-voice posts per week. Real observations from client conversations. Direct opener. Max 3 sentences per paragraph. Never \"Excited to announce\"." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "One post this week, anchored to a real operator scenario (e.g. a TEREZ-style lease-up observation). The system has the agent already; what is needed is a one-time approval cadence between Walter and Carlos." })]),

  h2("4.3 Juan's LinkedIn"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "2,000+ followers. Posts even less than Carlos. Voice when he does post is technical and precise." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "1-2 product-voice posts per week. Around 60 words. Lead with a product milestone or an industry datapoint." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "One product moment per week from the repressed backlog. The Calendar v2.0 or showing confirmation features are natural fits for Juan's voice." })]),

  h2("4.4 r/LeaseyAI (owned subreddit)"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "The subreddit exists. Zero official posts. Ivan has drafted four changelog posts during his handover (showing confirmation dashboard, ID verification, Calendar v2.0, billing tab)." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "Posts must look like a real software company's changelog, not marketing. Title pattern, body length, honesty about limitations, all documented." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Publish the four drafted posts this month. Zero generation effort; the drafts exist. After that, every product update goes here as a 1-2 paragraph changelog." })]),

  h2("4.5 Reddit communities"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "Zero official presence on any of r/PropertyManagement, r/Landlord, r/RealEstateInvesting, r/RealEstateTechnology." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "Authentic participation. Value-first replies. Max one Leasey mention per thread. Build reputation as a knowledgeable voice over months, not as a publishing calendar." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Establish a Reddit account with some baseline karma (a few weeks of honest replies in r/PropertyManagement is enough). Then one helpful comment per day across the four subs becomes the steady-state rhythm." })]),

  h2("4.6 Facebook Groups"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "Zero official presence. The four target groups are Property Management Network, Canadian Property Managers, Landlords of Canada, Apartment Owners Association." })]),
  p([new TextRun({ text: "The guide asks for. ", bold: true }), new TextRun({ text: "Same rules as Reddit communities. Value first. Maximum one mention. Walter participates as a person, not as the company." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Walter joins the four groups this week. Observes the first month. Begins helpful replies in month two. This is a 60-90 day initiative per the Onboarding Guide." })]),

  h2("4.7 Press releases and contributed articles"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "Zero outbound. Nine repressed announcements that would each justify a real press release." })]),
  p([new TextRun({ text: "The Onboarding Guide asks for. ", bold: true }), new TextRun({ text: "5-10 PropTech and real estate media targets identified, a pitch for a contributed article drafted." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Send the SingleKey partnership press release to MultifamilyBiz and Multifamily Press in the same week the announcement blog goes up. Treat it as a coordinated launch, not a sequence." })]),

  h2("4.8 The operator-facing blog (www.leasey.ai/blog)"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "Lives. Has roughly 30 posts spanning Era 1 and Era 2. Most of the search traffic on the property comes here. The single highest-impression page on the entire site is here (\"Best PMS 4 popular options\", 83K impressions over 90 days)." })]),
  p([new TextRun({ text: "The Onboarding Guide asks for. ", bold: true }), new TextRun({ text: "Cadence is implicit in the 90-day calendar deliverable; the editorial principles are explicit." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Treat the blog as the primary publishing venue for the repressed backlog. One announcement blog per week. Era 2 voice. Internal link to the relevant feature page." })]),

  h2("4.9 blog.leasey.ai (the renter subdomain)"),
  p([new TextRun({ text: "Today. ", bold: true }), new TextRun({ text: "12 city guides written in the Era 1 playful voice. 39 clicks in 90 days. Not in the operator funnel." })]),
  p([new TextRun({ text: "The Onboarding Guide does not address it directly. ", bold: true }), new TextRun({ text: "The renter funnel is not the core ICP." })]),
  p([new TextRun({ text: "Right first move. ", bold: true }), new TextRun({ text: "Founder decision required. Two options:" })]),
  bullet([new TextRun({ text: "Invest: ", bold: true }), new TextRun({ text: "refresh content in a current voice, add internal links, treat as a top-of-funnel content marketing play to the homepage." })]),
  bullet([new TextRun({ text: "Sunset: ", bold: true }), new TextRun({ text: "redirect to a relevant operator resource, retire the subdomain, free up the maintenance overhead." })]),

  h2("4.10 What I take away from distribution"),
  num([new TextRun({ text: "The fastest unlock is the four already-drafted Reddit posts. ", bold: true }), new TextRun({ text: "Days of effort, immediate signal that r/LeaseyAI is a live channel." })]),
  num([new TextRun({ text: "Carlos's LinkedIn is the highest leverage per post. ", bold: true }), new TextRun({ text: "One thoughtful post from him beats five from the company page." })]),
  num([new TextRun({ text: "The repressed backlog drives three channels at once ", bold: true }), new TextRun({ text: "(blog + LinkedIn + Reddit changelog) for the product announcements, plus PR for the partnerships." })]),
  num([new TextRun({ text: "PR can wait until week 3-4 ", bold: true }), new TextRun({ text: "of the cadence; Reddit communities and FB groups can build in parallel as Walter's ongoing presence." })]),
  num([new TextRun({ text: "blog.leasey.ai needs a founder call this month ", bold: true }), new TextRun({ text: "so we are not spending mental energy on a channel we may sunset." })]),
];

// Section 5
const sec5 = [
  h1("5. Search demand at a glance"),
  p("This section is here only to give you the shape of search demand around Leasey so the content recommendations in this document are anchored in real numbers, not assumptions."),
  p("All figures are live from Google Search Console, pulled Jun 12, 2026."),

  h2("5.1 Three properties, very different traffic profiles"),
  buildTable(
    [2360, 1700, 1700, 3600],
    ["Property", "Clicks 90d", "Impressions 90d", "Read"],
    [
      ["www.leasey.ai", "2,352", "585,188", "This is the franchise. Around 95% of visibility."],
      ["blog.leasey.ai", "39", "12,624", "Effectively dormant."],
      ["www.silverhomes.ai", "149", "58,198", "Steady at small scale (Carlos's adjacent site)."],
    ]
  ),
  p("Whatever happens on www.leasey.ai is what moves the needle."),

  h2("5.2 The shape of demand is good news"),
  p("The site already ranks for the category-defining queries:"),
  bullet("best property management software and its variants (positions 5-17 across multiple phrasings, around 17K impressions over 90 days)."),
  bullet("automated leasing, rental syndication, leasing ai (our category language; positions 14-26)."),
  bullet("property management software (position 19.9, 1K impressions)."),
  bullet("A long tail of Facebook Marketplace queries (where we are strong)."),
  p([new TextRun({ text: "Translation for content. ", bold: true }), new TextRun({ text: "The themes we want to write about are the same themes operators are already searching for. We are not chasing a new audience. We are optimising for one that is already raising a hand." })]),

  h2("5.3 The single biggest content lever on the site"),
  p("/blog/whats-the-best-property-management-software-4-popular-options/"),
  bullet("83,185 impressions over 90 days."),
  bullet("90 clicks."),
  bullet("That is a 0.11% CTR."),
  p("A title and meta description rewrite on this single page, if it bumps CTR to even 1% (still below the position-average), unlocks roughly 800 additional clicks per quarter. This is Alejandra's call to execute. From the content side, this confirms that long-form comparison content is the highest-impression format we publish, and we should commit to it."),

  h2("5.4 The Facebook Marketplace cluster is ours to keep"),
  p([new TextRun({ text: "Three of the top ten pages by clicks are FB Marketplace content. That cluster generated roughly 35,000 impressions over 90 days. " }), new TextRun({ text: "The repressed announcement on FB Marketplace direct syndication lands directly into this cluster, ", bold: true }), new TextRun({ text: "this is timing on our side." })]),

  h2("5.5 The blind spots"),
  p("These are real demand signals where we are barely showing up despite the queries matching our positioning:"),
  buildTable(
    [2360, 1700, 1100, 4200],
    ["Query", "Impressions 90d", "Pos", "What is happening"],
    [
      ["ai property management software", "279", "45.4", "Page 5 of Google. We need content for our exact category."],
      ["automated leasing", "70 (28d)", "26", "Our category language. Page 3 of Google."],
      ["rental listing syndication", "413", "16.1", "Page 2. We have the feature, the page just is not strong enough."],
      ["lease takeover apartment", "331", "10.9", "Already on page 1 but CTR near zero. Title needs work."],
    ]
  ),
  p([new TextRun({ text: "Translation for content. ", bold: true }), new TextRun({ text: "Two implications. First, there are themes (AI property management software, automated leasing) where we are below page 2, meaning we either do not have the dedicated content for them, or the existing content is not strong enough. Second, there are themes where the title is the problem more than the content. Both are fixable." })]),

  h2("5.6 The branded search anomaly"),
  p([new TextRun({ text: "The query leasey itself ranks at position 6.7 with 1,384 impressions over 90 days and 8.8% CTR. " }), new TextRun({ text: "A brand should sit at positions 1-3 for its own name. ", bold: true }), new TextRun({ text: "Competitors like leadsy.ai and lease.ai are taking some of this traffic. Alejandra owns the fix; from the content side it is enough to know that brand-entity reinforcement (consistent \"Leasey.AI\" stylisation, founder bio pages, consistent company description) helps her case." })]),

  h2("5.7 What I take away from search demand"),
  num("The themes we should be writing about (Section 3.2) are validated by real search demand, not by guessing."),
  num("The Facebook Marketplace cluster is a real authority we already own and should keep building."),
  num("The \"best property management software\" comparison content is by a wide margin our highest-impression format. We should commit to producing more of it."),
  num("Long-tail product category queries (AI property management, automated leasing) are below page 2, that is where dedicated cornerstone pieces will move the needle."),
  num("The detailed action plan (titles, meta, technical SEO, schema) is Alejandra's. From content, the takeaway is: we are not lacking demand. We are lacking publication."),
];

// Section 6
const sec6 = [
  h1("6. AEO: where Leasey shows up in AI search"),
  p("AEO (Answer Engine Optimization) is the new layer between us and our buyers. Property managers increasingly ask ChatGPT, Claude, Perplexity, or Google's AI Overview before they Google. Being named by those engines is high-leverage and content-led."),

  h2("6.1 The infrastructure we already have"),
  p("From the Onboarding Guide and the Feb 2026 SEO Knowledge Base:"),
  buildTable(
    [2360, 4500, 2500],
    ["Asset", "State", "Where"],
    [
      ["/llm-info/ page", "Exists; intentionally for AI crawlers only (not navigation-linked).", "www.leasey.ai/llm-info/"],
      ["SEO Knowledge Base", "Clean Q&A on identity, ICP, what Leasey is NOT, pricing, implementation.", "Internal doc (Feb 28, 2026); now mirrored in our system as context/aeo-faq.md."],
      ["Research articles", "Authoritative pieces on Fair Housing and algorithmic screening.", "/resources/research/"],
      ["AI bot policy", "Configured per Ivan's handover.", "Site-wide"],
    ]
  ),
  p("The Knowledge Base is well-built for AEO. Three reasons:"),
  num("Boundary statements are explicit (\"Leasey is NOT a PMS\", \"NOT a chatbot\", \"no commercial leases\", \"no free trial\")."),
  num("Comparison anchors are clear (\"Leasey vs spreadsheets\", \"Leasey vs generic CRM\", \"Leasey vs traditional lease management tools\")."),
  num("Entity definitions are tight and consistent across answers."),
  p("That is exactly the structure AI engines reward."),

  h2("6.2 What is missing"),
  p("Two big gaps:"),
  num([new TextRun({ text: "FAQPage schema is not implemented. ", bold: true }), new TextRun({ text: "The Onboarding Guide flags it as a \"one-time implementation, permanent AEO benefit\". Until it ships, the Q&A on the site is invisible to extraction-based engines. This is Alejandra's task with the dev team." })]),
  num([new TextRun({ text: "No live test of how Leasey actually shows up. ", bold: true }), new TextRun({ text: "Today we are guessing. We do not know:" })]),
  bullet("Does ChatGPT name Leasey when asked \"What is the best leasing automation software?\""),
  bullet("Does Perplexity cite leasey.ai when asked about Canadian property management?"),
  bullet("Does Claude know what Liza is?"),
  bullet("Does Google's AI Overview include leasey.ai for commercial-intent queries?"),
  bullet("Are AI engines citing our Fair Housing research?"),
  p("Until we run the test, AEO is opinion, not evidence."),

  h2("6.3 The test I want to run before Jun 30"),
  p([new TextRun({ text: "Engines. ", bold: true }), new TextRun({ text: "ChatGPT, Claude, Perplexity, Google AI Overview, Gemini." })]),
  p([new TextRun({ text: "Query set. ", bold: true }), new TextRun({ text: "Ten priority queries that mix commercial-intent, branded, and category-defining patterns:" })]),
  num("\"What is the best leasing automation software for property managers?\""),
  num("\"How do I automate tenant screening in Canada?\""),
  num("\"What is Liza by Leasey.AI?\""),
  num("\"Best alternative to ShowMojo for multifamily?\""),
  num("\"How do I list a rental on Facebook Marketplace at scale?\""),
  num("\"Property management software that integrates with Yardi?\""),
  num("\"AI leasing agent for 100+ door multifamily?\""),
  num("\"Fair Housing compliance for AI tenant screening?\""),
  num("\"What is Leasey.AI?\" (branded)"),
  num("\"How fast can I lease up a 154-unit multifamily building?\" (TEREZ scenario)"),
  p([new TextRun({ text: "For each query, capture. ", bold: true })]),
  bullet("Is Leasey.AI named? Cited with a link? Or absent?"),
  bullet("Which competitors are named?"),
  bullet("How is Leasey positioned (correctly per the SEO KB, or hallucinated)?"),
  bullet("Is /llm-info/ showing up as a cited source?"),
  bullet("For the branded query: is the Knowledge Base definition surfaced verbatim?"),
  p([new TextRun({ text: "Output. ", bold: true }), new TextRun({ text: "A scorecard with one row per query, one column per engine. Becomes a baseline we can measure against quarterly." })]),

  h2("6.4 What I can already say from the content side"),
  p("Even without the live test, three content-level commitments make sense:"),
  num([new TextRun({ text: "Treat the SEO Knowledge Base as the canonical answer set. ", bold: true }), new TextRun({ text: "Every blog FAQ section, every /llm-info/ update, every quote-style sentence about what Leasey is uses the same exact answers and boundaries. Consistency builds entity recognition for AI engines." })]),
  num([new TextRun({ text: "Lead each blog section with an answer-pattern sentence. ", bold: true }), new TextRun({ text: "\"Property management software is X\" or \"The best way to handle Y is Z\". AI extraction engines reward direct answer formats." })]),
  num([new TextRun({ text: "Build out a \"Leasey vs [competitor]\" page per major competitor ", bold: true }), new TextRun({ text: "(Tenant Turner, ShowMojo, Funnel Leasing, AppFolio). AI engines surface comparison content disproportionately for buyer-intent queries." })]),

  h2("6.5 What I take away from AEO"),
  num("The infrastructure is more built than it looks. The Knowledge Base and /llm-info/ are solid foundations."),
  num("The measurement layer is missing. The Jun 30 test closes that."),
  num("The FAQPage schema is the lowest-effort highest-value AEO fix on the table, one Alejandra-and-dev sprint."),
  num("From content, the discipline is: write to be cited, not just to be clicked. That means answer patterns, consistent entity language, comparison content, and named-source attribution everywhere."),
];

// Section 7: Open questions
const sec7 = [
  h1("7. Open questions for the founders"),
  p("Five decisions I cannot make alone. Each one shapes what the 90-day calendar can commit to."),
  h2("7.1 blog.leasey.ai: invest or sunset"),
  p("39 clicks in 90 days across 12 city guides in the Era 1 voice. The renter funnel is not the core ICP, but the subdomain has SEO equity we either capitalize on or retire cleanly. The longer it sits, the more mental overhead it generates. I need a call this month."),
  h2("7.2 Founder approval cadence for LinkedIn"),
  p("The system can draft 1-2 posts per week in Carlos's voice and 1-2 in Juan's. What it cannot do is publish without you. I propose a Friday review window (15 minutes) where you approve, edit or kill the week's drafts. Without a fixed cadence, the highest-leverage channel stays silent."),
  h2("7.3 Validity of pillar 5 (compliance-aware AI)"),
  p("Of the eight client testimonials we have, zero mention compliance. The pillar is a push from Leasey, not a pull from the market. Two options: keep it as a product/positioning bet (then we own the narrative through cornerstone research content), or retire it and double down on the four pillars clients actually cite."),
  h2("7.4 Aquilini as a public reference"),
  p("Robyn Lockhart's testimonial is the strongest institutional credibility we have, and Aquilini is Carlos's former employer. I want to use it but sparingly: max one mention per quarter in Carlos's LinkedIn, max one PR pitch in 90 days. Confirm this fits the relationship before I bake it into the calendar."),
  h2("7.5 Testimonial outreach to silent clients"),
  p("13 active clients have no quote yet (Excel Leasing, King Residences, Rent Panda, Seven, Sutton, Three Shores, Cromwell, Freddy Beach, Locarno, Bayshore, Mendlo, Unity, Walcott). A coordinated CS-led ask in July could triple our proof inventory before Q4. Do I run it, does Tereza run it, or do you?"),
];

// Section 8: Roadmap
const sec8 = [
  h1("8. Roadmap to end of June"),
  p("Two weeks. The goal is to close this CSA with the founders, ship the first publications, and have the 90-day calendar approved."),

  h2("Week of Jun 16-20"),
  num("Finalize this CSA. Incorporate feedback from this draft. Distribute final to Juan and Carlos by Jun 19."),
  num("Publish SingleKey announcement (blog + Carlos LinkedIn + Reddit changelog)."),
  num("Publish first of Ivan's drafted Reddit posts (Calendar v2.0)."),
  num("Walter joins the four Facebook Groups. Observation phase begins."),
  num("Run the AEO scorecard test (Section 6.3) across 5 engines, 10 queries."),

  h2("Week of Jun 23-27"),
  num("Founder review session for final CSA (lock 60-90 minutes)."),
  num("Decide blog.leasey.ai (invest vs sunset)."),
  num("Decide pillar 5 (keep or retire)."),
  num("Approve founder LinkedIn cadence and Friday review window."),
  num("Publish the second repressed announcement (Calendar v2.0 or showing confirmation dashboard)."),
  num("Publish the remaining three Reddit changelog posts."),
  num("Deliver the 90-day calendar (Jun 30 deadline per Onboarding Guide)."),

  h2("Hand-offs to Alejandra"),
  bullet("Title and meta rewrite for \"Best PMS 4 popular options\" (Section 5.3)."),
  bullet("FAQPage schema implementation (Section 6.2)."),
  bullet("Branded search anomaly fix (Section 5.6)."),
  bullet("Lease takeover apartment title rewrite (Section 5.5)."),
];

// Section 9: Conclusion (NEW)
const sec9 = [
  h1("9. Conclusion"),
  p([new TextRun({ text: "If you read nothing else, read this.", bold: true })]),
  p("Leasey's content engine is not broken. It is paused. The strategy, the voice, the topics and the audience are all correct. What is missing is publication."),
  p("Three facts make the next 90 days mostly a coordination problem, not a creative one:"),
  num([new TextRun({ text: "We already have 48 concrete pieces ready to write. ", bold: true }), new TextRun({ text: "Nine repressed product announcements plus fifteen content angles derived from real client quotes plus extensions of the pages that already rank. No invention required for the first 60-75 days." })]),
  num([new TextRun({ text: "We already rank for the queries we care about. ", bold: true }), new TextRun({ text: "Category-defining searches (best property management software, automated leasing, rental syndication) are bringing 585K impressions per quarter. We are leaking clicks on titles, not losing share of demand." })]),
  num([new TextRun({ text: "We already have the highest-leverage channel sitting idle. ", bold: true }), new TextRun({ text: "Carlos's LinkedIn outperforms our company page despite one post per month. Turning it on is a Friday-morning decision, not a Q3 project." })]),
  p([new TextRun({ text: "The single most important thing to take away: ", bold: true }), new TextRun({ text: "we do not need a new strategy, a rebrand or a bigger team. We need a publishing rhythm, two founder-approval windows, and one decision about blog.leasey.ai. Everything else compounds from there." })]),
  p([new TextRun({ text: "What I am asking from you between now and Jun 27:", bold: true })]),
  bullet("60-90 minutes for the final CSA review."),
  bullet("Five answers to the questions in Section 7."),
  bullet("A standing 15-minute Friday window to approve the week's LinkedIn drafts."),
  p([new TextRun({ text: "What I commit to delivering by Jun 30:", bold: true })]),
  bullet("The 90-day calendar, mapped to the four themes in Section 3.2 and the inventory in the content system."),
  bullet("The AEO baseline scorecard across five engines."),
  bullet("First three weeks of content live across blog, LinkedIn and Reddit."),
  p([new TextRun({ text: "We are not behind. We are loaded.", bold: true, color: "1F3864" })]),
];

// Build document
const doc = new Document({
  creator: "Walter Von Roestel",
  title: "Leasey.AI - Current State Assessment - Content",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2E75B6" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
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
        children: [new TextRun({ text: "Leasey.AI - Content CSA - Jun 16, 2026 - Page ", size: 18, color: "808080" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
      })] }),
    },
    children: [
      ...cover,
      ...toc,
      ...sec1,
      ...sec2,
      ...sec3,
      ...sec4,
      ...sec5,
      ...sec6,
      ...sec7,
      ...sec8,
      ...sec9,
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, "Leasey-Content-CSA-Revised-2026-06-16.docx");
  fs.writeFileSync(out, buf);
  console.log("Wrote", out, buf.length, "bytes");
});
