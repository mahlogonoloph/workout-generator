import { StyleSheet, Platform } from 'react-native';
import { Colors, Radii, Glass } from '../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroBackdropWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  heroBackdropImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroBackdropImageInner: {
    opacity: 0.9,
  },
  heroBackdropSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroBackdropGradientWeb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(180deg, rgba(25,7,39,0.50) 0%, rgba(25,7,39,0.22) 34%, rgba(25,7,39,0.58) 68%, rgba(25,7,39,0.82) 100%)',
      },
      default: {
        backgroundColor: 'rgba(25, 7, 39, 0.56)',
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },

  // Minimal First-Visit Brand Masthead (lets the fig backdrop breathe)
  brandMastheadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 10,
    marginBottom: 148,
  },
  brandWordmark: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  brandTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 2.2,
  },

  // Top Header / Saved Blueprint Banner (Figma 1001:281)
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 12,
    marginBottom: 96,
    gap: 14,
  },
  topHeaderInfo: {
    flex: 1,
  },
  topHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eyebrowWide: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },
  eyebrowLime: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  savedEditedBadge: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savedEditedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  topHeaderTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  topHeaderMeta: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    maxWidth: 240,
  },
  viewPlanBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: Radii.control,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPlanBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryInk,
    letterSpacing: -0.1,
  },

  // Frosted Glass Blueprint Card (Figma 1001:94)
  glassBlueprintCard: {
    ...Glass.card,
    borderRadius: Radii.card,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  glassHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 12,
  },
  glassTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    flex: 1,
  },
  glassStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  jointSafetyTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  glassDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    marginBottom: 14,
  },
  glassSplitRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
  },
  chartWell: {
    flex: 1,
    minHeight: 90,
    backgroundColor: 'rgba(25, 7, 39, 0.38)',
    borderRadius: Radii.control,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryCol: {
    flex: 1.05,
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryEyebrow: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryMainVal: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  summaryMetaLine: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryPeriodLine: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Guided 4-Step Program Setup Strip
  stepGuideCard: {
    ...Glass.card,
    borderRadius: Radii.card,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  stepGuideTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  stepGuideEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stepGuideEta: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepGuideHint: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  stepGuideRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepGuidePill: {
    flex: 1,
    backgroundColor: Colors.surfaceRecessed,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.control,
    paddingVertical: 8,
    paddingHorizontal: 7,
    minHeight: 52,
    justifyContent: 'space-between',
  },
  stepGuidePillActive: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primaryBorder,
  },
  stepGuidePillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  stepNumBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumBadgeActive: {
    backgroundColor: Colors.primary,
  },
  stepNumText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stepNumTextActive: {
    color: Colors.primaryInk,
  },
  stepGuideLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  stepGuideLabelActive: {
    color: Colors.primary,
  },
  stepGuideValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },

  // Step Badge Header (Steps 1-4)
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  stepPillBadge: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.badge,
  },
  stepPillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  stepActionHint: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // Goal Selection Cascading Pages Deck (Figma 1001:96 + 1001:282 + 1001:326)
  goalDeckSection: {
    marginBottom: 28,
  },
  goalDeckRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
    height: 222,
    width: '100%',
  },
  goalCascadePage: {
    height: '100%',
    borderRadius: Radii.card,
    overflow: 'hidden',
    position: 'relative',
  },
  goalSpineLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  goalSpineTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  goalSpineLabelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    transform: [{ rotate: '-90deg' }],
  },
  goalSpineLabelMuted: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.72)',
  },
  goalExpandedLayer: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  goalHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  goalHeroEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primaryInk,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  goalHeroCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  goalHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryInk,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  goalHeroDesc: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(25, 7, 39, 0.78)',
    textAlign: 'center',
    maxWidth: 184,
  },
  goalDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  goalDotTouch: {
    padding: 4,
  },
  goalDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  goalDotActive: {
    width: 14,
  },
  radioCircleUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: 'transparent',
  },

  // Standard Section Chrome
  section: {
    marginBottom: 26,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: Colors.textMuted,
    lineHeight: 17,
    marginBottom: 12,
  },

  // Selection Cards (Environment)
  verticalPillsContainer: {
    gap: 8,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: Radii.card,
    borderWidth: 1,
    minHeight: 68,
  },
  goalIconBox: {
    width: 42,
    height: 42,
    borderRadius: Radii.control,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalIconBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalPillUnselected: {
    ...Glass.card,
  },
  goalPillSelected: {
    ...Glass.elevated,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  pillTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  goalPillTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  goalPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  goalPillTitleSelected: {
    color: Colors.primary,
    fontWeight: '800',
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
    borderColor: Colors.borderStrong,
  },
  selectionIndicatorActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Frequency & Duration Rows
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyPill: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderRadius: Radii.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  frequencyPillUnselected: {
    ...Glass.card,
  },
  frequencyPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyPillTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  frequencyPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  frequencyPillTitleSelected: {
    color: Colors.primaryInk,
  },
  frequencyPillSub: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2,
  },
  frequencyPillSubUnselected: {
    color: Colors.textMuted,
  },
  frequencyPillSubSelected: {
    color: 'rgba(25, 7, 39, 0.78)',
  },

  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Radii.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 62,
  },
  durationPillUnselected: {
    ...Glass.card,
  },
  durationPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationPillTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  durationPillTitleUnselected: {
    color: Colors.textPrimary,
  },
  durationPillTitleSelected: {
    color: Colors.primaryInk,
  },
  durationPillSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  durationPillSubUnselected: {
    color: Colors.textMuted,
  },
  durationPillSubSelected: {
    color: 'rgba(25, 7, 39, 0.78)',
  },

  // Muscle Targeting & Anatomy
  muscleTargetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Glass.card,
    borderRadius: Radii.card,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  muscleAnatomyBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  anatomyBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.textMuted,
    marginTop: 6,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  muscleChipsRightCol: {
    flex: 1,
  },
  muscleTargetingNote: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },

  // Joint Exclusions
  jointHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  jointHeaderTitles: {
    flex: 1,
  },
  jointShieldBadge: {
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radii.badge,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    marginTop: 2,
  },
  jointShieldBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  jointChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jointChip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: Radii.control,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
  },
  jointChipSafe: {
    ...Glass.card,
  },
  jointChipExcluded: {
    backgroundColor: 'rgba(255, 107, 107, 0.14)',
    borderColor: Colors.error,
  },
  jointChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  jointChipTextSafe: {
    color: Colors.textSecondary,
  },
  jointChipTextExcluded: {
    color: Colors.error,
  },
  focusChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  focusChipTextSelected: {
    color: Colors.primaryInk,
    fontWeight: '800',
  },

  // Progressive Disclosure Fine-Tune Card
  fineTuneCard: {
    ...Glass.card,
    borderRadius: Radii.card,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  fineTuneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  fineTuneTitleWrap: {
    flex: 1,
  },
  fineTuneEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  fineTuneTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  fineTuneSummary: {
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  fineTuneTogglePill: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radii.control,
  },
  fineTuneToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  fineTuneBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // Feedback Memory Card
  feedbackMemoryCard: {
    ...Glass.card,
    borderRadius: Radii.card,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  feedbackMemoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackMemoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.4,
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

  // Footer
  attributionFooterCard: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 4,
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
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2,
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

  // Bottom Action Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    ...Glass.bar,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  bottomBarSummary: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 648,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 52,
    maxWidth: 648,
    width: '100%',
    borderRadius: Radii.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.primaryInk,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.1,
    marginRight: 8,
  },
  buttonArrow: {
    color: Colors.primaryInk,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default styles;
