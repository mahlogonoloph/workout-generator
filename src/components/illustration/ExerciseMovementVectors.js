import React from 'react';
import { Circle, Line, Path, Rect, G, Polygon } from 'react-native-svg';
import { solvePose, MOTION_TYPES } from './exerciseRigPoses';

export { MOTION_TYPES };

const COLORS = {
  b: '#FAF4F0', // bone
  j: '#C84663', // joint / load
  e: '#96839B', // equipment
  v: '#C84663', // force vector
  s: 'rgba(250, 244, 240, 0.45)', // secondary (far-side) limb
};

function renderPrim(q, key) {
  const c = COLORS[q.c] || COLORS.b;
  switch (q.k) {
    case 'l':
      return (
        <Line
          key={key}
          x1={q.x1}
          y1={q.y1}
          x2={q.x2}
          y2={q.y2}
          stroke={c}
          strokeWidth={q.w || 3}
          strokeLinecap="round"
          strokeDasharray={q.dash}
        />
      );
    case 'r':
      return <Rect key={key} x={q.x} y={q.y} width={q.w} height={q.h} rx={q.rx || 0} fill={c} />;
    case 'c':
      return <Circle key={key} cx={q.x} cy={q.y} r={q.r} fill={c} />;
    case 'g':
      return <Polygon key={key} points={q.pts.map((pt) => pt.join(',')).join(' ')} fill={c} />;
    case 'p':
      return <Path key={key} d={q.d} stroke={c} strokeWidth={q.w || 2} fill="none" strokeDasharray={q.dash} />;
    default:
      return null;
  }
}

function Segment({ a, b, secondary, width = 3.6 }) {
  return (
    <Line
      x1={a[0]}
      y1={a[1]}
      x2={b[0]}
      y2={b[1]}
      stroke={secondary ? COLORS.s : COLORS.b}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function renderRig(svgType, p) {
  const pose = solvePose(svgType, p);
  const primary = pose.limbs.filter((l) => !l.sec);
  const secondary = pose.limbs.filter((l) => l.sec);
  return (
    <G>
      {pose.back.map((q, i) => renderPrim(q, `b${i}`))}
      {secondary.map((l, i) => (
        <G key={`s${i}`}>
          <Segment a={l.root} b={l.joint} secondary />
          <Segment a={l.joint} b={l.end} secondary />
        </G>
      ))}
      <Segment a={pose.hip} b={pose.shoulder} width={5} />
      <Circle cx={pose.head[0]} cy={pose.head[1]} r={5} fill={COLORS.b} />
      {primary.map((l, i) => (
        <G key={`p${i}`}>
          <Segment a={l.root} b={l.joint} />
          <Segment a={l.joint} b={l.end} />
        </G>
      ))}
      {primary.map((l, i) => (
        <Circle key={`j${i}`} cx={l.joint[0]} cy={l.joint[1]} r={2.4} fill={COLORS.j} />
      ))}
      {pose.front.map((q, i) => renderPrim(q, `f${i}`))}
    </G>
  );
}

/** Static isometric holds: nothing moves, so they are drawn as-is. */
function renderIsometric(svgType) {
  const boneColor = COLORS.b;
  const jointColor = COLORS.j;
  const equipColor = COLORS.e;
  const vectorColor = COLORS.v;

  if (svgType === 'wall_sit') {
    return (
      <G>
        <Line x1="28" y1="14" x2="28" y2="92" stroke={equipColor} strokeWidth="4.5" />
        <Circle cx="36" cy="28" r="5.5" fill={boneColor} />
        <Line x1="35" y1="35" x2="35" y2="62" stroke={boneColor} strokeWidth="5" strokeLinecap="round" />
        <Circle cx="35" cy="62" r="3.5" fill={jointColor} />
        <Line x1="35" y1="62" x2="66" y2="62" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
        <Circle cx="66" cy="62" r="3.5" fill={jointColor} />
        <Line x1="66" y1="62" x2="66" y2="91" stroke={boneColor} strokeWidth="4" strokeLinecap="round" />
        <Path d="M58 62 L58 70 L66 70" stroke={vectorColor} strokeWidth="1.5" fill="none" />
        <Line x1="50" y1="52" x2="38" y2="52" stroke={vectorColor} strokeWidth="2" strokeDasharray="2,2" />
        <Polygon points="35,52 41,49 41,55" fill={vectorColor} />
      </G>
    );
  }

  // plank
  return (
    <G>
      <Circle cx="88" cy="64" r="5" fill={boneColor} />
      <Line x1="82" y1="66" x2="22" y2="82" stroke={boneColor} strokeWidth="4.5" strokeLinecap="round" />
      <Line x1="76" y1="68" x2="76" y2="90" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
      <Line x1="76" y1="90" x2="90" y2="90" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
      <Circle cx="76" cy="68" r="3" fill={jointColor} />
      <Line x1="54" y1="84" x2="54" y2="74" stroke={vectorColor} strokeWidth="2" strokeDasharray="2,2" />
      <Polygon points="54,70 50,76 58,76" fill={vectorColor} />
    </G>
  );
}

export const ISOMETRIC_TYPES = new Set(['plank', 'wall_sit']);

/**
 * Renders the exercise illustration. `motionProgress` (0..1) moves the skeleton
 * between the start and end of the range of motion; bone lengths never change.
 */
function renderMovementVector(svgType, motionProgress = 0) {
  if (ISOMETRIC_TYPES.has(svgType)) return renderIsometric(svgType);
  const p = typeof motionProgress === 'number' ? Math.max(0, Math.min(1, motionProgress)) : 0;
  return renderRig(MOTION_TYPES.has(svgType) ? svgType : 'cable_fly', p);
}

export default renderMovementVector;
