import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screens/IntakeScreen.styles';
import { LocationIcon } from './IntakeGraphics';

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
      <Text style={styles.sectionTitle}>Environment & Equipment</Text>
      <Text style={styles.sectionSubtitle}>Where you will perform the majority of your sessions</Text>
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
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.title}`}
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
