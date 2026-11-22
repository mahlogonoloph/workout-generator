import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/RoutineScreen.styles';

export const SWAP_REASONS = [
  { id: 'equipment_busy', label: 'Equipment Busy', sub: 'Swap for today only' },
  { id: 'joint_pain', label: 'Joint Discomfort', sub: 'Swap & avoid stressed joint' },
  { id: 'too_hard', label: 'Too Complex', sub: 'Prefer simpler mechanics' },
  { id: 'dislike', label: 'Dislike Exercise', sub: 'Never prescribe again' },
];

export default function SwapReasonDrawer({
  onChooseFromLibrary,
  onSelectSwapReason,
}) {
  return (
    <View style={styles.swapReasonDrawer}>
      {/* OPTION 1: CHOOSE DIRECTLY FROM LIBRARY */}
      <TouchableOpacity
        style={styles.chooseFromLibraryBtn}
        activeOpacity={0.8}
        onPress={onChooseFromLibrary}
      >
        <View style={styles.chooseLibraryIconWrap}>
          <Text style={styles.chooseLibraryIcon}>🔍</Text>
        </View>
        <View style={styles.chooseLibraryTextWrap}>
          <Text style={styles.chooseLibraryTitle}>Choose from Exercise Library</Text>
          <Text style={styles.chooseLibrarySubtitle}>
            Browse 100+ exercises to select your preferred replacement
          </Text>
        </View>
        <Text style={styles.chooseLibraryArrow}>➔</Text>
      </TouchableOpacity>

      <View style={styles.swapDividerRow}>
        <View style={styles.swapDividerLine} />
        <Text style={styles.swapDividerText}>OR INSTANT AI AUTO-SWAP</Text>
        <View style={styles.swapDividerLine} />
      </View>

      <Text style={styles.swapDrawerTitle}>
        Why swap this movement? (Trains your recommendation profile)
      </Text>
      <View style={styles.swapReasonsGrid}>
        {SWAP_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason.id}
            activeOpacity={0.75}
            onPress={() => onSelectSwapReason(reason.id)}
            style={styles.swapReasonChip}
          >
            <Text style={styles.swapReasonLabel}>{reason.label}</Text>
            <Text style={styles.swapReasonSub}>{reason.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

