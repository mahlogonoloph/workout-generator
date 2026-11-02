import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { getExercisePdfSvgMarkup } from '../components/ExerciseIllustrationSvg';

/**
 * Generates a clean, professional HTML document representing the workout routine,
 * complete with inline SVG exercise posture diagrams, muscle taxonomy, and form cues.
 */
export function buildWorkoutHtml({ routine, userProfile, logistics, targeting }) {
  const programName = routine?.programName || 'Personalized Workout Program';
  const goal = userProfile?.primaryGoal || 'Strength & Conditioning';
  const location = logistics?.location || 'Gym';
  const frequency = logistics?.frequencyDays || routine?.schedule?.length || 4;
  const duration = logistics?.durationMinutes || 60;
  const cycleWeeks = userProfile?.cycleLengthWeeks || 8;
  const focusAreas = targeting?.focusAreas?.length ? targeting.focusAreas.join(', ') : 'Full Body';
  const exclusions = targeting?.exclusionZones?.length ? targeting.exclusionZones.join(', ') : null;

  const warmup = routine?.warmupRoutine;
  const schedule = routine?.schedule || [];

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${programName}</title>
  <style>
    @page {
      size: letter;
      margin: 14mm 12mm 14mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1F1124;
      background-color: #FFFFFF;
      line-height: 1.4;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      padding: 0 4px;
    }
    .header {
      border-bottom: 2px solid #C84663;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .brand-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: #C84663;
    }
    .brand-date {
      font-size: 10px;
      color: #7D4F38;
      font-weight: 600;
    }
    .program-title {
      font-size: 22px;
      font-weight: 800;
      color: #1F1124;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
    }
    .meta-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .meta-pill {
      background-color: #F8F2F4;
      border: 1px solid #EAD8DF;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 10px;
      color: #361D40;
    }
    .meta-pill strong {
      color: #C84663;
      font-weight: 700;
    }
    .section-card {
      background-color: #FAF6F8;
      border: 1px solid #EEDFE5;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #361D40;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .warmup-primer {
      font-size: 11px;
      color: #4A3428;
      margin-bottom: 6px;
    }
    .mobility-list {
      list-style-type: none;
      padding-left: 0;
    }
    .mobility-list li {
      font-size: 11px;
      color: #361D40;
      margin-bottom: 3px;
      position: relative;
      padding-left: 12px;
    }
    .mobility-list li::before {
      content: '•';
      color: #C84663;
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    .day-container {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .day-header {
      background: #361D40;
      color: #FAF4F0;
      padding: 8px 12px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .day-title {
      font-size: 13px;
      font-weight: 700;
    }
    .day-count {
      font-size: 10px;
      font-weight: 600;
      color: #E2CAD4;
      background: rgba(255, 255, 255, 0.15);
      padding: 2px 7px;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #EEDFE5;
      border-top: none;
      background: #FFFFFF;
    }
    th {
      background-color: #F8F2F4;
      color: #7D4F38;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: left;
      padding: 7px 8px;
      border-bottom: 1px solid #EAD8DF;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #F0E6EB;
      vertical-align: top;
      font-size: 11px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .col-svg {
      width: 62px;
      text-align: center;
    }
    .col-name {
      font-weight: 700;
      color: #1F1124;
    }
    .taxonomy-line {
      margin-top: 3px;
      margin-bottom: 4px;
    }
    .pattern-pill {
      display: inline-block;
      background: #EFE7EC;
      color: #361D40;
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .muscle-pill {
      display: inline-block;
      background: rgba(200, 70, 99, 0.14);
      color: #C84663;
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 3px;
    }
    .cue-item {
      font-size: 10px;
      color: #564459;
      font-weight: 400;
      margin-top: 2px;
    }
    .col-metric {
      width: 48px;
      text-align: center;
      font-weight: 700;
      color: #361D40;
      background-color: #FAF8F9;
    }
    .sub-tag {
      display: inline-block;
      background: #F4EEF1;
      border: 1px solid #E8DFE3;
      border-radius: 4px;
      padding: 1px 5px;
      margin: 1px 2px 1px 0;
      font-size: 9px;
      color: #4A3428;
    }
    .tracking-box {
      width: 42px;
      height: 20px;
      border: 1px dashed #C84663;
      border-radius: 4px;
      margin: 0 auto;
    }
    .footer {
      border-top: 1px solid #EAD8DF;
      padding-top: 12px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      color: #8C788A;
      font-size: 9px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-row">
        <span class="brand-title">Fig Fitness • Biomechanical Training Blueprint (wger DB)</span>
        <span class="brand-date">${formattedDate}</span>
      </div>
      <h1 class="program-title">${programName}</h1>

      <div class="meta-grid">
        <div class="meta-pill"><strong>Goal:</strong> ${goal}</div>
        <div class="meta-pill"><strong>Frequency:</strong> ${frequency} Days / Week</div>
        <div class="meta-pill"><strong>Duration:</strong> ${duration} min / session</div>
        <div class="meta-pill"><strong>Cycle:</strong> ${cycleWeeks} Weeks</div>
        <div class="meta-pill"><strong>Environment:</strong> ${location}</div>
        ${focusAreas ? `<div class="meta-pill"><strong>Focus:</strong> ${focusAreas}</div>` : ''}
        ${exclusions ? `<div class="meta-pill"><strong>Excluded:</strong> ${exclusions}</div>` : ''}
      </div>
    </div>

    ${
      warmup
        ? `
    <div class="section-card">
      <div class="section-title">Warmup & Movement Prep</div>
      ${warmup.cardioPrimer ? `<p class="warmup-primer"><strong>Cardio Primer:</strong> ${warmup.cardioPrimer}</p>` : ''}
      ${
        warmup.dynamicMobility && warmup.dynamicMobility.length > 0
          ? `<ul class="mobility-list">${warmup.dynamicMobility.map((item) => `<li>${item}</li>`).join('')}</ul>`
          : ''
      }
    </div>
    `
        : ''
    }

    ${schedule
      .map(
        (day) => `
      <div class="day-container">
        <div class="day-header">
          <span class="day-title">${day.dayLabel || `Day ${day.dayNumber}`}</span>
          <span class="day-count">${day.exercises ? day.exercises.length : 0} Movements</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 62px; text-align: center;">Form SVG</th>
              <th>Exercise, Taxonomy & Coaching Cues</th>
              <th style="text-align: center; width: 46px;">Sets</th>
              <th style="text-align: center; width: 52px;">Reps</th>
              <th style="text-align: center; width: 52px;">Rest</th>
              <th style="width: 140px;">Substitutions</th>
              <th style="text-align: center; width: 50px;">Log</th>
            </tr>
          </thead>
          <tbody>
            ${(day.exercises || [])
              .map(
                (ex, idx) => `
              <tr>
                <td class="col-svg">
                  ${getExercisePdfSvgMarkup(ex.svgType || 'squat', ex.svgAccuracy || 'exact')}
                </td>
                <td class="col-name">
                  <div>${idx + 1}. ${ex.name}</div>
                  <div class="taxonomy-line">
                    ${ex.movementPatternLabel ? `<span class="pattern-pill">${ex.movementPatternLabel}</span>` : ''}
                    ${(ex.primaryMuscleLabels || []).map((m) => `<span class="muscle-pill">${m}</span>`).join('')}
                  </div>
                  ${ex.svgNote ? `<div class="cue-item" style="color:#B86B35;font-weight:600;">≈ ${ex.svgNote}</div>` : ''}
                  ${(ex.formCues || [])
                    .slice(0, 2)
                    .map((cue) => `<div class="cue-item">• ${cue}</div>`)
                    .join('')}
                </td>
                <td class="col-metric">${ex.sets}</td>
                <td class="col-metric">${ex.reps}</td>
                <td class="col-metric">${ex.restSeconds}s</td>
                <td>
                  ${
                    ex.substitutions && ex.substitutions.length > 0
                      ? ex.substitutions.map((sub) => `<span class="sub-tag">${sub}</span>`).join(' ')
                      : '—'
                  }
                </td>
                <td style="text-align: center;"><div class="tracking-box"></div></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
      )
      .join('')}

    <div class="footer">
      <span>Generated via Fig Workout Engine • Powered by wger Open-Source Exercise Taxonomy</span>
      <span>Progressive Overload Blueprint</span>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function downloadWorkoutPdf({ routine, userProfile, logistics, targeting }) {
  const html = buildWorkoutHtml({ routine, userProfile, logistics, targeting });

  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: `${routine?.programName || 'Workout-Program'}.pdf`,
    });
  } else {
    await Print.printAsync({ uri });
  }
}
