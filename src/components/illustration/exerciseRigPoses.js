/**
 * Skeleton rig for exercise motion previews.
 *
 * Every figure is built from a constant-length skeleton, so limbs can never
 * stretch or detach from their joints while animating:
 *   torso 24 · upper arm 11 · forearm 11 · thigh 15 · shin 15
 * Joints are solved with two-bone IK (hands/feet pinned to bars, handles, floor)
 * or forward kinematics (single-joint movements such as curls). `p` runs 0 -> 1
 * from the start pose to the opposite end of the range of motion.
 */

export const BONE = { torso: 24, upper: 11, fore: 11, thigh: 15, shin: 15, head: 8 };

const L = (a, b, p) => a + (b - a) * p;
const rad = (d) => (d * Math.PI) / 180;
const dir = (d) => [Math.cos(rad(d)), Math.sin(rad(d))];
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const unit = (v) => {
  const d = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / d, v[1] / d];
};

/** Two-bone IK. Reach is clamped, so bone lengths are always preserved. */
export function ik(root, target, l1, l2, side = 1) {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const dist = Math.hypot(dx, dy) || 0.0001;
  const d = Math.min(Math.max(dist, Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const ux = dx / dist;
  const uy = dy / dist;
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return {
    joint: [root[0] + ux * a - uy * h * side, root[1] + uy * a + ux * h * side],
    end: [root[0] + ux * d, root[1] + uy * d],
  };
}

/** Circle/circle intersection, returns both solutions. */
function intersect(c0, r0, c1, r1) {
  const dx = c1[0] - c0[0];
  const dy = c1[1] - c0[1];
  const D = Math.hypot(dx, dy);
  const a = (r0 * r0 - r1 * r1 + D * D) / (2 * D);
  const h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
  const ux = dx / D;
  const uy = dy / D;
  const bx = c0[0] + ux * a;
  const by = c0[1] + uy * a;
  return [
    [bx - uy * h, by + ux * h],
    [bx + uy * h, by - ux * h],
  ];
}

function arrow(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const bx = x2 - ux * 7;
  const by = y2 - uy * 7;
  return [
    { k: 'l', x1, y1, x2: bx, y2: by, c: 'v', w: 2, dash: '3,2' },
    { k: 'g', pts: [[x2, y2], [bx - uy * 4, by + ux * 4], [bx + uy * 4, by - ux * 4]], c: 'v' },
  ];
}

const stand = (hx, hy = 61) => ({
  hip: [hx, hy],
  torso: -90,
  legs: [
    { target: [hx - 4, 91], side: -1 },
    { target: [hx + 6, 91], side: -1, sec: true },
  ],
});

const line = (x1, y1, x2, y2, c = 'e', w = 3, dash) => ({ k: 'l', x1, y1, x2, y2, c, w, dash });
const rect = (x, y, w, h, c = 'e', rx = 2) => ({ k: 'r', x, y, w, h, c, rx });
const dumbbell = (h, w = 10) => rect(h[0] - w / 2, h[1] - 3, w, 6, 'j', 1.5);
const barbell = (h) => [
  line(h[0] - 14, h[1], h[0] + 14, h[1], 'j', 3),
  rect(h[0] - 14, h[1] - 5, 4, 10, 'j', 1.5),
  rect(h[0] + 10, h[1] - 5, 4, 10, 'j', 1.5),
];
const plate = (h) => [{ k: 'c', x: h[0], y: h[1], r: 5.5, c: 'j' }];

export const POSES = {
  /* ---------------- PRESSING ---------------- */
  bench_press: (p) => ({
    hip: [66, 63],
    torso: 180,
    arms: [{ target: [46, L(42, 56, p)], side: 1 }],
    legs: [{ target: [76, 90], side: -1 }],
    back: () => [
      rect(22, 68, 58, 5),
      line(30, 73, 30, 92),
      line(72, 73, 72, 92),
    ],
    front: (r) => [
      line(r.hands[0][0] - 12, r.hands[0][1], r.hands[0][0] + 12, r.hands[0][1], 'j', 3),
      rect(r.hands[0][0] - 4, r.hands[0][1] - 7, 8, 14, 'j'),
      ...arrow(64, 52, 64, 26),
    ],
  }),

  floor_press: (p) => ({
    hip: [68, 84],
    torso: 180,
    arms: [{ target: [48, L(63, 73, p)], side: 1 }],
    legs: [{ target: [88, 89], side: -1 }],
    back: () => [rect(16, 88, 88, 4)],
    front: (r) => [dumbbell(r.hands[0], 14), ...arrow(62, 70, 62, 40)],
  }),

  incline_press: (p) => ({
    hip: [62, 68],
    torso: -132,
    arms: [{ target: [L(48, 50, p), L(29, 44, p)], side: 1 }],
    legs: [{ target: [82, 90], side: -1 }],
    back: (r) => {
      const d = dir(-132);
      const o = [-3, 2.7];
      const a = add(r.hip, o);
      const b = add(a, d, 32);
      return [
        line(a[0], a[1], b[0], b[1], 'e', 4.5),
        line(a[0], a[1], a[0] + 18, a[1] - 2, 'e', 4.5),
        line(b[0] + 6, b[1] + 8, b[0] + 6, 92),
        line(a[0] + 12, a[1], a[0] + 12, 92),
      ];
    },
    front: (r) => [dumbbell(r.hands[0], 12), ...arrow(68, 52, 68, 26)],
  }),

  machine_chest_press: (p) => ({
    hip: [38, 64],
    torso: -90,
    arms: [{ target: [L(59.5, 46, p), 44], side: 1 }],
    legs: [{ target: [55, 88], side: -1 }],
    back: () => [line(28, 22, 28, 92, 'e', 4), line(28, 68, 50, 68, 'e', 4)],
    front: (r) => [
      line(r.hands[0][0], r.hands[0][1] - 8, r.hands[0][0], r.hands[0][1] + 8, 'j', 3.5),
      ...arrow(76, 44, 100, 44),
    ],
  }),

  cable_fly: (p) => {
    const hip = [60, 62];
    return {
      hip,
      torso: -90,
      arms: [
        { off: [-5, 2], target: [L(35, 53, p), L(46, 52, p)], side: 1 },
        { off: [5, 2], target: [L(85, 67, p), L(46, 52, p)], side: -1 },
      ],
      legs: [
        { target: [55, 91], side: 1 },
        { target: [65, 91], side: -1 },
      ],
      back: (r) => [
        line(16, 34, r.hands[0][0], r.hands[0][1], 'e', 1.5, '2,2'),
        line(104, 34, r.hands[1][0], r.hands[1][1], 'e', 1.5, '2,2'),
      ],
      front: (r) => [
        { k: 'c', x: r.hands[0][0], y: r.hands[0][1], r: 2.6, c: 'j' },
        { k: 'c', x: r.hands[1][0], y: r.hands[1][1], r: 2.6, c: 'j' },
      ],
    };
  },

  pushup: (p) => {
    const F = [22, 90];
    const sin = L(0.407, 0.185, p);
    const cos = Math.sqrt(1 - sin * sin);
    const d = [cos, -sin];
    return {
      hip: add(F, d, 30),
      shoulder: add(F, d, 54),
      arms: [{ target: [72, 90], side: 1 }],
      legs: [{ target: F, side: -1 }],
      front: () => arrow(50, 58, 50, 34),
    };
  },

  decline_pushup: (p) => {
    const F = [22, 50];
    const sin = L(0.333, 0.556, p);
    const cos = Math.sqrt(1 - sin * sin);
    const d = [cos, sin];
    return {
      hip: add(F, d, 30),
      shoulder: add(F, d, 54),
      arms: [{ target: [73, 90], side: 1 }],
      legs: [{ target: F, side: -1 }],
      back: () => [rect(12, 50, 20, 42, 'e', 3)],
      front: () => arrow(52, 50, 52, 26),
    };
  },

  pike_pushup: (p) => {
    const F = [30, 90];
    const hand = [64, 90];
    const phi = L(70, 62, p);
    const hip = add(F, [Math.cos(rad(phi)), -Math.sin(rad(phi))], 30);
    const sols = intersect(hip, BONE.torso, hand, L(22, 12, p));
    const shoulder = sols[0][1] < sols[1][1] ? sols[0] : sols[1];
    return {
      hip,
      shoulder,
      arms: [{ target: hand, side: 1 }],
      legs: [{ target: F, side: -1 }],
      front: () => arrow(88, 76, 88, 50),
    };
  },

  dip: (p) => {
    const shoulder = [62, L(33, 42, p)];
    const hip = add(shoulder, [-4, 23.7]);
    return {
      hip,
      shoulder,
      arms: [{ target: [62, 54], side: 1 }],
      legs: [{ target: add(hip, [-12, 24]), side: -1 }],
      back: () => [line(34, 54, 86, 54, 'e', 3.5), line(40, 54, 40, 92), line(80, 54, 80, 92)],
      front: () => arrow(84, 50, 84, 26),
    };
  },

  overhead_press: (p) => ({
    ...stand(56),
    arms: [{ target: [L(58, 64, p), L(16, 33, p)], side: 1 }],
    front: (r) => [...barbell(r.hands[0]), ...arrow(88, 38, 88, 10)],
  }),

  lateral_raise: (p) => {
    const t = L(8, 80, p);
    const lroot = [55, 40];
    const rroot = [65, 40];
    return {
      hip: [60, 62],
      torso: -90,
      arms: [
        { off: [-5, 2], target: add(lroot, [-Math.sin(rad(t)), Math.cos(rad(t))], 20), side: 1 },
        { off: [5, 2], target: add(rroot, [Math.sin(rad(t)), Math.cos(rad(t))], 20), side: -1 },
      ],
      legs: [
        { target: [55, 91], side: 1 },
        { target: [65, 91], side: -1 },
      ],
      front: (r) => [dumbbell(r.hands[0], 6), dumbbell(r.hands[1], 6)],
    };
  },

  /* ---------------- PULLING ---------------- */
  lat_pulldown: (p) => ({
    hip: [56, 72],
    torso: -100,
    arms: [{ target: [L(58, 63, p), L(29, 57, p)], side: 1 }],
    legs: [{ target: [76, 90], side: -1 }],
    back: (r) => [
      line(40, 76, 66, 76, 'e', 4),
      line(56, 76, 56, 92),
      line(60, 4, r.hands[0][0], r.hands[0][1], 'e', 1.5),
    ],
    front: (r) => [
      line(r.hands[0][0] - 12, r.hands[0][1], r.hands[0][0] + 12, r.hands[0][1], 'j', 3.5),
      ...arrow(90, 30, 90, 56),
    ],
  }),

  pullup: (p) => {
    const shoulder = [60, L(32, 19, p)];
    const hip = [60, shoulder[1] + 24];
    return {
      hip,
      shoulder,
      arms: [
        { target: [60, 10], side: -1 },
        { off: [3, 0], target: [63, 10], side: -1, sec: true },
      ],
      legs: [
        { target: [hip[0] - 3, hip[1] + 28.5], side: -1 },
        { target: [hip[0] + 3, hip[1] + 28], side: -1, sec: true },
      ],
      back: () => [line(26, 10, 94, 10, 'e', 4)],
      front: () => arrow(28, 58, 28, 30),
    };
  },

  straight_arm_pulldown: (p) => {
    const hip = [38, 62];
    const shoulder = add(hip, dir(-60), BONE.torso);
    const t = L(-38, 68, p);
    return {
      hip,
      shoulder,
      arms: [{ target: add(shoulder, dir(t), 21), side: 1 }],
      legs: [
        { target: [40, 91], side: -1 },
        { target: [46, 91], side: -1, sec: true },
      ],
      back: (r) => [line(90, 10, 90, 92), line(90, 14, r.hands[0][0], r.hands[0][1], 'e', 1.5, '2,2')],
      front: () => [],
    };
  },

  db_pullover: (p) => {
    const shoulder = [46, 62];
    return {
      hip: [70, 62],
      shoulder,
      arms: [{ target: add(shoulder, dir(L(-90, -200, p)), 20), side: 1 }],
      legs: [{ target: [78, 90], side: -1 }],
      back: () => [rect(30, 66, 54, 5), line(36, 71, 36, 92), line(76, 71, 76, 92)],
      front: (r) => [dumbbell(r.hands[0], 10)],
    };
  },

  row: (p) => ({
    hip: [40, 64],
    torso: -30,
    arms: [{ target: [L(60.8, 56, p), L(73, 58, p)], side: 1 }],
    legs: [
      { target: [50, 91], side: -1 },
      { target: [44, 91], side: -1, sec: true },
    ],
    front: (r) => [...plate(r.hands[0]), ...arrow(76, 78, 66, 60)],
  }),

  one_arm_db_row: (p) => ({
    hip: [50, 63],
    torso: -8,
    arms: [
      { target: [L(74, 62, p), L(80.7, 62, p)], side: 1 },
      { target: [88, 77], side: 1, sec: true },
    ],
    legs: [
      { target: [44, 91], side: -1 },
      { target: [36, 90], side: -1, sec: true },
    ],
    back: () => [rect(80, 77, 22, 5), line(84, 82, 84, 92), line(98, 82, 98, 92)],
    front: (r) => [dumbbell(r.hands[0], 10), ...arrow(68, 80, 62, 58)],
  }),

  seated_cable_row: (p) => ({
    hip: [40, 68],
    torso: L(-80, -98, p),
    arms: [{ target: [L(60, 46, p), L(48, 52, p)], side: 1 }],
    legs: [{ target: [62, 86], side: -1 }],
    back: (r) => [
      rect(20, 70, 40, 4),
      line(66, 62, 66, 92),
      line(98, 20, 98, 92, 'e', 3.5),
      line(98, 50, r.hands[0][0], r.hands[0][1], 'e', 1.5, '2,2'),
    ],
    front: (r) => [
      line(r.hands[0][0], r.hands[0][1] - 5, r.hands[0][0], r.hands[0][1] + 5, 'j', 3),
      ...arrow(80, 38, 56, 38),
    ],
  }),

  chest_supported_row: (p) => ({
    hip: [42, 66],
    torso: -42,
    arms: [{ target: [L(62, 57, p), L(71, 58, p)], side: 1 }],
    legs: [
      { target: [34, 90], side: -1 },
      { target: [40, 91], side: -1, sec: true },
    ],
    back: (r) => {
      const d = dir(-42);
      const off = [3.4, 3.7];
      const a = add(add(r.hip, off), d, -6);
      const b = add(add(r.shoulder, off), d, 8);
      return [
        line(a[0], a[1], b[0], b[1], 'e', 5),
        line(a[0], a[1], a[0], 92),
        line(b[0], b[1], b[0], 92),
      ];
    },
    front: (r) => [dumbbell(r.hands[0], 10), ...arrow(86, 70, 86, 46)],
  }),

  inverted_row: (p) => {
    const hand = [42, 38];
    const F = [88, 88];
    const sols = intersect(F, BONE.torso + BONE.thigh * 2, hand, L(21, 15, p));
    const shoulder = sols[0][1] > sols[1][1] ? sols[0] : sols[1];
    const hip = add(F, unit([shoulder[0] - F[0], shoulder[1] - F[1]]), 30);
    return {
      hip,
      shoulder,
      arms: [{ target: hand, side: 1 }],
      legs: [{ target: F, side: -1 }],
      back: () => [line(42, 24, 42, 92, 'e', 3.5)],
      front: () => [{ k: 'c', x: 42, y: 38, r: 3.5, c: 'j' }, ...arrow(26, 68, 26, 46)],
    };
  },

  face_pull: (p) => ({
    ...stand(36),
    arms: [{ target: [L(56, 45, p), L(34, 31, p)], side: -1 }],
    back: (r) => [line(94, 12, 94, 92, 'e', 3.5), line(94, 30, r.hands[0][0], r.hands[0][1], 'e', 1.5, '2,2')],
    front: (r) => [{ k: 'c', x: r.hands[0][0], y: r.hands[0][1], r: 2.8, c: 'j' }, ...arrow(80, 22, 56, 22)],
  }),

  /* ---------------- SQUAT / LEGS ---------------- */
  squat: (p) => ({
    hip: [L(56, 43, p), L(61, 72, p)],
    torso: L(-90, -52, p),
    arms: [{ rel: [5, 2], side: 1 }],
    legs: [
      { target: [56, 91], side: -1 },
      { target: [62, 91], side: -1, sec: true },
    ],
    front: (r) => [
      line(r.shoulder[0] - 14, r.shoulder[1] - 2, r.shoulder[0] + 14, r.shoulder[1] - 2, 'j', 3),
      rect(r.shoulder[0] - 17, r.shoulder[1] - 7, 4, 10, 'j', 1.5),
      rect(r.shoulder[0] + 13, r.shoulder[1] - 7, 4, 10, 'j', 1.5),
      ...arrow(24, 66, 24, 28),
    ],
  }),

  goblet_squat: (p) => ({
    hip: [L(56, 43, p), L(61, 72, p)],
    torso: L(-90, -70, p),
    arms: [{ rel: [8, 9], side: 1 }],
    legs: [
      { target: [56, 91], side: -1 },
      { target: [62, 91], side: -1, sec: true },
    ],
    front: (r) => [rect(r.hands[0][0] - 3, r.hands[0][1] - 6, 6, 12, 'j', 2), ...arrow(24, 66, 24, 28)],
  }),

  air_squat: (p) => ({
    hip: [L(56, 43, p), L(61, 72, p)],
    torso: L(-90, -60, p),
    arms: [{ rel: [20, -2], side: 1 }],
    legs: [
      { target: [56, 91], side: -1 },
      { target: [62, 91], side: -1, sec: true },
    ],
    front: () => arrow(24, 66, 24, 28),
  }),

  leg_press: (p) => {
    const hip = [40, 72];
    const shoulder = add(hip, dir(-130), BONE.torso);
    const foot = add(hip, dir(-40), L(29, 16, p));
    const n = [0.64, 0.77];
    return {
      hip,
      shoulder,
      arms: [{ rel: [6, 10], side: 1 }],
      legs: [{ target: foot, side: -1 }],
      back: () => {
        const a = add(hip, [-3.1, 2.6]);
        const b = add(a, dir(-130), 30);
        return [
          line(24, 88, 94, 34, 'e', 3),
          line(a[0], a[1], b[0], b[1], 'e', 4.5),
          line(a[0] - 4, a[1] + 2, a[0] + 12, a[1] + 2, 'e', 4.5),
        ];
      },
      front: (r) => [
        line(r.feet[0][0] - n[0] * 10, r.feet[0][1] - n[1] * 10, r.feet[0][0] + n[0] * 10, r.feet[0][1] + n[1] * 10, 'j', 4.5),
        ...arrow(80, 38, 96, 24),
      ],
    };
  },

  leg_extension: (p) => {
    const knee = [53, 66];
    return {
      hip: [38, 66],
      torso: -90,
      arms: [{ rel: [6, 14], side: 1 }],
      legs: [{ joint: knee, end: add(knee, dir(L(-8, 90, p)), BONE.shin) }],
      back: () => [line(28, 28, 28, 66, 'e', 4), line(28, 66, 58, 66, 'e', 4), line(42, 66, 42, 92)],
      front: (r) => [{ k: 'c', x: r.feet[0][0], y: r.feet[0][1], r: 3.5, c: 'j' }],
    };
  },

  leg_curl: (p) => {
    const knee = [53, 66];
    return {
      hip: [38, 66],
      torso: -90,
      arms: [{ rel: [6, 14], side: 1 }],
      legs: [{ joint: knee, end: add(knee, dir(L(0, 105, p)), BONE.shin) }],
      back: () => [line(28, 28, 28, 66, 'e', 4), line(28, 66, 58, 66, 'e', 4), line(42, 66, 42, 92)],
      front: (r) => [{ k: 'c', x: r.feet[0][0], y: r.feet[0][1], r: 3.5, c: 'j' }],
    };
  },

  hinge: (p) => ({
    hip: [L(48, 38, p), L(61, 63, p)],
    torso: L(-90, -22, p),
    arms: [{ rel: [0, 21], side: 1 }],
    legs: [
      { target: [48, 91], side: -1 },
      { target: [50, 91], side: -1, sec: true },
    ],
    front: (r) => [
      line(r.hands[0][0] - 12, r.hands[0][1], r.hands[0][0] + 12, r.hands[0][1], 'j', 3),
      ...plate(r.hands[0]),
      ...arrow(30, 52, 14, 52),
    ],
  }),

  glute_bridge: (p) => {
    const shoulder = [27, 64];
    const th = L(48, 0, p);
    return {
      hip: add(shoulder, dir(th), BONE.torso),
      shoulder,
      arms: [{ target: [33, 84], side: 1 }],
      legs: [{ target: [58, 91], side: -1 }],
      back: () => [rect(16, 66, 22, 25, 'e', 3)],
      front: () => arrow(66, 56, 66, 30),
    };
  },

  lunge: (p) => ({
    hip: [54, L(66, 76, p)],
    torso: -90,
    arms: [{ rel: [2, 19], side: 1 }],
    legs: [
      { target: [70, 91], side: -1 },
      { target: [36, 90], side: -1, sec: true },
    ],
    front: () => arrow(92, 60, 92, 28),
  }),

  bulgarian_split_squat: (p) => ({
    hip: [52, L(64.5, 74, p)],
    torso: -90,
    arms: [{ rel: [2, 19], side: 1 }],
    legs: [
      { target: [66, 91], side: -1 },
      { target: [30, 64], side: -1, sec: true },
    ],
    back: () => [rect(14, 66, 20, 25, 'e', 3)],
    front: () => arrow(92, 60, 92, 28),
  }),

  calf_raise: (p) => {
    const toe = [60, 84];
    const phi = L(15, 55, p);
    const ankle = add(toe, [-Math.cos(rad(phi)), -Math.sin(rad(phi))], 12);
    return {
      hip: [ankle[0], ankle[1] - 30],
      torso: -90,
      arms: [{ rel: [1, 20], side: 1 }],
      legs: [
        { target: ankle, side: -1 },
        { target: add(ankle, [4, 0]), side: -1, sec: true },
      ],
      back: () => [rect(34, 84, 32, 8)],
      front: () => [line(ankle[0], ankle[1], toe[0], toe[1], 'b', 4), ...arrow(78, 84, 78, 58)],
    };
  },

  /* ---------------- ARMS ---------------- */
  bicep_curl: (p) => ({
    ...stand(52),
    arms: [
      {
        fk: (s) => {
          const j = add(s, [2, 10.81]);
          return { joint: j, end: add(j, dir(L(80, -62, p)), BONE.fore) };
        },
      },
    ],
    front: (r) => [dumbbell(r.hands[0], 8), ...arrow(80, 56, 82, 30)],
  }),

  incline_curl: (p) => ({
    hip: [58, 66],
    torso: -125,
    arms: [
      {
        fk: (s) => {
          const j = add(s, [0, 11]);
          return { joint: j, end: add(j, dir(L(95, -40, p)), BONE.fore) };
        },
      },
    ],
    legs: [{ target: [76, 90], side: -1 }],
    back: (r) => {
      const a = add(r.hip, [-3.3, 2.3]);
      const b = add(a, dir(-125), 34);
      return [
        line(a[0], a[1], b[0], b[1], 'e', 4.5),
        line(a[0], a[1], a[0] + 16, a[1] + 2, 'e', 4.5),
        line(b[0], b[1], b[0], 92),
        line(a[0] + 10, a[1], a[0] + 10, 92),
      ];
    },
    front: (r) => [dumbbell(r.hands[0], 8)],
  }),

  tricep_ext: (p) => ({
    ...stand(46),
    arms: [
      {
        fk: (s) => {
          const j = add(s, [2, 10.81]);
          return { joint: j, end: add(j, dir(L(70, -35, p)), BONE.fore) };
        },
      },
    ],
    back: (r) => [line(88, 10, 88, 92), line(88, 14, r.hands[0][0], r.hands[0][1], 'e', 1.5, '2,2')],
    front: (r) => [{ k: 'c', x: r.hands[0][0], y: r.hands[0][1], r: 2.8, c: 'j' }],
  }),

  overhead_tricep_ext: (p) => ({
    ...stand(56),
    arms: [
      {
        fk: (s) => {
          const j = add(s, [0, -11]);
          return { joint: j, end: add(j, dir(L(-90, -210, p)), BONE.fore) };
        },
      },
    ],
    front: (r) => [dumbbell(r.hands[0], 8)],
  }),

  /* ---------------- CORE ---------------- */
  core_hang: (p) => {
    const hip = [60, 56];
    const th = L(86, 2, p);
    return {
      hip,
      shoulder: [60, 32],
      arms: [{ target: [60, 10], side: -1 }],
      legs: [{ joint: add(hip, dir(th), BONE.thigh), end: add(hip, dir(th), BONE.thigh + BONE.shin) }],
      back: () => [line(36, 10, 84, 10, 'e', 4)],
      front: () => [],
    };
  },

  core_floor: (p) => ({
    hip: [54, 86],
    torso: 180,
    arms: [
      { target: [L(30, 10, p), L(64, 84, p)], side: 1 },
      { target: [30, 64], side: 1, sec: true },
    ],
    legs: [
      { target: [69, 71], side: -1, sec: true },
      { target: [L(69, 82, p), L(71, 84, p)], side: -1 },
    ],
    back: () => [rect(12, 89, 96, 3)],
    front: () => [],
  }),
};

export const MOTION_TYPES = new Set(Object.keys(POSES));

/** Solve skeleton for a pose spec. */
export function solvePose(type, p = 0) {
  const build = POSES[type] || POSES.cable_fly;
  const spec = build(Math.max(0, Math.min(1, p)));
  const hip = spec.hip;
  const shoulder = spec.shoulder || add(hip, dir(spec.torso), BONE.torso);
  const head = add(shoulder, unit([shoulder[0] - hip[0], shoulder[1] - hip[1]]), BONE.head);

  const limbs = [];
  (spec.arms || []).forEach((a) => {
    const root = add(shoulder, a.off || [0, 0]);
    let res;
    if (a.fk) res = a.fk(root);
    else {
      const target = a.rel ? add(root, a.rel) : a.target;
      res = ik(root, target, BONE.upper, BONE.fore, a.side || 1);
      res.target = target;
    }
    limbs.push({ kind: 'arm', root, joint: res.joint, end: res.end, target: res.target, sec: !!a.sec });
  });
  (spec.legs || []).forEach((l) => {
    const root = add(hip, l.off || [0, 0]);
    let res;
    if (l.joint) res = { joint: l.joint, end: l.end };
    else {
      res = ik(root, l.target, BONE.thigh, BONE.shin, l.side || 1);
      res.target = l.target;
    }
    limbs.push({ kind: 'leg', root, joint: res.joint, end: res.end, target: res.target, sec: !!l.sec });
  });

  const r = {
    hip,
    shoulder,
    head,
    hands: limbs.filter((x) => x.kind === 'arm' && !x.sec).map((x) => x.end),
    feet: limbs.filter((x) => x.kind === 'leg' && !x.sec).map((x) => x.end),
  };
  if (!r.hands.length) r.hands = limbs.filter((x) => x.kind === 'arm').map((x) => x.end);
  return {
    hip,
    shoulder,
    head,
    limbs,
    back: spec.back ? spec.back(r) : [],
    front: spec.front ? spec.front(r) : [],
  };
}
