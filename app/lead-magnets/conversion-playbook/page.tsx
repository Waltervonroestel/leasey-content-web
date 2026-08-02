"use client";

export default function ConversionPlaybookPage() {
  return (
    <>
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          main { max-width: 100% !important; padding: 0 !important; }
          .print-break { page-break-before: always; }
          body { font-size: 11pt; }
          .card { box-shadow: none !important; border: 1px solid #d1d5db !important; }
        }
        .accent { color: #059669; }
        .bg-accent { background-color: #059669; }
        .border-accent { border-color: #059669; }
        .bg-accent-light { background-color: #ecfdf5; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-sm font-medium bg-accent-light text-emerald-700 px-4 py-1.5 rounded-full mb-4">
          FREE RESOURCE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Showing-to-Signed Conversion Playbook
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          7 leasing funnel metrics + benchmarks by portfolio size + message templates to convert showings into signed leases faster.
        </p>
        <button
          onClick={() => window.print()}
          className="no-print mt-6 bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
        >
          Download as PDF
        </button>
      </div>

      {/* The Leasing Funnel */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4 accent">The Leasing Funnel: 7 Metrics That Matter</h2>
        <p className="text-sm text-gray-500 mb-6">Track these metrics weekly. If any metric drops below benchmark, that stage is your bottleneck.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-accent-light">
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">Metric</th>
                <th className="text-left p-3 font-semibold">Definition</th>
                <th className="text-center p-3 font-semibold">Small<br/><span className="font-normal text-xs">(1-20 units)</span></th>
                <th className="text-center p-3 font-semibold">Mid<br/><span className="font-normal text-xs">(21-100 units)</span></th>
                <th className="text-center p-3 font-semibold">Large<br/><span className="font-normal text-xs">(100+ units)</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  n: "1", metric: "Listing-to-Inquiry Rate", def: "% of listing views that generate an inquiry (call, email, form)",
                  small: "3-5%", mid: "5-8%", large: "8-12%"
                },
                {
                  n: "2", metric: "Inquiry-to-Showing Rate", def: "% of inquiries that result in a confirmed showing",
                  small: "40-50%", mid: "50-65%", large: "60-75%"
                },
                {
                  n: "3", metric: "Showing No-Show Rate", def: "% of confirmed showings where the prospect does not appear",
                  small: "30-40%", mid: "20-30%", large: "15-25%"
                },
                {
                  n: "4", metric: "Showing-to-Application Rate", def: "% of completed showings that result in a submitted application",
                  small: "25-35%", mid: "35-50%", large: "40-55%"
                },
                {
                  n: "5", metric: "Application Approval Rate", def: "% of submitted applications that pass screening",
                  small: "70-80%", mid: "75-85%", large: "80-90%"
                },
                {
                  n: "6", metric: "Approval-to-Signed Rate", def: "% of approved applicants who sign the lease",
                  small: "80-90%", mid: "85-92%", large: "88-95%"
                },
                {
                  n: "7", metric: "Days to Lease", def: "Calendar days from listing posted to lease signed",
                  small: "21-35 days", mid: "14-25 days", large: "10-18 days"
                },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 font-bold accent">{row.n}</td>
                  <td className="p-3 font-semibold">{row.metric}</td>
                  <td className="p-3 text-gray-600">{row.def}</td>
                  <td className="p-3 text-center">{row.small}</td>
                  <td className="p-3 text-center">{row.mid}</td>
                  <td className="p-3 text-center font-medium">{row.large}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-accent-light rounded-lg p-4 text-sm">
          <strong className="accent">How to read this:</strong> A 100-unit property averaging 5% listing-to-inquiry and 50% inquiry-to-showing should expect roughly 25 showings per 1,000 listing views. If your showing-to-app rate is below 35%, the problem is likely at the showing itself, not the listing.
        </div>
      </section>

      {/* Bottleneck Diagnosis */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm print-break">
        <h2 className="text-xl font-bold mb-4 accent">Bottleneck Diagnosis Guide</h2>
        <div className="space-y-4">
          {[
            {
              problem: "Low Listing-to-Inquiry Rate (under 3%)",
              causes: ["Poor listing photos (dark, cluttered, portrait orientation)", "Vague descriptions missing key details (sq ft, pet policy, parking)", "Rent priced 10%+ above comps", "Listing buried — not refreshed or syndicated"],
              fixes: ["Re-shoot photos with natural light", "Use platform-specific templates (see Listing Kit)", "Run a comp analysis within 0.5-mile radius", "Syndicate to 4+ platforms and refresh weekly"]
            },
            {
              problem: "Low Inquiry-to-Showing Rate (under 40%)",
              causes: ["Slow response time (over 4 hours)", "Inconvenient showing times offered", "No self-scheduling option", "Prospect ghosting after initial contact"],
              fixes: ["Respond to inquiries within 30 minutes during business hours", "Offer same-day or next-day showings", "Implement online self-scheduling", "Use confirmation + reminder sequence (templates below)"]
            },
            {
              problem: "High No-Show Rate (over 30%)",
              causes: ["No confirmation message sent", "Showing scheduled too far out (3+ days)", "No reminder sent day-of", "Prospect applied elsewhere in the meantime"],
              fixes: ["Send confirmation immediately after booking", "Aim for showings within 24-48 hours of inquiry", "Send morning-of reminder with address and parking info", "Pre-qualify interest via text before booking"]
            },
            {
              problem: "Low Showing-to-Application Rate (under 25%)",
              causes: ["Unit not show-ready (dirty, damaged, occupied clutter)", "Leasing agent underselling or absent", "Application process too complex", "Price shock at showing (hidden fees not disclosed upfront)"],
              fixes: ["Walk the unit 1 hour before every showing", "Use the showing script (below) to address objections", "Offer instant online applications on mobile", "Disclose all move-in costs in the listing"]
            },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-red-600 mb-2">{item.problem}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Common Causes</div>
                  <ul className="text-sm space-y-1">
                    {item.causes.map((c, j) => <li key={j} className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">-</span>{c}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Fixes</div>
                  <ul className="text-sm space-y-1">
                    {item.fixes.map((f, j) => <li key={j} className="flex items-start gap-1.5"><span className="accent mt-0.5">+</span>{f}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message Templates */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm print-break">
        <h2 className="text-xl font-bold mb-4 accent">Message Templates: Confirmation & Follow-Up Sequence</h2>
        <p className="text-sm text-gray-500 mb-6">Copy-paste these into your SMS/email system. Customize the bracketed fields. Use all 5 to reduce no-shows by up to 40%.</p>

        <div className="space-y-5">
          {/* Template 1: Inquiry Response */}
          <div className="border-l-4 border-accent pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent-light text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">MSG 1</span>
              <span className="font-semibold text-sm">Inquiry Response (send within 30 min)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hi [First Name]! Thanks for your interest in the [beds]BR at [address/neighborhood]. The unit is still available at $[rent]/mo — here are a few quick details:

- Available: [date]
- Pets: [yes, cats + dogs OK / no pets]
- Parking: [included / $X/mo / street]

Would you like to schedule a showing? I have availability:
- [Day], [Time]
- [Day], [Time]
- [Day], [Time]

Or you can book directly here: [scheduling link]

Looking forward to showing you around!
— [Your Name], [Property/Company]`}
            </div>
          </div>

          {/* Template 2: Showing Confirmation */}
          <div className="border-l-4 border-accent pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent-light text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">MSG 2</span>
              <span className="font-semibold text-sm">Showing Confirmation (send immediately after booking)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hi [First Name], you're confirmed for a showing!

📍 [Full address], [Unit # if applicable]
📅 [Day, Date] at [Time]
🅿️ Parking: [visitor spot / street parking on X side]

When you arrive, [meet me at the front entrance / call me and I'll buzz you in / go to the leasing office].

If anything changes, just text me at this number. See you [day]!
— [Your Name]`}
            </div>
          </div>

          {/* Template 3: Day-Before Reminder */}
          <div className="border-l-4 border-accent pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent-light text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">MSG 3</span>
              <span className="font-semibold text-sm">Day-Before Reminder (send evening before)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hey [First Name], just a quick reminder about your showing tomorrow at [time] at [address]. Still good to go?

A quick "yes" works — just want to make sure I'm there ready for you.`}
            </div>
          </div>

          {/* Template 4: Post-Showing Follow-Up */}
          <div className="border-l-4 border-accent pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent-light text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">MSG 4</span>
              <span className="font-semibold text-sm">Post-Showing Follow-Up (send within 2 hours)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hi [First Name], it was great meeting you today! I hope you liked the [beds]BR at [address].

A few things I wanted to follow up on:
- [Answer any question they asked during the showing]
- The unit [will hold / won't hold] — we currently have [X] other applicants interested

If you'd like to move forward, here's the application link: [link]
Application fee: $[amount] | Takes about [X] minutes to complete

Happy to answer any other questions!
— [Your Name]`}
            </div>
          </div>

          {/* Template 5: 48-Hour Nudge */}
          <div className="border-l-4 border-accent pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent-light text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">MSG 5</span>
              <span className="font-semibold text-sm">48-Hour Nudge (send if no application after 2 days)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hi [First Name], just checking in on the [beds]BR at [neighborhood]. We've had [X] showing requests since your visit, so I wanted to give you first priority before we move forward with other applicants.

No pressure at all — if it's not the right fit, totally understand. But if you're still interested, the application only takes [X] minutes: [link]

Either way, let me know!`}
            </div>
          </div>

          {/* Template 6: No-Show Recovery */}
          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded">RECOVERY</span>
              <span className="font-semibold text-sm">No-Show Recovery (send 30 min after missed showing)</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
{`Hey [First Name], I was at [address] for our [time] showing — no worries if something came up! Things happen.

The unit is still available. Would you like to reschedule? I can do:
- [Day], [Time]
- [Day], [Time]

Just let me know.`}
            </div>
          </div>
        </div>
      </section>

      {/* Showing Script */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm print-break">
        <h2 className="text-xl font-bold mb-4 accent">The 15-Minute Showing Script</h2>
        <p className="text-sm text-gray-500 mb-5">A structured approach that increases showing-to-application rates by addressing what prospects actually care about.</p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
            <div>
              <h4 className="font-bold">Arrival & Rapport (2 min)</h4>
              <p className="text-sm text-gray-600">&quot;Thanks for coming out. Before we walk through, tell me — what&apos;s most important to you in your next place?&quot;</p>
              <p className="text-xs text-gray-400 mt-1">Listen for: commute, space, quiet, pets, budget. Tailor the tour to their top priority.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
            <div>
              <h4 className="font-bold">Exterior & Common Areas (2 min)</h4>
              <p className="text-sm text-gray-600">Point out parking, laundry, package area, trash/recycling. Address safety features (lighting, locks, cameras).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
            <div>
              <h4 className="font-bold">Unit Walkthrough (6 min)</h4>
              <p className="text-sm text-gray-600">Start with the kitchen (high-value room), then living area, bedrooms, bathrooms. At each stop, name one specific upgrade or feature. Let them explore — don&apos;t rush.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
            <div>
              <h4 className="font-bold">Logistics & Objection Handling (3 min)</h4>
              <p className="text-sm text-gray-600">Proactively cover: move-in costs, lease terms, utility estimates, pet policy, maintenance process. Ask: &quot;Any questions about anything you&apos;ve seen?&quot;</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">5</div>
            <div>
              <h4 className="font-bold">Close (2 min)</h4>
              <p className="text-sm text-gray-600">&quot;So what do you think — can you see yourself living here?&quot; If yes: &quot;Great, I&apos;ll text you the application link right now. It takes about 10 minutes.&quot; If hesitant: &quot;No pressure — I&apos;ll follow up tomorrow. What would help you decide?&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Speed-to-Lease Benchmarks */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold mb-4 accent">Speed-to-Lease: Response Time Benchmarks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-accent-light">
                <th className="text-left p-3 font-semibold">Touchpoint</th>
                <th className="text-center p-3 font-semibold">Target</th>
                <th className="text-center p-3 font-semibold">Acceptable</th>
                <th className="text-center p-3 font-semibold">Losing Leads</th>
              </tr>
            </thead>
            <tbody>
              {[
                { touch: "Initial inquiry response", target: "Under 15 min", accept: "Under 1 hour", bad: "Over 4 hours" },
                { touch: "Showing scheduled after inquiry", target: "Within 24 hours", accept: "Within 48 hours", bad: "Over 3 days" },
                { touch: "Confirmation sent after booking", target: "Immediately (auto)", accept: "Within 1 hour", bad: "Never sent" },
                { touch: "Day-of reminder", target: "Morning of (auto)", accept: "2 hours before", bad: "Never sent" },
                { touch: "Post-showing follow-up", target: "Within 1 hour", accept: "Same day", bad: "Next day or never" },
                { touch: "Application review turnaround", target: "Within 4 hours", accept: "Within 24 hours", bad: "Over 48 hours" },
                { touch: "Lease sent after approval", target: "Same day", accept: "Next business day", bad: "Over 3 days" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 font-medium">{row.touch}</td>
                  <td className="p-3 text-center text-emerald-700 font-medium">{row.target}</td>
                  <td className="p-3 text-center text-yellow-600">{row.accept}</td>
                  <td className="p-3 text-center text-red-500">{row.bad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8 border-t border-gray-200">
        <div className="text-sm text-gray-400 mb-2">Brought to you by</div>
        <div className="text-xl font-bold accent mb-2">Leasey.AI</div>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
          Automate showing confirmations, follow-up sequences, and conversion tracking — so you never lose a lead to slow response times.
        </p>
        <a
          href="https://leasey.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="no-print inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          Learn more at leasey.ai
        </a>
      </section>
    </>
  );
}
