"use client";

import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents, { type TocItem } from "@/components/blog/TableOfContents";
import ExecutiveSummary from "@/components/blog/ExecutiveSummary";
import Callout from "@/components/blog/Callout";
import ContextualCTA from "@/components/blog/ContextualCTA";
import LeaseyCompare from "@/components/blog/LeaseyCompare";
import KeyTakeaways from "@/components/blog/KeyTakeaways";
import LeadMagnet from "@/components/blog/LeadMagnet";
import BlogLayout from "@/components/blog/BlogLayout";

const tocItems: TocItem[] = [
  { id: "overview", label: "Market Overview", level: 2 },
  { id: "challenges", label: "Operator Challenges", level: 2 },
  { id: "comparison", label: "The Leasey Difference", level: 2 },
  { id: "strategy", label: "Response Strategy", level: 2 },
  { id: "lead-magnet", label: "Free Resource", level: 2 },
  { id: "takeaways", label: "Key Takeaways", level: 2 },
];

function DataRail() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono mb-3">
          Market Snapshot
        </p>
        {[
          { label: "Avg. Vacancy", value: "5.2%", delta: "-0.8%" },
          { label: "Rent Growth", value: "+3.4%", delta: "+1.1%" },
          { label: "NOI Margin", value: "62%", delta: "+2.3%" },
        ].map((m) => (
          <div key={m.label} className="flex justify-between items-baseline py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{m.label}</span>
            <div className="text-right">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">{m.value}</span>
              <span className="ml-1.5 text-xs text-emerald-600 font-mono">{m.delta}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono mb-2">
          Related
        </p>
        {["Lease Renewal Playbook", "Vacancy Reduction Guide", "NOI Optimization"].map((t) => (
          <a key={t} href="#" className="block text-sm text-emerald-700 dark:text-emerald-400 hover:underline py-1">
            {t}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function BlogDemoPage() {
  return (
    <>
      <ReadingProgress />
      <BlogLayout
        toc={<TableOfContents items={tocItems} />}
        sidebar={<DataRail />}
      >
        <ExecutiveSummary
          title="2026 Tariff Impact: What Every Property Operator Needs to Know"
          subtitle="How new trade policies reshape maintenance costs, capital budgets, and vendor strategy for multifamily operators."
          readingTime={7}
          date="July 15, 2026"
          author="Leasey.AI Research"
          topics={[
            "Material cost increases across lumber, steel, and HVAC",
            "Vendor contract renegotiation strategies",
            "Capital expenditure planning adjustments",
            "Technology solutions for cost mitigation",
          ]}
          bestFor={["Property Managers", "Asset Managers", "Maintenance Directors", "Procurement Teams"]}
        />

        {/* Section 1 */}
        <section>
          <h2 id="overview" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-10 mb-4 scroll-mt-24">
            Market Overview
          </h2>
          <p className="mb-4">
            The 2026 tariff landscape has fundamentally altered the cost structure for property operations.
            With lumber up 18%, steel up 12%, and HVAC equipment facing 25% import duties, operators who
            fail to adapt their procurement and maintenance strategies face margin compression of 3-5
            percentage points over the next 18 months.
          </p>

          <Callout variant="data">
            According to the National Apartment Association, average maintenance costs per unit have
            increased <strong>$142/year</strong> since tariff implementation -- a 9.3% increase over 2025 baseline.
          </Callout>

          <p className="mb-4">
            The impact is not uniform across markets. Coastal metros with higher renovation activity are
            seeing the steepest increases, while markets with established domestic supply chains are
            weathering the transition more effectively.
          </p>

          <ContextualCTA
            headline="See how tariffs affect your specific portfolio"
            description="Our impact calculator models cost changes by region, unit count, and material mix."
            buttonText="Try the calculator"
            variant="inline"
          />
        </section>

        {/* Section 2 */}
        <section>
          <h2 id="challenges" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-10 mb-4 scroll-mt-24">
            Operator Challenges
          </h2>
          <p className="mb-4">
            Property operators are facing a perfect storm: rising material costs, tightening labor
            markets, and residents increasingly sensitive to rent increases. The operators who thrive
            will be those who leverage technology to optimize every dollar of their maintenance budget.
          </p>

          <Callout variant="tip">
            Lock in existing inventory contracts before Q3 price adjustments take effect. Vendors with
            domestic supply chains are offering 6-month price guarantees -- but only to operators who
            commit by August 1st.
          </Callout>

          <Callout variant="warning">
            Deferring maintenance to absorb tariff costs is a losing strategy. Deferred maintenance
            compounds at roughly 6x the original repair cost within 18 months. Address issues now while
            vendor capacity is available.
          </Callout>
        </section>

        {/* Section 3 */}
        <section>
          <h2 id="comparison" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-10 mb-4 scroll-mt-24">
            The Leasey Difference
          </h2>
          <p className="mb-4">
            Traditional property management approaches were not built for this level of cost volatility.
            Spreadsheet-based budgeting and reactive maintenance scheduling leave operators exposed to
            margin erosion they do not see until quarter-end.
          </p>

          <LeaseyCompare
            without={[
              { text: "Manual vendor price tracking across dozens of suppliers" },
              { text: "Reactive maintenance scheduling based on tenant complaints" },
              { text: "Quarterly budget reviews that lag behind cost changes" },
              { text: "No visibility into material cost trends by category" },
            ]}
            withLeasey={[
              { text: "Automated vendor cost benchmarking with real-time alerts" },
              { text: "Predictive maintenance scheduling that optimizes timing and costs" },
              { text: "Live budget dashboards with tariff-adjusted forecasting" },
              { text: "Material cost intelligence by category, vendor, and region" },
            ]}
          />

          <ContextualCTA
            headline="Ready to see the difference in your portfolio?"
            description="Join 200+ operators who cut maintenance costs by 15% in their first quarter."
            buttonText="Book a demo"
            variant="banner"
          />
        </section>

        {/* Section 4 */}
        <section>
          <h2 id="strategy" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-10 mb-4 scroll-mt-24">
            Response Strategy
          </h2>
          <p className="mb-4">
            The most effective operators are taking a four-pronged approach to tariff mitigation:
          </p>
          <ol className="list-decimal pl-5 space-y-3 mb-4">
            <li className="text-sm"><strong>Diversify supply chains</strong> -- Reduce single-source dependency by qualifying 2-3 vendors per material category, including domestic alternatives.</li>
            <li className="text-sm"><strong>Shift to predictive maintenance</strong> -- Use sensor data and AI to schedule repairs at optimal cost windows rather than reacting to failures.</li>
            <li className="text-sm"><strong>Renegotiate vendor contracts</strong> -- Lock in pricing tiers with volume commitments that give vendors revenue certainty in exchange for tariff buffers.</li>
            <li className="text-sm"><strong>Adjust capital planning horizons</strong> -- Extend CapEx planning from 12 to 24 months to capture bulk purchasing opportunities.</li>
          </ol>
        </section>

        {/* Lead Magnet */}
        <section id="lead-magnet" className="scroll-mt-24">
          <LeadMagnet
            title="2026 Tariff Response Checklist for Property Operators"
            description="A 12-point action plan covering vendor negotiation scripts, budget adjustment templates, and procurement timeline recommendations."
            resourceLabel="Free Checklist"
            buttonText="Get the checklist"
          />
        </section>

        {/* Key Takeaways */}
        <section id="takeaways" className="scroll-mt-24">
          <KeyTakeaways
            items={[
              "Material costs have risen 9-25% across key categories -- operators must adjust budgets now, not at year-end.",
              "Domestic supply chain diversification is the single highest-ROI strategy for tariff mitigation.",
              "Predictive maintenance technology can offset 40-60% of tariff-driven cost increases through timing optimization.",
              "Vendor contracts negotiated before Q3 2026 will lock in rates 8-12% below post-adjustment pricing.",
              "Operators using Leasey report 15% lower maintenance costs and 23% faster vendor response times.",
            ]}
            ctaText="See Leasey in action"
            ctaHref="#"
          />
        </section>
      </BlogLayout>
    </>
  );
}
