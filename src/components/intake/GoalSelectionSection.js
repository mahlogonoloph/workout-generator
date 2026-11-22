import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import {
  GoalIcon,
  CheckBadgeIcon,
  ArrowRightCircleIcon,
} from './IntakeGraphics';

export const GOAL_OPTIONS = [
  {
    id: 'Hypertrophy / Muscle',
    title: 'Hypertrophy',
    shortLabel: 'HYPERTROPHY',
    desc: 'Maximal muscular volume & structural density.',
    bg: '#D7FF35',
    ink: '#190727',
    subInk: 'rgba(25, 7, 39, 0.78)',
    dotInactive: 'rgba(25, 7, 39, 0.25)',
    badgeBg: '#190727',
    badgeCheck: '#D7FF35',
    border: 'transparent',
  },
  {
    id: 'Strength & Power',
    title: 'Strength & Power',
    shortLabel: 'STRENGTH',
    desc: 'Heavy progressive overload on compound lifts.',
    bg: '#5C2365',
    ink: '#FFFFFF',
    subInk: 'rgba(255, 255, 255, 0.78)',
    dotInactive: 'rgba(255, 255, 255, 0.28)',
    badgeBg: '#D7FF35',
    badgeCheck: '#190727',
    border: 'rgba(255, 255, 255, 0.10)',
  },
  {
    id: 'Endurance & Stamina',
    title: 'Endurance',
    shortLabel: 'ENDURANCE',
    desc: 'Aerobic work capacity, pacing & conditioning.',
    bg: '#260E3B',
    ink: '#FFFFFF',
    subInk: 'rgba(255, 255, 255, 0.76)',
    dotInactive: 'rgba(255, 255, 255, 0.28)',
    badgeBg: '#D7FF35',
    badgeCheck: '#190727',
    border: 'rgba(255, 255, 255, 0.16)',
  },
  {
    id: 'Fat Loss & Tone',
    title: 'Fat Loss & Tone',
    shortLabel: 'FAT LOSS',
    desc: 'High metabolic output & density circuits.',
    bg: '#A62D52',
    ink: '#FFFFFF',
    subInk: 'rgba(255, 255, 255, 0.80)',
    dotInactive: 'rgba(255, 255, 255, 0.28)',
    badgeBg: '#D7FF35',
    badgeCheck: '#190727',
    border: 'rgba(255, 255, 255, 0.10)',
  },
  {
    id: 'Longevity & Mobility',
    title: 'Longevity & Mobility',
    shortLabel: 'LONGEVITY',
    desc: 'Joint resilience, posture & range of motion.',
    bg: '#215B4A',
    ink: '#FFFFFF',
    subInk: 'rgba(255, 255, 255, 0.80)',
    dotInactive: 'rgba(255, 255, 255, 0.28)',
    badgeBg: '#D7FF35',
    badgeCheck: '#190727',
    border: 'rgba(255, 255, 255, 0.10)',
  },
];

const DECK_GAP = 6;

export default function GoalSelectionSection({
  selectedGoal,
  onSelectGoal,
}) {
  const activeIndex = Math.max(
    0,
    GOAL_OPTIONS.findIndex(
      (item) => selectedGoal === item.id || selectedGoal === item.title
    )
  );

  const [deckWidth, setDeckWidth] = useState(0);

  // One Animated.Value per goal page: 1 = expanded primary card, 0 = collapsed cascading page
  const pageAnims = useRef(
    GOAL_OPTIONS.map((_, idx) => new Animated.Value(idx === activeIndex ? 1 : 0))
  ).current;

  useEffect(() => {
    Animated.parallel(
      pageAnims.map((anim, idx) =>
        Animated.spring(anim, {
          toValue: idx === activeIndex ? 1 : 0,
          tension: 68,
          friction: 11,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [activeIndex, pageAnims]);

  const numPages = GOAL_OPTIONS.length;
  const totalGaps = DECK_GAP * (numPages - 1);
  // Responsive collapsed spine width: 32px on narrow phones, up to 48px on wider screens
  const collapsedWidth =
    deckWidth > 0
      ? Math.max(30, Math.min(48, Math.floor((deckWidth - 204) / (numPages - 1))))
      : 34;
  const expandedWidth =
    deckWidth > 0
      ? Math.max(188, deckWidth - totalGaps - collapsedWidth * (numPages - 1))
      : 210;

  return (
    <View style={styles.goalDeckSection}>
      <View
        style={styles.goalDeckRow}
        onLayout={(e) => {
          const w = Math.floor(e.nativeEvent.layout.width);
          if (w > 0 && Math.abs(w - deckWidth) > 1) {
            setDeckWidth(w);
          }
        }}
      >
        {GOAL_OPTIONS.map((item, idx) => {
          const isActive = idx === activeIndex;
          const anim = pageAnims[idx];

          const animatedCardStyle =
            deckWidth > 0
              ? {
                  width: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [collapsedWidth, expandedWidth],
                  }),
                }
              : { flex: isActive ? 6 : 1 };

          const expandedOpacity = anim.interpolate({
            inputRange: [0, 0.55, 1],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
          });

          const expandedTranslateY = anim.interpolate({
            inputRange: [0.45, 1],
            outputRange: [8, 0],
            extrapolate: 'clamp',
          });

          const spineOpacity = anim.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.goalCascadePage,
                {
                  backgroundColor: item.bg,
                  borderColor: item.border,
                  borderWidth: item.border === 'transparent' ? 0 : 1,
                },
                animatedCardStyle,
              ]}
            >
              {/* Collapsed Spine View (tappable to expand this goal page) */}
              <Animated.View
                style={[styles.goalSpineLayer, { opacity: spineOpacity }]}
                pointerEvents={isActive ? 'none' : 'auto'}
              >
                <TouchableOpacity
                  style={styles.goalSpineTouchable}
                  activeOpacity={0.8}
                  onPress={() => onSelectGoal(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch primary goal to ${item.title}`}
                >
                  <View style={styles.goalSpineLabelWrap}>
                    <Text
                      style={[styles.goalSpineLabel, { color: item.ink }]}
                      numberOfLines={1}
                    >
                      {item.shortLabel}
                    </Text>
                  </View>
                  <ArrowRightCircleIcon size={15} color={item.ink} />
                </TouchableOpacity>
              </Animated.View>

              {/* Expanded Primary Goal Page */}
              <Animated.View
                style={[
                  styles.goalExpandedLayer,
                  {
                    opacity: expandedOpacity,
                    transform: [{ translateY: expandedTranslateY }],
                  },
                ]}
                pointerEvents={isActive ? 'auto' : 'none'}
              >
                <View style={styles.goalHeroTopRow}>
                  <Text
                    style={[styles.goalHeroEyebrow, { color: item.ink }]}
                    numberOfLines={1}
                  >
                    PRIMARY GOAL
                  </Text>
                  <CheckBadgeIcon
                    size={18}
                    bgColor={item.badgeBg}
                    checkColor={item.badgeCheck}
                  />
                </View>

                <View style={styles.goalHeroCenter}>
                  <GoalIcon
                    goalId={item.id}
                    isSelected={true}
                    inkColor={item.ink}
                    cutoutColor={item.bg}
                    size={56}
                  />
                  <Text
                    style={[styles.goalHeroTitle, { color: item.ink }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.goalHeroDesc, { color: item.subInk }]}
                    numberOfLines={2}
                  >
                    {item.desc}
                  </Text>
                </View>

                {/* Interactive 5-Dot Pagination */}
                <View style={styles.goalDotsRow}>
                  {GOAL_OPTIONS.map((dotItem, dotIdx) => {
                    const isDotActive = dotIdx === activeIndex;
                    return (
                      <TouchableOpacity
                        key={dotItem.id}
                        onPress={() => onSelectGoal(dotItem.id)}
                        activeOpacity={0.7}
                        style={styles.goalDotTouch}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${dotItem.title}`}
                      >
                        <View
                          style={[
                            styles.goalDot,
                            {
                              backgroundColor: isDotActive
                                ? item.ink
                                : item.dotInactive,
                            },
                            isDotActive && styles.goalDotActive,
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
