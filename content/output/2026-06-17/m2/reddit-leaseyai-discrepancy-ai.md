Canal: Reddit r/LeaseyAI (internal changelog)
Calendario ID: M2-011 (Week 6, Thu Jul 16)
Signal: Backlog (Discrepancy AI launch)
Author: Walter (changelog voice)
Status: DRAFT (pending editor-qa + Walter review)

---

**Title:** Leasey.AI Discrepancy AI - inconsistency detection in screening, flags only, no auto-denial

**Body:**

Pushed Discrepancy AI into the screening workflow this week. Posting the changelog because a few of you have asked specifically about this layer.

What it does. The system reads structured fields of a rental application alongside the supporting documents and flags mismatches. Income on the form vs deposit aggregates from bank statements. Employer name on the paystub vs the application. ID name vs application name. Date inconsistencies across submissions. Document metadata flags on re-rendered files. Each flag shows up in the leasing dashboard with the underlying data visible.

What it deliberately does not do. The system does not auto-deny applications. It does not produce a tenant score. It does not gate the application from human review. The reviewer always sees what triggered the flag and makes the call.

This is deliberate. The Fair Housing exposure on auto-decisions in screening is now a real one (DOJ vs RealPage, Greystar added as co-defendant in 2025, separate Harbor Group voucher screening matter). Auto-denial without human review is the path most operators do not want their stack on.

Known limits. The flags today work on the most common North American document types (US and Canadian paystubs, bank statements, IDs). International documents are best-effort. Custom employer letters (no template) sometimes flag false positives. v1.1 will improve those.

Drop a comment if your team hits a false positive pattern we should tune for, or a true positive we missed.
