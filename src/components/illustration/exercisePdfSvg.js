/**
 * Generates raw inline SVG markup for embedding in the PDF export (`generateWorkoutPdf.js`).
 * 1-to-1 exact visual match with the app's ExerciseIllustrationSvg posture diagrams.
 */
const EXERCISE_PDF_SVG_PATHS = {
  bench_press: `
      <rect x="22" y="68" width="58" height="5" rx="2" fill="#96839B" />
      <line x1="30" y1="73" x2="30" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="72" y1="73" x2="72" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="28" cy="60" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="63" x2="72" y2="63" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="72" y1="63" x2="88" y2="70" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="88" y1="70" x2="88" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="44" y1="63" x2="44" y2="36" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="44" cy="63" r="3" fill="#C84663" />
      <line x1="32" y1="34" x2="56" y2="34" stroke="#C84663" stroke-width="3" />
      <rect x="40" y="27" width="8" height="14" rx="2" fill="#C84663" />
      <line x1="64" y1="54" x2="64" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="64,18 60,26 68,26" fill="#C84663" />
  `,
  floor_press: `
      <rect x="16" y="88" width="88" height="4" rx="2" fill="#96839B" />
      <circle cx="26" cy="81" r="5.5" fill="#FAF4F0" />
      <line x1="33" y1="84" x2="68" y2="84" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="68" y1="84" x2="80" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="80" y1="66" x2="92" y2="88" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="42" y1="84" x2="42" y2="56" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="84" r="3" fill="#C84663" />
      <rect x="35" y="51" width="14" height="6" rx="2" fill="#C84663" />
      <line x1="58" y1="72" x2="58" y2="34" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="58,28 54,36 62,36" fill="#C84663" />
  `,
  incline_press: `
      <line x1="28" y1="45" x2="62" y2="74" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="62" y1="74" x2="78" y2="70" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="40" y1="58" x2="40" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="68" y1="74" x2="68" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="36" cy="40" r="5.5" fill="#FAF4F0" />
      <line x1="40" y1="46" x2="62" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="62" y1="68" x2="82" y2="68" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="82" y1="68" x2="86" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="52" x2="48" y2="25" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="46" cy="52" r="3" fill="#C84663" />
      <rect x="42" y="20" width="12" height="6" rx="2" fill="#C84663" />
      <line x1="64" y1="48" x2="64" y2="20" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="64,14 60,22 68,22" fill="#C84663" />
  `,
  machine_chest_press: `
      <line x1="28" y1="22" x2="28" y2="92" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="68" x2="50" y2="68" stroke="#96839B" stroke-width="4" />
      <circle cx="38" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="36" x2="36" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="64" x2="56" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="66" x2="58" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="42" x2="68" y2="42" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="36" cy="42" r="3" fill="#C84663" />
      <line x1="62" y1="16" x2="70" y2="48" stroke="#C84663" stroke-width="3" />
      <line x1="74" y1="42" x2="98" y2="42" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="104,42 96,38 96,46" fill="#C84663" />
  `,
  pushup: `
      <circle cx="88" cy="46" r="5.5" fill="#FAF4F0" />
      <line x1="82" y1="50" x2="24" y2="86" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="54" x2="70" y2="72" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="70" y1="72" x2="76" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="76" cy="54" r="3" fill="#C84663" />
      <circle cx="70" cy="72" r="2.5" fill="#C84663" />
      <line x1="58" y1="44" x2="58" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="58,18 54,26 62,26" fill="#C84663" />
  `,
  decline_pushup: `
      <rect x="14" y="64" width="22" height="28" rx="3" fill="#96839B" />
      <circle cx="90" cy="60" r="5.5" fill="#FAF4F0" />
      <line x1="84" y1="62" x2="28" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="62" x2="74" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="74" y1="76" x2="80" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="78" cy="62" r="3" fill="#C84663" />
      <line x1="88" y1="46" x2="88" y2="24" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="88,18 84,26 92,26" fill="#C84663" />
  `,
  pike_pushup: `
      <line x1="28" y1="91" x2="54" y2="34" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="54" cy="34" r="4" fill="#C84663" />
      <line x1="54" y1="34" x2="78" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="82" cy="72" r="5" fill="#FAF4F0" />
      <line x1="74" y1="62" x2="84" y2="91" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="94" y1="66" x2="80" y2="38" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="77,32 77,41 85,37" fill="#C84663" />
  `,
  dip: `
      <line x1="34" y1="54" x2="86" y2="54" stroke="#96839B" stroke-width="3.5" />
      <line x1="40" y1="54" x2="40" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="80" y1="54" x2="80" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="64" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="62" y1="29" x2="54" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="54" y1="58" x2="52" y2="78" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="78" x2="40" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="60" y1="34" x2="48" y2="42" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="48" y1="42" x2="58" y2="54" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="48" cy="42" r="3" fill="#C84663" />
      <line x1="82" y1="44" x2="82" y2="20" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="82,14 78,22 86,22" fill="#C84663" />
  `,
  overhead_press: `
      <circle cx="56" cy="36" r="5.5" fill="#FAF4F0" />
      <line x1="56" y1="43" x2="56" y2="68" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="56" y1="68" x2="48" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="68" x2="64" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="45" x2="40" y2="34" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="40" y1="34" x2="42" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="45" x2="72" y2="34" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="72" y1="34" x2="70" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="40" cy="34" r="2.8" fill="#C84663" />
      <circle cx="72" cy="34" r="2.8" fill="#C84663" />
      <line x1="26" y1="18" x2="86" y2="18" stroke="#C84663" stroke-width="3" />
      <rect x="30" y="13" width="5" height="10" rx="1.5" fill="#C84663" />
      <rect x="77" y="13" width="5" height="10" rx="1.5" fill="#C84663" />
      <polygon points="56,6 52,13 60,13" fill="#C84663" />
  `,
  lateral_raise: `
      <circle cx="60" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="33" x2="60" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="62" x2="52" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="60" y1="62" x2="68" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="36" x2="26" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="62" y1="36" x2="94" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="56" cy="36" r="3" fill="#C84663" />
      <circle cx="64" cy="36" r="3" fill="#C84663" />
      <rect x="20" y="34" width="6" height="8" rx="1.5" fill="#C84663" />
      <rect x="94" y="34" width="6" height="8" rx="1.5" fill="#C84663" />
      <path d="M36 58 Q24 50 24 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <path d="M84 58 Q96 50 96 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
  `,
  lat_pulldown: `
      <line x1="60" y1="4" x2="60" y2="20" stroke="#96839B" stroke-width="2" />
      <line x1="30" y1="20" x2="90" y2="20" stroke="#C84663" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="60" cy="40" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="47" x2="60" y2="72" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="72" x2="76" y2="72" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="76" y1="72" x2="76" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="48" x2="38" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="38" y1="38" x2="36" y2="20" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="64" y1="48" x2="82" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="82" y1="38" x2="84" y2="20" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="28" y1="28" x2="28" y2="48" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="28,53 24,45 32,45" fill="#C84663" />
      <line x1="92" y1="28" x2="92" y2="48" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="92,53 88,45 96,45" fill="#C84663" />
  `,
  pullup: `
      <line x1="26" y1="14" x2="94" y2="14" stroke="#96839B" stroke-width="4" stroke-linecap="round" />
      <circle cx="60" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="31" x2="60" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="60" x2="58" y2="82" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="82" x2="50" y2="76" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="34" x2="40" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="40" y1="28" x2="44" y2="14" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="64" y1="34" x2="80" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="80" y1="28" x2="76" y2="14" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="28" y1="54" x2="28" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="28,20 24,28 32,28" fill="#C84663" />
  `,
  straight_arm_pulldown: `
      <line x1="90" y1="10" x2="90" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="90" y1="14" x2="62" y2="48" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="44" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="42" y1="33" x2="32" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="32" y1="58" x2="36" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="42" y1="35" x2="62" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="35" r="3" fill="#C84663" />
      <path d="M72 30 Q68 50 50 62" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="45,65 54,64 50,57" fill="#C84663" />
  `,
  db_pullover: `
      <rect x="26" y="66" width="54" height="5" rx="2" fill="#96839B" />
      <line x1="34" y1="71" x2="34" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="72" y1="71" x2="72" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="30" cy="58" r="5.5" fill="#FAF4F0" />
      <line x1="37" y1="61" x2="74" y2="61" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="74" y1="61" x2="88" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="38" y1="59" x2="18" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="12" y="32" width="10" height="6" rx="2" fill="#C84663" />
      <path d="M18 28 Q34 14 50 32" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="54,36 51,28 45,33" fill="#C84663" />
  `,
  row: `
      <circle cx="76" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="70" y1="35" x2="40" y2="54" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="40" y1="54" x2="48" y2="72" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="48" y1="72" x2="44" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="64" y1="39" x2="52" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="52" y1="28" x2="62" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="52" cy="28" r="3" fill="#C84663" />
      <circle cx="62" cy="50" r="5.5" fill="#C84663" />
      <line x1="74" y1="70" x2="64" y2="56" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="61,51 62,60 69,55" fill="#C84663" />
  `,
  one_arm_db_row: `
      <rect x="52" y="64" width="44" height="5" rx="2" fill="#96839B" />
      <line x1="58" y1="69" x2="58" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="90" y1="69" x2="90" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="86" cy="36" r="5" fill="#FAF4F0" />
      <line x1="78" y1="40" x2="38" y2="42" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="40" x2="82" y2="64" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3" stroke-linecap="round" />
      <line x1="42" y1="42" x2="60" y2="64" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="38" y1="42" x2="26" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="70" y1="40" x2="56" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="56" y1="28" x2="58" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="56" cy="28" r="3" fill="#C84663" />
      <rect x="52" y="48" width="12" height="5" rx="1.5" fill="#C84663" />
      <path d="M68 62 Q58 58 56 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="56,38 52,46 60,46" fill="#C84663" />
  `,
  seated_cable_row: `
      <rect x="20" y="70" width="60" height="4" rx="2" fill="#96839B" />
      <line x1="78" y1="54" x2="78" y2="74" stroke="#96839B" stroke-width="4" />
      <line x1="98" y1="20" x2="98" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="98" y1="50" x2="52" y2="50" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="36" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="37" x2="36" y2="68" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="36" y1="68" x2="56" y2="60" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="60" x2="76" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="44" x2="26" y2="52" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="26" y1="52" x2="48" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="26" cy="52" r="3" fill="#C84663" />
      <line x1="74" y1="42" x2="50" y2="42" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="44,42 52,38 52,46" fill="#C84663" />
  `,
  chest_supported_row: `
      <line x1="32" y1="78" x2="76" y2="38" stroke="#96839B" stroke-width="5" stroke-linecap="round" />
      <line x1="42" y1="70" x2="42" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="70" y1="44" x2="70" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="80" cy="28" r="5" fill="#FAF4F0" />
      <line x1="72" y1="34" x2="38" y2="66" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="38" y1="66" x2="24" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="66" y1="40" x2="54" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="54" y1="30" x2="62" y2="54" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="30" r="3" fill="#C84663" />
      <rect x="56" y="54" width="12" height="5" rx="1.5" fill="#C84663" />
      <line x1="84" y1="68" x2="84" y2="44" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="84,38 80,46 88,46" fill="#C84663" />
  `,
  inverted_row: `
      <line x1="42" y1="24" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="42" cy="38" r="4" fill="#C84663" />
      <circle cx="30" cy="48" r="5" fill="#FAF4F0" />
      <line x1="36" y1="52" x2="88" y2="88" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="42" y1="55" x2="42" y2="38" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="42" cy="55" r="3" fill="#C84663" />
      <line x1="62" y1="58" x2="52" y2="38" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="49,32 49,41 57,37" fill="#C84663" />
  `,
  face_pull: `
      <line x1="94" y1="12" x2="94" y2="92" stroke="#96839B" stroke-width="3.5" />
      <line x1="94" y1="30" x2="54" y2="30" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="36" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="36" y1="33" x2="36" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="64" x2="30" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="64" x2="42" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="36" y1="36" x2="24" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="24" y1="30" x2="46" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="24" cy="30" r="3" fill="#C84663" />
      <line x1="78" y1="22" x2="54" y2="22" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="48,22 56,18 56,26" fill="#C84663" />
  `,
  squat: `
      <circle cx="66" cy="24" r="5.5" fill="#FAF4F0" />
      <circle cx="60" cy="31" r="5" fill="#C84663" />
      <line x1="60" y1="31" x2="42" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="42" cy="58" r="3.5" fill="#C84663" />
      <line x1="42" y1="58" x2="70" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="70" cy="60" r="3" fill="#C84663" />
      <line x1="70" y1="60" x2="58" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  goblet_squat: `
      <circle cx="62" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="29" x2="44" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="44" cy="58" r="3.5" fill="#C84663" />
      <line x1="44" y1="58" x2="72" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="72" y1="58" x2="62" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="32" x2="66" y2="44" stroke="#FAF4F0" stroke-width="3" stroke-linecap="round" />
      <line x1="66" y1="44" x2="74" y2="34" stroke="#FAF4F0" stroke-width="3" stroke-linecap="round" />
      <rect x="72" y="28" width="7" height="12" rx="2" fill="#C84663" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  air_squat: `
      <circle cx="62" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="31" x2="42" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="42" cy="58" r="3.5" fill="#C84663" />
      <line x1="42" y1="58" x2="70" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="70" y1="60" x2="60" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="58" y1="33" x2="90" y2="33" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="26" y1="64" x2="26" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="26,18 22,27 30,27" fill="#C84663" />
  `,
  wall_sit: `
      <line x1="28" y1="14" x2="28" y2="92" stroke="#96839B" stroke-width="4.5" />
      <circle cx="36" cy="28" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="35" x2="35" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="35" cy="62" r="3.5" fill="#C84663" />
      <line x1="35" y1="62" x2="66" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="66" cy="62" r="3.5" fill="#C84663" />
      <line x1="66" y1="62" x2="66" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <path d="M58 62 L58 70 L66 70" stroke="#C84663" stroke-width="1.5" fill="none" />
      <line x1="50" y1="52" x2="38" y2="52" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="35,52 41,49 41,55" fill="#C84663" />
  `,
  leg_press: `
      <line x1="24" y1="86" x2="54" y2="86" stroke="#96839B" stroke-width="4" />
      <line x1="24" y1="86" x2="18" y2="64" stroke="#96839B" stroke-width="4" />
      <circle cx="24" cy="56" r="5" fill="#FAF4F0" />
      <line x1="26" y1="63" x2="36" y2="82" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="82" x2="50" y2="60" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="60" x2="72" y2="44" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="50" cy="60" r="3" fill="#C84663" />
      <line x1="66" y1="34" x2="80" y2="54" stroke="#C84663" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="40" x2="94" y2="24" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="98,20 89,23 95,29" fill="#C84663" />
  `,
  leg_extension: `
      <line x1="28" y1="28" x2="28" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="62" x2="58" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="42" y1="62" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="36" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="31" x2="35" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="35" y1="58" x2="60" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="60" cy="58" r="3.5" fill="#C84663" />
      <line x1="60" y1="58" x2="86" y2="46" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="84" cy="47" r="4" fill="#C84663" />
      <path d="M68 82 Q88 74 90 52" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="90,46 86,54 94,54" fill="#C84663" />
  `,
  leg_curl: `
      <line x1="28" y1="28" x2="28" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="28" y1="62" x2="58" y2="62" stroke="#96839B" stroke-width="4" />
      <line x1="42" y1="62" x2="42" y2="92" stroke="#96839B" stroke-width="3.5" />
      <circle cx="36" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="35" y1="31" x2="35" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="35" y1="58" x2="62" y2="58" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="62" cy="58" r="3.5" fill="#C84663" />
      <line x1="62" y1="58" x2="54" y2="84" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="54" cy="82" r="4" fill="#C84663" />
      <path d="M88 58 Q82 78 62 84" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="56,85 64,81 64,89" fill="#C84663" />
  `,
  hinge: `
      <circle cx="78" cy="32" r="5.5" fill="#FAF4F0" />
      <line x1="72" y1="36" x2="36" y2="50" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="36" cy="50" r="3.5" fill="#C84663" />
      <line x1="36" y1="50" x2="52" y2="70" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="52" y1="70" x2="50" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="66" y1="39" x2="64" y2="68" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="64" cy="70" r="5.5" fill="#C84663" />
      <line x1="32" y1="50" x2="16" y2="50" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="12,50 19,46 19,54" fill="#C84663" />
  `,
  glute_bridge: `
      <rect x="18" y="64" width="20" height="27" rx="3" fill="#96839B" />
      <circle cx="24" cy="56" r="5" fill="#FAF4F0" />
      <line x1="30" y1="60" x2="68" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="68" cy="58" r="4" fill="#C84663" />
      <line x1="68" y1="58" x2="84" y2="62" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="84" y1="62" x2="84" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="64" y1="50" x2="64" y2="26" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="64,20 60,28 68,28" fill="#C84663" />
  `,
  lunge: `
      <circle cx="58" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="58" y1="29" x2="56" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="58" x2="78" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="60" x2="78" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="78" cy="60" r="3" fill="#C84663" />
      <line x1="56" y1="58" x2="48" y2="82" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="48" y1="82" x2="26" y2="86" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <circle cx="48" cy="82" r="3" fill="#C84663" />
      <line x1="94" y1="60" x2="94" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="94,20 90,28 98,28" fill="#C84663" />
  `,
  bulgarian_split_squat: `
      <rect x="14" y="66" width="18" height="25" rx="3" fill="#96839B" />
      <circle cx="60" cy="22" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="29" x2="56" y2="58" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="58" x2="78" y2="60" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="78" y1="60" x2="78" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <circle cx="78" cy="60" r="3" fill="#C84663" />
      <line x1="56" y1="58" x2="46" y2="78" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="78" x2="24" y2="66" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <circle cx="46" cy="78" r="3" fill="#C84663" />
      <line x1="94" y1="60" x2="94" y2="26" stroke="#C84663" stroke-width="2" stroke-dasharray="3,2" />
      <polygon points="94,20 90,28 98,28" fill="#C84663" />
  `,
  calf_raise: `
      <rect x="34" y="84" width="32" height="8" rx="2" fill="#96839B" />
      <circle cx="54" cy="14" r="5.5" fill="#FAF4F0" />
      <line x1="54" y1="21" x2="54" y2="50" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="54" y1="50" x2="54" y2="76" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="54" cy="76" r="3" fill="#C84663" />
      <line x1="54" y1="76" x2="44" y2="84" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="74" y1="84" x2="74" y2="60" stroke="#C84663" stroke-width="2.2" stroke-dasharray="3,2" />
      <polygon points="74,54 70,62 78,62" fill="#C84663" />
  `,
  bicep_curl: `
      <circle cx="52" cy="20" r="5.5" fill="#FAF4F0" />
      <line x1="52" y1="27" x2="52" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="52" y1="60" x2="48" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="60" x2="58" y2="91" stroke="rgba(250, 244, 240, 0.45)" stroke-width="4" stroke-linecap="round" />
      <line x1="52" y1="30" x2="54" y2="50" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="50" r="3" fill="#C84663" />
      <line x1="54" y1="50" x2="72" y2="36" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="74" cy="34" r="4" fill="#C84663" />
      <path d="M72 58 Q84 46 78 30" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="76,26 75,34 82,31" fill="#C84663" />
  `,
  incline_curl: `
      <line x1="26" y1="34" x2="56" y2="70" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="56" y1="70" x2="74" y2="68" stroke="#96839B" stroke-width="4.5" stroke-linecap="round" />
      <line x1="36" y1="48" x2="36" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="64" y1="70" x2="64" y2="92" stroke="#96839B" stroke-width="3" />
      <circle cx="34" cy="26" r="5.5" fill="#FAF4F0" />
      <line x1="38" y1="33" x2="58" y2="64" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="58" y1="64" x2="78" y2="66" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="78" y1="66" x2="82" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="40" y1="36" x2="40" y2="58" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="40" cy="58" r="3" fill="#C84663" />
      <line x1="40" y1="58" x2="60" y2="44" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="58" y="38" width="10" height="5" rx="1.5" fill="#C84663" />
      <path d="M46 72 Q68 64 66 44" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="66,38 62,46 70,46" fill="#C84663" />
  `,
  tricep_ext: `
      <line x1="88" y1="10" x2="88" y2="92" stroke="#96839B" stroke-width="3" />
      <line x1="88" y1="14" x2="66" y2="48" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="46" cy="20" r="5.5" fill="#FAF4F0" />
      <line x1="46" y1="27" x2="44" y2="60" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="44" y1="60" x2="42" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="30" x2="48" y2="48" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="48" cy="48" r="3" fill="#C84663" />
      <line x1="48" y1="48" x2="64" y2="64" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <path d="M68 44 Q74 56 66 68" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="64,72 64,64 71,68" fill="#C84663" />
  `,
  overhead_tricep_ext: `
      <circle cx="56" cy="30" r="5.5" fill="#FAF4F0" />
      <line x1="56" y1="37" x2="56" y2="66" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="56" y1="66" x2="52" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="56" y1="38" x2="58" y2="18" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="58" cy="18" r="3" fill="#C84663" />
      <line x1="58" y1="18" x2="42" y2="28" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <rect x="36" y="25" width="8" height="6" rx="1.5" fill="#C84663" />
      <path d="M36 20 Q44 6 62 8" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="67,9 59,5 60,13" fill="#C84663" />
  `,
  core_hang: `
      <line x1="36" y1="12" x2="84" y2="12" stroke="#96839B" stroke-width="4" stroke-linecap="round" />
      <line x1="54" y1="12" x2="54" y2="30" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="54" cy="24" r="5" fill="#FAF4F0" />
      <line x1="54" y1="30" x2="54" y2="56" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="54" cy="56" r="3.5" fill="#C84663" />
      <line x1="54" y1="56" x2="84" y2="52" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <path d="M64 82 Q88 74 88 56" stroke="#C84663" stroke-width="2" fill="none" stroke-dasharray="3,2" />
      <polygon points="88,50 84,58 92,58" fill="#C84663" />
  `,
  plank: `
      <circle cx="88" cy="64" r="5" fill="#FAF4F0" />
      <line x1="82" y1="66" x2="22" y2="82" stroke="#FAF4F0" stroke-width="4.5" stroke-linecap="round" />
      <line x1="76" y1="68" x2="76" y2="90" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="76" y1="90" x2="90" y2="90" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="76" cy="68" r="3" fill="#C84663" />
      <line x1="54" y1="84" x2="54" y2="74" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="54,70 50,76 58,76" fill="#C84663" />
  `,
  core_floor: `
      <circle cx="26" cy="76" r="5.5" fill="#FAF4F0" />
      <line x1="33" y1="80" x2="68" y2="80" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <circle cx="50" cy="80" r="3.5" fill="#C84663" />
      <line x1="38" y1="80" x2="34" y2="52" stroke="#FAF4F0" stroke-width="3.5" stroke-linecap="round" />
      <line x1="68" y1="80" x2="68" y2="56" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="68" y1="56" x2="86" y2="56" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="68" y1="80" x2="96" y2="74" stroke="rgba(250, 244, 240, 0.45)" stroke-width="3.5" stroke-linecap="round" />
      <line x1="50" y1="60" x2="50" y2="74" stroke="#C84663" stroke-width="2" stroke-dasharray="2,2" />
      <polygon points="50,76 46,69 54,69" fill="#C84663" />
  `,
  cable_fly: `
      <circle cx="60" cy="24" r="5.5" fill="#FAF4F0" />
      <line x1="60" y1="31" x2="60" y2="62" stroke="#FAF4F0" stroke-width="5" stroke-linecap="round" />
      <line x1="60" y1="62" x2="50" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="60" y1="62" x2="70" y2="91" stroke="#FAF4F0" stroke-width="4" stroke-linecap="round" />
      <line x1="16" y1="34" x2="46" y2="42" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <line x1="104" y1="34" x2="74" y2="42" stroke="#96839B" stroke-width="1.5" stroke-dasharray="2,2" />
      <path d="M56 35 Q42 38 52 46" stroke="#FAF4F0" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M64 35 Q78 38 68 46" stroke="#FAF4F0" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <circle cx="54" cy="46" r="3" fill="#C84663" />
      <circle cx="66" cy="46" r="3" fill="#C84663" />
  `,
};

export function getExercisePdfSvgMarkup(svgType = 'squat', svgAccuracy = 'exact') {
  const inner = EXERCISE_PDF_SVG_PATHS[svgType] || EXERCISE_PDF_SVG_PATHS.squat;
  const approxBadge =
    svgAccuracy === 'pattern'
      ? `<div style="font-size:7.5px;color:#B86B35;font-weight:700;margin-top:2px;letter-spacing:0.2px;">≈ Pattern</div>`
      : '';

  return `<div style="text-align:center;">
    <svg width="60" height="52" viewBox="0 0 120 104" xmlns="http://www.w3.org/2000/svg" style="background:#24142B;border:1px solid #4A3428;border-radius:6px;display:block;margin:0 auto;">
      <line x1="12" y1="92" x2="108" y2="92" stroke="rgba(250, 244, 240, 0.16)" stroke-width="1.5" stroke-dasharray="3,3" />
      ${inner}
    </svg>
    ${approxBadge}
  </div>`;
}
