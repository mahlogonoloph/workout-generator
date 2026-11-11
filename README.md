# Fig Workout Generator (Fig Fitness)

**Fig Workout Generator** is a zero-distraction, science-based 8-week workout blueprint and printable PDF binder generator built with **Expo (React Native + React Native Web)**.

Designed for lifters and everyday athletes who want an evidence-based program without phone distractions on the gym floor, Fig synthesizes a complete 8-week periodized training routine—complete with vector posture diagrams, anatomical muscle maps, coaching cues, joint-safe substitutions, and an 8-week pen-and-paper tracking matrix—ready to print or save as a PDF on any phone or computer.

---

## ✨ Key Features

- **Deterministic Biomechanical Rule Engine (Zero LLM/API Costs):**
  - Powered by a curated 10-movement-pattern taxonomy (`Horizontal Push`, `Vertical Push`, `Horizontal Pull`, `Vertical Pull`, `Knee-Dominant Squat`, `Hip-Dominant Hinge`, `Unilateral / Lunge`, `Elbow Flexion`, `Elbow Extension`, `Core & Anti-Rotation`).
  - Automatically sequences multi-joint compound lifts before accessory and isolation movements, prioritizes stretch-mediated hypertrophy where appropriate, and balances antagonist planes even in compact 30- and 45-minute sessions.
- **Strict Joint-Sensitivity Shields:**
  - Users can flag sensitive joints (`Shoulders`, `Lower Back`, `Knees`, `Wrists`, `Elbows`).
  - The engine strictly filters out contraindicated movements across primary exercises, warmups, and recommended substitutions—and safely alerts the user rather than falling back to unsafe movements.
- **Adaptive Feedback Loop & Full Customization:**
  - **Heart / Favorite** movements to prioritize them in future blocks.
  - **Smart Auto-Swap** with reason tracking (*Equipment Busy*, *Joint Discomfort*, *Too Complex*, *Dislike*) or browse the full **Exercise Library** to hand-pick replacements.
  - **Fine-Tune Prescriptions:** Customize working sets, rep or isometric hold ranges, rest intervals, exercise order, or add/remove movements per day—with a one-tap **Reset to Original Plan** option.
  - **Session Volume Calibration:** Instantly scale volume and recovery (*Too Easy*, *Just Right*, *Too Brutal*) while preserving science-based compound rest floors.
- **Cross-Platform Printable 8-Week PDF Binder:**
  - Generates a print-optimized 8-week training binder featuring a 4-phase periodization roadmap (Weeks 1–3 Base, Weeks 4–6 Overload, Week 7 Peak, Week 8 Deload), warmup protocol, custom vector posture & force-vector illustrations, and an `8-Week Weight / Reps` tracking grid.
  - Engineered to work seamlessly across Desktop browsers (isolated hidden `<iframe>` print spooler), Mobile Web (iOS Safari & Android Chrome dedicated print view), and Native iOS/Android (`expo-print` + `expo-sharing`).
- **100% Local Privacy:**
  - All user preferences, feedback history, and customized routines are persisted locally on-device (`AsyncStorage` / `localStorage`) via Zustand. No account creation, tracking, or external API keys required.

---

## 🗂 Project Structure

```text
workout-generator/
├── App.js                              # Root provider & NavigationContainer
├── index.js                            # Expo entry point + web Alert polyfill
├── app.json                            # Expo configuration & web metadata
├── vercel.json                         # Vercel static web build & SPA routing config
├── LICENSE                             # MIT License + Third-Party Attribution Notice
└── src/
    ├── api/
    │   └── generationClient.js         # Biomechanical rule engine, scoring, & periodization
    ├── components/
    │   ├── AddExerciseModal.js         # Searchable & filterable exercise catalog modal
    │   ├── ConfirmModal.js             # Cross-platform confirmation & alert modal
    │   ├── EditPrescriptionModal.js    # Sets, reps/hold time, and rest interval editor
    │   └── ExerciseIllustrationSvg.js  # Vector posture diagrams & anatomical muscle maps
    ├── data/
    │   └── wgerExerciseCatalog.js      # Seeded wger exercise & muscle taxonomy database
    ├── navigation/
    │   └── AppNavigator.js             # Native stack navigator (Intake -> Loading -> Routine)
    ├── screens/
    │   ├── IntakeScreen.js             # Parameter configuration & live volume architecture bar
    │   ├── LoadingScreen.js            # Kinetic synthesis transition & safety check handler
    │   └── RoutineScreen.js            # Interactive routine editor, swap drawer, & PDF export
    ├── store/
    │   └── useWorkoutStore.js          # Persisted Zustand state & feedback loop actions
    ├── theme/
    │   └── colors.js                   # Fig Design System color tokens
    └── utils/
        ├── alertPolyfill.js            # Web window.alert / window.confirm polyfill
        └── generateWorkoutPdf.js       # HTML/SVG print builder & cross-platform PDF exporter
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (LTS `>=20.x`, recommended `>=22.13.0`)
- **npm** (or `yarn` / `bun`)

### Installation

```bash
cd workout-generator
npm install
```

### Running Locally

```bash
# Start Expo development server (press 'w' for Web, 'i' for iOS, 'a' for Android)
npm run start

# Start directly on Web
npm run web
```

### Building & Deploying to Web (Vercel)

The app exports as a standalone static web bundle into `dist/` and is pre-configured for **Vercel** via [`vercel.json`](./vercel.json):

```bash
# Build production static web bundle into ./dist
npm run build
```

To deploy to Vercel for friends and family:
```bash
cd workout-generator
npx vercel deploy --prod
```
*(Or import the `workout-generator` directory in [Vercel](https://vercel.com) with Build Command `npm run build` and Output Directory `dist`.)*

---

## 📜 Credits & Open-Source Attribution

### wger Workout Manager (`wger.de`)
Exercise reference identifiers (`wgerId`), exercise names, and anatomical muscle group classifications in [`src/data/wgerExerciseCatalog.js`](./src/data/wgerExerciseCatalog.js) are seeded from and mapped to the open-source **[wger Workout Manager](https://wger.de)** project ([`wger-project/wger`](https://github.com/wger-project/wger)):
- **wger Source Code License:** GNU Affero General Public License v3.0 ([AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html))
- **wger Exercise Data & Community Content License:** Creative Commons Attribution-ShareAlike ([CC-BY-SA](https://creativecommons.org/licenses/by-sa/4.0/))

Custom biomechanical movement pattern rules, periodization blueprints, coaching form cues, and vector posture diagrams in this repository are original works of the **Fig Workout Generator** project.

### Core Open-Source Libraries
- [Expo](https://expo.dev) & [React Native](https://reactnative.dev) (MIT License)
- [React Navigation](https://reactnavigation.org) (MIT License)
- [Zustand](https://github.com/pmndrs/zustand) (MIT License)
- [react-native-svg](https://github.com/software-mansion/react-native-svg) (MIT License)

---

## ⚠️ Medical & Physical Activity Disclaimer

**Fig Workout Generator** provides general strength, hypertrophy, and conditioning templates for **educational and informational purposes only**. It does not constitute medical advice, physical therapy, or clinical diagnosis. Always consult a physician or qualified healthcare professional before beginning any new exercise program—especially if you have pre-existing medical conditions, cardiovascular concerns, or joint injuries. Discontinue any exercise immediately if you experience sharp pain, dizziness, or unusual discomfort.

---

## 📄 License

This project's application source code is licensed under the **MIT License** — see [`LICENSE`](./LICENSE) for full details and third-party notices.

