import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth });

const DOC_ID = '1bn8s7jnDbnwVtEKSywmVp7eMkSCx9572WuaZtNDSd6o';

// First clear the doc
const doc = await docs.documents.get({ documentId: DOC_ID });
const endIndex = doc.data.body.content.at(-1).endIndex;

const requests = [];

if (endIndex > 2) {
  requests.push({ deleteContentRange: { range: { startIndex: 1, endIndex: endIndex - 1 } } });
}

await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests } });
console.log('Cleared doc');

// Build content for both bios
const content = `Author Bio Pages — Leasey.AI (E-E-A-T Corrections Applied)

════════════════════════════════════════════════════════════════
JUAN LEAL — CEO & CPO
════════════════════════════════════════════════════════════════

SEO Meta
Title: Juan Leal — CEO & CPO at Leasey.AI | Leasing Automation Architect
Meta Title: Juan Leal | The CPA Who Codes Leasey.AI's AI Engine (55 chars)
Meta Description: CPA-CA turned full-stack engineer. Juan Leal built Leasey.AI's native intelligence layer, from KPMG audits to automating 90% of leasing tasks for property managers. (155 chars)
Slug: /author/juan-leal
Photo spec: min 400x400px, neutral background, WebP format, alt="Juan Leal, CEO and CPO of Leasey.AI"

────────────────────────────────────────

H1: Juan Leal
Subtitle: Co-founder, CEO & Chief Product Officer at Leasey.AI

[PHOTO: min 400x400px, neutral background, WebP, alt="Juan Leal, CEO and CPO of Leasey.AI"]

Location: Based in Vancouver, British Columbia, Canada

────────────────────────────────────────

H2: About Juan

I started my career as a CPA, CA at KPMG, where I spent three years auditing financial systems for enterprise clients. The work taught me how to read complex operations and find the gaps that cost organisations money. But I kept noticing the same pattern: the businesses I audited were drowning in manual processes that software could handle in seconds.

That observation led me to engineering. I taught myself full-stack development, joined Wishpond Technologies as a software engineer, and later worked at The DMZ (one of the top university-linked incubators in the world). Each role sharpened a different edge: at KPMG, rigour; at Wishpond, speed; at The DMZ, the discipline of building under constraints.

In 2023, my brother Carlos and I founded Leasey.AI. I architected the platform's native intelligence layer from the ground up, including Liza, our AI leasing agent that handles phone and chat inquiries 24/7 with a 100% response rate (versus the industry average of 30-40%). I also led the migration to React and built the integrations with PMS platforms like Yardi, Buildium, and Rent Manager.

Today, Leasey.AI automates approximately 90% of leasing tasks and syndicates listings to 48+ marketplaces. Every line of product logic traces back to a real conversation with a property manager who needed something that did not exist yet.

────────────────────────────────────────

H2: Proof of Work

H3: Platform Architecture
• Designed and built Leasey.AI's core intelligence layer: tenant pre-qualification engine, showing scheduler with anti-no-show logic, and smart lease auto-fill with native eSignature
• Led the full-stack migration to React, reducing page load times and enabling real-time dashboard reporting
• Built PMS integrations (Yardi, Buildium, Rent Manager) that sync listings bidirectionally without manual data entry

H3: AI Agent Development
• Created Liza, the conversational AI agent (phone + chat) that handles inquiries in English, Spanish, French, and more
• Engineered the tenant screening pipeline: biometric ID verification, credit checks, background checks, employment and income verification, bank data analysis, and fraud detection
• Developed the Market Rent Comparison engine that analyses comparables and flags over/under-priced units

H3: Industry Presentations
• Featured speaker at the Rent Manager Integrations Spotlight, demonstrating real-time pricing updates, listing automation, and lead capture through PMS integration
• Featured in CanadianSME: "Transforming Property Management: Juan and Carlos Leal on Revolutionizing Leasing with Leasey.AI" (https://canadiansme.ca/transforming-property-management-juan-and-carlos-leal-on-revolutionizing-leasing-with-leasey-ai/)
• [VERIFICAR: agregar otras presentaciones, conferencias, o panels de Juan]

────────────────────────────────────────

H2: Topics Juan Writes About

Juan contributes to the Leasey.AI blog with a focus on product-led, technical content. His articles span:

• Leasing Automation & AI — How AI agents, automation workflows, and machine learning reshape the leasing funnel.
• Screening & Compliance — Tenant screening technology, fair housing compliance, and fraud detection.
• Press & Product Updates — Product launches, integration announcements, and platform milestones.

View all articles by Juan Leal → /blog?author=juan-leal

────────────────────────────────────────

H2: Editorial Standards

Articles published under Juan's byline reflect his direct technical knowledge of the Leasey.AI platform and the leasing automation industry. AI writing tools may assist with drafting and research, but every claim, data point, and product detail is verified by Juan or the Leasey.AI editorial team before publication. All statistics cite their original source. No fabricated data, no unsourced claims.

────────────────────────────────────────

JSON-LD Schema (ProfilePage + Person):

{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2026-07-24",
  "dateModified": "2026-07-24",
  "mainEntity": {
    "@type": "Person",
    "name": "Juan Leal",
    "givenName": "Juan",
    "familyName": "Leal",
    "jobTitle": "CEO & Chief Product Officer",
    "description": "CPA-CA turned full-stack engineer. Co-founder of Leasey.AI, where he architected the platform's native intelligence layer and leads product development.",
    "image": "[VERIFICAR: URL de foto de Juan, min 400x400px, WebP]",
    "url": "https://www.leasey.ai/author/juan-leal",
    "worksFor": {
      "@type": "Organization",
      "name": "Leasey.AI",
      "url": "https://www.leasey.ai"
    },
    "alumniOf": ["KPMG", "Wishpond Technologies", "The DMZ"],
    "knowsLanguage": ["English", "Spanish", "French"],
    "sameAs": [
      "https://ca.linkedin.com/in/lealjuan",
      "https://www.crunchbase.com/person/juan-leal-d46a",
      "https://rocketreach.co/juan-leal-email_6744086",
      "https://canadiansme.ca/transforming-property-management-juan-and-carlos-leal-on-revolutionizing-leasing-with-leasey-ai/",
      "[VERIFICAR: X/Twitter de Juan]",
      "[VERIFICAR: GitHub de Juan]"
    ],
    "hasCredential": { "name": "CPA, CA (Chartered Professional Accountant)" },
    "homeLocation": { "name": "Vancouver, British Columbia, Canada" }
  }
}


════════════════════════════════════════════════════════════════
CARLOS LEAL — COO
════════════════════════════════════════════════════════════════

SEO Meta
Title: Carlos Leal — COO at Leasey.AI | Leasing Operations Strategist
Meta Title: Carlos Leal | From EY & QuadReal to Automating Leasing (53 chars)
Meta Description: 15+ years in institutional real estate (EY, QuadReal, Aquilini). Carlos Leal co-founded Leasey.AI to automate the leasing funnel for property managers across North America. (155 chars)
Slug: /author/carlos-leal
Photo spec: min 400x400px, neutral background, WebP format, alt="Carlos Leal, COO of Leasey.AI"

────────────────────────────────────────

H1: Carlos Leal
Subtitle: Co-founder & Chief Operating Officer at Leasey.AI

[PHOTO: min 400x400px, neutral background, WebP, alt="Carlos Leal, COO of Leasey.AI"]

Location: Based in Bogotá, Colombia, operating a Canadian startup.

────────────────────────────────────────

H2: About Carlos

I spent 15 years inside institutional real estate before building Leasey.AI. At EY Consulting, I advised firms like Oxford Properties and QuadReal on strategy and operations. Then I moved in-house: QuadReal Property Group, Aquilini Investment Group. Each role showed me the same bottleneck from a different angle: leasing teams buried in manual work, losing qualified leads because nobody picked up the phone fast enough.

I am a licensed Realtor. I have raised capital, managed investor relations, and built client success programmes for portfolios spanning thousands of units. That background is why Leasey.AI's go-to-market runs entirely on inbound: zero ad spend, zero outbound. Every client found us through content, because the content speaks their language.

In 2023, my brother Juan and I founded Silver Homes Technology Inc. (operating as Leasey.AI), backed by DMZ Ventures. I run operations from Bogotá while the company is headquartered in Canada with teams in Vancouver, Toronto, and New York. The Colombia-Canada dynamic is not a quirk; it is how we stay connected to two markets simultaneously.

Today, Leasey.AI helps property managers fill vacancies up to 60% faster with 70% less manual effort. We are post-revenue, currently raising our Seed via SAFE, and focused on Canada and the United States, with UK and Europe planned for 2026.

────────────────────────────────────────

H2: Proof of Work

H3: Enterprise Real Estate Experience
• EY Consulting: advised Oxford Properties and QuadReal on real estate strategy, operations, and technology adoption
• QuadReal Property Group: hands-on portfolio operations across institutional-scale residential and commercial assets
• Aquilini Investment Group: strategy, fundraising, and investor relations for one of Western Canada's largest private investment groups

H3: Leasey.AI Growth & Operations
• Built a 100% inbound acquisition engine through SEO and content (zero ad spend, zero outbound), driving all client acquisition
• Launched performance-based pilot model for enterprise clients (e.g. TEREZ: 0.5 month's rent per signed lease attributable to Leasey)
• Grew the platform to automate approximately 90% of leasing tasks across 48+ marketplace syndications
• Secured backing from DMZ Ventures; currently raising Seed round via SAFE

H3: Industry Recognition
• Featured in CanadianSME: "Transforming Property Management: Juan and Carlos Leal on Revolutionizing Leasing with Leasey.AI" (https://canadiansme.ca/transforming-property-management-juan-and-carlos-leal-on-revolutionizing-leasing-with-leasey-ai/)
• Pitched at Canada House in London as part of international expansion strategy
• [VERIFICAR: agregar otros artículos, conferencias, o premios de Carlos]

────────────────────────────────────────

H2: Topics Carlos Writes About

Carlos contributes to the Leasey.AI blog and LinkedIn with a focus on operational strategy and industry perspective. His content spans:

• Leasing Automation & AI — The business case for automation, ROI frameworks, and operator-level insights on AI adoption.
• Market Insights — Vacancy trends, rental market data, and competitive positioning for property managers.
• Listings & Marketing — Marketplace syndication strategy, listing optimisation, and lead capture.
• Press & Product Updates — Company milestones, partnerships, hiring, and product launches.

View all articles by Carlos Leal → /blog?author=carlos-leal

────────────────────────────────────────

H2: Editorial Standards

Articles published under Carlos's byline reflect his direct operational experience in institutional real estate and the leasing automation industry. AI writing tools may assist with drafting and research, but every claim, data point, and business insight is verified by Carlos or the Leasey.AI editorial team before publication. All statistics cite their original source. No fabricated data, no unsourced claims.

────────────────────────────────────────

JSON-LD Schema (ProfilePage + Person):

{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2026-07-24",
  "dateModified": "2026-07-24",
  "mainEntity": {
    "@type": "Person",
    "name": "Carlos Leal",
    "givenName": "Carlos",
    "familyName": "Leal",
    "jobTitle": "Chief Operating Officer",
    "description": "Licensed Realtor with 15+ years in institutional real estate (EY, QuadReal, Aquilini). Co-founder of Leasey.AI, leading operations, growth, and client success.",
    "image": "[VERIFICAR: URL de foto de Carlos, min 400x400px, WebP]",
    "url": "https://www.leasey.ai/author/carlos-leal",
    "worksFor": {
      "@type": "Organization",
      "name": "Leasey.AI",
      "url": "https://www.leasey.ai"
    },
    "alumniOf": ["EY (Ernst & Young)", "QuadReal Property Group", "Aquilini Investment Group"],
    "knowsLanguage": ["English", "Spanish"],
    "sameAs": [
      "https://ca.linkedin.com/in/carlosaleal",
      "https://www.crunchbase.com/person/carlos-leal-289f",
      "https://rocketreach.co/carlos-leal-email_3034557",
      "https://canadiansme.ca/transforming-property-management-juan-and-carlos-leal-on-revolutionizing-leasing-with-leasey-ai/",
      "[VERIFICAR: X/Twitter de Carlos]",
      "[VERIFICAR: otros perfiles públicos de Carlos]"
    ],
    "hasCredential": { "name": "Licensed Realtor" },
    "homeLocation": { "name": "Bogotá, Colombia" }
  }
}


════════════════════════════════════════════════════════════════
12 E-E-A-T CORRECTIONS APPLIED
════════════════════════════════════════════════════════════════

1. ✅ Heading hierarchy (H1 → H2 → H3)
2. ✅ Meta title (max 55 chars, curiosity-driven)
3. ✅ Meta description (max 155 chars, curiosity-driven)
4. ✅ Extended bio as "data source" with years, credentials, projects
5. ✅ Schema: ProfilePage wrapping Person with dateCreated/dateModified
6. ✅ sameAs: LinkedIn, Crunchbase, RocketReach, CanadianSME (+ placeholders for X/GitHub)
7. ✅ Proof of Work: methodology, concrete projects, measurable results
8. ✅ Content inventory / cross-linking to blog clusters
9. ✅ Editorial / AI disclosure statement
10. ✅ First-person audit: unique bios, not generic PropTech founder copy
11. ✅ Structured geographic anchor
12. ✅ Photo specification: min 400x400px, neutral background, WebP, alt text

Items still marked [VERIFICAR]:
• Photo URLs for both authors (need WebP upload)
• X/Twitter and GitHub profiles for both
• Additional presentations/conferences for both
`;

// Insert all content
const insertRequests = [
  { insertText: { location: { index: 1 }, text: content } }
];

await docs.documents.batchUpdate({
  documentId: DOC_ID,
  requestBody: { requests: insertRequests }
});

console.log('Bios uploaded to Google Doc');
console.log(`Open: https://docs.google.com/document/d/${DOC_ID}/edit`);
