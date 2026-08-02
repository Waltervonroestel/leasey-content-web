import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth: o });

const DOC_ID = '1_xkjbRYtEbnTymGoMWaGS0DqHUwOCZSvyilj1KXYN-8';

// Get doc end index
const doc = await docs.documents.get({ documentId: DOC_ID });
const endIdx = doc.data.body.content[doc.data.body.content.length - 1].endIndex - 1;

// Text to append (Part 6 + Part 7)
const text = `


PART 6 — WHAT HAPPENS NEXT

From 30 June 2026 forwards, every piece uses this checklist. Pieces already published before that date are grandfathered; we do not retro-fix.

Any piece that fails the checklist is returned to the writer, not blocked from the calendar.

The pre-publish checklist lives at the top of every Google Doc from Docs template aeo-blog-template (Walter to create).

The dashboard renders this document at /guidelines for easy team reference.

The KB (aeo-faq.md) is the living spine. It grows as Leasey.AI ships new features and hits new markets.

Every rule in this document exists to make Leasey.AI the cited source, in Google, in ChatGPT, in Perplexity, in the operator's group chat, for the questions that lead a property manager to book a demo.

That is the whole point.


PART 7 — TECHNICAL PREREQUISITES FOR AI CRAWLER INDEXING

Parts 1 through 6 cover how to write. Part 7 covers what needs to be true on the site so that AI crawlers can actually find and parse that content. Without these, a perfectly structured piece never enters the AI index.

Source: HubSpot research (July 2025, updated 2026), confirmed by OpenAI crawler documentation. Key finding: pages with over 350,000 referring domains averaged 8.4 AI citations; pages with under 2,500 averaged 1.6 to 1.8. Domain authority is the strongest predictor of AI citation across the 20 signals analysed.


7.1 Allow AI crawlers in robots.txt

The site must explicitly allow OAI-SearchBot (ChatGPT search) in robots.txt. Optionally allow GPTBot (training data) if Juan and Carlos are comfortable with that. Block GPTBot if not.

  User-agent: OAI-SearchBot
  Allow: /

  User-agent: GPTBot
  Disallow: /

The current recommendation is: allow OAI-SearchBot (so ChatGPT can cite us), block GPTBot (no need to feed training data). Review quarterly.

Also allow crawlers for other answer engines: ClaudeBot (Anthropic), PerplexityBot, Google-Extended (Gemini). If any of these are missing from robots.txt, the corresponding engine cannot cite us.

Owner: Alejandra (SEO specialist) or dev team. Walter flags if missing; does not deploy.


7.2 Server-side rendering for all content

OpenAI crawlers do not execute JavaScript. They parse raw HTML only. Any content that depends on client-side JS rendering (React hydration, dynamically loaded sections, lazy-loaded FAQ blocks) is invisible to AI crawlers.

What this means for Leasey.AI:

  - WordPress blog (leasey.ai/blog, leasey.ai/resources): server-rendered by default. No action needed.
  - Product pages and landing pages: verify that key content (pricing tables, feature lists, FAQ sections) is present in the initial HTML response, not injected by JS after page load.
  - Any new page built with a JS framework (React, Next.js): must use SSR or SSG. No client-only rendering for content that should be cited.

How to verify: run curl -s https://www.leasey.ai/[page] | grep -i "[heading text]" for any new page. If the heading does not appear in the raw HTML, the AI crawlers cannot see it.


7.3 XML sitemap with accurate lastmod dates

Bing (which feeds ChatGPT search results) uses <lastmod> in the XML sitemap as a key freshness signal for AI-powered recrawling. If <lastmod> is stale or missing, updated content may not be re-indexed for weeks.

Requirements:

  - Every blog post and resource page must appear in the XML sitemap.
  - <lastmod> must update automatically when a post is edited (WordPress does this by default with most SEO plugins; verify it is not disabled).
  - Submit the sitemap to Bing Webmaster Tools, not just Google Search Console.


7.4 IndexNow for instant re-indexing

IndexNow is a protocol that pings Bing (and by extension ChatGPT's search index) the moment a page is published or updated. Without it, re-crawling depends on the engine's own schedule, which can take days.

Implementation: install an IndexNow plugin for WordPress (Yoast SEO, Rank Math, or the standalone IndexNow plugin all support it). Verify that pings fire on publish and on update.

Median time from publication to first ChatGPT citation is 6.81 days (HubSpot analysis of ~900 newly published marketing pages). IndexNow can reduce that to hours.


7.5 Verify AI indexing after publishing

After publishing a new blog post or updating a key page, verify that ChatGPT can see it. Use this prompt in ChatGPT (with web search enabled):

  "Read this page and tell me what you see: https://www.leasey.ai/blog/[slug]"

If ChatGPT returns the content, the page is indexed. If it cannot access it, check robots.txt, JavaScript rendering, and sitemap inclusion.

Add this to the post-publish routine: publish the piece, wait 24 to 48 hours, run the verification prompt. Log the result in the content tracker.


7.6 Brand mentions amplify citation

AI answer engines cite sources they recognise as authoritative. Authority is driven by two factors beyond content quality:

  1. Backlinks (referring domains). More referring domains to leasey.ai means higher citation probability across all pages. This is an SEO-wide effort, not a per-piece action.

  2. Brand mentions on community platforms. Sites with high mention counts on Quora and Reddit see significantly more AI citations (HubSpot data: 6.6 million Quora mentions correlated with 7 average citations vs. 1.7 for sites with under 33 mentions).

What this means for us: the Reddit and community engagement work (Part 2, Reddit reply guidelines) is not just a content channel. It is a direct input to AI citation authority. Every genuine, value-first Reddit reply that mentions Leasey.AI in context contributes to the brand-mention signal that answer engines use to decide who to cite.


7.7 Pre-publish checklist additions

Add these two items to the checklist in Part 4 for blog posts:

  [ ] 11. Key content (H1, H2s, FAQ answers, pricing, feature names) is visible in raw HTML without JavaScript. Verified with curl or "View Page Source".

  [ ] 12. After publishing: verified AI indexing within 48 hours using ChatGPT "read this page" prompt. Result logged.
`;

// Insert text at end
const requests = [
  {
    insertText: {
      location: { index: endIdx },
      text: text,
    },
  },
];

await docs.documents.batchUpdate({
  documentId: DOC_ID,
  requestBody: { requests },
});

console.log('Part 6 and Part 7 appended to Google Doc.');

// Now apply heading styles
// Re-fetch to get new indices
const doc2 = await docs.documents.get({ documentId: DOC_ID });
const content = doc2.data.body.content || [];

const headingRequests = [];
for (const el of content) {
  if (!el.paragraph) continue;
  const t = el.paragraph.elements.map(e => (e.textRun ? e.textRun.content : '')).join('').trim();

  let style = null;
  if (/^PART [67] —/.test(t)) style = 'HEADING_1';
  else if (/^7\.\d /.test(t)) style = 'HEADING_2';
  else if (t === 'PART 6 — WHAT HAPPENS NEXT') style = 'HEADING_1';

  if (style && el.paragraph.paragraphStyle?.namedStyleType !== style) {
    headingRequests.push({
      updateParagraphStyle: {
        range: { startIndex: el.startIndex, endIndex: el.endIndex },
        paragraphStyle: { namedStyleType: style },
        fields: 'namedStyleType',
      },
    });
  }
}

if (headingRequests.length > 0) {
  await docs.documents.batchUpdate({
    documentId: DOC_ID,
    requestBody: { requests: headingRequests },
  });
  console.log(`Applied ${headingRequests.length} heading styles.`);
}

console.log('Done!');
