import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { getExercisePdfSvgMarkup } from '../components/ExerciseIllustrationSvg';
import { buildPeriodizationPlan, getSafeSubstitutions } from '../api/generationClient';

/**
 * Robust HTML entity sanitization to neutralize XSS and arbitrary HTML injection vectors.
 * Safely handles null, undefined, numbers, and strings containing special characters.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a clean, professional HTML document representing the workout routine,
 * complete with an 8-week periodization blueprint, inline SVG exercise posture diagrams,
 * muscle taxonomy, form cues, and an 8-week physical pen-and-paper tracking matrix.
 */
export function buildWorkoutHtml({ routine, userProfile, logistics, targeting }) {
  const programName = routine?.programName || 'Personalized Workout Program';
  const goal = userProfile?.primaryGoal || 'Strength & Conditioning';
  const location = logistics?.location || 'Gym';
  const frequency = logistics?.frequencyDays || routine?.schedule?.length || 4;
  const duration = logistics?.durationMinutes || 60;
  const cycleWeeks = userProfile?.cycleLengthWeeks || 8;

  const focusAreas = Array.isArray(targeting?.focusAreas) && targeting.focusAreas.length
    ? targeting.focusAreas.map((f) => escapeHtml(f)).join(', ')
    : targeting?.focusAreas
    ? escapeHtml(targeting.focusAreas)
    : 'Full Body';

  const exclusions = Array.isArray(targeting?.exclusionZones) && targeting.exclusionZones.length
    ? targeting.exclusionZones.map((e) => escapeHtml(e)).join(', ')
    : targeting?.exclusionZones
    ? escapeHtml(targeting.exclusionZones)
    : null;

  const warmup = routine?.warmupRoutine;
  const schedule = routine?.schedule || [];
  const periodization = routine?.periodizationPlan || buildPeriodizationPlan(goal, cycleWeeks);
  const rawExclusionsList = Array.isArray(targeting?.exclusionZones)
    ? targeting.exclusionZones
    : [];

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
  <title>${escapeHtml(programName)}</title>
  <style>
    @page {
      size: letter;
      margin: 12mm 12mm 12mm 12mm;
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
      font-size: 11.5px;
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
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .brand-title {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: #C84663;
    }
    .brand-date {
      font-size: 9.5px;
      color: #7D4F38;
      font-weight: 600;
    }
    .program-title {
      font-size: 22px;
      font-weight: 800;
      color: #1F1124;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
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
      padding: 4px 9px;
      font-size: 9.5px;
      color: #361D40;
    }
    .meta-pill strong {
      color: #C84663;
      font-weight: 700;
    }

    /* 8-Week Periodization Blueprint Card */
    .periodization-card {
      background: #FCFAFB;
      border: 1px solid #E4D0D9;
      border-left: 4px solid #C84663;
      border-radius: 8px;
      padding: 11px 13px;
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .periodization-header {
      margin-bottom: 8px;
    }
    .periodization-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #C84663;
      background: rgba(200, 70, 99, 0.1);
      padding: 2px 6px;
      border-radius: 3px;
      margin-bottom: 4px;
    }
    .periodization-title {
      font-size: 13px;
      font-weight: 800;
      color: #361D40;
      letter-spacing: -0.2px;
    }
    .periodization-subtitle {
      font-size: 9.5px;
      color: #6A5668;
      margin-top: 2px;
    }
    .periodization-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .phase-card {
      background: #FFFFFF;
      border: 1px solid #EAD8DF;
      border-radius: 6px;
      padding: 8px 8px;
      display: flex;
      flex-direction: column;
    }
    .phase-card.deload-phase {
      background: #F8FAF9;
      border-color: #CBE0D8;
    }
    .phase-badge {
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #C84663;
      margin-bottom: 2px;
    }
    .phase-badge.deload-badge {
      color: #2F6F5E;
    }
    .phase-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #1F1124;
      line-height: 1.25;
      margin-bottom: 4px;
    }
    .phase-metrics {
      font-size: 8.5px;
      font-weight: 700;
      color: #7D4F38;
      background: #FDF4F6;
      border-radius: 3px;
      padding: 2px 4px;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .phase-metrics.deload-metrics {
      color: #2F6F5E;
      background: #EAF4F0;
    }
    .phase-desc {
      font-size: 8.5px;
      color: #564459;
      line-height: 1.3;
    }

    /* Warmup Card */
    .section-card {
      background-color: #FAF6F8;
      border: 1px solid #EEDFE5;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #361D40;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .warmup-primer {
      font-size: 10px;
      color: #4A3428;
      margin-bottom: 4px;
    }
    .mobility-list {
      list-style-type: none;
      padding-left: 0;
    }
    .mobility-list li {
      font-size: 10px;
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

    /* Day Schedule */
    .day-container {
      margin-bottom: 18px;
      page-break-inside: auto;
      break-inside: auto;
    }
    .day-header {
      background: #361D40;
      color: #FAF4F0;
      padding: 7px 12px;
      border-radius: 7px 7px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-after: avoid;
      break-after: avoid;
    }
    .day-title {
      font-size: 12.5px;
      font-weight: 700;
    }
    .day-count {
      font-size: 9.5px;
      font-weight: 600;
      color: #E2CAD4;
      background: rgba(255, 255, 255, 0.15);
      padding: 2px 7px;
      border-radius: 4px;
    }

    /* Workout Exercise Table */
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #EEDFE5;
      border-top: none;
      background: #FFFFFF;
    }
    thead {
      display: table-header-group;
    }
    th {
      background-color: #F8F2F4;
      color: #7D4F38;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: left;
      padding: 6px 8px;
      border-bottom: 1px solid #EAD8DF;
    }
    td {
      padding: 7px 8px;
      vertical-align: top;
      font-size: 10.5px;
    }
    .exercise-item-group {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .exercise-main-row td {
      border-bottom: 1px dotted #F0E6EB;
    }
    .col-svg {
      width: 62px;
      text-align: center;
      padding: 6px 4px;
    }
    .col-name {
      font-weight: 600;
      color: #1F1124;
    }
    .exercise-heading {
      font-size: 11px;
      font-weight: 700;
      color: #1F1124;
    }
    .taxonomy-line {
      margin-top: 2px;
      margin-bottom: 3px;
    }
    .pattern-pill {
      display: inline-block;
      background: #EFE7EC;
      color: #361D40;
      font-size: 8.5px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 4px;
    }
    .muscle-pill {
      display: inline-block;
      background: rgba(200, 70, 99, 0.14);
      color: #C84663;
      font-size: 8.5px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 3px;
    }
    .rir-pill {
      display: inline-block;
      background: #FDF4EE;
      border: 1px solid #EBD4C5;
      color: #7D4F38;
      font-size: 8px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 3px;
    }
    .focus-pill {
      display: inline-block;
      background: #EAF4F0;
      border: 1px solid #CBE0D8;
      color: #2F6F5E;
      font-size: 8px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 3px;
    }
    .cue-item {
      font-size: 9.5px;
      color: #564459;
      font-weight: 400;
      margin-top: 2px;
      line-height: 1.25;
    }
    .cue-approx {
      color: #B86B35;
      font-weight: 600;
    }
    .col-metric {
      width: 46px;
      text-align: center;
      font-weight: 700;
      color: #361D40;
      background-color: #FAF8F9;
      vertical-align: middle;
      font-size: 10.5px;
    }
    .highlight-reps {
      background-color: #F7F0F3;
      color: #C84663;
    }
    .col-subs {
      width: 130px;
      vertical-align: middle;
    }
    .sub-tag {
      display: inline-block;
      background: #F4EEF1;
      border: 1px solid #E8DFE3;
      border-radius: 4px;
      padding: 1px 5px;
      margin: 1px 2px 1px 0;
      font-size: 8.5px;
      color: #4A3428;
    }
    .empty-subs {
      color: #B5A4B2;
      font-size: 10px;
    }

    /* 8-Week Physical Pen-and-Paper Tracking Grid */
    .exercise-tracking-row td {
      background-color: #FAF7F9;
      border-bottom: 2px solid #EAD8DF;
      padding: 5px 8px 7px 8px;
    }
    .tracking-row-inner {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tracking-label-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 62px;
      flex-shrink: 0;
    }
    .tracking-label-title {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #7D4F38;
      line-height: 1.1;
    }
    .tracking-label-sub {
      font-size: 7.5px;
      font-weight: 600;
      color: #9E8899;
      line-height: 1.1;
    }
    .tracking-matrix-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
    }
    .tracking-cell {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    .tracking-cell-header {
      font-size: 7.5px;
      font-weight: 800;
      color: #564459;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tracking-cell-header.deload-header {
      color: #2F6F5E;
      font-weight: 800;
    }
    .tracking-cell-box {
      border: 1px dashed #C84663;
      border-radius: 4px;
      background: #FFFFFF;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2px;
    }
    .tracking-cell-box.deload-box {
      border: 1px dashed #2F6F5E;
      background: #F4F8F6;
    }
    .tracking-cell-blank {
      font-size: 9px;
      font-family: 'Courier New', Courier, monospace, -apple-system;
      font-weight: 600;
      color: #9A8396;
      letter-spacing: 0.5px;
      user-select: none;
    }

    .footer {
      border-top: 1px solid #EAD8DF;
      padding-top: 10px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      color: #8C788A;
      font-size: 8.5px;
    }

  @media print {
    @page {
      size: letter;
      margin: 12mm 10mm 12mm 10mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background-color: #FFFFFF !important;
      padding-bottom: 0 !important;
    }
    .no-print-toolbar {
      display: none !important;
    }
    .container {
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 4px !important;
      margin: 0 auto !important;
      max-width: 820px !important;
    }
    .periodization-card,
    .section-card,
    .exercise-item-group {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .day-header {
      page-break-after: avoid;
      break-after: avoid;
    }
    .day-container {
      page-break-inside: auto;
      break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }

  @media screen {
    body {
      background-color: #F4EFF2;
      padding-bottom: 40px;
    }
    .container {
      background-color: #FFFFFF;
      box-shadow: 0 4px 24px rgba(54, 29, 64, 0.08);
      border-radius: 8px;
      padding: 24px 20px;
      margin: 16px auto 32px auto;
    }
    .no-print-toolbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: #361D40;
      color: #FAF4F0;
      padding: 10px 16px;
      box-shadow: 0 2px 12px rgba(31, 17, 36, 0.25);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .toolbar-content {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .toolbar-title {
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .toolbar-badge {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(200, 70, 99, 0.3);
      color: #FFB3C2;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .toolbar-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .toolbar-btn {
      border: none;
      border-radius: 6px;
      padding: 7px 13px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.1s ease, opacity 0.15s ease;
    }
    .toolbar-btn:active {
      transform: scale(0.97);
    }
    .toolbar-btn-print {
      background: #C84663;
      color: #FFFFFF;
    }
    .toolbar-btn-close {
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
    }
    .toolbar-tip {
      max-width: 820px;
      margin: 6px auto 0 auto;
      font-size: 10px;
      color: #E2CAD4;
      line-height: 1.3;
    }
  }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <div class="toolbar-content">
      <div class="toolbar-brand">
        <span class="toolbar-title">${escapeHtml(programName)}</span>
        <span class="toolbar-badge">8-Week Blueprint</span>
      </div>
      <div class="toolbar-actions">
        <button type="button" class="toolbar-btn toolbar-btn-print" onclick="window.print()">
          🖨️ Print / Save as PDF
        </button>
        <button type="button" class="toolbar-btn toolbar-btn-close" onclick="window.close()">
          ✕ Close
        </button>
      </div>
    </div>
    <div class="toolbar-tip">
      💡 <strong>To save as PDF:</strong> Select <em>"Save as PDF"</em> (Desktop/Android) or tap <em>Share → Print → Pinch / Save to Files</em> (iPhone).
    </div>
  </div>
  <div class="container">
    <div class="header">
      <div class="brand-row">
        <span class="brand-title">Fig Fitness • Biomechanical Training Blueprint (wger DB)</span>
        <span class="brand-date">${escapeHtml(formattedDate)}</span>
      </div>
      <h1 class="program-title">${escapeHtml(programName)}</h1>

      <div class="meta-grid">
        <div class="meta-pill"><strong>Goal:</strong> ${escapeHtml(goal)}</div>
        <div class="meta-pill"><strong>Frequency:</strong> ${escapeHtml(frequency)} Days / Week</div>
        <div class="meta-pill"><strong>Duration:</strong> ${escapeHtml(duration)} min / session</div>
        <div class="meta-pill"><strong>Cycle:</strong> ${escapeHtml(cycleWeeks)} Weeks</div>
        <div class="meta-pill"><strong>Environment:</strong> ${escapeHtml(location)}</div>
        ${focusAreas ? `<div class="meta-pill"><strong>Focus:</strong> ${focusAreas}</div>` : ''}
        ${exclusions ? `<div class="meta-pill"><strong>Excluded:</strong> ${exclusions}</div>` : ''}
      </div>
    </div>

    <!-- 8-Week Periodization Blueprint -->
    <div class="periodization-card">
      <div class="periodization-header">
        <div class="periodization-badge">Screen-Free Progression Protocol</div>
        <div class="periodization-title">${escapeHtml(periodization.title)}</div>
        <div class="periodization-subtitle">${escapeHtml(periodization.subtitle)}</div>
      </div>
      <div class="periodization-grid">
        ${(periodization.phases || [])
          .map(
            (phase) => `
        <div class="phase-card${phase.isDeload ? ' deload-phase' : ''}">
          <div class="phase-badge${phase.isDeload ? ' deload-badge' : ''}">${escapeHtml(phase.badge)}</div>
          <div class="phase-title">${escapeHtml(phase.title)}</div>
          <div class="phase-metrics${phase.isDeload ? ' deload-metrics' : ''}">${escapeHtml(phase.metrics)}</div>
          <div class="phase-desc">${escapeHtml(phase.desc)}</div>
        </div>`
          )
          .join('')}
      </div>
    </div>

    ${
      warmup
        ? `
    <div class="section-card">
      <div class="section-title">Warmup &amp; Movement Prep</div>
      ${warmup.cardioPrimer ? `<p class="warmup-primer"><strong>Cardio Primer:</strong> ${escapeHtml(warmup.cardioPrimer)}</p>` : ''}
      ${
        warmup.dynamicMobility && warmup.dynamicMobility.length > 0
          ? `<ul class="mobility-list">${warmup.dynamicMobility.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
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
          <span class="day-title">${escapeHtml(day.dayLabel || `Day ${day.dayNumber}`)}</span>
          <span class="day-count">${day.exercises ? day.exercises.length : 0} Movements</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 62px; text-align: center;">Form</th>
              <th>Exercise, Taxonomy &amp; Coaching Cues</th>
              <th style="text-align: center; width: 46px;">Sets</th>
              <th style="text-align: center; width: 54px;">Target Reps</th>
              <th style="text-align: center; width: 48px;">Rest</th>
              <th style="width: 130px;">Substitutions</th>
            </tr>
          </thead>
          ${(day.exercises || [])
            .map((ex, idx) => {
              const safeSubs = getSafeSubstitutions(ex, {
                location,
                exclusionZones: rawExclusionsList,
                existingDayCatalogIds: (day.exercises || []).map((e) => e.catalogId || e.id),
              });
              const displaySubs =
                safeSubs.length > 0 ? safeSubs : ex.substitutions || [];
              return `
          <tbody class="exercise-item-group">
            <tr class="exercise-main-row">
              <td class="col-svg">
                ${getExercisePdfSvgMarkup(ex.svgType || 'squat', ex.svgAccuracy || 'exact')}
              </td>
              <td class="col-name">
                <div class="exercise-heading">${idx + 1}. ${escapeHtml(ex.name)}</div>
                <div class="taxonomy-line">
                  ${ex.movementPatternLabel ? `<span class="pattern-pill">${escapeHtml(ex.movementPatternLabel)}</span>` : ''}
                  ${(ex.primaryMuscleLabels || []).map((m) => `<span class="muscle-pill">${escapeHtml(m)}</span>`).join('')}
                  ${ex.targetRir ? `<span class="rir-pill">${escapeHtml(ex.targetRir)}</span>` : ''}
                  ${ex.isFocusBoosted ? `<span class="focus-pill">★ Focus Priority</span>` : ''}
                </div>
                ${ex.svgNote ? `<div class="cue-item cue-approx">≈ ${escapeHtml(ex.svgNote)}</div>` : ''}
                ${(ex.formCues || [])
                  .slice(0, 2)
                  .map((cue) => `<div class="cue-item">• ${escapeHtml(cue)}</div>`)
                  .join('')}
              </td>
              <td class="col-metric">${escapeHtml(ex.sets)}</td>
              <td class="col-metric highlight-reps">${escapeHtml(ex.reps)}</td>
              <td class="col-metric">${escapeHtml(ex.restSeconds)}s</td>
              <td class="col-subs">
                ${
                  displaySubs.length > 0
                    ? displaySubs.map((sub) => `<span class="sub-tag">${escapeHtml(sub)}</span>`).join(' ')
                    : '<span class="empty-subs">—</span>'
                }
              </td>
            </tr>
            <tr class="exercise-tracking-row">
              <td colspan="6" class="col-tracking">
                <div class="tracking-row-inner">
                  <div class="tracking-label-col">
                    <span class="tracking-label-title">8-Wk Matrix</span>
                    <span class="tracking-label-sub">wt / reps</span>
                  </div>
                  <div class="tracking-matrix-grid">
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W1</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W2</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W3</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W4</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W5</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W6</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell">
                      <span class="tracking-cell-header">W7</span>
                      <div class="tracking-cell-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                    <div class="tracking-cell tracking-cell-deload">
                      <span class="tracking-cell-header deload-header">W8 (Deload)</span>
                      <div class="tracking-cell-box deload-box"><span class="tracking-cell-blank">___ / ___</span></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          `;
            })
            .join('')}
        </table>
      </div>
    `
      )
      .join('')}

    <div class="footer">
      <span>Generated via Fig Workout Engine • Powered by wger Open-Source Exercise Taxonomy</span>
      <span>Screen-Free 8-Week Progressive Overload Blueprint</span>
    </div>
  </div>
  <script>
    window.addEventListener('load', function() {
      // If opened in a standalone tab/window (mobile web or fallback), auto-trigger print dialog
      if (window.self === window.top) {
        setTimeout(function() {
          try {
            window.print();
          } catch (e) {
            console.log('Direct print trigger suppressed or unsupported in this browser context.');
          }
        }, 350);
      }
    });
  </script>
</body>
</html>
  `.trim();
}

/**
 * Cross-browser printing and PDF export helper for web platforms.
 *
 * 1. Desktop Web (Chrome, Firefox, Safari, Edge):
 *    Uses an isolated hidden <iframe>. When iframe.contentWindow.print() is invoked,
 *    the browser's native print preview dialog renders ONLY the workout program document
 *    (clean white vector layout with @page margins) rather than the React Native Web app UI.
 *    Desktop users can directly choose "Save as PDF" or select their printer.
 *
 * 2. Mobile Web (iOS Safari, iOS Chrome, Android Chrome):
 *    - iOS Safari has WebKit bugs with printing hidden iframes (often printing the parent page).
 *    - iOS Chrome disables window.print() inside third-party WKWebView contexts.
 *    - Android Chrome often suppresses iframe print spoolers.
 *    For mobile web, we populate a dedicated tab/window (either pre-opened in the tap gesture
 *    or opened here). It auto-triggers the system print dialog where supported and provides
 *    an interactive top toolbar with clear instructions on saving as PDF.
 *
 * 3. Fallback:
 *    If window opening or iframe printing is blocked by strict browser security policies,
 *    it initiates a direct file download of the standalone HTML document.
 */
function printViaIframe(html) {
  return new Promise((resolve, reject) => {
    try {
      const oldIframe = document.getElementById('fig-workout-print-frame');
      if (oldIframe) {
        oldIframe.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'fig-workout-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        iframe.remove();
        return reject(new Error('Cannot access iframe document'));
      }

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      let hasTriggered = false;
      const executePrint = () => {
        if (hasTriggered) return;
        hasTriggered = true;
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          // Delay cleanup so the browser print engine finishes reading iframe resources
          setTimeout(() => {
            try {
              iframe.remove();
            } catch (e) {}
            resolve();
          }, 1500);
        } catch (err) {
          try {
            iframe.remove();
          } catch (e) {}
          reject(err);
        }
      };

      iframe.onload = () => {
        setTimeout(executePrint, 250);
      };

      // Fallback timer if onload fails to fire
      setTimeout(executePrint, 600);
    } catch (err) {
      reject(err);
    }
  });
}

export async function printWebWorkoutDocument({ html, title = 'Workout-Program', targetWindow = null }) {
  if (typeof window === 'undefined') return;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ''
  );

  // 1. If mobile web and a targetWindow was pre-opened in the user tap gesture:
  if (targetWindow && !targetWindow.closed) {
    try {
      targetWindow.document.open();
      targetWindow.document.write(html);
      targetWindow.document.close();
      targetWindow.document.title = title;
      return;
    } catch (e) {
      console.warn('Failed writing to pre-opened targetWindow, falling back:', e);
      try {
        targetWindow.close();
      } catch (err) {}
    }
  }

  // 2. On desktop browsers, prefer hidden iframe to avoid unwanted tabs or popup warnings
  if (!isMobile) {
    try {
      await printViaIframe(html);
      return;
    } catch (e) {
      console.warn('Iframe printing failed or blocked, falling back to window/download:', e);
    }
  }

  // 3. Mobile web or fallback from iframe error: open dedicated window
  try {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
      printWin.document.title = title;
      return;
    }
  } catch (e) {
    console.warn('window.open failed:', e);
  }

  // 4. Ultimate fallback: direct HTML file download via Blob
  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${title}.html`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.error('All print and download strategies failed:', err);
    throw err;
  }
}

export async function downloadWorkoutPdf({
  routine,
  userProfile,
  logistics,
  targeting,
  targetWindow = null,
}) {
  const html = buildWorkoutHtml({ routine, userProfile, logistics, targeting });

  if (Platform.OS === 'web') {
    const safeTitle = (routine?.programName || 'Workout-Program').replace(/[^\w\s-]/g, '');
    await printWebWorkoutDocument({ html, title: safeTitle, targetWindow });
    return;
  }

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    const safeTitle = (routine?.programName || 'Workout-Program').replace(/[^\w\s-]/g, '');
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: `${safeTitle}.pdf`,
    });
  } else {
    await Print.printAsync({ uri });
  }
}
