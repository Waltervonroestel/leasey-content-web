<!-- fila 14 | 2026-08-10 | Reddit (r/LeaseyAI) | P5 Compliance-aware AI | Ph5 Most aware | doc 1D911ufzgxMWpT7bijbtvzGgPoiqMxt8rl-CoWNpEu2Y -->

Leasey.AI ID Verification: biometric check for showings and applications, optional gating


What it does


Biometric ID check on the prospect's phone. Government ID + selfie + liveness detection. Verifies the person matches the ID. Takes ~90 seconds.


Two flows:
* At showing: link sent on booking, optional gating before confirmation.
* At application: embedded in the application form, result attached to the file.


Why it is binary, not inferential


The verification surfaces: verified, not verified, or pending. That is it. We do not infer or surface name, age, ethnicity, or any protected characteristic to the operator. This is deliberate, and aligned with the DOJ's 2025 guidance on automated screening tools.


Limitations


* Government IDs supported: Canadian provincial driver's licences and ID cards, US state driver's licences, US passports, Canadian passports. Other IDs route to manual review.
* Liveness detection rejects 0.2% of legitimate users (poor lighting, low-quality phone camera). Manual retry available.
* Required vs optional is a per-listing setting.


Live as of


August 10, 2026 for all Leasey.AI accounts. Settings → Verification → ID Check.


Feedback welcome.