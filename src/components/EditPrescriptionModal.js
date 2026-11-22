import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../theme/colors';
import styles from './EditPrescriptionModal.styles';

const REP_PRESETS = [
  { id: '3-5', label: '3-5', tag: 'Strength' },
  { id: '6-8', label: '6-8', tag: 'Power' },
  { id: '8-12', label: '8-12', tag: 'Hypertrophy' },
  { id: '10-15', label: '10-15', tag: 'Volume' },
  { id: '12-15', label: '12-15', tag: 'Conditioning' },
  { id: '15-20', label: '15-20', tag: 'Endurance' },
];

const TIME_PRESETS = [
  { id: '30s', label: '30s', tag: 'Neural/Core' },
  { id: '30-45s', label: '30-45s', tag: 'Stability' },
  { id: '45-60s', label: '45-60s', tag: 'Hypertrophy' },
  { id: '60s', label: '60s', tag: 'Endurance' },
  { id: '60-90s', label: '60-90s', tag: 'Stamina' },
  { id: '30-45s / side', label: '30-45s/side', tag: 'Unilateral' },
];

const REST_PRESETS = [30, 45, 60, 75, 90, 105, 120, 150, 180];

export default function EditPrescriptionModal({
  visible,
  exercise,
  onClose,
  onSave,
  onRequestSwap,
}) {
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('8-12');
  const [restSeconds, setRestSeconds] = useState(90);

  const isTimeBased = exercise?.prescriptionType === 'time';

  // Sync state when opened with a new exercise
  useEffect(() => {
    if (exercise) {
      setSets(Number(exercise.sets) || 3);
      setReps(String(exercise.reps || (exercise.prescriptionType === 'time' ? '30-45s' : '8-12')));
      setRestSeconds(Number(exercise.restSeconds) || 90);
    }
  }, [exercise, visible]);

  if (!visible || !exercise) return null;

  const handleSetsChange = (delta) => {
    setSets((prev) => Math.max(1, Math.min(12, prev + delta)));
  };

  const handleRestChange = (delta) => {
    setRestSeconds((prev) => Math.max(15, Math.min(300, prev + delta)));
  };

  const handleSave = () => {
    onSave({
      sets,
      reps: reps.trim() || (isTimeBased ? '30-45s' : '8-12'),
      restSeconds,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContainer}
            >
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.headerSub}>FINE-TUNE PRESCRIPTION</Text>
                  <Text style={styles.exerciseName} numberOfLines={1}>
                    {exercise.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* SWAP MOVEMENT FROM LIBRARY SHORTCUT */}
                {onRequestSwap && (
                  <TouchableOpacity
                    style={styles.swapLibraryBanner}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      onRequestSwap(exercise);
                    }}
                  >
                    <View style={styles.swapLibraryIconCircle}>
                      <Text style={styles.swapLibraryIcon}>⇄</Text>
                    </View>
                    <View style={styles.swapLibraryTextWrap}>
                      <Text style={styles.swapLibraryTitle}>Swap with Exercise from Library</Text>
                      <Text style={styles.swapLibrarySubtitle}>
                        Choose any movement from 100+ wger exercises
                      </Text>
                    </View>
                    <Text style={styles.swapLibraryArrow}>➔</Text>
                  </TouchableOpacity>
                )}

                {/* SETS CONTROL */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Working Sets</Text>
                    <Text style={styles.sectionValueHighlight}>{sets} Sets</Text>
                  </View>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={[styles.stepperBtn, sets <= 1 && styles.stepperBtnDisabled]}
                      activeOpacity={0.7}
                      disabled={sets <= 1}
                      onPress={() => handleSetsChange(-1)}
                    >
                      <Text style={styles.stepperBtnText}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.stepperDisplay}>
                      <Text style={styles.stepperValue}>{sets}</Text>
                      <Text style={styles.stepperUnit}>sets</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.stepperBtn, sets >= 12 && styles.stepperBtnDisabled]}
                      activeOpacity={0.7}
                      disabled={sets >= 12}
                      onPress={() => handleSetsChange(1)}
                    >
                      <Text style={styles.stepperBtnText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* REPS / HOLD DURATION CONTROL */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>
                      {isTimeBased ? 'Target Hold Duration' : 'Target Rep Range'}
                    </Text>
                    <Text style={styles.sectionValueHighlight}>
                      {isTimeBased ? reps : `${reps} Reps`}
                    </Text>
                  </View>
                  <View style={styles.presetsGrid}>
                    {(isTimeBased ? TIME_PRESETS : REP_PRESETS).map((preset) => {
                      const isSelected = reps === preset.id;
                      return (
                        <TouchableOpacity
                          key={preset.id}
                          activeOpacity={0.75}
                          onPress={() => setReps(preset.id)}
                          style={[
                            styles.presetChip,
                            isSelected && styles.presetChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.presetChipLabel,
                              isSelected && styles.presetChipLabelActive,
                            ]}
                          >
                            {preset.label}
                          </Text>
                          <Text
                            style={[
                              styles.presetChipTag,
                              isSelected && styles.presetChipTagActive,
                            ]}
                          >
                            {preset.tag}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Custom Reps Input */}
                  <View style={styles.customRepInputRow}>
                    <Text style={styles.customRepLabel}>Custom / Notes:</Text>
                    <TextInput
                      style={styles.customRepInput}
                      value={reps}
                      onChangeText={setReps}
                      placeholder="e.g. 5x5, AMRAP, 30s"
                      placeholderTextColor={Colors.textMuted}
                      maxLength={20}
                    />
                  </View>
                </View>

                {/* REST INTERVAL CONTROL */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Rest Between Sets</Text>
                    <Text style={styles.sectionValueHighlight}>
                      {restSeconds}s ({Math.floor(restSeconds / 60)}m {restSeconds % 60}s)
                    </Text>
                  </View>

                  <Text style={styles.restRecommendationHint}>
                    {exercise.tier === 'compound'
                      ? 'Recommended: 120–180s for multi-joint compounds'
                      : 'Recommended: 60–90s for isolation/accessories'}
                  </Text>

                  <View style={styles.restPresetsScroll}>
                    {REST_PRESETS.map((seconds) => {
                      const isSelected = restSeconds === seconds;
                      return (
                        <TouchableOpacity
                          key={seconds}
                          activeOpacity={0.75}
                          onPress={() => setRestSeconds(seconds)}
                          style={[
                            styles.restChip,
                            isSelected && styles.restChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.restChipText,
                              isSelected && styles.restChipTextActive,
                            ]}
                          >
                            {seconds}s
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.restStepperRow}>
                    <TouchableOpacity
                      style={styles.restAdjustBtn}
                      activeOpacity={0.7}
                      onPress={() => handleRestChange(-15)}
                    >
                      <Text style={styles.restAdjustBtnText}>− 15s</Text>
                    </TouchableOpacity>
                    <Text style={styles.restDisplaySub}>
                      {restSeconds < 60
                        ? 'Short recovery / High metabolic stress'
                        : restSeconds <= 120
                        ? 'Standard hypertrophy recovery'
                        : 'Maximal ATP / Central nervous recovery'}
                    </Text>
                    <TouchableOpacity
                      style={styles.restAdjustBtn}
                      activeOpacity={0.7}
                      onPress={() => handleRestChange(15)}
                    >
                      <Text style={styles.restAdjustBtnText}>+ 15s</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              {/* ACTION FOOTER */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  activeOpacity={0.85}
                  onPress={handleSave}
                >
                  <Text style={styles.saveBtnText}>Save Prescription</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

