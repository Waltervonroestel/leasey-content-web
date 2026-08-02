"use client";

export default function ListingKitPage() {
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
          2026 Rental Listing Optimization Kit
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          5 platform-specific listing templates + quality checklists to maximize inquiries and reduce vacancy days.
        </p>
        <button
          onClick={() => window.print()}
          className="no-print mt-6 bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
        >
          Download as PDF
        </button>
      </div>

      {/* Why this matters */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold mb-3 accent">Why Listing Quality Matters</h2>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-accent-light rounded-lg p-4">
            <div className="text-2xl font-bold accent">3x</div>
            <div className="text-sm text-gray-600">more inquiries from optimized listings vs. generic ones</div>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <div className="text-2xl font-bold accent">12 days</div>
            <div className="text-sm text-gray-600">faster lease-up with quality photos + descriptions</div>
          </div>
          <div className="bg-accent-light rounded-lg p-4">
            <div className="text-2xl font-bold accent">47%</div>
            <div className="text-sm text-gray-600">of renters skip listings missing key details</div>
          </div>
        </div>
      </section>

      {/* Template 1: Zillow */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">ZILLOW / TRULIA</span>
          <h3 className="text-lg font-bold">Template 1</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
{`[HEADLINE — 70 chars max, front-load neighborhood + key feature]
Sunny 2BR in [Neighborhood] — Updated Kitchen, In-Unit W/D, Pet-Friendly

[OPENING HOOK — answer "why this unit?" in 1 sentence]
Move into this recently renovated [beds]BR/[baths]BA [unit type] in the heart of [neighborhood], just [X] minutes from [landmark/transit].

[UNIT HIGHLIGHTS — bullet format, Zillow renders these well]
• [X] sq ft of living space with [hardwood floors / LVP / carpet]
• Updated kitchen with [granite/quartz] counters, [stainless steel] appliances, [dishwasher Y/N]
• In-unit washer/dryer [OR] shared laundry on-site
• [Balcony / patio / yard access] with [view description]
• [Central A/C / window units / mini-split] + [gas/electric] heat
• [X] parking spot(s) included [OR] street parking available

[BUILDING & COMMUNITY AMENITIES — only list what exists]
• [Fitness center / pool / rooftop / package lockers / bike storage]
• [Controlled access / on-site management / maintenance portal]

[NEIGHBORHOOD & COMMUTE — Zillow users search by location]
Walk Score: [XX] | Transit Score: [XX]
[X]-min walk to [grocery store] | [X]-min drive to [highway/downtown]
Near [school district name] for families

[LEASE TERMS — be specific, reduces unqualified inquiries]
Rent: $[amount]/mo | Security deposit: $[amount]
Lease term: [12/6/flexible] months | Available: [date]
[Pets allowed: cats/dogs, $X deposit + $X/mo pet rent] [OR] [No pets]
Application fee: $[amount] per applicant

[CTA]
Schedule a showing today — apply online at [link] or call [phone].`}
        </div>
        <div className="text-sm text-gray-500">
          <strong>Zillow tips:</strong> Zillow truncates descriptions after ~250 chars in search results. Put your strongest selling point in the first sentence. Use all 29 photo slots — listings with 20+ photos get 2x more saves.
        </div>
      </section>

      {/* Template 2: Apartments.com */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm print-break">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">APARTMENTS.COM</span>
          <h3 className="text-lg font-bold">Template 2</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
{`[COMMUNITY NAME / PROPERTY NAME]

[LIFESTYLE PARAGRAPH — Apartments.com favors narrative descriptions]
Welcome to [Property Name], where modern living meets convenience in [city/neighborhood]. Whether you're commuting downtown or enjoying a quiet weekend at home, this [beds]BR/[baths]BA residence offers the space, comfort, and amenities that today's renter expects.

[UNIT FEATURES — paragraph + bullets hybrid works best here]
Each home features:
• Open-concept floor plan with [X] sq ft
• Full-size [stainless/black/white] appliance package including [dishwasher, microwave, disposal]
• [Vinyl plank / hardwood / tile] flooring throughout living areas
• Large closets with [walk-in / reach-in / built-in organizer]
• Private [balcony / patio] | [ceiling fans / smart thermostat]
• In-unit [W/D connections OR full-size W/D included]

[COMMUNITY AMENITIES — Apartments.com displays these as filterable tags]
Resident perks include:
• [Resort-style pool / fitness center / clubhouse / business center]
• [Dog park / pet washing station / pet-friendly community]
• [Package lockers / Amazon Hub / concierge]
• [Covered/garage/surface] parking [included / $X/mo additional]
• 24/7 emergency maintenance + online resident portal

[NEIGHBORHOOD]
Located near [major intersection / highway], with easy access to [employers, shopping, dining]. [Transit line] is [X] minutes away. Zoned for [school district].

[PRICING & AVAILABILITY]
Starting at $[amount]/mo | [Multiple floor plans available]
[X]-month lease | Move-in special: [describe if applicable]

[CTA]
Schedule your tour today! Apply online or contact our leasing office at [phone/email].`}
        </div>
        <div className="text-sm text-gray-500">
          <strong>Apartments.com tips:</strong> Use their amenity tags system — check every relevant box in the backend. Properties with 3D tours get 49% more engagement. Respond to inquiries within 6 hours to keep your response-time badge.
        </div>
      </section>

      {/* Template 3: Facebook Marketplace */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">FB MARKETPLACE</span>
          <h3 className="text-lg font-bold">Template 3</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
{`[TITLE — short, scannable, emoji optional on FB]
🏠 [Beds]BR/[Baths]BA in [Neighborhood] — $[Rent]/mo — Available [Date]

[KEEP IT SHORT — FB users scroll fast, mobile-first]
Renovated [unit type] in [neighborhood/city]. Move-in ready [date].

✅ [X] sq ft
✅ Updated kitchen + [key appliance]
✅ [W/D in-unit OR on-site laundry]
✅ [Parking included / street parking]
✅ [Pet-friendly / No pets]
✅ [A/C + heat included]

Rent: $[amount]/mo
Deposit: $[amount]
Lease: [X] months
Utilities: [included / tenant pays electric+gas / etc.]

[LOCATION HOOK — FB users are hyper-local]
📍 [X] min from [local landmark everyone knows]
📍 Near [grocery store / transit stop / school]

[CTA — direct and simple]
DM me to schedule a showing or call/text [phone].
Application + credit check required.

⚠️ This is NOT a scam — in-person showing required before any payment. Never send money without seeing the unit.`}
        </div>
        <div className="text-sm text-gray-500">
          <strong>FB Marketplace tips:</strong> Lead with the best photo (exterior or living room). Repost every 5-7 days to stay fresh in the algorithm. Always include the scam disclaimer — it builds trust and FB rewards it. Respond to Messenger inquiries within 1 hour.
        </div>
      </section>

      {/* Template 4: Zumper */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm print-break">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">ZUMPER / PADMAPPER</span>
          <h3 className="text-lg font-bold">Template 4</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
{`[HEADLINE — Zumper shows first 100 chars prominently]
Bright [Beds]BR with [Top Feature] in [Neighborhood] — Available [Month]

[CONCISE DESCRIPTION — Zumper's audience skews younger, 25-35]
Modern [beds]BR/[baths]BA [apartment/condo/townhome] in [neighborhood]. [One sentence about what makes it special — renovation, view, location, price point].

UNIT DETAILS
→ [X] sq ft | [Floor level] floor
→ [Flooring type] throughout
→ Kitchen: [countertop material], [appliance list]
→ Bathroom: [tub/shower, updated Y/N]
→ [W/D hookups / in-unit / shared]
→ Storage: [closet size / additional storage unit]
→ Climate: [A/C type + heating type]

BUILDING
→ [Year built / recently renovated]
→ [Elevator / walk-up]
→ [Laundry / gym / roof / courtyard]
→ [Parking: included / additional / none]

PET POLICY
→ [Cats OK / Dogs OK (breed/weight restrictions) / No pets]
→ [Pet deposit: $X | Pet rent: $X/mo]

LEASE & COSTS
→ $[rent]/mo | $[deposit] deposit
→ [X]-month lease minimum
→ Move-in costs: first + deposit [+ last month if applicable]
→ Available: [exact date]

Apply directly on Zumper or contact [name] at [email/phone].`}
        </div>
        <div className="text-sm text-gray-500">
          <strong>Zumper tips:</strong> Enable instant applications — Zumper's "Apply Now" feature drives 35% more apps. Use the landlord dashboard to track views and compare to similar listings in your area.
        </div>
      </section>

      {/* Template 5: Craigslist */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">CRAIGSLIST</span>
          <h3 className="text-lg font-bold">Template 5</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
{`[TITLE — Craigslist has a 70-char limit, pack it dense]
$[Rent] / [Beds]br - [Sq ft]ft² - [Neighborhood] - [Key feature] - Avail [Date]

[BODY — CL is plain text, use clear formatting]

===== THE UNIT =====
- [Beds] bedroom, [baths] bathroom [apartment/house/condo]
- [X] square feet
- [Floor level / unit number if comfortable sharing]
- [Flooring: hardwood / carpet / tile / LVP]
- Kitchen: [full-size appliances / updated / gas or electric stove]
- [Washer/dryer: in-unit / hookups / shared / laundromat nearby]
- [A/C: central / window / none] | Heat: [forced air / radiator / baseboard]
- [Closet space / storage]

===== THE BUILDING =====
- [# units in building / single family / duplex]
- [Laundry: on-site / in-unit / coin-op]
- [Parking: driveway / garage / lot / street]
- [Outdoor space: yard / patio / balcony / shared]
- [Other: buzzer entry / bike rack / elevator]

===== LOCATION =====
Cross streets: [street] & [street]
Near: [grocery], [transit], [park/school]
Commute: [X] min to [downtown / major employer] by [car/bus/train]

===== LEASE TERMS =====
Rent: $[amount]/month
Deposit: $[amount]
Lease: [X] months, starting [date]
Utilities included: [water / trash / none / all]
Tenant pays: [electric / gas / internet]

===== PET POLICY =====
[Cats/dogs OK with $X deposit] OR [No pets, sorry]

===== TO APPLY =====
1. Reply to this ad OR call/text [phone]
2. Schedule an in-person showing
3. Fill out application ($[X] fee, credit + background check)

** Please do NOT send money or sign anything before seeing the unit in person. **
** I will NEVER ask you to wire money or pay via gift cards. **`}
        </div>
        <div className="text-sm text-gray-500">
          <strong>Craigslist tips:</strong> Renew your post every 48 hours (free). Include 24 photos — max allowed. Post between 8-10 AM local time for best visibility. The scam disclaimer is essential for CL — it reduces flags and builds trust.
        </div>
      </section>

      {/* Quality Checklist */}
      <section className="card bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm print-break">
        <h2 className="text-xl font-bold mb-4 accent">Listing Quality Checklist</h2>
        <p className="text-gray-500 text-sm mb-5">Score each listing before publishing. Aim for 90%+ on every listing.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-3">Photos (40 points)</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Minimum 15 photos uploaded (10 pts)",
                "First photo is exterior or best room (5 pts)",
                "All major rooms included: kitchen, living, bed, bath (5 pts)",
                "Photos are well-lit (natural light preferred) (5 pts)",
                "No personal items / clutter visible (5 pts)",
                "Photos are landscape orientation, not portrait (5 pts)",
                "Amenity photos included: laundry, parking, gym (5 pts)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 mt-0.5 border-2 border-gray-300 rounded flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-3">Description (30 points)</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Headline includes neighborhood + beds + key feature (5 pts)",
                "Exact square footage listed (5 pts)",
                "All appliances and features named specifically (5 pts)",
                "Pet policy is explicit — not vague (5 pts)",
                "Lease terms and move-in costs are clear (5 pts)",
                "No spelling or grammar errors (5 pts)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 mt-0.5 border-2 border-gray-300 rounded flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-3">Accuracy (20 points)</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Rent amount matches current pricing (5 pts)",
                "Availability date is correct and updated (5 pts)",
                "Address / cross streets are accurate (5 pts)",
                "Amenities listed actually exist and are operational (5 pts)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 mt-0.5 border-2 border-gray-300 rounded flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-3">Distribution (10 points)</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Posted on 3+ platforms simultaneously (5 pts)",
                "Platform-specific fields are filled (tags, amenities) (3 pts)",
                "Syndication feeds are active and verified (2 pts)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-block w-4 h-4 mt-0.5 border-2 border-gray-300 rounded flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-accent-light rounded-lg p-4 text-sm">
          <strong className="accent">Scoring:</strong> 90-100 = Publish confidently | 70-89 = Fix gaps before posting | Below 70 = Do not publish, rework needed
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8 border-t border-gray-200">
        <div className="text-sm text-gray-400 mb-2">Brought to you by</div>
        <div className="text-xl font-bold accent mb-2">Leasey.AI</div>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
          Automate listing syndication, quality scoring, and inquiry tracking across all your platforms — in one dashboard.
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
