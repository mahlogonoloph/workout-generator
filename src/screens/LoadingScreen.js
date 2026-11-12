import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
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
import styles from './LoadingScreen.styles';

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

