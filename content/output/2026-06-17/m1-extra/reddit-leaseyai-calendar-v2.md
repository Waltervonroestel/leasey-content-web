Canal: Reddit r/LeaseyAI (internal changelog)
Calendario ID: M1-025 (Week 4, Thu Jul 2)
Signal: Reddit backlog (Ivan draft pending)
Pilar: (n/a — operational changelog)
Author: Walter (changelog voice)
Status: DRAFT (pending editor-qa + Walter review)

Pre-flight: si existe un draft de Ivan, usar el suyo como base. Si no, este draft.

---

**Title:** Leasey.AI Calendar View v2.0 - split layout and overlap tooltips

**Body:**

Pushed Calendar View v2.0 to all accounts this week. Two changes for leasing teams who run heavy showing schedules.

First, split layout. The calendar now optionally splits the day vertically when you have overlapping showings across the same agent or unit. The old single-column view was hiding double-bookings inside the same time block, which we found in support tickets came up most for teams with 80+ showings per week. The split layout makes the overlap visible at a glance so the team can rebook before the conflict becomes a no-show.

Second, overlap tooltips. Hover any time block that contains more than one event and you get a tooltip listing all of them, including agent, unit, and prospect name. Click to open whichever one needs attention without losing the calendar position.

Known limits. The split layout currently only triggers on overlap across the same agent or the same unit. Cross-agent overlaps in different units do not trigger the split yet (we kept the trigger conservative to avoid splitting too aggressively for distributed teams). On our list for v2.1.

Drop a comment if you hit a scenario where the overlap detection misses something, or if you want a configuration toggle for the split trigger.
