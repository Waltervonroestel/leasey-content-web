Canal: Blog (leasey.ai/blog), B2B operator-facing
Calendario ID: M2-009 (Week 6, Wed Jul 15)
Signal: Backlog (Discrepancy AI launch) + N1 + N4
Pilar: 5 (compliance-aware AI)
Anchor: Diego Mendoza (Century21)
Status: DRAFT (pending editor-qa + Walter review)

---

Título SEO sugerido: Discrepancy AI: How Leasey Flags Fraud and Inconsistencies in Rental Applications
Meta description: (omitir por defecto)
Slug sugerido: discrepancy-ai-screening
Enlaces internos incluidos:
  - /features/liza/ [VERIFICAR URL]
  - /resources/research (Fair Housing research) [VERIFICAR URL]
  - /get-started/ (CTA final)
Imágenes sugeridas + alt text:
  - Hero: dashboard mock with flagged income discrepancy (stated $5,200/mo vs deposit avg $3,100/mo). Alt: "Leasey.AI screening dashboard showing an application flagged by Discrepancy AI for a mismatch between stated monthly income and average bank deposit totals."

---

# Discrepancy AI: how Leasey flags fraud and inconsistencies in rental applications

How many of the rental applications you screened this quarter had a number that did not quite match?

Income on the application that does not match three months of bank statements. Employer name that does not match the payroll provider. ID name that does not match the application. Most of these are unintentional. A subset are fraud.

For the property manager screening 30 applications a week per leasing agent, catching these by eye is a discipline that breaks under volume. According to ShowMojo, around 70% of rental prospects search after business hours, and a similar share of applications now arrive outside the agent's working window. The review queue is bigger than ever. The time to give each application a careful read is smaller.

This week we shipped Discrepancy AI as part of Leasey.AI's screening workflow. Here is what it does and what it does not.

## What Discrepancy AI does

The system reads the structured fields of a rental application alongside the supporting documents (bank statements, paystubs, ID, employer letters) and flags cases where the data points do not line up:

1. **Income mismatch.** Stated monthly income on the application versus aggregated deposit totals over the last 90 days.
2. **Employer mismatch.** Name on the paystub or employer letter versus the application's stated employer.
3. **ID mismatch.** Name and date of birth on the ID versus the application form.
4. **Date inconsistencies.** Lease term overlaps, simultaneous tenancy claims, two applications for different units submitted within hours of each other.
5. **Document signals.** Metadata flags on documents that look re-rendered or out of date.

Each flag surfaces in the leasing dashboard with the underlying data visible. The reviewer sees what the system saw.

## What Discrepancy AI does not do

The system does not auto-deny an application. It does not score a tenant. It does not gate the application from human review.

That separation is deliberate. Per Multifamily Dive's reporting on the DOJ vs RealPage case (2025), Greystar was added as a co-defendant. Harbor Group is dealing with separate scrutiny on voucher screening. A court will look at any decision that materially affects whether a person gets housed and ask which person made it. The right answer is "a human, on the record."

The Leasey position on screening: the system catches the inconsistency. The human carries the decision. Every flag has an audit trail attached.

## Why this matters in a soft market

According to Yardi's Q1 2026 Multifamily Report, Canadian national vacancy is at 5.1%, Calgary at 7.3%, Edmonton at 6.2%. In a market like that, the cost of a missed fraud signal is real. So is the cost of a Fair Housing complaint from a denied application that should not have been denied.

For operators like Diego Mendoza at Century21, the screening volume justifies investment in better signal. The team can now spend deep review time on the flagged applications, instead of distributing it thin across every file.

## Master compliant screening with Leasey.AI

Discrepancy AI is part of the [Leasey.AI screening](/features/liza/) layer, alongside biometric ID verification, credit and background checks, and (for Canadian operators) SingleKey integration. The team that built it published a [research piece on Fair Housing](/resources/research) earlier this year for operators wanting the legal context behind the design choices.

Schedule a call with Leasey.AI to get started today and see how it can transform your leasing process: https://www.leasey.ai/get-started/
