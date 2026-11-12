import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // #1F1124
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E09F67', // Warm high-contrast bronze
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary, // #FAF4F0
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  metaSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
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
    marginTop: 20,
    gap: 8,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 6,
  },
  equalizerBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  equalizerBarTall: {
    height: 28,
    backgroundColor: '#D95878',
  },
  equalizerBarAccent: {
    height: 26,
    backgroundColor: '#E09F67',
  },
  equalizerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.2,
  },
  haloRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Colors.primary, // #C84663
  },
  midRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.surfaceElevated, // #361D40
    borderWidth: 1,
    borderColor: 'rgba(200, 70, 99, 0.4)',
  },
  centerNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface, // #291630
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  innerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.textPrimary,
  },
  statusContainer: {
    width: '100%',
    backgroundColor: Colors.surface, // #291630
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stageText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    minHeight: 40,
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary, // #C84663
    borderRadius: 3,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  percentNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  skipAction: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

export default styles;
