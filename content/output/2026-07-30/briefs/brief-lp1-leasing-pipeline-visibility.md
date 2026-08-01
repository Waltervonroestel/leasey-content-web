# Brief LP1 · Leasing Pipeline Visibility (landing polish)

| | |
|---|---|
| **Live URL** | `https://www.leasey.ai/resources/leasing-pipeline-visibility/` |
| **Notion task** | [Landing: Leasing Pipeline Visibility](https://app.notion.com/p/3a543656a5b381cf93fef3f6b2ba4343) |
| **WordPress post ID** | 27148 |
| **Work type** | Landing polish. The page is already written as a product landing and it works. This is not a rewrite. |
| **Pillar** | Agent, secondary All-in-one |
| **Audience** | Leasing managers, regional managers, finance teams, executives |
| **Consolidations received** | **19** |
| **Author** | **None.** Landings carry no byline (Rule C). |

> The two addenda delivered on 28 July 2026 govern over this brief. Where they disagree with anything below, the addenda win.

---

## 1. Strategy

This page is one of the three most heavily loaded destinations in the entire SEO plan. **Nineteen URLs are scheduled to redirect into it.** That single fact should drive every decision made here.

A page receiving nineteen 301s inherits the accumulated authority of nineteen URLs. If it is weak when that authority lands, the loss compounds twice over: the redirected pages stop earning on their own, and the destination is not strong enough to convert what it receives. Strengthening this page is therefore worth considerably more than strengthening a page with no consolidations pointing at it, even though both take the same effort.

**There is an urgency the Notion spec does not capture.** Part of the consolidation has already happened. `/resources/reporting-analytics-property-management/` already 301s here, verified live on 30 July 2026. The spec says "strengthen it BEFORE executing those 301s", and at least one arrived early. Before planning the remaining redirects, someone should establish how many of the nineteen are already live, because the sequencing advice in the spec is written for a starting position we may no longer be in.

**Order of work, highest impact first:**

1. **Remove the 16 em-dashes.** This is the most explicit non-negotiable rule in the system and the page breaks it sixteen times.
2. **Cut brand density from 2.3% to under 1%.** This is the single biggest readability problem on the page.
3. **Rewrite both meta tags.** Both sit outside their character limits today.
4. **Add the Proof block.** It is the only structurally missing element of the seven-block landing shape.
5. **Fix the literal duplication bug** in the body text.

## 2. Live status of the page (audited on 30 July 2026, not assumed)

| Attribute | Verified state |
|---|---|
| HTTP status | 200, no redirect |
| H1 in the body | **Zero.** The theme renders one from the post title |
| H2 / H3 / H4 | 6 / 10 / 0 |
| Author | Admin (user ID 1) |
| Em-dashes | **16** |
| "Leasey.AI" occurrences | **43** in 1,906 words (density **2.3%**) |
| External links | **0** |
| Internal links | 3, all resolving |
| Figures in body | None |
| Banned hype words | None |
| Demo CTA | Present and working |
| GA4 sessions (90 days) | 0 |
| GSC impressions (90 days) | 0 |
| Ranking keywords | None |

**The heading hierarchy is already clean.** H2 into H3 with no skipped levels and no H4s anywhere. Nothing needs re-levelling, which is unusual in this cluster and worth noting because most sibling pages do need it.

**Literal bug in the body:** the phrase `Leasey.AI's Leasey.AI marketplace syndication` appears in the channel performance section. The brand name is duplicated. Fix on sight.

## 3. Focus keyword

### Recommended: `leasing pipeline management software`

**Rationale, and it runs against the obvious choice.**

The slug phrase, "leasing pipeline visibility", **generates no measurable search demand at all.**

What was verified in Search Console on 30 July 2026, across 90 days:

- The page returns **zero queries**. Not low impressions: none.
- The phrase "pipeline visibility" returns **zero impressions across the entire site**, on any page.

With zero impressions there is no ranking position to report, because position is only measured where impressions exist. The page has no presence in search to improve.

A web search for a longer variant of the phrase does return this page as the first result, which suggests very little competition for that exact wording. **That is not a verified Google ranking position** and it should not be presented as one. It is consistent with the same conclusion reached from the Search Console data: almost nobody uses this phrasing, so almost nobody competes for it, and almost nobody searches it.

This is the clearest example in the cluster of what Addendum 2 warned about: the seven landing keywords were taken from slugs without external volume validation, and slugs are written in internal product language rather than buyer language. Ranking for a phrase nobody types is indistinguishable from not ranking at all. "Pipeline visibility" is how a product team describes a feature. It is not how a regional manager describes the problem at 8am when three units have gone a week without an application.

The top-3 analysis below shows where the demand actually sits: the competitors capturing this audience rank for *lease management software* and *property management dashboard*. Of the phrasings close to that demand, `leasing pipeline management software` stays closest to what this page genuinely offers while keeping the residential leasing specificity that separates us from commercial real estate tools.

⚠️ **Requires external volume validation before approval** using Ahrefs, Semrush, or equivalent. We cannot resolve this internally: Search Console reports nothing for a page that does not rank, so the absence of data is not evidence either way. This is Alejandra's call and it applies to all seven Benefits landings, not only this one.

**"Leasing pipeline visibility" stays** as the H1 and as the phrase used throughout the body. It describes the benefit in the customer's words and it is the page's identity. What changes is which term the meta tags optimise for.

### Secondary keywords

| Keyword | Intent | Where it is reinforced |
|---|---|---|
| leasing pipeline dashboard | Commercial | Block 3, the single-view section |
| property management reporting software | Commercial | Block 6, finance and leadership access |
| lead to lease conversion tracking | Informational to commercial | Block 4, channel performance |
| leasing performance metrics | Informational | Block 5, agent-level metrics |
| real-time leasing reports | Commercial | Block 2, the problem section |

Never blur these with the focus keyword. They shape section copy; they do not appear in the meta tags.

## 4. Top-3 analysis

Search performed 30 July 2026.

| Position | Page | Format | Angle | Sources | Weakness |
|---|---|---|---|---|---|
| 1 | leasey.ai (this page) | Product landing | Real-time visibility of the residential pipeline | **None** | Zero proof, brand density 2.3%, 16 em-dashes. Appears first only because almost nobody uses this wording |
| 2 | [VTS Lease](https://www.vts.com/vts-lease) | Product landing | Portfolio analytics, deal trends, tenant sentiment, portfolio risk | Not visible | **Commercial real estate**, so it does not compete for our buyer. ⚠️ The page returns 403 to automated access and could **not be read at source**. This row rests on its public positioning, not on reading it |
| 3 | [Buildium, best lease management software](https://www.buildium.com/blog/best-lease-management-software/) | Listicle | Comparison of six lease management tools | Vendor claims | Opened and read on 30 July 2026. Its only analytics wording is generic, advanced analytics that help managers make informed decisions. **No stage-level diagnostics at all** |

### Opportunities for Leasey.AI

**Neither competing page treats the pipeline as an operational diagnostic.** Buildium was opened and read: it compares six tools and its only analytics claim is generic. VTS could not be read at source, but it is a commercial real estate product, so residential stage diagnostics sit outside its scope by definition. Neither explains how to read time-in-stage in order to decide *which intervention to apply*. That distinction, between a deal stalled at screening and a deal stalled at docs-out, is exactly what a regional manager needs.

This page already has that section. The work is to raise it and sharpen it, not to invent something new. That is the single most valuable insight in this brief.

**Second opportunity: the competing pages argue in the abstract.** Buildium, the one page read in full, never anchors to a concrete operator scenario. House rules require anchoring to a real situation rather than a generality, and doing so here is a genuine differentiator rather than a stylistic preference.

**Third opportunity: sourcing.** Buildium cites no independent source for its framing, and vendor landings in this category rarely do. Citing one costs a single link and is a credibility signal that is cheap for us and awkward for a vendor to copy.

## 5. Meta tags

**The Notion spec says the current meta title is correct and should be kept. It is not.** It measures **79 characters against a 55 limit**, 24 over. The description measures **196 against a 155 limit**, 41 over. Hard rule 4 explicitly prohibits proposing to keep a title or description that breaks these limits.

**Meta title (48 characters):**
`Leasing Pipeline Management Software | Leasey.AI`

**Meta description (152 characters):**
`See every lead, showing, and application across your portfolio in one live dashboard. Find the stage where deals stall, and coach the team that owns it.`

The description leads with the outcome and closes with the action a manager takes. It carries the focus keyword concept without stuffing the exact phrase, which reads better in a SERP.

## 6. Structure to publish (the fixed seven-block landing shape)

Every Benefits landing follows the same shape. Only the content changes.

**H1: `Leasing Pipeline Visibility`**
Keep as is. **Do not add an H1 to the body.** The theme already renders one from the post title, so adding another produces two H1s on the page. See correction 1.

---

**Block 1. Summary paragraph**
*One paragraph, three lines maximum, zero links.*

Rewrite the current opening. It runs five lines and repeats the focus phrase three times. The first sentence must answer the search intent directly: who this is for and what they get. State the audience explicitly, because this page serves four distinct roles and a reader needs to recognise themselves immediately.

---

**Block 2. The problem**

**H2: `Manual Leasing Operations Surface Problems Weeks After They Start`**
Keep verbatim. This is the strongest heading on the page: it names the pain in operational terms rather than product terms, and the delay framing is what makes the rest of the page necessary.

- **H3: `How reporting lag delays corrective action`**
  Keep. Covers the gap between a problem starting and leadership seeing it, and why that gap costs vacancy days.
- **H3: `What a live pipeline makes visible that manual reports miss`**
  Keep the content, drop the brand repetition from the heading. Covers uncontacted leads, stalled deals, units accumulating showings without applications, and falling agent throughput.

---

**Block 3. The solution, part one**

**H2: `Every Deal at Every Stage, in One View`**
Replaces `The Leasey.AI Pipeline Shows Every Deal at Every Stage`. The current heading opens with the brand name, which is both keyword stuffing and weaker copy. The benefit belongs in the heading; the brand belongs in the body.

- **H3: `Reading time-in-stage as an operations diagnostic`**
  Keep. This is the best section on the page. Expand it if anything.
- **H3: `How stage-level conversion identifies the right intervention`**
  Keep. Covers the diagnostic logic: screened-to-approved points at underwriting, showing-to-application points at prospect experience or the unit itself.

---

**Block 4. The solution, part two**

**H2: `Channel Performance Shows Which Sources Produce Signed Leases`**
Keep. The distinction between inquiry volume and signed-lease outcomes is a real argument and the heading carries it.

- **H3: `Measuring lead-to-lease conversion by source channel`** Keep.
- **H3: `How channel data shapes listing distribution`** Keep, shortened.

---

**Block 5. The solution, part three**

**H2: `Agent-Level Metrics Enable Specific Coaching`**
Keep, shortened from the current version.

- **H3: `What agent-level metrics reveal about individual performance`** Keep.
- **H3: `How performance data helps standardise best practice`** Keep. Note the British spelling: **standardise**, not standardize.

---

**Block 6. The solution, part four**

**H2: `Finance and Leadership Access the Data Without Asking`**
Keep. This block targets a different buyer from the rest of the page and it earns its place.

- **H3: `What finance teams need from leasing reporting`** Keep.
- **H3: `How live dashboards replace the monthly reporting cycle`** Keep.

---

**Block 7. Proof** ← **NEW BLOCK. Does not exist today.**

**H2: `The Scale That Makes Manual Reporting Untenable`**

This is point 5 of the fixed landing structure and the only structural element missing from the page. Two sourced external figures plus one client testimonial. Full specification in section 7.

Keep it short. Three or four sentences and the diagram. A proof block that runs long reads as defensive.

---

**Block 8. CTA**

**H2: `See the Live Pipeline Dashboard in Action`**
Keep. It works, it is specific, and it names what the reader will see.

⚠️ **The CTA link is blocked.** `/get-started/` returns a 301 to the homepage. Until a canonical CTA destination is decided, the CTA text ships without a link. See blockers.

## 7. Figures and sources (Rule D)

**The page currently contains no figures at all.** That means the Proof block is built from scratch, which is precisely the condition under which invented statistics appear. Treat this section as binding.

### Approved figures, verified at source on 30 July 2026

| Figure | Source | Deep link | Verification note |
|---|---|---|---|
| The 50 largest apartment managers in the United States oversee **23.7%** of the national apartment stock | 2026 NMHC 50 Survey | https://www.nmhc.org/research-insight/the-nmhc-50/faqs-about-the-nmhc-50/ | Read directly from the page source. The site is JavaScript-rendered, so a summariser returns only the title |
| Greystar alone manages **more than 1 million units** (1,014,091) | 2026 NMHC 50, Top Managers | https://www.nmhc.org/research-insight/the-nmhc-50/top-50-lists/2026-top-managers/ | Verified in the published ranking table |

Both figures frame the same argument: at that concentration, a weekly manual reporting cycle cannot keep pace. They establish the problem. **They do not promise a result**, and the copy must not bend them into one.

⚠️ **Do not cite the 2025 edition.** The 2025 survey reports 21.4%, not 23.7%, and Greystar at 946,742 units. Mixing the percentage from one year with the unit count from another produces a sentence where each half is defensible and the whole is false. That exact error was found and corrected in the Centralized Leasing pillar on 30 July 2026.

### Self-sourced product data (permitted, must be declared as our own)

- Listing syndication to **48+ marketplaces**
- The channels named on the page: Zillow, Apartments.com, Zumper, Facebook Marketplace, Kijiji, Realtor.com, Trulia, HotPads, and Rental Beast
- The six pipeline stages: new inquiry, contacted, screened, approved, docs out, and signed

### Prohibited

Any figure for conversion improvement, vacancy-day reduction, or time saved that does not come from an identifiable client with permission to be quoted. These are the numbers that write themselves, and they are the ones a buyer repeats to their own leadership.

**If the only source for a figure is another leasey.ai page, it is not a source.** That is circular self-citation and it is a blocker, not a caution.

### Preferred proof: a real client quote

The Testimonial Tracker holds a quote from **David Betesh, Rockwell Properties LLC** that maps directly onto this page's argument: lead organisation, conversation tracking, and improved response time. Use it verbatim and contiguous, cut only at a genuine sentence boundary. Never paraphrase a real client.

## 8. Visual specification

**One SVG diagram.** Vector rather than raster: the text stays selectable and indexable, the file lands around 5 to 15 KB rather than 100 KB, and it scales cleanly on mobile.

| Attribute | Specification |
|---|---|
| Subject | The six pipeline stages left to right, with time-in-stage shown as the measurement read between them |
| Dimensions | 1200 × 630 |
| Format | SVG source, exported to WebP for upload |
| Palette | Brand navy and the brand accent, on a light ground |
| Alt text | `Diagram of the six leasing pipeline stages from new inquiry to signed lease, showing time-in-stage measured between each` |
| Placement | Inside Block 3, directly after the first paragraph |

**Do not use product screenshots.** They date with every release and Alejandra asked for diagrams and infographics instead. **Do not put invented numbers on the diagram.** If a value cannot be sourced, the diagram shows the shape of the relationship without magnitudes.

## 9. Cluster interlinking, three layers

**Layer 1, hub to child.** `/benefits/` returns **404**. The hub does not exist, so the card linking into this page cannot be created. Blocked.

**Layer 2, child to hub.** Breadcrumb return link, blocked by the same 404.

**Layer 3, sibling pages.** All verified on 30 July 2026, all returning 200 with no redirect:

| Target | Anchor context |
|---|---|
| `/resources/multi-property-listing-consistency/` | Where consistency across properties is mentioned |
| `/resources/centralized-leasing/` | Where the shared-team model is referenced |
| `/showing-scheduler/` | In the stage discussion, at showing scheduled |
| `/tenant-screening/` | In the stage discussion, at screened |

**Product interlink:** `/smart-rent-pricing/` (200 verified) connects pipeline data to the pricing decision, which is the natural next question after reading channel performance.

**Do not link:** `/resources/reporting-analytics-property-management/`. It **already 301s to this page**. A link that redirects back to the page containing it returns 200 and passes any superficial check, which is exactly why it needs flagging here.

## 10. Writing rules

**Language and typography**
- British English throughout. Watch for **-ize** endings: standardise, prioritise, optimise, organise.
- Oxford comma.
- "Leasey.AI" with that exact capitalisation.
- **Zero em-dashes.** There are 16 today. Use commas, brackets, or full stops.

**Brand density, the biggest copy problem on this page**
- Currently 43 mentions in 1,906 words, a density of 2.3%. Target: **under 1%**, roughly 15 to 18 mentions.
- **Rule: one "Leasey.AI" per H2 section at most.** Everywhere else use a natural subject: the dashboard, the platform, the pipeline, or simply it.
- Strings such as "Leasey.AI's pipeline dashboard, Leasey.AI's stage-level data, Leasey.AI's reporting builder" across consecutive paragraphs are keyword stuffing and read as machine-written.
- Fix the literal bug: `Leasey.AI's Leasey.AI marketplace syndication`.

**Structure**
- Paragraphs of four lines maximum, one idea each, active voice.
- Bold only the key phrase a scanner needs, a concept or a figure, never a whole sentence. Two or three per H2 at most.
- Intro paragraph: three lines maximum, zero links, answers intent in the first sentence.

**Length**
- Rule 18 does **not** apply. This is a landing, not an article. Length is driven by conversion, not word count. Current length is roughly right; the work is density, not volume.

**Banned words:** streamline, seamless, unlock, empower, robust, transform, game-changer.

## 11. Corrections to the Notion spec

**1. "Create the H1 (the title is currently an H2)" is wrong, and wrong in a way that would cause damage.**
The body contains **zero H1 elements**. The theme renders the H1 from the post title, so the page already has exactly one. Following the instruction would produce **two H1s**, which is worse than the problem it intends to fix. Rule B is already satisfied. This same error appears in all three landing specs and was found and corrected on two published articles on 30 July 2026.

**2. "CURRENT META TITLE (correct, keep)" is wrong.**
79 characters against a 55 limit. The description is 196 against 155. Both are rewritten in section 5.

**3. The authorship instruction was resolved against the spec.**
This spec says "change to Carlos or Juan". **Walter's decision, 30 July 2026: landings carry no author.** Rule C governs. The "Admin" byline is removed and not replaced. This matches the Task 1 spec, which already said so, and it avoids the separate problem that neither Juan Leal nor Carlos Leal exists as a WordPress user.

**4. "Strengthen it BEFORE executing those 301s" arrived late in at least one case.**
`/resources/reporting-analytics-property-management/` already redirects here. Establish how many of the nineteen are already live before planning the rest.

## 12. Blockers

| Blocker | Effect | Owner |
|---|---|---|
| `/benefits/` returns **404** | Interlinking layers 1 and 2 cannot be built. The hub is written and unpublished at `output/2026-07-24/hubs/benefits-hub.md` | Technical / Walter |
| `/get-started/` returns **301** to the homepage | The canonical CTA has no destination. Every landing in the cluster is affected | Product / Alejandra |
| `/integrations/` returns **404** | Appears in the site menu but cannot be linked | Technical |
| Focus keyword volume unvalidated | Needs Ahrefs or Semrush. Applies to all seven Benefits landings | Alejandra |
| Consolidation status unknown | Some of the 19 have already run. Sequencing advice may be based on a stale starting position | Alejandra |

## 13. Definition of done

Before this page is handed back, all of the following must be true:

- [ ] Zero em-dashes in the published body
- [ ] Brand density under 1%, verified by count
- [ ] Both meta tags within limits, character counts stated and independently verified
- [ ] Exactly one H1 on the rendered page
- [ ] Proof block present with both figures deep-linked to the exact resource
- [ ] Every figure traced to a source that was opened and read, not to a search summary
- [ ] Client quote verbatim and contiguous against the Testimonial Tracker
- [ ] The `Leasey.AI's Leasey.AI` duplication removed
- [ ] No link to `/resources/reporting-analytics-property-management/`
- [ ] Author byline removed, none added
- [ ] `scripts/qa-briefs.mjs` returns no mechanical findings
- [ ] `link-verifier`, `source-verifier`, `brief-compliance`, and `editor-qa` all clear
