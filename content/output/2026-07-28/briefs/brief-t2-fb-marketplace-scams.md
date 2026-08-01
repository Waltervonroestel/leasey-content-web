# Brief T2 · Facebook Marketplace Rental Scams

**Date:** 28 July 2026
**Language:** British English, Oxford comma, zero em-dashes.
**Status:** corrected version. The canonical recommendation of the previous version has been reversed with Search Console evidence. See "Corrección de la versión anterior" at the end.

---

# PART 1 · UNBLOCKING AND CANONICAL DECISION

## The block has expired

The task was marked BLOCKED because "3 pages compete for the same topic". That premise is **no longer true**.

The URL in the SEO report, `/benefits/facebook-marketplace-rental-scams-how-to-identify/`, returns **404**. The entire `/benefits/` section migrated to `/resources/`. Of the successor URLs, only two resolve to distinct live pages:

| URL | Status | Result |
|---|---|---|
| `/resources/overcoming-rental-scams-facebook-marketplace/` | **200, live** | Case study |
| `/resources/landlords-avoiding-facebook-marketplace-rentals/` | **200, live** | Alternatives guide |
| `/resources/renter-scam-protection-apartment-seekers/` | 301 | to the alternatives guide |
| `/resources/tips-avoid-scams-facebook-marketplace-rentals/` | 301 | to the alternatives guide |

**Two pages are live, not three.** The original block has expired and the task is unblocked.

## The canonical is the case study

**Canonical = `/resources/overcoming-rental-scams-facebook-marketplace/`.**

**The alternatives guide is NOT consolidated into it. No 301 is fired in either direction.** It serves a different intent and stays as an independent page.

The deciding criterion is the one that has always governed this work: **nothing that holds keywords is lost**. Search Console, 90 days, pulled directly from the API, settles it.

**Live verification.** Both keyword tables below were re-pulled directly from the Search Console API against `https://www.leasey.ai/`, window **30 April 2026 to 29 July 2026** (90 days), dimension `query`, page filter `contains` the relevant slug. **All 14 keywords in the case study table and all 6 in the alternatives guide table returned live rows at the positions and impressions shown.** Nothing in either table is inflated and nothing was removed. The local repository export is stale and was not used.

### What the case study actually ranks for

| Keyword | Position | Impressions |
|---|---|---|
| facebook marketplace rental scam red flags | **9.7** | 3 |
| facebook marketplace rental scam | 14.0 | 3 |
| how to spot rental scams on facebook marketplace | 14.1 | 17 |
| facebook marketplace housing scams | 15.0 | 1 |
| rent scams on facebook | 17.4 | 5 |
| facebook marketplace rental scams | 19.6 | **19** |
| facebook marketplace apartment scams | 20.0 | 4 |
| facebook rental scams | 20.5 | 18 |
| facebook rental scam | 20.7 | 3 |
| apartment scams on facebook | 21.0 | 2 |
| facebook marketplace rent scams | 27.0 | 1 |
| fb marketplace rental scams | 41.0 | 1 |
| is facebook marketplace safe for rentals | 43.0 | 1 |
| facebook marketplace rental property automation | 88.3 | 19 |

**Fourteen keywords on the theme, and the only top-10 position on the whole block, sit on the case study.** "facebook marketplace rental scam red flags" at 9.7 is the "1 keyword in top 10" that the SEO report counted without naming.

### What the alternatives guide actually ranks for

| Keyword | Position | Impressions |
|---|---|---|
| best alternatives to facebook for property rentals | **5.5** | **29** |
| are rentals on facebook marketplace legit | 10.8 | 6 |
| are rental listings on facebook marketplace legit | 15.5 | 2 |
| are facebook marketplace rentals legit | 16.5 | 2 |
| are apartments on facebook marketplace legit | 21.5 | 4 |
| are facebook marketplace apartments legit | 29.0 | 5 |

All six verified live in the same API pull, 30 April to 29 July 2026.

Every one of those is a **renter verifying whether a specific advert is real**. None of them is a property manager defending their own listings. Its highest-impression query is `burgessproperties.com facebook ads count`, 1,634 impressions at position 9.1, which is **navigational noise for somebody else's brand** and carries no commercial value to Leasey.AI.

**Two different intents, two different audiences, two pages. Consolidating them would merge a renter-verification page into an operator-defence page and damage both.**

## Correction to argument 2 of the previous version

The previous version of this brief argued, as its second reason for choosing the alternatives guide:

> "A is a case study, a different content type entirely, and case studies do not hold identification-intent keywords. Making a case study the canonical for 'how to identify' queries would strand the very rankings we are trying to protect."

**That argument is wrong and the Search Console data disproves it directly.** It is being corrected here in the open rather than quietly deleted, because the reasoning was plausible and somebody will repeat it otherwise.

Three facts kill it:

1. **The case study holds the identification keywords.** "how to spot rental scams on facebook marketplace" (pos 14.1, 17 impressions) and "facebook marketplace rental scam red flags" (pos 9.7) are pure identification intent and they live on the case study.
2. **The case study holds the only top-10 keyword on the block**, and it is an identification keyword.
3. **The alternatives guide holds none of them.** Its cluster is "are these listings legit", which is a verification question, not an identification method.

The theoretical claim about content types lost to measured behaviour. **What a page ranks for is decided by what Google observes, not by what content-type label the page carries.** The lesson generalises: on any future canonical decision in this block, the query export is pulled before the argument is written.

## The alternatives guide keeps its own life

It is not redirected, not merged, and not deprecated. It keeps its own focus (`best alternatives to facebook for property rentals`, pos 5.5, its strongest genuine keyword) and it earns an internal link from the canonical for readers who arrive on the verification question. **No content moves off it.**

---

# PART 2 · OPTIMISATION BRIEF

**Page:** Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools
**URL:** https://www.leasey.ai/resources/overcoming-rental-scams-facebook-marketplace/
**Work type:** Optimise, protect and add. No rewrite.
**Page type:** Resource article, case study format, **carries an author** (Rule C below).
**Ranking keywords:** 14 on the theme, of which **1 sits in the top 10**.
**Consolidations:** none. No 301 in or out.

---

## Strategy

This page holds every keyword worth holding on the topic and it is the only page on the block with a page-one position. Everything else is secondary to not breaking it. Three moves:

1. **Protect.** Every H2 and H3 that holds a keyword stays verbatim and in place. The single exception is the pair of identical H2 strings, which consolidate into one, and that is not a deletion.
2. **Correct.** Remove the unsourced figures, replace two with real sources, fix both meta fields, fix the byline, and reframe the competitor mentions that read as anti-scam endorsements.
3. **Add.** Insert the operator-defence angle, an SVG comparison, and an FAQ block that captures the question keywords the page already brushes.

---

## Focus keyword

**Focus: `facebook marketplace rental scams` · position 19.6 · 19 impressions**

**Secondary, ordered by priority:**
1. `facebook marketplace rental scam red flags` · pos **9.7** · the top-10 holder, protected above everything
2. `how to spot rental scams on facebook marketplace` · pos 14.1 · 17 impressions
3. `facebook rental scams` · pos 20.5 · 18 impressions
4. `facebook marketplace rental scam` · pos 14.0
5. `rent scams on facebook` · pos 17.4
6. `facebook marketplace housing scams` · pos 15.0
7. `facebook marketplace apartment scams` · pos 20.0
8. `is facebook marketplace safe for rentals` · pos 43.0 · FAQ target
9. `facebook marketplace rental property automation` · pos 88.3 · 19 impressions, product-intent, addressed in the product section

### Why the focus is the head term and not the top-10 keyword

The obvious move would be to make `facebook marketplace rental scam red flags` the focus, because at 9.7 it is the closest thing the page has to page one. **That is the wrong call, and here is the argument.**

- **It is a long tail with 3 impressions in 90 days, per Search Console.** Position 9.7 on a query with that little demand is a ranking, not traffic. Optimising the whole page around it caps the ceiling at roughly its current volume.
- **`facebook marketplace rental scams` is the semantic head of the cluster.** Eight of the fourteen ranking queries are morphological variants of it: singular, plural, "fb", "rent scams", "housing scams", "apartment scams". Moving the head term from 19.6 towards page one **pulls the variants with it**, because they share the same intent and the same page. Moving a single long tail moves nothing else.
- **It carries the joint-highest impressions on the page (19)**, tied with the automation query, and it is the only one of the two that is on-topic.
- **The red-flags keyword is protected as the top secondary, not sacrificed.** Its section stays verbatim, it gets the SVG, and it becomes the target of a dedicated FAQ question. **A top-10 position is defended by leaving the section that earns it alone, not by putting the phrase in the meta title.**

**Intent:** informational shading into commercial, split between renters checking a listing and property managers whose listings are being cloned. The page keeps both, and the operator half is the one that converts.

**The old "volume not retrievable" limitation is gone.** Positions and impressions above come from a direct Search Console API pull, 90 days.

---

## Top-3 Google analysis

SERP checked for `facebook marketplace rental scams`, July 2026.

**Position 1 · consumer.ftc.gov/articles/rental-listing-scams** (fully fetched, **HTTP 200**, plain server-rendered HTML)
- **Format:** government consumer advice article.
- **H1:** `Rental Listing Scams`
- **H2s:** `How Rental Scam Ads Work` · `How To Tell Whether a Rental Listing Is Real` · `Protect Your Personal Information and Money` · `Report Problems`
- **H3s: none.** The article body runs H1 to H2 only, with the detail carried in prose and bullet lists rather than a third heading level.
- **Sources:** none cited externally. It is the primary authority, so it cites itself, and it carries no figures at all in the body.
- **Weakness:** written for renters only, end to end. The structure proves it: every H2 addresses the person about to hand over a deposit. Nothing addresses the party whose listing was cloned. `Report Problems` routes the reader to ReportFraud.ftc.gov, which is a reporting path, not a prevention path for an operator.

**Position 2 · equifax.com · "Rental Fraud: How to Spot & Avoid Rental Scams"**
- **Format:** brand education article from a credit bureau.
- **Structure: NOT VERIFIABLE, and the reason matters.** The page returns **HTTP 200, not 403**. It is not blocking us. The body is rendered client side: the delivered HTML carries roughly 61,000 characters of script against roughly 8,800 characters of visible text, and every `h2` present in the source belongs to site navigation or product promotion (`Credit Scores`, `Fraud & Identity Theft`, `Debt Management`), not to the article. **No article headings exist in the fetched document, so none are claimed here.** The conclusion of the previous version was right; its stated reason was wrong and is corrected.
- **Weakness (inferable from the SERP title and the surrounding page furniture, not from the article body):** identity-theft framing, renter-facing, funnels towards credit monitoring rather than listing control.

**Position 3 · ziprent.com · "How to Avoid Rental Scams: Stay Safe on Craigslist and Facebook"** (fully fetched)
- **Format:** property-management company blog, roughly 2,200 words.
- **H1:** How to Avoid Rental Scams: Stay Safe on Craigslist and Facebook
- **H2s:** How do Rental Scams Work? · Rental Fraud Red Flags · Platform-Specific Dangers · Ziprent's Safeguards · Conclusion · Property Management Services Near You
- **H3s under Red Flags:** Prices that are Too Good to Be True · Typos, Poor Grammar, and Excessive Punctuation · MLS Watermarks · No Tenant Screening Processes · Requests for Personal Information or Money Before Viewings · Untraceable Payment Methods · Unverifiable Property Rental Statuses · Unconventional Requests. **H3s under Platform-Specific Dangers:** Craigslist Rental Scams · Facebook Marketplace Rental Scams.
- **Sources: none.** Zero external citations.
- **Weakness:** renter-facing again, and entirely unsourced, so it wins on structure rather than on evidence.

**Opportunities for Leasey.AI**

**Scope of these statements.** These are observations about pages I opened and read directly, not about the SERP as a whole, and none of them is a Search Console measurement. Two of the three competitors were read in full: the FTC page (**verified 200**, server-rendered) and the Ziprent page (**verified 200**, fully fetched). The Equifax article body could not be read, so it is excluded from every claim below. **Each opportunity is bounded to the pages actually opened, and none of them generalises to the whole SERP.**

1. **Both pages read speak to renters. Neither speaks to the property manager whose listing was cloned.** On the FTC page this is visible in all four H2s; on Ziprent it is visible in the red-flag H3s, which are all buyer-side checks. Empty lane on the evidence available, and it is our ICP.
2. **Neither of the two pages read cites a single external figure.** The FTC carries no numbers in its body and Ziprent carries no citations at all. Two deep-linked, in-date figures (FTC data spotlight, NMHC) beat both of them on evidence. Equifax is unknown and is not counted either way.
3. **Neither page read connects detection to prevention.** Both end at "be careful", with the FTC adding a reporting route. We end at "publish the official listing everywhere first, so the clone has to compete with a verified original".
4. **We already hold a real case narrative.** Neither of the two pages read has one. That is the format advantage the previous version of this brief mistook for a liability.

---

## Meta

**Meta title · 49 characters:**
`Facebook Marketplace Rental Scams: Operator Guide`
Character count: 49. Limit 55. **Focus keyword sits first.** Replaces the current title, which breaks the limit.

**Meta description · 149 characters:**
`Facebook Marketplace rental scams clone your real listings. See how property managers spot the fakes and publish official listings that outrank them.`
Character count: 149. Limit 155. **Focus keyword opens the first sentence.**

**H1 (Rule B):**
`Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools`
**The H1 already exists, is correctly rendered as H1, and holds ranking keywords. It is not touched and no ticket is raised for it.**

---

## Heading structure and section to keyword map

The live audit of the canonical: 1 H1, 9 H2, 5 H3, **zero H4/H5/H6**. Author signature: LeaseyEditor. CTA: "Book a free demo", with no free-trial language anywhere.

Every heading below is KEEP verbatim unless marked otherwise. New blocks are INSERTED, never substituted.

| # | Heading (level) | Status | Keyword(s) it holds |
|---|---|---|---|
| H1 | Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools | KEEP verbatim | **facebook marketplace rental scams**, facebook marketplace rental scam |
| H2 1 | Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools | **KEEP, absorbs the duplicate at position 3** | head-term cluster |
| H2 2 | Understanding the Root Causes of Rental Scams | KEEP verbatim | rent scams on facebook, facebook marketplace housing scams |
| ~~H2 3~~ | ~~Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools~~ | **CONSOLIDATE into H2 1. Its body text is retained in full and moved under H2 1.** | none uniquely |
| H2 4 | Navigating Safety Settings for Marketplace Rentals | KEEP verbatim | is facebook marketplace safe for rentals, safety long tails |
| **NEW H3** | **The eight red flags that separate a real listing from a clone** | INSERT under H2 4 | **facebook marketplace rental scam red flags (pos 9.7, protected)**, how to spot rental scams on facebook marketplace |
| H2 5 | Using Advanced Tools to Identify Fraudulent Listings | KEEP verbatim | how to spot rental scams on facebook marketplace, facebook marketplace rental property automation |
| **NEW H2** | **When the clone carries your building's name** | INSERT after H2 5 | cloned rental listings, operator-intent long tails |
| H2 6 | Success Stories and Lessons from the Marketplace | KEEP verbatim | outcome long tails |
| H2 7 | Analyzing the Impact of Facebook Marketplace on Rental Scams | KEEP verbatim | facebook rental scams, facebook marketplace apartment scams, apartment scams on facebook |
| **NEW H2** | **Publishing the official listing first** | INSERT after H2 7 | facebook marketplace rental property automation, product angle |
| **NEW H2** | **Frequently asked questions** | INSERT before the CTA blocks | question keywords, PAA capture |
| H2 8 | Real numbers. Your portfolio. | KEEP verbatim | conversion block |
| H2 9 | Go live in under a week. | **KEEP the heading, see the note below** | conversion block |

**Hierarchy: the page has zero H4, H5, and H6 today and it stays that way. H1 to H2 to H3 only.** The five existing H3s keep their current positions and wording.

**Regla A applied to the duplicate.** The string "Case Study: Overcoming Rental Listing Scams Using Facebook Marketplace Tools" appears as **H2 number 1 and H2 number 3**. These consolidate into one H2. **No content is lost: the body text sitting under the second instance moves intact under the first.** Two identical heading strings cannot hold two different keywords, so removing the repetition removes no ranking surface. This is a consolidation, not a deletion, and Regla A is satisfied.

**Note on H2 9, "Go live in under a week."** This is the site-wide template block flagged in the adenda (present on all 8 `/resources/` pages checked). **The heading is not edited from this brief.** It is a business decision above page level: either the company substantiates the timeline once and it becomes an attributed Leasey.AI product figure, or it comes out of the template in a single change. Raised again in Bloqueos.

---

## The angle to keep (the spine of the new sections)

Scammers clone real listings on Facebook Marketplace. The property manager finds out not from Facebook but from **prospects ringing them, angry, having lost a deposit to somebody using their name and their building's name**. The manager's reputation is being spent by somebody else.

The answer is not moderation, which the manager does not control. It is **occupancy of the channel**: Leasey.AI publishes the official listing directly to Facebook Marketplace as part of syndication to **48+ marketplaces**, so the verified original is present, current, and correctly priced, and the clone has to compete with it rather than stand alone. Leasey.AI also handles the inbound leads without opening Facebook, which is what makes it sustainable across a portfolio.

**This spine already exists on the page.** It is the case study's own narrative. The work is to sharpen it and give it its own heading, not to import it from elsewhere.

---

## Content to rescue and keep

Nothing is being moved off this page and nothing is being merged into it. What follows is what must survive the edit intact:

- **The case narrative.** The property manager who discovers clones of their own listings and starts fielding complaints from defrauded prospects. It is the reason this page ranks and it exists nowhere else on the site.
- **The remediation sequence.** What the manager did in response. Keep the operational steps; every invented percentage attached to them is deleted (see Figures).
- **The platform breadth.** The page names Zillow, Apartments.com, Trulia, Craigslist, Redfin, HomeAdvisor, Rent.com, CoStar, and Realtor.com. Keep only those that are genuine syndication destinations or genuine scam vectors, and reframe each per the section below. Drop the rest rather than padding a list.
- **The body text under the duplicated H2.** Moves under the surviving instance, word for word.

---

## FAQ (NEW block)

Each H3 is an exact-match question phrasing. Two of them map to queries the page already ranks for, which is why they are first.

- **H3: How do I spot rental scams on Facebook Marketplace?** Targets `how to spot rental scams on facebook marketplace`, pos 14.1, 17 impressions. Highest-volume identification query on the page.
- **H3: Is Facebook Marketplace safe for rentals?** Targets `is facebook marketplace safe for rentals`, pos 43.0. Currently the weakest ranking of the cluster and the easiest to move, because no section on the page answers the question directly today.
- **H3: What are the red flags of a Facebook Marketplace rental scam?** Reinforces the pos 9.7 keyword with an exact-match question without touching the section that earns it.
- **H3: What should I do if somebody clones my rental listing?** The operator answer nobody on the SERP gives. Owns the empty lane.
- **H3: Can you get your money back from a rental scam?** PAA question that pulls renter traffic. Answer points to the FTC reporting route.
- **H3: Does Leasey.AI publish listings to Facebook Marketplace?** Yes, as part of syndication to 48+ marketplaces, with lead handling that does not require opening Facebook. Answer-engine capture for the product question, and the landing point for `facebook marketplace rental property automation`.

---

## Figures: change by change (Rule D)

**Eleven unsourced figures sit on this page. Two are replaced with real, sourced figures. One replacement was withdrawn at verification (see below). Eight are deleted outright.** Nothing is kept conditionally and no `[VERIFY]` marker remains.

### Salvaged with a real source (2)

| Current claim | Replacement | Source, deep linked |
|---|---|---|
| "97% of property managers have seen tenant fraud" | **93.3% of operators surveyed reported experiencing fraud in the past twelve months, and of those, 84.3% saw applicants falsifying or fabricating pay stubs, employment references, or other income documentation. That is roughly 78.7% of all operators surveyed.** Attribute in text as "according to the NMHC Pulse Survey on rental application fraud, published January 2024". Survey of 75 apartment owners, developers, and managers, fielded 15 Nov 2023 to 9 Jan 2024. | https://www.nmhc.org/research-insight/research-report/nmhc-pulse-survey-analyzing-the-operational-impact-of-rental-application-fraud-and-bad-debt/ |
| "15,000 cases reported in 2022" | **Nearly 65,000 rental scam reports and about $65 million in losses, January 2020 to June 2025, median reported loss $1,000. About half of the people reporting a rental scam in the twelve months to June 2025 said it started with a fake Facebook advert.** | https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/12/rental-scams-hit-home-65-million-reported-losses |

### Withdrawn at verification (1)

| Claim previously scheduled to publish | Status | Why |
|---|---|---|
| "74% of 300 UK Facebook Marketplace listings analysed carried at least one scam indicator, and 56% used photos lifted from other sites", attributed to Generation Rent, October 2023 to April 2024 | **NOT VERIFIABLE. DO NOT PUBLISH.** | Two independent failures. First, `https://www.generationrent.org/2024/11/06/most-facebook-marketplace-rental-listings-appear-to-be-scams/` returns **HTTP 403** to fetch, so the wording of the figure could not be checked against the source. The previous version recorded this URL as 200 in the link table, which was wrong. Second, even if it opened, **it is United Kingdom data on a page written for the United States and Canada**, so it would fail the market rule regardless. |

**Consequence for the figure it was meant to replace.** The unsourced claim on the live page, "3,000 fraudulent rental listings each month in 2022", was scheduled to be swapped for the Generation Rent numbers. With the replacement withdrawn, **there is nothing to swap it for, so it is deleted outright rather than replaced.** The running total becomes: eleven unsourced figures, **two replaced with sourced figures, nine deleted**.

**The SVG diagram no longer carries "the Generation Rent indicators".** Its central checkpoint strip uses the red flags documented on the page itself and on the FTC's `How To Tell Whether a Rental Listing Is Real` section, both of which were read directly. See the Visual section.

**Which NMHC number, and why the denominator is now stated.** The previous version published "84.3% of operators reported applicants falsifying pay stubs". **That sentence has the wrong denominator and it is corrected here.** Read at source, the NMHC survey says that 93.3% of respondents experienced fraud in the past twelve months, and that **the 84.3% is a share of that 93.3%, not of the whole sample**. Written as "84.3% of operators", the figure overstates the incidence by roughly six percentage points. The corrected sentence therefore carries both numbers and their relationship, or, where a single number is needed for rhythm, **roughly 78.7% of all operators surveyed**, which is 84.3% of 93.3%. **Never write "84.3% of operators" unqualified.**

**Freshness declaration on the NMHC figure (house rule: 90 days).** The Pulse Survey was published in **January 2024** and fielded between 15 November 2023 and 9 January 2024. At publication it is **more than two years old and therefore stale under the 90-day rule**. It is used anyway, and this is a deliberate, declared exception: it is the only survey that measures application fraud incidence across a defined operator sample, and no fresher equivalent exists. **The condition of use is that the date ships inside the sentence**, as "the NMHC Pulse Survey published in January 2024", so the reader dates the figure without clicking. **A stale figure with a visible date is acceptable. A stale figure presented as current is not.** If NMHC publishes a newer wave before this page ships, the newer wave replaces it.

**The strongest line on the page is the FTC one: about half of reported rental scams in the year to June 2025 started with a fake Facebook advert.** It is the single sentence that justifies the whole article existing on this domain, and it opens the intro.

### Deleted, with reason (8)

All eight were searched for and no source exists. They are removed, not flagged.

1. **"95 percent accuracy identifying rental scams"** · DELETE. No detection tool publishes a validated accuracy rate for rental-scam identification. Unfalsifiable as written, and it reads as a product claim about a tool the page does not name.
2. **"80 percent less likely to encounter rental scams"** · DELETE. No study measures this. It is a marketing claim wearing a statistic's clothes, with no stated comparison group.
3. **"12 percent decrease 2021-2022"** · DELETE. No source, and it points in the opposite direction to the FTC trend now cited on the same page.
4. **"78 percent of reported scams resolved"** · DELETE. No agency publishes a resolution rate for rental scams. The FTC publishes reports and losses, not outcomes.
5. **"67% of users felt safer renting"** · DELETE. No named survey, no sample size, no instrument. Nothing to attribute it to.
6. **"75% highlighted importance of user reviews"** · DELETE. Same defect: no survey exists, and the claim is not connected to any named population.
7. **"23% decrease in rental scams"** · DELETE. Directly contradicts the sourced FTC data now on the page. Leaving it would put the article in conflict with its own citation in the same scroll.
8. **"60% of reports constituted verified fraud"** · DELETE. No source distinguishes verified from reported fraud at this granularity, and the FTC explicitly reports complaints rather than verified cases.

### Kept as is

- **"48+ marketplaces"**: Leasey.AI's own product figure, self-sourced, named as Leasey.AI's syndication network in the sentence. Never write "40+".
- **Pricing (from $499/month; $1.50 to $5.00 per door/month)**: self-sourced, links to the live pricing page.

**The invented table the report ordered removed, "Reported Rental Scams on Major Platforms 2023-2024", does not exist on this page.** No action required.

---

## Competitor mentions to reframe

The page names **Zillow, Apartments.com, Trulia, Craigslist, Redfin, HomeAdvisor, Rent.com, CoStar, and Realtor.com**, several of them in passages that read as anti-scam recommendations. None of them is an anti-scam product.

- **Zillow Rental Manager:** keep, reframe. A listing destination with integrated Experian screening. Say screening, do not imply fraud prevention on the listing side. It is also a Leasey.AI syndication destination, which should be stated.
- **Apartments.com:** same treatment. TransUnion-based screening, a syndication destination, not a scam defence.
- **Craigslist:** keep, and keep it framed as a **scam vector**, which is what it is in this context and what the SERP's third result also treats it as.
- **Trulia, Rent.com, Realtor.com:** keep only where they appear as syndication destinations. Drop any mention that positions them as a fraud solution.
- **Redfin, HomeAdvisor, CoStar:** **remove.** HomeAdvisor is a home-services marketplace and CoStar is commercial data; neither is a residential rental syndication destination and neither belongs in this argument. Redfin is a sales-first portal. Their presence pads the list without serving a keyword.
- **Buildium and AppFolio:** not currently mentioned. If added, described as a PMS that Leasey.AI integrates with, never as an anti-scam solution and never as a competitor we claim against.

---

## Visual: SVG diagram

**One SVG. No product screenshots.**

- **Diagram:** "Verified official listing versus clone." Two side-by-side listing cards. Left, labelled **Official listing**: established account age, price in line with the local market, photos unique to the property, contact routing to the leasing team, syndicated from one source to 48+ marketplaces. Right, labelled **Clone**: account created within the past year, price well below market, photos traced back to another site, payment requested before viewing, contact off-platform. Between them, a vertical strip listing the checkpoints that separate the two, **drawn from the red flags already documented on this page and from the FTC's `How To Tell Whether a Rental Listing Is Real` section, which was read directly. No Generation Rent material is used, in the diagram or in its alt text.** Below, a single arrow showing the official listing publishing to Facebook Marketplace among the 48+ destinations.
- **Placement:** immediately under the NEW H3 "The eight red flags that separate a real listing from a clone", which is the section protecting the pos 9.7 keyword.
- **Alt text:** `Side by side comparison of a verified official rental listing and a cloned scam listing on Facebook Marketplace, showing the warning signs that separate them: new seller account, below market price, photos lifted from other sites, and payment requested before viewing.`
- **Format:** SVG source, WebP fallback, max 1200px wide.

---

## Cluster interlinking

- **Layer 1, hub: BLOCKED.** `/benefits/` returns 404. No live parent hub to link up to.
- **Layer 2, breadcrumb:** Home > Resources > Overcoming Rental Listing Scams on Facebook Marketplace.
- **Layer 3, siblings:**
  - https://www.leasey.ai/resources/landlords-avoiding-facebook-marketplace-rentals/ · **link to it, do not redirect it.** It answers the renter's "are these listings legit" question, which is a real intent this page should hand off rather than absorb. Anchor text should carry verification language, not scam language, so the two pages stay separated in Google's eyes.
  - https://www.leasey.ai/resources/multi-property-listing-consistency/ (syndication angle, verified live in the T6 brief)
- **Product interlink:** https://www.leasey.ai/smart-rent-pricing/ is **live** and is a valid link from the below-market-price warning sign, since pricing against real comparables is exactly how a manager knows a clone's price is wrong.
- **CTA link: BLOCKED.** `/get-started/` 301s to the homepage.

Do not link `/advanced-reporting/` (410), `/free-trial/` (301 to homepage), or anything under `/benefits/` (404).

---

## CTA

**Verified on the live page: the CTA already reads "Book a free demo". There is no "Start your free trial" and no link to `/free-trial/` anywhere.** The report is out of date on this point and the fix has already shipped.

Two underlying problems remain and both are real:

1. **`/free-trial/` 301s to the homepage.** Do not link it from anywhere, in any form.
2. **Leasey.AI does not offer a free trial.** Per `products.md`: paid pilots on monthly terms only. If free-trial wording ever appears in this block, **the promise is removed, not just the link.**

**Third problem, and it blocks the page:** the canonical demo CTA destination `/get-started/` **301s to the homepage**. The demo button currently drops the reader on the home page. Flagged in Bloqueos.

---

## Writing rules

- **Intro:** max 3 lines, answers the intent directly, zero links. Opens on the FTC figure: about half of reported rental scams in the year to June 2025 started with a fake Facebook advert.
- **Paragraphs:** max 4 lines, one idea each, active voice.
- **Bold:** 2 to 3 per section, only the phrase a scanner needs. Never a full sentence.
- **Length:** this is an optimise job on a keyword-holding page, so the 800 to 1,000 word target does not cap it. Target 1,400 to 1,600 words after the additions, adding only, trimming nothing except the eight figures and the three off-topic platform mentions.
- **Style:** British English, Oxford comma, "Leasey.AI" capitalisation, **zero em-dashes anywhere including headings and separators**. Use a colon or the middle dot (·).
- **Banned words:** streamline, seamless, unlock, empower, robust, transform, game-changer. None currently appears in this page's headings, unlike the alternatives guide. Check the body copy at QA.

---

## Rule C: author

**This page takes an author.** It is a case study: a first-person account of what happened at a property. An anonymous account of a real incident carries no weight, and E-E-A-T is the whole point of the format.

The current signature is **LeaseyEditor**, a system account. It must be replaced with a named human.

**Assign Carlos Leal** (Compliance and operations pillar; fraud exposure and reputational risk are operations territory).

**Important:** `/author/carlos-leal` and `/author/juan-leal` both return **404** (the `/author/` route itself works: `/author/leaseyeditor/` responds 200, so the missing piece is the WordPress term). The author box ships as **name, title, and short bio, with no link to an author page**, and with the LinkedIn link only if verified live at publication time. Do not link a 404.

---

## Correcciones al reporte

1. **The block has expired.** "3 pages compete for the same topic" is no longer true. Two of the URLs 301 into one destination, so **two live pages remain**, and they target different intents. Task unblocked.
2. **FALSE: the URL.** `/benefits/facebook-marketplace-rental-scams-how-to-identify/` returns **404**, not a redirect. The whole `/benefits/` section moved to `/resources/`.
3. **RESOLVED: the "1 keyword in top 10".** It is **`facebook marketplace rental scam red flags`, position 9.7**, and it lives on the case study. The report counted it without naming it.
4. **FALSE: the CTA is "Start your free trial" linking to `/free-trial/`.** The live canonical says **"Book a free demo"**. Already fixed.
5. **FALSE: remove the table "Reported Rental Scams on Major Platforms 2023-2024".** That table does not exist on either live page. No action.
6. **FALSE: remove Buildium and AppFolio mentions.** Neither appears on the canonical. Nothing to remove.
7. **FALSE: "US English".** Walter has confirmed **British English** for Leasey.AI. British English wins over the report.
8. **PARTIALLY FALSE: the byline.** The report treats the block as unsigned. The canonical is signed **LeaseyEditor**, a system account, which must become a real author.
9. **CONFIRMED CORRECT:** both meta fields break the limits. Both are replaced above, with counts.
10. **CONFIRMED CORRECT:** the eleven figures on the canonical are unsourced. **Two now have real sources and nine are deleted**, after the Generation Rent replacement was withdrawn at verification.
11. **CORRECTED IN THIS VERSION, four errors of our own making.** They are listed rather than quietly fixed, because each one is a pattern that repeats: (a) the FTC page was recorded as 403 and its structure as unverifiable when it returns **200** and plain HTML, so the top-3 analysis was incomplete for no reason; (b) the Equifax failure was recorded as a 403 block when the page returns **200** and simply renders its body in JavaScript, so the right conclusion carried a false reason; (c) the NMHC 84.3% was published against the wrong denominator; (d) Generation Rent was recorded as 200 in the link table when it returns **403**, which put an unverifiable figure into a table of verified ones. **The common thread is a status code or a denominator copied forward instead of re-checked.**

---

## Verificación de enlaces

| URL | Status | Use |
|---|---|---|
| `/resources/overcoming-rental-scams-facebook-marketplace/` | **200** | **CANONICAL** |
| `/resources/landlords-avoiding-facebook-marketplace-rentals/` | **200** | independent page, sibling link, **not redirected** |
| `/resources/renter-scam-protection-apartment-seekers/` | 301 | already consolidated into the alternatives guide |
| `/resources/tips-avoid-scams-facebook-marketplace-rentals/` | 301 | already consolidated into the alternatives guide |
| `/benefits/facebook-marketplace-rental-scams-how-to-identify/` | **404** | report URL, dead, do not use |
| `/benefits/` | **404** | no hub, layer 1 blocked |
| `/get-started/` | **301 to homepage** | CTA blocked |
| `/free-trial/` | **301 to homepage** | never link, and no free trial exists |
| `/advanced-reporting/` | **410** | never link |
| `/smart-rent-pricing/` | **200** | valid product interlink |
| `/resources/multi-property-listing-consistency/` | 200 | sibling |
| `/author/leaseyeditor/` | 200 | route works |
| `/author/carlos-leal` · `/author/juan-leal` | **404** | author box ships unlinked |
| ftc.gov rental scams data spotlight (Dec 2025) | 200 | figure source |
| generationrent.org Facebook Marketplace study (Nov 2024) | **403** | **NOT VERIFIABLE, figure withdrawn, and UK data on a US and Canada page. Do not cite.** |
| nmhc.org Pulse Survey on fraud and bad debt | 200 | figure source, **dated January 2024 in the text** |
| consumer.ftc.gov/articles/rental-listing-scams | **200, plain HTML** | SERP competitor, **structure fully verified, H1 and 4 H2s recorded above** |
| equifax.com rental scams article | **200, body rendered client side** | SERP competitor, article headings absent from the delivered HTML, structure not verifiable. **Not a 403.** |

---

## Bloqueos

1. **CTA destination is broken.** `/get-started/` 301s to the homepage, so every demo CTA on this page loses the reader. This is the page's only conversion path and it affects the whole `/resources/` set. Needs a fix before publication or the optimisation converts nothing.
2. **No live `/benefits/` hub.** 404, so layer 1 of the interlinking cannot be completed. Either a hub is created or the layer-1 link is formally dropped for the whole `/resources/` set.
3. **Author pages return 404.** The `/author/` route works but the WordPress terms for Carlos and Juan do not exist, so Rule C ships half satisfied: real named author, no author page link.
4. **"Go live in under a week." is a site-wide template claim with no source.** It sits as H2 9 on this page and on at least 7 other `/resources/` pages. Either the company substantiates the onboarding timeline once and it becomes an attributed Leasey.AI product figure, or it comes out of the template. It is a business decision, not a page edit, and it should be settled before any of the eleven tasks publish.
5. **One of the top three SERP competitors cannot be read, and it is not a block.** The FTC page and the Ziprent page were both fetched in full and their structures are documented above. **Equifax returns 200 but renders its article body in JavaScript**, so its headings are absent from the delivered HTML and are documented as unverifiable rather than invented. If the full top-3 structural breakdown is needed, only that one page has to be opened manually in a browser.
6. **The Generation Rent study is unreachable (403).** The figure it was to support is withdrawn, and it would have failed the market rule anyway as United Kingdom data on a page for the United States and Canada. **If a Facebook Marketplace listing-quality figure for the US or Canadian market is wanted, one has to be sourced from scratch.** Until then the page carries two sourced figures rather than three, which is still more than either competitor read.
7. **The NMHC figure is stale under the 90-day rule.** Published January 2024, so more than two years old at publication. It ships with its date inside the sentence as a declared exception, per the Figures section. **This needs a sign-off, not a silent pass**, and it should be revisited if NMHC publishes a newer wave.

**The previous version's bloqueo 4, "no GSC export for this URL", is removed. The export exists, the query data is in Part 1, and the focus keyword is chosen on measured positions rather than inference.**

---

## Corrección de la versión anterior

This brief previously recommended the opposite canonical. What changed and why:

| # | Previous version | Corrected version | Why |
|---|---|---|---|
| 1 | Canonical = `/resources/landlords-avoiding-facebook-marketplace-rentals/` | **Canonical = `/resources/overcoming-rental-scams-facebook-marketplace/`** (the case study) | Search Console, 90 days: 14 topic keywords and the only top-10 position sit on the case study. The alternatives guide holds none of them. |
| 2 | The case study 301s into the alternatives guide after a 30-day window | **No 301 in either direction. Both pages stay live.** | They serve different intents: operator defence versus renter verification. Merging them would damage both. |
| 3 | Argument 2: "a case study cannot hold identification-intent keywords" | **Withdrawn and stated as an error.** The identification keywords, including the pos 9.7 one, are on the case study. | Measured query data beats a theoretical claim about content types. |
| 4 | Argument 1: "the alternatives guide is already the consolidation hub, so it holds more accumulated authority" | **Withdrawn.** Two of the URLs redirecting into it were near-duplicates with no ranking of their own. Accumulated redirects are not accumulated rankings. | Redirect count is not a ranking signal. Query data is. |
| 5 | Argument 4: "the alternatives guide's heading structure is already clean" | **Withdrawn as a canonical criterion.** Two duplicate H2s consolidate in one edit. | A heading defect is a task, not a reason to move a canonical. |
| 6 | Focus keyword chosen with "volume not retrievable", position unknown | **`facebook marketplace rental scams`, pos 19.6, 19 impressions**, chosen as the semantic head over the pos 9.7 long tail, with the argument written out | The export exists now. The choice is made on data. |
| 7 | Part 2 mapped against the alternatives guide's 6 H2s and 8 H3s | **Part 2 rebuilt entirely against the case study's 1 H1, 9 H2s, and 5 H3s**, including the duplicate-H2 consolidation | Different page, different structure. |
| 8 | Content "rescued from Page A" before a redirect | **Nothing is moved. The case narrative already lives on the canonical** and is protected in place. | No redirect, so no rescue operation. |
| 9 | The 97% replaced with the NMHC **93.3%** | **Replaced with both numbers and their relationship: 93.3% experienced fraud, and 84.3% of those saw falsified income documents, which is roughly 78.7% of the sample.** | Read at source. The 84.3% is a share of the 93.3%, not of the whole sample, so "84.3% of operators" overstated the incidence. The figure must match what the sentence claims, and so must its denominator. |
| 11 | FTC page recorded as 403 and structurally unverifiable | **200 and plain HTML. H1 and four H2s recorded verbatim, top-3 analysis completed.** | Re-fetched with a browser user agent. The block never existed. |
| 12 | Equifax failure attributed to a 403 | **200. The body renders client side, so no article headings are delivered.** Conclusion unchanged, reason corrected. | A correct conclusion resting on a false reason fails the next time the reason changes. |
| 13 | Generation Rent figure listed as sourced, URL marked 200 | **Withdrawn. URL returns 403, and it is UK data on a US and Canada page.** | Two independent disqualifications, either one sufficient. |
| 14 | "All three speak to renters", "two of the three cite no data", "none of the three has one" | **Bounded to the two pages actually opened**, with Equifax excluded by name. | An absolute about a page nobody read is a guess wearing a fact's clothes. |
| 15 | NMHC figure used with no date and no freshness note | **Dated January 2024 in the sentence and declared stale against the 90-day rule**, with the reason for the exception written out. | Freshness is the house's first rule. An exception is allowed; an undeclared one is not. |
| 10 | Bloqueo 4: no GSC export | **Removed.** | Resolved. |

**What did not change:** the canonical decision and the keyword tables, both re-verified live against the Search Console API on the 90-day window 30 April to 29 July 2026 with all 20 keywords returning rows, the FTC "about half started with a fake Facebook advert" line as the opening figure, the CTA and `/get-started/` problem, the author requirement under Rule C, the SVG concept, and the meta field limits.
