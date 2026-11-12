import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Polyline,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';

/**
 * High-taste SVG Icons for Training Adaptation Goals
 */
export function GoalIcon({ goalId, isSelected, size = 36 }) {
  const activeColor = isSelected ? Colors.textPrimary : Colors.primary;
  const secondaryColor = isSelected ? 'rgba(250, 244, 240, 0.7)' : Colors.textMuted;
  const accentColor = isSelected ? '#FAF4F0' : '#E09F67';

  switch (goalId) {
    case 'Hypertrophy / Muscle':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Heavy Olympic Barbell with Muscle Volume Concentric Bars */}
          {/* Barbell Shaft */}
          <Line x1="4" y1="18" x2="32" y2="18" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Inner Collars */}
          <Rect x="8" y="14" width="2" height="8" rx="0.8" fill={activeColor} />
          <Rect x="26" y="14" width="2" height="8" rx="0.8" fill={activeColor} />
          {/* Big Olympic Plates */}
          <Rect x="10.5" y="10" width="3" height="16" rx="1.5" fill={activeColor} />
          <Rect x="22.5" y="10" width="3" height="16" rx="1.5" fill={activeColor} />
          {/* Secondary Outer Plates */}
          <Rect x="14" y="12" width="2" height="12" rx="1" fill={secondaryColor} />
          <Rect x="20" y="12" width="2" height="12" rx="1" fill={secondaryColor} />
          {/* Hypertrophy Volume Waves Above and Below */}
          <Path d="M12 6 Q18 3 24 6" stroke={accentColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <Path d="M10 30 Q18 33 26 30" stroke={accentColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </Svg>
      );

    case 'Strength & Power':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Force Vector Upward Power & Heavy Barbell */}
          {/* Central Explosive Force Arrow */}
          <Line x1="18" y1="28" x2="18" y2="8" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" />
          <Polyline points="13,13 18,7 23,13" fill="none" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Heavy Base Plates */}
          <Rect x="5" y="24" width="26" height="3" rx="1.5" fill={secondaryColor} />
          <Rect x="8" y="20" width="20" height="3" rx="1.5" fill={activeColor} />
          {/* Power Arc Energy Vectors */}
          <Path d="M8 17 Q5 12 9 8" stroke={accentColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <Path d="M28 17 Q31 12 27 8" stroke={accentColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </Svg>
      );

    case 'Endurance & Stamina':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Cardiac Rhythm & Steady State Aerobic Sine Wave */}
          <Path
            d="M4 18 L10 18 L13 11 L17 26 L21 14 L24 21 L26 18 L32 18"
            stroke={activeColor}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Circular Aerobic Capacity Ring */}
          <Circle cx="18" cy="18" r="14" stroke={secondaryColor} strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
          {/* Oxygen / Tempo Pulse Dots */}
          <Circle cx="13" cy="11" r="2" fill={accentColor} />
          <Circle cx="21" cy="14" r="2" fill={accentColor} />
        </Svg>
      );

    case 'Fat Loss & Tone':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* High-Metabolic Density Flame & Interval Circuit */}
          <Path
            d="M18 5 C15 11 11 14 11 20 C11 25.5 14.1 29 18 29 C21.9 29 25 25.5 25 20 C25 14 21 11 18 5 Z"
            stroke={activeColor}
            strokeWidth="2"
            fill={isSelected ? 'rgba(250, 244, 240, 0.15)' : 'rgba(200, 70, 99, 0.18)'}
            strokeLinejoin="round"
          />
          <Path
            d="M18 15 C16.5 18 15 19.5 15 22.5 C15 25 16.3 26.5 18 26.5 C19.7 26.5 21 25 21 22.5 C21 19.5 19.5 18 18 15 Z"
            fill={accentColor}
          />
          {/* Surrounding Metabolic Circuit Ticks */}
          <Line x1="6" y1="18" x2="8" y2="18" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="28" y1="18" x2="30" y2="18" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="18" y1="31" x2="18" y2="33" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      );

    case 'Longevity & Mobility':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* 360° Joint Articulation Arc & Posture Spine Center */}
          <Circle cx="18" cy="18" r="13" stroke={activeColor} strokeWidth="2" strokeDasharray="18 6" fill="none" />
          {/* Spine & Range of Motion Vertebrae */}
          <Circle cx="18" cy="11" r="2.2" fill={accentColor} />
          <Circle cx="18" cy="18" r="2.2" fill={activeColor} />
          <Circle cx="18" cy="25" r="2.2" fill={secondaryColor} />
          <Line x1="18" y1="13.2" x2="18" y2="22.8" stroke={secondaryColor} strokeWidth="1.8" />
          {/* Bi-directional Mobility Arrows */}
          <Path d="M29 14 L31 18 L27 18" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M7 22 L5 18 L9 18" stroke={accentColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
  }
}

/**
 * High-taste SVG Icons for Training Environment & Equipment
 */
export function LocationIcon({ locationId, isSelected, size = 36 }) {
  const activeColor = isSelected ? Colors.textPrimary : Colors.primary;
  const secondaryColor = isSelected ? 'rgba(250, 244, 240, 0.7)' : Colors.textMuted;
  const accentColor = isSelected ? '#FAF4F0' : '#E09F67';

  switch (locationId) {
    case 'Commercial Gym':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Heavy Power Rack & Cable Stack Station */}
          {/* Rack Uprights */}
          <Line x1="8" y1="6" x2="8" y2="30" stroke={activeColor} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="28" y1="6" x2="28" y2="30" stroke={activeColor} strokeWidth="2.2" strokeLinecap="round" />
          {/* Top Crossbar */}
          <Line x1="8" y1="8" x2="28" y2="8" stroke={activeColor} strokeWidth="2.2" />
          {/* Floor Base */}
          <Line x1="5" y1="30" x2="31" y2="30" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />
          {/* Barbell Across J-Cups */}
          <Line x1="4" y1="18" x2="32" y2="18" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          {/* Plates */}
          <Rect x="5.5" y="13" width="2" height="10" rx="1" fill={accentColor} />
          <Rect x="28.5" y="13" width="2" height="10" rx="1" fill={accentColor} />
          {/* Safety Spotter Pins */}
          <Line x1="8" y1="23" x2="28" y2="23" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="3 3" />
        </Svg>
      );

    case 'Home Gym':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Adjustable Bench & Dumbbell Pair */}
          {/* Incline Bench Backrest */}
          <Line x1="11" y1="22" x2="24" y2="10" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Bench Seat */}
          <Line x1="8" y1="23" x2="13" y2="21" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Bench Frame Legs */}
          <Line x1="12" y1="23" x2="10" y2="30" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1="21" y1="25" x2="23" y2="30" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1="7" y1="30" x2="26" y2="30" stroke={secondaryColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Dumbbell Floor Pair */}
          <Line x1="26" y1="26" x2="33" y2="26" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
          <Rect x="25" y="24" width="1.8" height="4" rx="0.8" fill={accentColor} />
          <Rect x="32" y="24" width="1.8" height="4" rx="0.8" fill={accentColor} />
        </Svg>
      );

    case 'Bodyweight Only':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {/* Calisthenics Bar & Athletic Suspension Silhouette */}
          {/* Pull-up Rig Top Bar */}
          <Line x1="6" y1="7" x2="30" y2="7" stroke={activeColor} strokeWidth="2.4" strokeLinecap="round" />
          {/* Calisthenic Rings / Straps */}
          <Line x1="12" y1="7" x2="12" y2="16" stroke={secondaryColor} strokeWidth="1.5" />
          <Line x1="24" y1="7" x2="24" y2="16" stroke={secondaryColor} strokeWidth="1.5" />
          <Circle cx="12" cy="18" r="2.8" stroke={accentColor} strokeWidth="1.6" fill="none" />
          <Circle cx="24" cy="18" r="2.8" stroke={accentColor} strokeWidth="1.6" fill="none" />
          {/* Athletic Core Lever Line */}
          <Line x1="10" y1="28" x2="26" y2="28" stroke={activeColor} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="18" cy="24" r="2.2" fill={accentColor} />
        </Svg>
      );
  }
}

/**
 * 8-Week Periodization Wave Volume Chart
 * Visualizes the sports-science progressive overload, deload, and peak volume progression
 */
export function PeriodizationWaveChart({
  estimatedWeeklySets = 32,
  selectedFrequency = 4,
}) {
  // 8-Week Progressive Overload Multipliers
  // W1 (85%), W2 (95%), W3 (105%), W4 (70% Deload), W5 (100%), W6 (110%), W7 (120% Peak), W8 (75% Consolidation)
  const multipliers = [0.85, 0.95, 1.05, 0.70, 1.00, 1.12, 1.20, 0.75];
  const chartHeight = 54;
  const maxBarHeight = 36;
  const colWidth = 14;

  const weeklyVolumes = multipliers.map((m) => Math.round(estimatedWeeklySets * m));
  const maxVol = Math.max(...weeklyVolumes, 1);

  // Generate smooth spline curve points through top of bars
  const points = weeklyVolumes.map((vol, idx) => {
    const x = 16 + idx * 36;
    const barH = (vol / maxVol) * maxBarHeight;
    const y = chartHeight - 8 - barH;
    return { x, y, vol };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.headerRow}>
        <View style={chartStyles.headerLeft}>
          <Text style={chartStyles.chartTitle}>8-WEEK PERIODIZATION WAVE</Text>
          <Text style={chartStyles.chartSubtitle}>
            Progression • Scheduled Deload (W4) • Peak Volume (W7)
          </Text>
        </View>
        <View style={chartStyles.statsBadge}>
          <Text style={chartStyles.statsBadgeText}>~{estimatedWeeklySets * 8} Total Sets</Text>
        </View>
      </View>

      <View style={chartStyles.svgContainer}>
        <Svg width="100%" height={chartHeight + 18} viewBox="0 0 292 72">
          <Defs>
            <LinearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.4" />
              <Stop offset="1" stopColor={Colors.primary} stopOpacity="0.0" />
            </LinearGradient>
            <LinearGradient id="barPeakGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#E09F67" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#C84663" stopOpacity="0.6" />
            </LinearGradient>
          </Defs>

          {/* Baseline Grid Line */}
          <Line x1="10" y1="50" x2="282" y2="50" stroke="rgba(250, 244, 240, 0.08)" strokeWidth="1" />

          {/* Shaded Area Under Volume Curve */}
          <Path
            d={`${pathD} L ${points[points.length - 1].x} 50 L ${points[0].x} 50 Z`}
            fill="url(#waveGradient)"
          />

          {/* Volume Wave Spline */}
          <Path
            d={pathD}
            fill="none"
            stroke={Colors.primary}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Weekly Volume Columns & Nodes */}
          {points.map((pt, idx) => {
            const isDeload = idx === 3;
            const isPeak = idx === 6;
            const barH = (weeklyVolumes[idx] / maxVol) * maxBarHeight;

            return (
              <React.Fragment key={idx}>
                {/* Column Bar */}
                <Rect
                  x={pt.x - colWidth / 2}
                  y={50 - barH}
                  width={colWidth}
                  height={barH}
                  rx="3"
                  fill={
                    isPeak
                      ? 'url(#barPeakGrad)'
                      : isDeload
                      ? 'rgba(78, 159, 116, 0.45)'
                      : 'rgba(250, 244, 240, 0.12)'
                  }
                  stroke={isPeak ? '#E09F67' : isDeload ? '#4E9F74' : 'transparent'}
                  strokeWidth={isPeak || isDeload ? 1 : 0}
                />

                {/* Node Dot on Curve */}
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPeak ? 3.5 : isDeload ? 3 : 2.2}
                  fill={isPeak ? '#E09F67' : isDeload ? '#4E9F74' : Colors.textPrimary}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Week Labels & Volume Numbers Row */}
      <View style={chartStyles.weeksRow}>
        {weeklyVolumes.map((vol, idx) => {
          const isDeload = idx === 3;
          const isPeak = idx === 6;
          return (
            <View key={idx} style={chartStyles.weekCol}>
              <Text
                style={[
                  chartStyles.weekLabel,
                  isPeak && chartStyles.weekLabelPeak,
                  isDeload && chartStyles.weekLabelDeload,
                ]}
              >
                W{idx + 1}
              </Text>
              <Text style={chartStyles.weekVolText}>{vol}s</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Mini 7-Day Weekly Frequency Dots Graphic
 */
export function WeeklyCalendarDots({ days = 4, isSelected = false }) {
  const activeColor = isSelected ? Colors.textPrimary : Colors.primary;
  const inactiveColor = isSelected ? 'rgba(250, 244, 240, 0.25)' : 'rgba(250, 244, 240, 0.12)';

  return (
    <View style={dotStyles.dotsRow}>
      {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
        const isDayActive = dayIdx <= days;
        return (
          <View
            key={dayIdx}
            style={[
              dotStyles.dot,
              {
                backgroundColor: isDayActive ? activeColor : inactiveColor,
                transform: [{ scale: isDayActive ? 1 : 0.8 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * Mini Duration Session Clock Dial Graphic
 */
export function DurationClockDial({ minutes = 60, isSelected = false, size = 18 }) {
  const strokeColor = isSelected ? Colors.textPrimary : Colors.primary;
  const trackColor = isSelected ? 'rgba(250, 244, 240, 0.25)' : 'rgba(250, 244, 240, 0.15)';

  // Calculate hand angle based on minutes (30m -> 180 deg, 45m -> 270 deg, 60m -> 360 deg, 75m -> 450/90 deg)
  const angle = (minutes / 60) * 360;
  const rad = ((angle - 90) * Math.PI) / 180;
  const cx = 9;
  const cy = 9;
  const r = 5.5;
  const handX = cx + r * Math.cos(rad);
  const handY = cy + r * Math.sin(rad);

  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      {/* Outer Dial Track */}
      <Circle cx={cx} cy={cy} r={7.5} stroke={trackColor} strokeWidth="1.5" fill="none" />
      {/* Clock Center Hub */}
      <Circle cx={cx} cy={cy} r={1.5} fill={strokeColor} />
      {/* Hour/Minute Hand Line */}
      <Line
        x1={cx}
        y1={cy}
        x2={handX}
        y2={handY}
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const dotStyles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

const chartStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(31, 17, 36, 0.55)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(250, 244, 240, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeft: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  statsBadge: {
    backgroundColor: 'rgba(200, 70, 99, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.3)',
  },
  statsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  svgContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  weeksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(250, 244, 240, 0.06)',
  },
  weekCol: {
    alignItems: 'center',
    width: 32,
  },
  weekLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  weekLabelPeak: {
    color: '#E09F67',
    fontWeight: '800',
  },
  weekLabelDeload: {
    color: '#4E9F74',
    fontWeight: '800',
  },
  weekVolText: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
