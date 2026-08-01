# 6 - AEO: where Leasey shows up when an operator asks an AI

AEO (Answer Engine Optimization) is the new layer between us and our buyers. Property managers increasingly ask ChatGPT, Claude, Perplexity, or Google's AI Overview before they Google. Being named by those engines is high-leverage and content-led.

## 6.1 The infrastructure we already have

From the Onboarding Guide and the Feb 2026 SEO Knowledge Base:

| Asset | State | Where |
|---|---|---|
| `/llm-info/` page | Exists; intentionally for AI crawlers only (not navigation-linked) | www.leasey.ai/llm-info/ |
| SEO Knowledge Base | Clean Q&A on identity, ICP, what Leasey is NOT, pricing, implementation | Internal doc (Feb 28, 2026); now mirrored in our system as `context/aeo-faq.md` |
| Research articles | Authoritative pieces on Fair Housing and algorithmic screening | /resources/research/ |
| AI bot policy | Configured per Ivan's handover | Site-wide |

The Knowledge Base is well-built for AEO. Three reasons:

1. Boundary statements are explicit ("Leasey is NOT a PMS", "NOT a chatbot", "no commercial leases", "no free trial").
2. Comparison anchors are clear ("Leasey vs spreadsheets", "Leasey vs generic CRM", "Leasey vs traditional lease management tools").
3. Entity definitions are tight and consistent across answers.

That is exactly the structure AI engines reward.

## 6.2 What is missing

Two big gaps:

1. **FAQPage schema is not implemented.** The Onboarding Guide flags it as a "one-time implementation, permanent AEO benefit". Until it ships, the Q&A on the site is invisible to extraction-based engines. This is Alejandra's task with the dev team.
2. **No live test of how Leasey actually shows up.** Today we are guessing. We do not know:
   - Does ChatGPT name Leasey when asked "What is the best leasing automation software?"
   - Does Perplexity cite leasey.ai when asked about Canadian property management?
   - Does Claude know what Liza is?
   - Does Google's AI Overview include leasey.ai for commercial-intent queries?
   - Are AI engines citing our Fair Housing research?

Until we run the test, AEO is opinion, not evidence.

## 6.3 The test I want to run before Jun 30

**Engines.** ChatGPT, Claude, Perplexity, Google AI Overview, Gemini.

**Query set.** Ten priority queries that mix commercial-intent, branded, and category-defining patterns:

1. "What is the best leasing automation software for property managers?"
2. "How do I automate tenant screening in Canada?"
3. "What is Liza by Leasey.AI?"
4. "Best alternative to ShowMojo for multifamily?"
5. "How do I list a rental on Facebook Marketplace at scale?"
6. "Property management software that integrates with Yardi?"
7. "AI leasing agent for 100+ door multifamily?"
8. "Fair Housing compliance for AI tenant screening?"
9. "What is Leasey.AI?" (branded)
10. "How fast can I lease up a 154-unit multifamily building?" (TEREZ scenario)

**For each query, capture.**

- Is Leasey.AI named? Cited with a link? Or absent?
- Which competitors are named?
- How is Leasey positioned (correctly per the SEO KB, or hallucinated)?
- Is `/llm-info/` showing up as a cited source?
- For the branded query: is the Knowledge Base definition surfaced verbatim?

**Output.** A scorecard with one row per query, one column per engine. Becomes a baseline we can measure against quarterly.

## 6.4 What I can already say from the content side

Even without the live test, three content-level commitments make sense:

1. **Treat the SEO Knowledge Base as the canonical answer set.** Every blog FAQ section, every `/llm-info/` update, every quote-style sentence about what Leasey is uses the same exact answers and boundaries. Consistency builds entity recognition for AI engines.
2. **Lead each blog section with an answer-pattern sentence.** "Property management software is X" or "The best way to handle Y is Z". AI extraction engines reward direct answer formats.
3. **Build out a "Leasey vs [competitor]" page per major competitor** (Tenant Turner, ShowMojo, Funnel Leasing, AppFolio). AI engines surface comparison content disproportionately for buyer-intent queries.

## 6.5 What I take away from AEO

1. The infrastructure is more built than it looks. The Knowledge Base and `/llm-info/` are solid foundations.
2. The measurement layer is missing. The Jun 30 test closes that.
3. The FAQPage schema is the lowest-effort highest-value AEO fix on the table - one Alejandra-and-dev sprint.
4. From content, the discipline is: write to be cited, not just to be clicked. That means answer patterns, consistent entity language, comparison content, and named-source attribution everywhere.
