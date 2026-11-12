import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../theme/colors';

export const styles = StyleSheet.create({
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
  currentExerciseCard: {
    opacity: 0.55,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.4)',
    backgroundColor: 'rgba(31, 17, 36, 0.5)',
  },
  swapSelectBtn: {
    backgroundColor: Colors.secondary || '#913D59',
  },
  swapBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 70, 99, 0.25)',
    gap: 12,
  },
  swapBannerBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  swapBannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.6,
  },
  swapBannerTextWrap: {
    flex: 1,
  },
  swapBannerExerciseName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  swapBannerHint: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  safetyFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  safetyTogglePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  safetyTogglePillActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary,
  },
  safetyTogglePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  safetyTogglePillTextActive: {
    color: Colors.primary,
  },
  stretchPill: {
    backgroundColor: 'rgba(78, 159, 116, 0.14)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(78, 159, 116, 0.3)',
  },
  stretchPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
  },
  warningPill: {
    backgroundColor: 'rgba(255, 107, 107, 0.14)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  warningPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.error,
  },
});


export default styles;
