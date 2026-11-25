# Statement of Intent: Today's Workout Cycle & Home Screen Widget

- **Outcome:** A completion-driven **"Today’s Workout" cycle** in the app paired with a **native home screen widget** that shows today's split/exercises and deep-links in 1 tap to the in-app workout view (with movement paths).
- **User:** You, your friends, and public App Store / Google Play users.
- **Why now:** Opening and scrolling a static PDF every gym session is too much friction, and you’re aiming to ship the app to the App Stores.
- **Success:** A user generates a routine, picks their starting split day, sees Today’s workout right on their home screen, taps straight into any exercise's movement path, and marks the day complete to auto-cycle to the next split day (even if they miss days).
- **Constraint:** Home screen widgets cannot play animated movement paths (so animation/guides stay 1 tap away inside the app), and native widgets require EAS builds rather than Expo Go.
- **Out of scope:** Google Calendar integration / OAuth, fixed weekday scheduling, and complex rest-day rules for v1.
