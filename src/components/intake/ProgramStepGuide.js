import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

const SHORT_LOCATION_LABELS = {
  'Commercial Gym': 'Gym',
  'Home Gym': 'Home',
  'Bodyweight Only': 'Bodyweight',
};

const SHORT_GOAL_LABELS = {
  'Hypertrophy / Muscle': 'Muscle',
  'Strength & Power': 'Strength',
  'Endurance & Stamina': 'Endurance',
  'Fat Loss & Tone': 'Fat Loss',
  'Longevity & Mobility': 'Mobility',
};

export default function ProgramStepGuide({
  selectedGoal,
  selectedLocation,
  selectedFrequency,
  selectedDuration,
  activeStep = 1,
  onJumpToStep,
}) {
  const steps = [
    {
      num: 1,
      label: 'Goal',
      value: SHORT_GOAL_LABELS[selectedGoal] || selectedGoal,
    },
    {
      num: 2,
      label: 'Space',
      value: SHORT_LOCATION_LABELS[selectedLocation] || selectedLocation,
    },
    {
      num: 3,
      label: 'Days',
      value: `${selectedFrequency}d/wk`,
    },
    {
      num: 4,
      label: 'Time',
      value: `${selectedDuration}m`,
    },
  ];

  return (
    <View style={styles.stepGuideCard}>
      <View style={styles.stepGuideTopRow}>
        <Text style={styles.stepGuideEyebrow}>HOW TO BUILD YOUR PLAN</Text>
        <Text style={styles.stepGuideEta}>4 quick steps</Text>
      </View>
      <Text style={styles.stepGuideHint}>
        Tap your choices in each step below, then tap Generate Routine at the bottom.
      </Text>

      <View style={styles.stepGuideRow}>
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          return (
            <TouchableOpacity
              key={step.num}
              style={[
                styles.stepGuidePill,
                isActive && styles.stepGuidePillActive,
              ]}
              activeOpacity={0.75}
              onPress={() => onJumpToStep?.(step.num)}
              accessibilityRole="button"
              accessibilityLabel={`Jump to step ${step.num}: ${step.label}, currently ${step.value}`}
            >
              <View style={styles.stepGuidePillTop}>
                <View
                  style={[
                    styles.stepNumBadge,
                    isActive && styles.stepNumBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumText,
                      isActive && styles.stepNumTextActive,
                    ]}
                  >
                    {step.num}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepGuideLabel,
                    isActive && styles.stepGuideLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>
              <Text style={styles.stepGuideValue} numberOfLines={1}>
                {step.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
