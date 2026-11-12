import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useWorkoutStore } from '../store/useWorkoutStore';
import {
  WGER_EXERCISE_CATALOG,
  MOVEMENT_PATTERNS,
  MUSCLE_GROUPS,
} from '../data/wgerExerciseCatalog.js';
import ExerciseCatalogCard from './ExerciseCatalogCard';
import styles from './AddExerciseModal.styles';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export default function AddExerciseModal({
  visible,
  dayLabel,
  mode = 'add', // 'add' | 'swap'
  swappingExercise = null,
  existingCatalogIds = [],
  onClose,
  onAddExercise,
  onSelectExercise,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlySafeForSetup, setOnlySafeForSetup] = useState(true);

  const location = useWorkoutStore((state) => state.logistics?.location || 'Commercial Gym');
  const exclusionZones = useWorkoutStore((state) => state.targeting?.exclusionZones || []);

  const isSwapMode = mode === 'swap';

  // Automatically sync category when swapping an exercise
  useEffect(() => {
    if (visible && swappingExercise?.category) {
      setSelectedCategory(swappingExercise.category);
    } else if (visible && !swappingExercise) {
      setSelectedCategory('All');
    }
    if (visible) {
      setSearchQuery('');
    }
  }, [swappingExercise, visible]);

  const existingSet = useMemo(() => new Set(existingCatalogIds), [existingCatalogIds]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return WGER_EXERCISE_CATALOG.filter((item) => {
      // Setup & Injury Safety filter
      if (onlySafeForSetup) {
        const matchesLocation = (item.locations || []).includes(location);
        const conflictingJoints = (item.jointStress || []).filter((j) =>
          exclusionZones.some((ez) => ez.toLowerCase() === j.toLowerCase())
        );
        if (!matchesLocation || conflictingJoints.length > 0) {
          return false;
        }
      }

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
  }, [searchQuery, selectedCategory, onlySafeForSetup, location, exclusionZones]);

  if (!visible) return null;

  const handleSelect = (item) => {
    if (onSelectExercise) {
      onSelectExercise(item);
    } else if (onAddExercise) {
      onAddExercise(item);
    }
    onClose();
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
            <Text style={styles.headerSub}>
              {isSwapMode ? 'EXERCISE LIBRARY • SWAP MOVEMENT' : 'EXERCISE CATALOG'}
            </Text>
            <Text style={styles.headerTitle}>
              {isSwapMode
                ? `Swap with Chosen Exercise`
                : `Add to ${dayLabel || 'Routine'}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* SWAP TARGET BANNER */}
        {isSwapMode && swappingExercise && (
          <View style={styles.swapBannerContainer}>
            <View style={styles.swapBannerBadge}>
              <Text style={styles.swapBannerBadgeText}>REPLACING</Text>
            </View>
            <View style={styles.swapBannerTextWrap}>
              <Text style={styles.swapBannerExerciseName}>
                {swappingExercise.name}
              </Text>
              <Text style={styles.swapBannerHint}>
                Pick any movement below from our verified exercise library.
              </Text>
            </View>
          </View>
        )}

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

        {/* SETUP & SAFETY FILTER BAR */}
        <View style={styles.safetyFilterBar}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setOnlySafeForSetup(true)}
            style={[
              styles.safetyTogglePill,
              onlySafeForSetup && styles.safetyTogglePillActive,
            ]}
          >
            <Text
              style={[
                styles.safetyTogglePillText,
                onlySafeForSetup && styles.safetyTogglePillTextActive,
              ]}
              numberOfLines={1}
            >
              {`🛡 Safe for ${location}${exclusionZones.length > 0 ? ` • No ${exclusionZones.join('/')}` : ''}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setOnlySafeForSetup(false)}
            style={[
              styles.safetyTogglePill,
              !onlySafeForSetup && styles.safetyTogglePillActive,
            ]}
          >
            <Text
              style={[
                styles.safetyTogglePillText,
                !onlySafeForSetup && styles.safetyTogglePillTextActive,
              ]}
            >
              {`Show All (${WGER_EXERCISE_CATALOG.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* EXERCISES LIST */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCatalogCard
              item={item}
              isSwapMode={isSwapMode}
              isCurrentSwapping={
                isSwapMode &&
                swappingExercise &&
                (swappingExercise.catalogId === item.id || swappingExercise.name === item.name)
              }
              isAlreadyAdded={!isSwapMode && existingSet.has(item.id)}
              exclusionZones={exclusionZones}
              onSelect={handleSelect}
            />
          )}
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
