import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import { Colors } from '../../theme/colors';
import { LocationIcon, CheckBadgeIcon } from './IntakeGraphics';

export const LOCATION_OPTIONS = [
  { id: 'Commercial Gym', title: 'Commercial Gym', desc: 'Full barbells, dumbbells, cables & machines' },
  { id: 'Home Gym', title: 'Home Gym', desc: 'Free weights, adjustable bench & pull-up bar' },
  { id: 'Bodyweight Only', title: 'Bodyweight Only', desc: 'Calisthenics requiring zero external equipment' },
];

export default function LocationSelectionSection({
  selectedLocation,
  onSelectLocation,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.stepBadgeRow}>
        <View style={styles.stepPillBadge}>
          <Text style={styles.stepPillBadgeText}>STEP 2 OF 4</Text>
        </View>
        <Text style={styles.stepActionHint}>Tap one to choose</Text>
      </View>
      <Text style={styles.sectionTitle}>Where Will You Work Out?</Text>
      <Text style={styles.sectionSubtitle}>
        Pick your main training space so we only include equipment you have
      </Text>
      <View style={styles.verticalPillsContainer}>
        {LOCATION_OPTIONS.map((item) => {
          const isSelected = selectedLocation === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectLocation(item.id)}
              style={[
                styles.goalPill,
                isSelected ? styles.goalPillSelected : styles.goalPillUnselected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Select ${item.title}: ${item.desc}`}
            >
              <View style={[styles.goalIconBox, isSelected && styles.goalIconBoxSelected]}>
                <LocationIcon locationId={item.id} isSelected={isSelected} size={32} />
              </View>
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
              {isSelected ? (
                <CheckBadgeIcon
                  size={20}
                  bgColor={Colors.primary}
                  checkColor={Colors.primaryInk}
                />
              ) : (
                <View style={styles.radioCircleUnselected} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
