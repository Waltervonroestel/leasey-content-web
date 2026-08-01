# REW.ca content: fact-check before approval

Audit of the REW.ca Partnership Assets doc, July 2026. Every figure I originally put in the press release was checked against a real source. Most did not survive.

## Figures that must come out

| Claim in the draft | What verification found | Verdict |
|---|---|---|
| "Established in 1996 under Real Estate Wire" | REW.ca launched its first prototype in **October 2011**. REW's LinkedIn lists the company as **founded 1978** (the Real Estate Weekly print business). Neither is 1996. | **Wrong. Remove.** |
| "over 1 million monthly visitors" | REW's own expansion announcement claimed "nearly 4 million visits per month". That both contradicts the figure and is from roughly 2019, so it is seven years stale. Also "visits" is not "visitors". | **Unverifiable. Remove.** |
| "16 million Canadian home seekers" | No source found anywhere. | **Unsourced. Remove.** |
| "over 577,000 property listings" | REW's own announcement said "70 thousand listings". Off by a factor of eight, and also stale. | **Wrong. Remove.** |
| "the number one real estate platform in British Columbia" | Not corroborated by any independent source. REW describes "long-standing success established in British Columbia", which is weaker and vaguer. | **Unsupported superlative. Remove.** |
| "49+ marketplaces" | leasey.ai says **48+ marketplaces** in its own headline. products.md also fixes 48+ as the source of truth. Incrementing to 49 was my invention. | **Wrong. Revert to 48+.** |

## Why this matters more than usual

These are claims about a partner company, in a press release that names that partner. If REW.ca reads its own boilerplate and finds the founding year and the listing count wrong, that is a worse outcome than a vague sentence. Regla D also applies: every figure needs a deep-linked source, and none of these had one.

## The fix

REW.ca supplies its own boilerplate and its own figures, in the same pass where Carlos collects their quote. That is standard press release practice: each party approves the paragraph describing itself. The draft now carries a clearly marked placeholder for it.

Everything Leasey.AI asserts about its own product stays, because it is self-sourced and verifiable: 48+ marketplaces, no setup, no additional cost, per-unit toggle in the Syndication tab, Liza handling inquiries.

## Sources checked

- REW company page on LinkedIn (founding year, company size)
- Times Colonist / Vancouver Is Awesome coverage of REW.ca's national expansion (visits per month, listing count, BC origin)
- rew.ca/about and rew.ca press releases: both returned HTTP 403 and could not be read
- leasey.ai homepage (marketplace count)
