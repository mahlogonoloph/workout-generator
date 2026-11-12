import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';

export const GOAL_OPTIONS = [
  { id: 'Hypertrophy / Muscle', title: 'Hypertrophy', desc: 'Maximal muscular volume & density' },
  { id: 'Strength & Power', title: 'Strength & Power', desc: 'Heavy progressive overload on compound lifts' },
  { id: 'Endurance & Stamina', title: 'Endurance', desc: 'Aerobic work capacity & conditioning' },
  { id: 'Fat Loss & Tone', title: 'Fat Loss & Tone', desc: 'High metabolic output & density circuits' },
  { id: 'Longevity & Mobility', title: 'Longevity & Mobility', desc: 'Joint resilience, posture & full range of motion' },
];

export default function GoalSelectionSection({
  selectedGoal,
  onSelectGoal,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Primary Goal</Text>
      <Text style={styles.sectionSubtitle}>Select your main adaptation target for this 8-week block</Text>
      <View style={styles.verticalPillsContainer}>
        {GOAL_OPTIONS.map((item) => {
          const isSelected = selectedGoal === item.id || selectedGoal === item.title;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectGoal(item.id)}
              style={[
                styles.goalPill,
                isSelected ? styles.goalPillSelected : styles.goalPillUnselected,
              ]}
            >
              <View style={styles.pillTextWrap}>
                <Text
                  style={[
                    styles.goalPillTitle,
                    isSelected ? styles.goalPillTitleSelected : styles.goalPillTitleUnselected,
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.goalPillDesc,
                    isSelected ? styles.goalPillDescSelected : styles.goalPillDescUnselected,
                  ]}
                >
                  {item.desc}
                </Text>
              </View>
              <View
                style={[
                  styles.selectionIndicator,
                  isSelected ? styles.selectionIndicatorActive : styles.selectionIndicatorInactive,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

