Canal: Reddit r/LeaseyAI (internal changelog)
Calendario ID: M2-019 (Week 7, Sat Jul 25)
Signal: Backlog (ID verification)
Author: Walter (changelog voice)
Status: DRAFT (pending editor-qa + Walter review)

---

**Title:** Leasey.AI ID Verification - biometric check for showings and applications

**Body:**

Shipping ID verification to all accounts this weekend.

The flow. The prospect scans the photo page of their government ID inside the Leasey app, then takes a live capture. The system compares the two using biometric matching and returns a confidence score. The leasing team sees pass / review / fail with the score visible.

Where it triggers. Two places: at the showing (the prospect verifies before the tour starts so the agent knows who they are letting into the unit) and at the application (the application is gated until ID verification is on file).

Why we built it. Two operator pain points. The first is "the person who showed up for the tour was not the person on the application." The second is the time the leasing agent spends verifying ID by eye against a stretched-out phone photo. The biometric layer answers both.

Known limits. The system today supports the most common North American government-issued IDs (US driver's licenses, US state IDs, Canadian provincial driver's licenses, Canadian passports). International documents are best-effort and the score will reflect the lower confidence. The roadmap for v1.1 is expanded international document support.

Drop a comment if your team needs an ID type we are not handling well, or want a specific minimum confidence threshold for the pass/review/fail boundary.
