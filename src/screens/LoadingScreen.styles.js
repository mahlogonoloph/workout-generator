import { StyleSheet } from 'react-native';
import { Colors, Radii } from '../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  metaSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  coreWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 12,
  },
  kineticOrbitContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalizerWrapper: {
    alignItems: 'center',
    marginTop: 22,
    gap: 8,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 6,
  },
  equalizerBar: {
    width: 5,
    height: 24,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  equalizerBarTall: {
    height: 28,
    backgroundColor: Colors.plum,
  },
  equalizerBarAccent: {
    height: 26,
    backgroundColor: Colors.primary,
  },
  equalizerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2.2,
  },
  haloRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.plum,
  },
  midRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  centerNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
  },
  statusContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stageText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    minHeight: 40,
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2.5,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2.2,
  },
  percentNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  skipAction: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});

export default styles;
