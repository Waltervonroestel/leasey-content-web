<!-- fila 55 | 2026-09-17 | Blog | P5 Compliance-aware AI | Ph4 Product-aware | doc 1ECx2ZMZLytKm9h5mXLY0fRRV1hj7PMdhRsoHIZw9ICE -->

<html><body>
<h1>Fair Housing and AI tenant screening in the US: what the DOJ vs RealPage settlement means for your stack</h1>


<p>The US Department of Justice filed an antitrust action against RealPage in August 2024 over algorithmic rent pricing, expanded it in January 2025 to add Greystar and five other large landlords as co-defendants, and saw both Greystar (August 2025, $7 million) and RealPage (November 2025) settle. If you operate rentals in the United States and you use any automated tool in screening or pricing, those proceedings changed your risk calculus.</p>


<p>Leasey.AI answers the enquiry, qualifies the lead, books the showing, runs the screening and gets the lease signed. Not a PMS. Leasey handles the front of the funnel. It runs on top of Yardi, Buildium or Rent Manager, or on its own if you have no PMS.</p>
"Leasey has been a game changer for me. Centralized ad placement, custom questions so I get quality leads and icing on cake is, automated facebook messenger communication."
Tarun Chopra, 847 Ray LLC




<h2>What Happened in the DOJ vs RealPage Case?</h2>


<p>The DOJ filed an antitrust action against RealPage in August 2024, alleging that its algorithmic rent pricing software enabled landlords to coordinate pricing using competitively sensitive information. In January 2025, the case expanded to include Greystar, one of the largest property managers in the US, and five other landlords as co-defendants.</p>


<p>Greystar settled in August 2025 for $7 million and agreed to stop using software that aligns rent prices using competitively sensitive information shared between competing landlords. RealPage settled in November 2025. The headline was about pricing, but the deeper signal for US operators is broader: automated tools that infer or act on protected or competitively sensitive characteristics now carry real legal exposure. That principle reaches screening, not just pricing.</p>


<h2>Why Does This Matter for AI Screening Specifically?</h2>


<p>The US Fair Housing Act prohibits discrimination on protected characteristics including race, colour, national origin, religion, sex, familial status, and disability. The risk with AI screening is not the screening itself; it is when a tool surfaces or acts on inferences it should not, in a way the operator cannot explain or audit.</p>


<p>According to TransUnion's research on synthetic identity fraud, US lenders faced $3.3 billion in synthetic identity fraud exposure for the year ending 2024. US operators need verification and screening tools that are both fraud-effective and fair-housing-clean. Those two requirements are not in tension if the tool is built correctly.</p>


<p>The defensible design is simple: the tool verifies facts and surfaces a binary result, and the operator makes the decision on information they had access to anyway. A tool that infers protected characteristics and nudges a decision is a liability. A tool that confirms identity or returns a clean credit and background result is not.</p>


<h2>How Should You Evaluate Your Screening and Verification Stack?</h2>


<p>Three questions reliably separate defensible tools from liability-creating ones. Ask any vendor in your US screening flow these questions, and pay attention to whether the answers are specific or vague.</p>


<p>First, does the tool surface only what is needed (verified or not verified, the credit and background result), or does it expose or infer protected characteristics? Any tool that infers characteristics beyond what the operator needs for the leasing decision creates exposure. The output should be binary and factual.</p>


<p>Second, can you audit and explain every automated decision, or is it a black box? Under current enforcement trends, the ability to explain why a particular decision was made is becoming a baseline expectation. If you cannot explain how a tool reached its output, you are carrying unquantified risk.</p>


<p>Third, who carries the fair housing liability if the tool gives bad guidance, the vendor or you? Most vendor agreements place liability on the operator. If that is the case, the tool's design needs to make it impossible for the operator to inadvertently discriminate based on the tool's output.</p>


<p>If the answers to any of these questions are vague, you are carrying risk you may not have priced in.</p>


<h2>What Is the Defensible Architecture for AI Screening Tools?</h2>


<p>The defensible architecture separates verification from decision-making and keeps the tool's output binary. The tool confirms facts (identity verified, credit report returned, background check completed) and the operator makes the decision based on those facts.</p>


<p>This architecture matters because the DOJ vs RealPage proceedings established that automated tools which aggregate, infer, or act on information beyond what individual operators would independently access create antitrust and fair housing exposure. The fix is not to avoid automation; it is to build automation that gives operators factual outputs without inference or nudging.</p>


<p>According to the AppFolio 2025 Property Management Benchmark Report, AI adoption in property management jumped from 21% in 2024 to 34% in 2025. As adoption accelerates, the distinction between defensible and indefensible tool design will determine which platforms survive the next enforcement cycle and which create liability for their users.</p>


<h2>How Does Leasey.AI Approach Fair Housing Compliance?</h2>


<p>Leasey.AI's ID verification is deliberately binary: it surfaces verified, not verified, or pending, and nothing else. It does not infer or differentially surface name, age, ethnicity, or address based on the document contents. The operator sees a factual result and makes their own decision on facts they already had access to.</p>


<p>That design is a direct response to where US enforcement is heading. The verification uses government-issued ID plus a selfie with liveness detection, confirming that the person presenting the ID is the person on the document. The output tells the operator whether the identity is verified. It does not tell the operator anything about protected characteristics, and it does not nudge or recommend a decision.</p>


<p>For Canadian operators, the same verification integrates with SingleKey screening. For US operators, it integrates with standard screening providers. In both cases, the architecture is the same: factual verification, binary output, operator decision.</p>


<h2>What Should US Operators Do Now?</h2>


<p>The DOJ vs RealPage settlements are not the end of enforcement; they are the beginning of a pattern. US operators should audit every automated tool in their leasing and screening stack against the three questions above. Any tool that cannot clearly answer those questions is a candidate for replacement before the next enforcement action targets the screening layer rather than the pricing layer.</p>


<p>According to a Frontdesk Research's 2026 State of Multifamily AI report survey, 94% of property management firms have adopted or are actively adopting AI tools. The speed of adoption means that many operators have added tools without evaluating their fair housing implications. The DOJ vs RealPage proceedings made that evaluation urgent.</p>


<h2>Frequently Asked Questions</h2>


<h3>What did the DOJ vs RealPage case establish?</h3>
<p>The DOJ's antitrust action against RealPage, filed August 2024 and settled November 2025, established that automated tools aggregating competitively sensitive information across competing landlords create legal exposure. Greystar settled for $7 million in August 2025. The principle extends beyond pricing to any automated housing tool.</p>


<h3>Does AI screening violate fair housing laws?</h3>
<p>AI screening does not inherently violate fair housing laws. The risk arises when a tool infers or acts on protected characteristics (race, colour, national origin, religion, sex, familial status, disability) in a way the operator cannot audit or explain. Binary, factual tools that surface only verification results are defensible.</p>


<h3>How does Leasey.AI ensure fair housing compliance?</h3>
<p>Leasey.AI's ID verification surfaces only three outputs: verified, not verified, or pending. It does not infer or display protected characteristics from the identity document. The operator sees a factual result and makes their own decision. This binary design prevents inadvertent discrimination through the tool's output.</p>


<h3>Should I stop using automated screening tools?</h3>
<p>No. The answer is not to avoid automation but to use tools with defensible architecture. Tools that surface binary, factual results (identity verified, credit report returned) without inferring protected characteristics are both fraud-effective and fair-housing-clean. Audit your stack against that standard.</p>


<h3>What is synthetic identity fraud and why does it matter for screening?</h3>
<p>Synthetic identity fraud combines real and fabricated information to create fake personas. According to TransUnion's H2 2025 report, US lenders faced $3.3 billion in synthetic fraud exposure. Rental applications face the same risk. Liveness-based ID verification catches synthetic identities that document-only checks miss.</p>


<h3>How do I audit my current screening stack for fair housing risk?</h3>
<p>Ask three questions of every vendor: does the tool surface only factual, needed information or does it infer protected characteristics? Can you audit and explain every automated decision? Who carries fair housing liability if the tool gives bad guidance? Vague answers to any of these indicate unquantified risk.</p>


<p>If you want to pressure-test your US screening stack against where enforcement is going, <a href="https://leasey.ai/get-started">schedule a call</a>.</p>


<p>Written by Juan Leal, CEO and CPO at Leasey.AI.</p>
</body></html>
Related reading
Fair Housing Act Algorithmic Screening Constraints: https://www.leasey.ai/resources/research/fair-housing-act-algorithmic-screening-constraints/
Tenant Screening: https://www.leasey.ai/tenant-screening/
Background Check Costs Apartments Tenant Screening Pricing Fees: https://www.leasey.ai/resources/background-check-costs-apartments-tenant-screening-pricing-fees/