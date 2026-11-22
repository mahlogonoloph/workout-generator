import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Polyline,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';

/**
 * Minimal Calendar Icon (matches Figma 1001:330)
 */
export function CalendarOutlineIcon({ size = 16, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x="2" y="3" width="12" height="11" rx="2" stroke={color} strokeWidth="1.4" />
      <Line x1="2" y1="6.5" x2="14" y2="6.5" stroke={color} strokeWidth="1.3" />
      <Line x1="5.2" y1="1.5" x2="5.2" y2="4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Line x1="10.8" y1="1.5" x2="10.8" y2="4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Micro Arrow Up Icon (matches Figma 1001:397)
 */
export function MicroArrowUpIcon({ size = 8, color = Colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Line x1="5" y1="8.5" x2="5" y2="2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Polyline points="2.2,4.6 5,1.8 7.8,4.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * Selected Checkmark Badge (matches Figma 1001:616)
 */
export function CheckBadgeIcon({
  size = 18,
  bgColor = Colors.primaryInk,
  checkColor = Colors.primary,
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Rect x="1" y="1" width="16" height="16" rx="4" fill={bgColor} />
      <Polyline
        points="5.2,9.2 7.8,11.8 12.8,6.4"
        stroke={checkColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Arrow Right Circle Icon (matches Figma 1001:372 / 1001:374)
 */
export function ArrowRightCircleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.3" />
      <Line x1="5.8" y1="9" x2="12" y2="9" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Polyline
        points="9.4,6.4 12.1,9 9.4,11.6"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Stacked 6-Bar Periodization Chart (matches Figma 1001:92)
 * White lower base + Fig Plum (#5C2365) / Deep Plum upper caps
 */
export function StackedPeriodizationBars({
  estimatedWeeklySets = 72,
  selectedFrequency = 4,
}) {
  // 6 representative mesocycle bars responding to weekly volume & frequency
  const freqFactor = Math.max(0.75, Math.min(1.15, selectedFrequency / 4));
  const volFactor = Math.max(0.7, Math.min(1.2, estimatedWeeklySets / 72));

  const bars = [
    { lower: Math.round(18 * volFactor), upper: 26, highlight: true },
    { lower: Math.round(38 * volFactor), upper: 12, highlight: true },
    { lower: Math.round(36 * freqFactor), upper: 22, highlight: true },
    { lower: Math.round(16 * volFactor), upper: 26, highlight: false },
    { lower: Math.round(16 * freqFactor), upper: 26, highlight: false },
    { lower: Math.round(16 * volFactor), upper: 26, highlight: false },
  ];

  return (
    <View style={barStyles.row}>
      {bars.map((bar, idx) => {
        const lowerH = Math.max(12, Math.min(44, bar.lower));
        const upperH = Math.max(10, Math.min(30, bar.upper));
        return (
          <View key={idx} style={barStyles.col}>
            <View
              style={[
                barStyles.upperSeg,
                {
                  height: upperH,
                  backgroundColor: bar.highlight ? Colors.plum : 'rgba(25, 7, 39, 0.72)',
                },
              ]}
            />
            <View
              style={[
                barStyles.lowerSeg,
                { height: lowerH },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

/**
 * High-contrast Geometric SVG Icons for Training Adaptation Goals
 */
export function GoalIcon({
  goalId,
  isSelected,
  onLime = false,
  inkColor = null,
  cutoutColor = null,
  size = 36,
}) {
  const activeColor =
    inkColor ||
    (onLime
      ? Colors.primaryInk
      : isSelected
      ? Colors.primaryInk
      : Colors.primary);
  const secondaryColor =
    activeColor === Colors.primaryInk
      ? 'rgba(25, 7, 39, 0.5)'
      : 'rgba(255, 255, 255, 0.55)';
  const innerCutout =
    cutoutColor || (onLime ? Colors.primary : Colors.background);

  switch (goalId) {
    case 'Hypertrophy / Muscle':
      return (
        <Svg width={size} height={size} viewBox="0 0 64 40" fill="none">
          {/* Bold Figma-style Dumbbell Silhouette */}
          <Rect x="4" y="12" width="6" height="16" rx="2.5" fill={activeColor} />
          <Rect x="12" y="5" width="9" height="30" rx="3.5" fill={activeColor} />
          <Rect x="21" y="16" width="22" height="8" rx="1.5" fill={activeColor} />
          <Rect x="43" y="5" width="9" height="30" rx="3.5" fill={activeColor} />
          <Rect x="54" y="12" width="6" height="16" rx="2.5" fill={activeColor} />
        </Svg>
      );

    case 'Strength & Power':
      return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <Line x1="20" y1="30" x2="20" y2="8" stroke={activeColor} strokeWidth="3.5" strokeLinecap="round" />
          <Polyline points="12,15 20,7 28,15" stroke={activeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <Rect x="6" y="29" width="28" height="4.5" rx="2" fill={activeColor} />
          <Rect x="10" y="23" width="20" height="4" rx="2" fill={secondaryColor} />
        </Svg>
      );

    case 'Endurance & Stamina':
      return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <Path
            d="M4 20 L11 20 L14.5 11 L19.5 30 L24 14 L27.5 23 L30 20 L36 20"
            stroke={activeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="20" cy="20" r="16" stroke={secondaryColor} strokeWidth="1.8" strokeDasharray="4 4" />
        </Svg>
      );

    case 'Fat Loss & Tone':
      return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <Path
            d="M20 5 C16 12 11 16 11 23 C11 29.5 15 34 20 34 C25 34 29 29.5 29 23 C29 16 24 12 20 5 Z"
            fill={activeColor}
          />
          <Path
            d="M20 17 C18.2 20.5 16.5 22.5 16.5 25.5 C16.5 28 18 29.8 20 29.8 C22 29.8 23.5 28 23.5 25.5 C23.5 22.5 21.8 20.5 20 17 Z"
            fill={innerCutout}
          />
        </Svg>
      );

    case 'Longevity & Mobility':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <Circle cx="20" cy="20" r="14" stroke={activeColor} strokeWidth="2.8" strokeDasharray="20 7" />
          <Circle cx="20" cy="12" r="2.8" fill={activeColor} />
          <Circle cx="20" cy="20" r="2.8" fill={activeColor} />
          <Circle cx="20" cy="28" r="2.8" fill={secondaryColor} />
          <Line x1="20" y1="14.5" x2="20" y2="25.5" stroke={activeColor} strokeWidth="2.4" />
        </Svg>
      );
  }
}

/**
 * Clean Geometric SVG Icons for Training Environment & Equipment
 */
export function LocationIcon({ locationId, isSelected, size = 28 }) {
  const activeColor = isSelected ? Colors.primaryInk : Colors.primary;
  const secondaryColor = isSelected ? 'rgba(25, 7, 39, 0.55)' : Colors.textMuted;

  switch (locationId) {
    case 'Commercial Gym':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <Line x1="8" y1="6" x2="8" y2="30" stroke={activeColor} strokeWidth="2.4" strokeLinecap="round" />
          <Line x1="28" y1="6" x2="28" y2="30" stroke={activeColor} strokeWidth="2.4" strokeLinecap="round" />
          <Line x1="8" y1="8" x2="28" y2="8" stroke={activeColor} strokeWidth="2.4" />
          <Line x1="5" y1="30" x2="31" y2="30" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="4" y1="18" x2="32" y2="18" stroke={activeColor} strokeWidth="2.2" strokeLinecap="round" />
          <Rect x="5.5" y="13" width="2.4" height="10" rx="1" fill={activeColor} />
          <Rect x="28.1" y="13" width="2.4" height="10" rx="1" fill={activeColor} />
        </Svg>
      );

    case 'Home Gym':
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <Line x1="11" y1="22" x2="24" y2="10" stroke={activeColor} strokeWidth="2.6" strokeLinecap="round" />
          <Line x1="8" y1="23" x2="13" y2="21" stroke={activeColor} strokeWidth="2.6" strokeLinecap="round" />
          <Line x1="12" y1="23" x2="10" y2="30" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="21" y1="25" x2="23" y2="30" stroke={secondaryColor} strokeWidth="2.2" strokeLinecap="round" />
          <Line x1="7" y1="30" x2="26" y2="30" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" />
          <Line x1="26" y1="26" x2="33" y2="26" stroke={activeColor} strokeWidth="2" strokeLinecap="round" />
          <Rect x="25" y="23.5" width="2" height="5" rx="0.8" fill={activeColor} />
          <Rect x="32" y="23.5" width="2" height="5" rx="0.8" fill={activeColor} />
        </Svg>
      );

    case 'Bodyweight Only':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <Line x1="6" y1="7" x2="30" y2="7" stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="12" y1="7" x2="12" y2="16" stroke={secondaryColor} strokeWidth="1.8" />
          <Line x1="24" y1="7" x2="24" y2="16" stroke={secondaryColor} strokeWidth="1.8" />
          <Circle cx="12" cy="18.5" r="2.8" stroke={activeColor} strokeWidth="1.8" />
          <Circle cx="24" cy="18.5" r="2.8" stroke={activeColor} strokeWidth="1.8" />
          <Line x1="10" y1="28" x2="26" y2="28" stroke={activeColor} strokeWidth="2.2" strokeLinecap="round" />
          <Circle cx="18" cy="24" r="2.2" fill={activeColor} />
        </Svg>
      );
  }
}

/**
 * Mini 7-Day Weekly Frequency Dots Graphic
 */
export function WeeklyCalendarDots({ days = 4, isSelected = false }) {
  const activeColor = isSelected ? Colors.primaryInk : Colors.primary;
  const inactiveColor = isSelected ? 'rgba(25, 7, 39, 0.24)' : 'rgba(255, 255, 255, 0.14)';

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

const barStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
  },
  col: {
    width: 17,
    gap: 2,
    alignItems: 'center',
  },
  upperSeg: {
    width: '100%',
    borderRadius: 2,
  },
  lowerSeg: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

const dotStyles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
