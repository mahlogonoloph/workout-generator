import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // #1F1124 Deep plum background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  purposeHeroBanner: {
    backgroundColor: 'rgba(41, 22, 48, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  purposeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  purposeBeaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeBeaconPulse: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  purposeTagLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.1,
  },
  purposeStatementText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  architectureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  architectureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  architectureTitleWrap: {
    flex: 1,
  },
  architectureSub: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.9,
    marginBottom: 2,
  },
  architectureMainVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  architectureBadge: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  architectureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E09F67',
  },
  volumeMeterTrack: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  volumeMeterFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1.5,
  },
  architectureFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  architectureFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  architectureFooterSub: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  architectureShieldText: {
    fontSize: 11,
    color: Colors.success || '#4E9F74',
    fontWeight: '700',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary, // #FAF4F0 Off-white
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary, // #C5B5C9
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  verticalPillsContainer: {
    gap: 8,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalIconBoxSelected: {
    backgroundColor: 'rgba(200, 70, 99, 0.22)',
    borderColor: Colors.primary,
  },
  goalPillUnselected: {
    backgroundColor: Colors.surface, // #291630
    borderColor: Colors.border,
  },
  goalPillSelected: {
    backgroundColor: 'rgba(200, 70, 99, 0.12)',
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  pillTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  goalPillTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  goalPillTitleSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  goalPillDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  goalPillDescUnselected: {
    color: Colors.textSecondary,
  },
  goalPillDescSelected: {
    color: Colors.textSecondary,
  },
  selectionIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  selectionIndicatorInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  selectionIndicatorActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyPill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyPillUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  frequencyPillSelected: {
    backgroundColor: 'rgba(200, 70, 99, 0.18)',
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  frequencyPillTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  frequencyPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  frequencyPillTitleSelected: {
    color: Colors.textPrimary,
  },
  frequencyPillSub: {
    fontSize: 10,
    marginTop: 2,
  },
  frequencyPillSubUnselected: {
    color: Colors.textMuted,
  },
  frequencyPillSubSelected: {
    color: Colors.textSecondary,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  durationPillSelected: {
    backgroundColor: 'rgba(200, 70, 99, 0.18)',
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  durationPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  durationPillTextUnselected: {
    color: Colors.textPrimary,
  },
  durationPillTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  durationPillTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  durationPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  durationPillTitleSelected: {
    color: Colors.textPrimary,
  },
  durationPillSub: {
    fontSize: 10,
    marginTop: 2,
  },
  durationPillSubUnselected: {
    color: Colors.textMuted,
  },
  durationPillSubSelected: {
    color: Colors.textSecondary,
  },
  muscleTargetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  muscleAnatomyBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  anatomyBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.6,
  },
  muscleChipsRightCol: {
    flex: 1,
  },
  muscleTargetingNote: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  jointHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  jointHeaderTitles: {
    flex: 1,
  },
  jointShieldBadge: {
    backgroundColor: 'rgba(78, 159, 116, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(78, 159, 116, 0.3)',
    marginTop: 2,
  },
  jointShieldBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4E9F74',
  },
  architectureShieldBadge: {
    backgroundColor: 'rgba(78, 159, 116, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(78, 159, 116, 0.3)',
  },
  jointChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jointChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  jointChipSafe: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  jointChipExcluded: {
    backgroundColor: 'rgba(200, 70, 99, 0.16)',
    borderColor: Colors.primary,
  },
  jointChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jointChipTextSafe: {
    color: Colors.textSecondary,
  },
  jointChipTextExcluded: {
    color: Colors.primary,
  },
  focusChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  focusChipTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  feedbackMemoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.35)',
  },
  feedbackMemoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackMemoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  feedbackResetBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  feedbackMemoryDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  savedRoutineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 12,
  },
  savedRoutineInfo: {
    flex: 1,
  },
  savedRoutineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  savedRoutineEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.9,
  },
  savedEditedBadge: {
    backgroundColor: 'rgba(200, 70, 99, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  savedEditedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  savedRoutineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  savedRoutineMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  resumeRoutineBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resumeRoutineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  attributionFooterCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  attributionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  attributionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  attributionLink: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  attributionText: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  attributionInlineLink: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  disclaimerText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: Colors.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary, // #C84663
    height: 54,
    maxWidth: 720,
    width: '100%',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginRight: 8,
  },
  buttonArrow: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;
