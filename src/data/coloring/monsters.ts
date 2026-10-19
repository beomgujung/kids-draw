import { circle, type ColoringPicture, ellipse, polygon, roundRect } from './shapes';

// 👾 몬스터: 몸통·눈·머리 장식·입·팔다리를 무작위로 조합해 매번 새 몬스터를 만든다.
// 몸통마다 꼭대기(top)·바닥(bottom) 높이가 달라서 나머지 부품은 그 높이를 기준으로 붙인다.

type Body = { d: string; top: number; bottom: number; hasFeet: boolean };

const BODIES: Body[] = [
  { d: ellipse(100, 115, 62, 52), top: 63, bottom: 167, hasFeet: true },
  { d: circle(100, 112, 58), top: 54, bottom: 170, hasFeet: true },
  { d: roundRect(50, 50, 100, 128, 40), top: 50, bottom: 178, hasFeet: true },
  {
    // 유령: 아래가 물결 모양
    d: 'M44 180 L44 100 A56 56 0 0 1 156 100 L156 180 L138 166 L119 180 L100 166 L81 180 L62 166 Z',
    top: 44,
    bottom: 180,
    hasFeet: false,
  },
];

type Part = Pick<ColoringPicture, 'regions' | 'inks' | 'lines'>;

// 몸통 뒤에 그려지는 머리 장식 (t = 몸통 꼭대기)
const HEADGEAR: ((t: number) => Part)[] = [
  (t) => ({
    regions: [polygon([76, t + 18], [60, t - 26], [94, t + 10]), polygon([124, t + 18], [140, t - 26], [106, t + 10])],
  }),
  (t) => ({
    regions: [circle(74, t - 28, 7), circle(126, t - 28, 7)],
    lines: [`M88 ${t + 4} L76 ${t - 21}`, `M112 ${t + 4} L124 ${t - 21}`],
  }),
  (t) => ({ regions: [circle(62, t + 12, 16), circle(138, t + 12, 16)] }),
  (t) => ({
    regions: [
      polygon([80, t + 14], [88, t - 14], [98, t + 14]),
      polygon([92, t + 10], [100, t - 22], [108, t + 10]),
      polygon([102, t + 14], [112, t - 14], [120, t + 14]),
    ],
  }),
  () => ({ regions: [] }),
];

// 눈 (y = 눈 높이)
const EYES: ((y: number) => Part)[] = [
  (y) => ({ regions: [circle(100, y, 18)], inks: [circle(100, y + 2, 7)] }),
  (y) => ({ regions: [circle(82, y, 13), circle(118, y, 13)], inks: [circle(84, y + 2, 5), circle(116, y + 2, 5)] }),
  (y) => ({
    regions: [circle(76, y + 4, 10), circle(100, y - 4, 11), circle(124, y + 4, 10)],
    inks: [circle(76, y + 6, 4), circle(100, y - 2, 4.5), circle(124, y + 6, 4)],
  }),
];

// 입 (y = 입 높이)
const MOUTHS: ((y: number) => Part)[] = [
  (y) => ({ regions: [], lines: [`M78 ${y} Q100 ${y + 20} 122 ${y}`] }),
  (y) => ({
    regions: [
      `M72 ${y} Q100 ${y + 44} 128 ${y} Z`,
      polygon([84, y], [90, y + 10], [96, y]),
      polygon([104, y], [110, y + 10], [116, y]),
    ],
  }),
  (y) => ({ regions: [ellipse(100, y + 8, 18, 12), ellipse(100, y + 13, 10, 6)] }),
];

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

let monsterCount = 0;

export function generateMonster(): ColoringPicture {
  const body = pick(BODIES);
  const eyeY = body.top + 38;
  const mouthY = body.top + 72;
  const armY = eyeY + 30;

  const behind: Part[] = [pick(HEADGEAR)(body.top)];
  if (Math.random() < 0.6) behind.push({ regions: [ellipse(38, armY, 18, 10), ellipse(162, armY, 18, 10)] });
  if (body.hasFeet) {
    behind.push({ regions: [roundRect(64, body.bottom - 12, 28, 24, 10), roundRect(108, body.bottom - 12, 28, 24, 10)] });
  }

  const front: Part[] = [pick(EYES)(eyeY), pick(MOUTHS)(mouthY)];
  if (Math.random() < 0.5) front.push({ regions: [circle(68, 148, 6), circle(132, 148, 6)] });

  const parts = [...behind, { regions: [body.d] }, ...front];
  monsterCount += 1;
  return {
    id: `monster-${monsterCount}`,
    regions: parts.flatMap((p) => p.regions),
    inks: parts.flatMap((p) => p.inks ?? []),
    lines: parts.flatMap((p) => p.lines ?? []),
  };
}
