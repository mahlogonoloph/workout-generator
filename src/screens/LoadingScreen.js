import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';

const GENERATION_STAGES = [
  'Analyzing movement patterns & frequency...',
  'Applying joint safety & recovery constraints...',
  'Balancing primary compounds & accessories...',
  'Calibrating progressive overload & rest periods...',
  'Finalizing your personalized Fig routine...',
];

export default function LoadingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Zustand Store
  const userProfile = useWorkoutStore((state) => state.userProfile);
  const logistics = useWorkoutStore((state) => state.logistics);
  const error = useWorkoutStore((state) => state.error);
  const generateWorkoutPlan = useWorkoutStore((state) => state.generateWorkoutPlan);

  const [stageIndex, setStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);

  // Smooth breathing animations
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // 1. Organic, subtle breathing glow
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.15,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.25,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 2. Stage progress timer
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          const next = prev + 1;
          const nextPercent = Math.min(95, Math.round(((next + 1) / GENERATION_STAGES.length) * 100));
          setProgressPercent(nextPercent);
          Animated.timing(progressAnim, {
            toValue: nextPercent / 100,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }).start();
          return next;
        }
        return prev;
      });
    }, 600);

    // 3. Trigger plan synthesis
    let isMounted = true;
    generateWorkoutPlan()
      .then(() => {
        if (!isMounted) return;
        setProgressPercent(100);
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            navigation.replace('Routine');
          }, 350);
        });
      })
      .catch((err) => {
        console.warn('Synthesis error:', err);
      });

    return () => {
      isMounted = false;
      clearInterval(stageTimer);
    };
  }, [navigation, generateWorkoutPlan]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CALCULATING</Text>
        <Text style={styles.title}>Synthesizing Routine</Text>
        <Text style={styles.metaSubtitle}>
          {userProfile?.primaryGoal || 'Hypertrophy'} • {logistics?.location || 'Commercial Gym'} • {logistics?.frequencyDays || 4} Days
        </Text>
      </View>

      {/* Breathing Core Visual */}
      <View style={styles.coreWrapper}>
        {/* Soft atmospheric halo */}
        <Animated.View
          style={[
            styles.haloRing,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
        {/* Mid plum glow */}
        <View style={styles.midRing} />
        {/* Central Fig Emblem */}
        <View style={styles.centerNode}>
          <View style={styles.innerDot} />
        </View>
      </View>

      {/* Stage Narrative & Progress Track */}
      <View style={styles.statusContainer}>
        <Text style={styles.stageText}>
          {error ? error : GENERATION_STAGES[stageIndex]}
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={styles.percentRow}>
          <Text style={styles.percentLabel}>SYNTHESIS</Text>
          <Text style={styles.percentNumber}>{progressPercent}%</Text>
        </View>

        {/* Skip action */}
        <TouchableOpacity
          style={styles.skipAction}
          activeOpacity={0.7}
          onPress={() => navigation.replace('Routine')}
        >
          <Text style={styles.skipActionText}>Skip to Results →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // #1F1124
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent, // #7D4F38 Bronze
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary, // #FAF4F0
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  metaSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  coreWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.primary, // #C84663
  },
  midRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.surfaceElevated, // #361D40
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.4)',
  },
  centerNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface, // #291630
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  innerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textPrimary,
  },
  statusContainer: {
    width: '100%',
    backgroundColor: Colors.surface, // #291630
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stageText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    minHeight: 40,
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary, // #C84663
    borderRadius: 3,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  percentNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  skipAction: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
