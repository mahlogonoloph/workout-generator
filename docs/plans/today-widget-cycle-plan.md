# Implementation Plan: Today's Workout Cycle & Native Widget

## 1. Data Model & Architecture

### A. Zustand State (`src/store/useWorkoutStore.js`)
Extend the persisted Zustand store with an `activeCycle` slice (kept separate from `generatedRoutine` so regenerating a routine doesn't silently corrupt an in-progress cycle):

```js
const initialActiveCycle = {
  isActive: false,
  startedAt: null,           // ISO timestamp when user tapped "Start Program"
  startDayIndex: 0,          // User-selected starting split day (0..schedule.length - 1)
  currentDayIndex: 0,        // Index into generatedRoutine.schedule
  currentWeek: 1,            // 1..userProfile.cycleLengthWeeks
  completedInCycle: 0,       // Count of completed sessions in the current week/rotation
  totalWorkoutsCompleted: 0, // Lifetime/program count
  lastCompletedAt: null,     // ISO timestamp (prevents accidental double-taps, shows "Done for today")
};
```

#### Cycle Progression Rules (Completion-Driven)
- **Start / Restart:** User picks `startDayIndex` (defaults to `0`) and taps **Start Program**. Sets `isActive: true`, `currentDayIndex: startDayIndex`, `currentWeek: 1`, `completedInCycle: 0`, `startedAt: now`.
- **Complete Workout:**
  - `nextDayIndex = (currentDayIndex + 1) % schedule.length`
  - `nextCompletedInCycle = completedInCycle + 1`
  - If `nextCompletedInCycle >= schedule.length`, increment `currentWeek` (capped or looped at `cycleLengthWeeks`) and reset `completedInCycle = 0`.
  - Updates `lastCompletedAt = now`.
- **Skip / Jump Day:** User can manually select a different split day if needed without breaking the modulo progression.

### B. Widget Snapshot Bridge (App ↔ Native Widget)
Home screen widgets (iOS WidgetKit / Android AppWidget) cannot read `AsyncStorage` directly. Whenever `activeCycle` or `generatedRoutine` changes, serialize a **minimal, non-sensitive JSON snapshot** to shared native storage (iOS App Group `UserDefaults` / Android `SharedPreferences`):

```json
{
  "version": 1,
  "isActive": true,
  "dayTitle": "Day 2 · Upper Pull",
  "weekLabel": "Week 1 of 8",
  "dayIndex": 1,
  "lastCompletedAt": "2026-11-25T07:30:00.000Z",
  "exercises": [
    { "id": "lat_pulldown", "name": "Lat Pulldown", "prescription": "3 × 10–12" },
    { "id": "chest_supported_row", "name": "Chest-Supported Row", "prescription": "3 × 10–12" }
  ]
}
```

### C. Deep Linking (`src/navigation/AppNavigator.js`)
Configure React Navigation linking with a custom URL scheme (e.g., `figworkout://`) so widget taps land directly on the right screen/exercise:
- `figworkout://today` → Opens **Today** screen
- `figworkout://today?exerciseId=<id>` → Opens **Today** screen and auto-expands / scrolls to that exercise's movement path

---

## 2. Security Risks & Mitigations

Because this feature is local-first (no backend user accounts or OAuth), the attack surface is small, but there are **four real security/privacy risks** to mitigate before App Store release:

1. **Deep Link Injection / Parameter Tampering (`figworkout://today?exerciseId=...`)**
   - *Risk:* Any external app or web link on the device can invoke a custom URL scheme with crafted query parameters (e.g., malformed `exerciseId`, unexpected types, or prototype-pollution keys).
   - *Mitigation:* Strictly validate and allowlist deep-link parameters at the navigation/screen boundary. Only match `exerciseId` against IDs present in the current `generatedRoutine.schedule[currentDayIndex].exercises`; ignore or fall back cleanly on unknown values. Never pass deep-link params to `eval`, dynamic `require`, or raw HTML.

2. **Shared App Group Container Exposure (iOS / Android)**
   - *Risk:* Data written to an App Group (`group.com.tennisclub.workoutgenerator`) or Android `SharedPreferences` is shared across the app and widget extension. Storing PII or sensitive health notes there increases exposure on rooted/jailbroken devices or backups.
   - *Mitigation:* Keep the widget snapshot strictly minimal and non-PII—only workout title, week counter, and exercise names/sets/reps. Never store `userProfile.gender`, exclusion/injury notes, or API keys in the shared widget container. Ensure the App Group identifier is scoped to your Apple Developer Team ID.

3. **Widget Interactive Action Abuse / State Desync (iOS 17+ / Android)**
   - *Risk:* If the widget exposes a "Complete Workout" button (via `AppIntent` / `BroadcastReceiver`), rapid tapping or out-of-sync writes between the widget extension and React Native `AsyncStorage` could corrupt `currentDayIndex` or double-advance the cycle.
   - *Mitigation:* Perform atomic/idempotent state updates (e.g., include `dayIndex` + a debounce/cooldown check on `lastCompletedAt`, or record a `pendingCompletion` flag that the main app reconciles on launch/foreground). Validate schema `version` when reading the snapshot.

4. **Store Supply-Chain & Config Exposure in EAS Builds**
   - *Risk:* Shipping native widget plugins and EAS builds can accidentally bundle `.env.local` secrets or expose unpinned native dependencies.
   - *Mitigation:* Keep `.env*` files out of client bundles (no private API keys in `EXPO_PUBLIC_*`), audit native widget plugins (`@bacons/apple-targets`, `react-native-android-widget`) before adding, and use `eas.json` build profiles cleanly.

---

## 3. Phased Implementation Plan

### Stage 1: In-App Cycle Engine & "Today" Screen (iOS, Android, Web)
1. **Store:** Add `activeCycle` state + `startProgramCycle`, `completeCurrentWorkout`, `setCycleDay`, and `resetCycle` actions in `src/store/useWorkoutStore.js`.
2. **Start Picker UI:** Add a "Start Program" modal/bar on `RoutineScreen.js` allowing the user to pick their starting split day (`0..N-1`).
3. **Today Screen (`src/screens/TodayScreen.js`):**
   - Displays current week (`Week X of Y`), active split day, and exercises with one-tap access to their movement path.
   - Includes **"Complete & Advance"** button and a quick day switcher.
4. **Navigation & Deep Linking:** Register `Today` in `AppNavigator.js` and configure `linking` for `figworkout://today` with strict parameter validation.

### Stage 2: Native Home Screen Widgets (EAS Build Required)
1. **App Group & Plugin Setup:** Add `ios.entitlements` App Group (`group.com.tennisclub.workoutgenerator`) and configure native widget targets via EAS config plugin (`@bacons/apple-targets` for iOS WidgetKit, `react-native-android-widget` for Android).
2. **Bridge Module:** Add a small `src/utils/widgetBridge.js` helper (no-op on Web/Expo Go, writes JSON snapshot + triggers `WidgetCenter.reloadAllTimelines()` on native).
3. **Widget UI:** Build Small (Today's Split + Next Up) and Medium (Today's Split + top 3–4 exercises with 1-tap deep links) widget layouts.
4. **Verification:** Build via `eas build --profile development` and verify deep linking, cycle completion, and widget refresh on physical iOS/Android devices.
