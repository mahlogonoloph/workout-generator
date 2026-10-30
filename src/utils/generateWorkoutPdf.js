import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Generates a clean, professional HTML document representing the workout routine.
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
      margin: 16mm 14mm 16mm 14mm;
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
      line-height: 1.45;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 4px;
    }
    
    /* Header & Branding */
    .header {
      border-bottom: 2px solid #C84663;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #C84663;
    }
    .brand-date {
      font-size: 11px;
      color: #7D4F38;
      font-weight: 600;
    }
    .program-title {
      font-size: 24px;
      font-weight: 800;
      color: #1F1124;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    
    /* Metadata Pills */
    .meta-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    .meta-pill {
      background-color: #F8F2F4;
      border: 1px solid #EAD8DF;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 11px;
      color: #361D40;
    }
    .meta-pill strong {
      color: #C84663;
      font-weight: 700;
    }

    /* Warmup Card */
    .section-card {
      background-color: #FAF6F8;
      border: 1px solid #EEDFE5;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #361D40;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #C84663;
      border-radius: 50%;
    }
    .warmup-primer {
      font-size: 12px;
      color: #4A3428;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .mobility-list {
      list-style-type: none;
      padding-left: 0;
    }
    .mobility-list li {
      font-size: 12px;
      color: #361D40;
      margin-bottom: 4px;
      position: relative;
      padding-left: 14px;
    }
    .mobility-list li::before {
      content: '•';
      color: #C84663;
      position: absolute;
      left: 2px;
      font-weight: bold;
    }

    /* Day Schedule */
    .day-container {
      margin-bottom: 26px;
      page-break-inside: avoid;
    }
    .day-header {
      background: #361D40;
      color: #FAF4F0;
      padding: 10px 14px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .day-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.2px;
    }
    .day-count {
      font-size: 11px;
      font-weight: 600;
      color: #E2CAD4;
      background: rgba(255, 255, 255, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Exercise Table */
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #EEDFE5;
      border-top: none;
      background: #FFFFFF;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }
    th {
      background-color: #F8F2F4;
      color: #7D4F38;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid #EAD8DF;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #F0E6EB;
      vertical-align: top;
      font-size: 12px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .col-idx {
      width: 28px;
      text-align: center;
      font-weight: 700;
      color: #C84663;
    }
    .col-name {
      font-weight: 700;
      color: #1F1124;
    }
    .col-metric {
      width: 60px;
      text-align: center;
      font-weight: 700;
      color: #361D40;
      background-color: #FAF8F9;
    }
    .col-subs {
      font-size: 11px;
      color: #6C5B6F;
    }
    .sub-tag {
      display: inline-block;
      background: #F4EEF1;
      border: 1px solid #E8DFE3;
      border-radius: 4px;
      padding: 1px 6px;
      margin: 2px 2px 2px 0;
      font-size: 10px;
      color: #4A3428;
    }
    .tracking-box {
      width: 48px;
      height: 22px;
      border: 1px dashed #C84663;
      border-radius: 4px;
      margin: 0 auto;
    }

    /* Footer */
    .footer {
      border-top: 1px solid #EAD8DF;
      padding-top: 14px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      color: #8C788A;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="brand-row">
        <span class="brand-title">Fitness • Training Blueprint</span>
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

    <!-- Warmup Routine -->
    ${
      warmup
        ? `
    <div class="section-card">
      <div class="section-title">Warmup & Movement Prep</div>
      ${warmup.cardioPrimer ? `<p class="warmup-primer"><strong>Cardio Primer:</strong> ${warmup.cardioPrimer}</p>` : ''}
      ${
        warmup.dynamicMobility && warmup.dynamicMobility.length > 0
          ? `
        <ul class="mobility-list">
          ${warmup.dynamicMobility.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `
          : ''
      }
    </div>
    `
        : ''
    }

    <!-- Routine Schedule -->
    ${schedule
      .map(
        (day) => `
      <div class="day-container">
        <div class="day-header">
          <span class="day-title">${day.dayLabel || `Day ${day.dayNumber}`}</span>
          <span class="day-count">${day.exercises ? day.exercises.length : 0} Exercises</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 24px; text-align: center;">#</th>
              <th>Exercise</th>
              <th style="text-align: center; width: 55px;">Sets</th>
              <th style="text-align: center; width: 65px;">Reps</th>
              <th style="text-align: center; width: 65px;">Rest</th>
              <th>Alternatives / Substitutions</th>
              <th style="text-align: center; width: 60px;">Logged</th>
            </tr>
          </thead>
          <tbody>
            ${(day.exercises || [])
              .map(
                (ex, idx) => `
              <tr>
                <td class="col-idx">${idx + 1}</td>
                <td class="col-name">${ex.name}</td>
                <td class="col-metric">${ex.sets}</td>
                <td class="col-metric">${ex.reps}</td>
                <td class="col-metric">${ex.restSeconds}s</td>
                <td class="col-subs">
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

    <!-- Footer -->
    <div class="footer">
      <span>Personalized Program generated via Workout Generator</span>
      <span>Progressive Overload Blueprint • Page 1</span>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Downloads or shares the generated workout program as a PDF.
 */
export async function downloadWorkoutPdf({ routine, userProfile, logistics, targeting }) {
  const html = buildWorkoutHtml({ routine, userProfile, logistics, targeting });

  if (Platform.OS === 'web') {
    // On web, expo-print prints / opens the native browser "Save as PDF" dialog
    await Print.printAsync({ html });
    return;
  }

  // On native platforms (iOS & Android)
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
    // If sharing dialog is not available, print directly
    await Print.printAsync({ uri });
  }
}

