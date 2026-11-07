import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  WGER_EXERCISE_CATALOG,
  MOVEMENT_PATTERNS,
  MUSCLE_GROUPS,
} from '../data/wgerExerciseCatalog.js';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export default function AddExerciseModal({
  visible,
  dayLabel,
  existingCatalogIds = [],
  onClose,
  onAddExercise,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const existingSet = useMemo(() => new Set(existingCatalogIds), [existingCatalogIds]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return WGER_EXERCISE_CATALOG.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!query) return true;

      const nameMatch = item.name.toLowerCase().includes(query);
      const catMatch = item.category.toLowerCase().includes(query);
      const equipMatch = (item.equipment || []).some((e) =>
        e.toLowerCase().includes(query)
      );
      const muscleMatch = (item.primaryMuscles || []).some((m) => {
        const label = MUSCLE_GROUPS[m]?.label || m;
        return label.toLowerCase().includes(query);
      });
      const patternMatch =
        MOVEMENT_PATTERNS[item.movementPattern?.toUpperCase()]?.label
          ?.toLowerCase()
          ?.includes(query);

      return nameMatch || catMatch || equipMatch || muscleMatch || patternMatch;
    });
  }, [searchQuery, selectedCategory]);

  if (!visible) return null;

  const handleSelect = (item) => {
    onAddExercise(item);
    onClose();
  };

  const renderExerciseItem = ({ item }) => {
    const isAlreadyAdded = existingSet.has(item.id);
    const patternMeta = Object.values(MOVEMENT_PATTERNS).find(
      (p) => p.id === item.movementPattern
    );
    const primaryMuscleLabels = (item.primaryMuscles || []).map(
      (m) => MUSCLE_GROUPS[m]?.label || m
    );

    return (
      <View style={styles.exerciseCard}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <View style={styles.cardMetaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{item.category}</Text>
            </View>
            {patternMeta && (
              <View style={styles.patternPill}>
                <Text style={styles.patternPillText}>{patternMeta.label}</Text>
              </View>
            )}
            <View style={styles.difficultyPill}>
              <Text style={styles.difficultyPillText}>
                {item.difficulty?.toUpperCase()}
              </Text>
            </View>
          </View>

          {primaryMuscleLabels.length > 0 && (
            <Text style={styles.muscleTargetText} numberOfLines={1}>
              Targets: {primaryMuscleLabels.join(', ')}
            </Text>
          )}

          {item.equipment && item.equipment.length > 0 && (
            <Text style={styles.equipmentText} numberOfLines={1}>
              Equipment: {item.equipment.join(' • ')}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.addBtn,
            isAlreadyAdded && styles.addBtnDisabled,
          ]}
          activeOpacity={0.75}
          disabled={isAlreadyAdded}
          onPress={() => handleSelect(item)}
        >
          <Text
            style={[
              styles.addBtnText,
              isAlreadyAdded && styles.addBtnTextDisabled,
            ]}
          >
            {isAlreadyAdded ? 'Added ✓' : '＋ Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* MODAL HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSub}>EXERCISE CATALOG</Text>
            <Text style={styles.headerTitle}>Add to {dayLabel || 'Routine'}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises, muscles, equipment..."
            placeholderTextColor={Colors.textMuted}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY FILTER PILLS */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item;
              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setSelectedCategory(item)}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* EXERCISES LIST */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No matching exercises</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search terms or category filter.
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  clearBtnText: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingHorizontal: 4,
  },
  categoriesSection: {
    marginBottom: 10,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  categoryPill: {
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  patternPill: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  patternPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  difficultyPill: {
    backgroundColor: 'rgba(250, 244, 240, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  muscleTargetText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  equipmentText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  addBtnTextDisabled: {
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

