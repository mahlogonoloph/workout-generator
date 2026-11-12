import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  outerWrap: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  containerCompact: {
    padding: 8,
  },
  diagramBox: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 17, 36, 0.55)',
    borderRadius: 10,
    paddingTop: 18,
    paddingBottom: 4,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  diagramBoxApproximation: {
    borderColor: 'rgba(224, 159, 103, 0.45)',
  },
  anatomyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 17, 36, 0.55)',
    borderRadius: 10,
    paddingTop: 18,
    paddingBottom: 4,
    position: 'relative',
  },
  diagramLabelTag: {
    position: 'absolute',
    top: 5,
    left: 8,
  },
  diagramLabelTagApproximation: {
    backgroundColor: 'rgba(224, 159, 103, 0.18)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  diagramLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.7,
  },
  diagramLabelTextApproximation: {
    color: '#E09F67',
  },
  playMotionBtn: {
    position: 'absolute',
    top: 4,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(250, 244, 240, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250, 244, 240, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    zIndex: 10,
  },
  playMotionBtnActive: {
    backgroundColor: 'rgba(200, 70, 99, 0.22)',
    borderColor: Colors.primary,
  },
  playMotionIcon: {
    fontSize: 7.5,
    color: Colors.textSecondary,
    fontWeight: '800',
  },
  playMotionIconActive: {
    color: Colors.primary,
  },
  playMotionText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  playMotionTextActive: {
    color: Colors.primary,
  },
  motionPulseIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
  },
  motionPulseDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: Colors.primary,
  },
  motionPhaseText: {
    fontSize: 7,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  approxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 159, 103, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(224, 159, 103, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 6,
    gap: 6,
  },
  approxIcon: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E09F67',
  },
  approxText: {
    fontSize: 11,
    color: '#E09F67',
    fontWeight: '600',
    flex: 1,
  },
});

export default styles;

