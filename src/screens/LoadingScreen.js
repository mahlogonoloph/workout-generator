import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import useWorkoutStore from '../store/useWorkoutStore';

const GENERATION_STAGES = [
  'Analyzing movement patterns & frequency...',
  'Applying joint safety & recovery constraints...',
  'Balancing primary compounds & accessories...',
  'Calibrating progressive overload & rest periods...',
  'Finalizing your personalized routine...',
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
  const synthesisReadyRef = useRef(false);
  const skipRequestedRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  // Smooth breathing animations
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  // Kinetic Orbital Rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateReverseAnim = useRef(new Animated.Value(0)).current;

  // Equalizer Spectrum Bars
  const bar1 = useRef(new Animated.Value(0.35)).current;
  const bar2 = useRef(new Animated.Value(0.85)).current;
  const bar3 = useRef(new Animated.Value(0.55)).current;
  const bar4 = useRef(new Animated.Value(0.95)).current;
  const bar5 = useRef(new Animated.Value(0.4)).current;

  // Stage Text Transitions
  const stageFadeAnim = useRef(new Animated.Value(1)).current;
  const stageSlideAnim = useRef(new Animated.Value(0)).current;

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

    // 2. Kinetic Orbital Rotation Loops
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(rotateReverseAnim, {
        toValue: 1,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Kinetic Spectrum Equalizer Waveform Loops
    const makeBarLoop = (animVal, minVal, maxVal, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animVal, {
            toValue: maxVal,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animVal, {
            toValue: minVal,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

    makeBarLoop(bar1, 0.2, 1.0, 420).start();
    makeBarLoop(bar2, 0.35, 0.95, 360).start();
    makeBarLoop(bar3, 0.25, 1.0, 480).start();
    makeBarLoop(bar4, 0.3, 0.9, 390).start();
    makeBarLoop(bar5, 0.15, 0.85, 450).start();

    // 4. Stage progress timer with smooth text cross-fade
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          const next = prev + 1;
          const nextPercent = Math.min(95, Math.round(((next + 1) / GENERATION_STAGES.length) * 100));
          setProgressPercent(nextPercent);

          Animated.sequence([
            Animated.parallel([
              Animated.timing(stageFadeAnim, { toValue: 0.2, duration: 120, useNativeDriver: true }),
              Animated.timing(stageSlideAnim, { toValue: -6, duration: 120, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(stageFadeAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
              Animated.timing(stageSlideAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
            ]),
          ]).start();

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

    const handleSafetyError = (errorMessage) => {
      if (!isMounted) return;
      clearInterval(stageTimer);
      Alert.alert(
        'Safety Limitation',
        errorMessage || 'Unable to generate a safe routine with these constraints...',
        [
          {
            text: 'Adjust Constraints',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    };

    generateWorkoutPlan()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success === false) {
          handleSafetyError(res.error);
          return;
        }
        synthesisReadyRef.current = true;
        if (skipRequestedRef.current && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigation.replace('Routine');
          return;
        }
        setProgressPercent(100);
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            if (isMounted && !hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              navigation.replace('Routine');
            }
          }, 350);
        });
      })
      .catch((err) => {
        console.warn('Synthesis error:', err);
        handleSafetyError(err?.message);
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

  const spinForward = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinReverse = rotateReverseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
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

      {/* Kinetic Biomechanical Motion Core */}
      <View style={styles.visualContainer}>
        <View style={styles.coreWrapper}>
          {/* Outer Forward Rotating Orbital Arc */}
          <Animated.View
            style={[
              styles.kineticOrbitContainer,
              { transform: [{ rotate: spinForward }] },
            ]}
          >
            <Svg width={210} height={210} viewBox="0 0 210 210">
              <Circle
                cx={105}
                cy={105}
                r={96}
                stroke="rgba(200, 70, 99, 0.38)"
                strokeWidth={2}
                strokeDasharray="45 18 10 18"
                fill="none"
              />
              <Circle cx={105} cy={9} r={4.5} fill={Colors.primary} />
              <Circle cx={105} cy={201} r={3} fill="#E09F67" />
            </Svg>
          </Animated.View>

          {/* Inner Counter Rotating Orbital Arc */}
          <Animated.View
            style={[
              styles.kineticOrbitContainer,
              { transform: [{ rotate: spinReverse }] },
            ]}
          >
            <Svg width={164} height={164} viewBox="0 0 164 164">
              <Circle
                cx={82}
                cy={82}
                r={74}
                stroke="rgba(224, 159, 103, 0.45)"
                strokeWidth={1.5}
                strokeDasharray="28 14 6 14"
                fill="none"
              />
              <Circle cx={8} cy={82} r={3.5} fill="#FAF4F0" />
              <Circle cx={156} cy={82} r={3} fill={Colors.primary} />
            </Svg>
          </Animated.View>

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
          {/* Central Fig Node */}
          <View style={styles.centerNode}>
            <View style={styles.innerDot} />
          </View>
        </View>

        {/* Biomechanical Equalizer Spectrum Bars */}
        <View style={styles.equalizerWrapper}>
          <View style={styles.equalizerRow}>
            <Animated.View style={[styles.equalizerBar, { transform: [{ scaleY: bar1 }] }]} />
            <Animated.View style={[styles.equalizerBar, styles.equalizerBarTall, { transform: [{ scaleY: bar2 }] }]} />
            <Animated.View style={[styles.equalizerBar, styles.equalizerBarAccent, { transform: [{ scaleY: bar3 }] }]} />
            <Animated.View style={[styles.equalizerBar, styles.equalizerBarTall, { transform: [{ scaleY: bar4 }] }]} />
            <Animated.View style={[styles.equalizerBar, { transform: [{ scaleY: bar5 }] }]} />
          </View>
          <Text style={styles.equalizerLabel}>BIOMECHANICAL ENGINE OPTIMIZING</Text>
        </View>
      </View>

      {/* Stage Narrative & Progress Track */}
      <View style={styles.statusContainer}>
        <Animated.Text
          style={[
            styles.stageText,
            {
              opacity: stageFadeAnim,
              transform: [{ translateY: stageSlideAnim }],
            },
          ]}
        >
          {error ? error : GENERATION_STAGES[stageIndex]}
        </Animated.Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={styles.percentRow}>
          <Text style={styles.percentLabel}>SYNTHESIS</Text>
          <Text style={styles.percentNumber}>{progressPercent}%</Text>
        </View>

        {/* Skip or Recovery action */}
        <TouchableOpacity
          style={styles.skipAction}
          activeOpacity={0.7}
          onPress={() => {
            if (error) {
              navigation.goBack();
              return;
            }
            skipRequestedRef.current = true;
            if (synthesisReadyRef.current && !hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              navigation.replace('Routine');
            }
          }}
        >
          <Text style={styles.skipActionText}>
            {error ? '← Back to Parameters' : 'Skip to Results →'}
          </Text>
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
    color: '#E09F67', // Warm high-contrast bronze
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
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 12,
  },
  kineticOrbitContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalizerWrapper: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 6,
  },
  equalizerBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  equalizerBarTall: {
    height: 28,
    backgroundColor: '#D95878',
  },
  equalizerBarAccent: {
    height: 26,
    backgroundColor: '#E09F67',
  },
  equalizerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
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
