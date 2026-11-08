import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../theme/colors';

const REP_PRESETS = [
  { id: '3-5', label: '3-5', tag: 'Strength' },
  { id: '6-8', label: '6-8', tag: 'Power' },
  { id: '8-12', label: '8-12', tag: 'Hypertrophy' },
  { id: '10-15', label: '10-15', tag: 'Volume' },
  { id: '12-15', label: '12-15', tag: 'Conditioning' },
  { id: '15-20', label: '15-20', tag: 'Endurance' },
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

  // Sync state when opened with a new exercise
  useEffect(() => {
    if (exercise) {
      setSets(Number(exercise.sets) || 3);
      setReps(String(exercise.reps || '8-12'));
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
      reps: reps.trim() || '8-12',
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

                {/* REPS CONTROL */}
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Target Rep Range</Text>
                    <Text style={styles.sectionValueHighlight}>{reps} Reps</Text>
                  </View>
                  <View style={styles.presetsGrid}>
                    {REP_PRESETS.map((preset) => {
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 7, 18, 0.78)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 12,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionValueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperBtn: {
    width: 52,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepperDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stepperUnit: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: -2,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetChip: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  presetChipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  presetChipLabelActive: {
    color: Colors.primary,
  },
  presetChipTag: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
  },
  presetChipTagActive: {
    color: Colors.primary,
  },
  customRepInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customRepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginRight: 8,
  },
  customRepInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  restPresetsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  restChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restChipActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  restChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  restChipTextActive: {
    color: Colors.primary,
  },
  restStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  restAdjustBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restAdjustBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  restDisplaySub: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  swapLibraryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.3)',
    gap: 12,
  },
  swapLibraryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapLibraryIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  swapLibraryTextWrap: {
    flex: 1,
  },
  swapLibraryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  swapLibrarySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  swapLibraryArrow: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});

