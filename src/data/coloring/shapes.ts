// 밑그림 공통 타입과 도형 헬퍼. 모든 좌표는 200x200 viewBox 기준.
// - regions: 칠할 수 있는 닫힌 영역. 배열 순서대로 그려지며 뒤의 것이 위에 놓인다.
// - inks: 검은색으로 미리 칠해진 부분 (눈동자 등). 칠하는 대상 아님.
// - lines: 선만 있는 장식 (입, 수염 등). 칠하는 대상 아님.

export type ColoringPicture = {
  id: string;
  regions: string[];
  inks?: string[];
  lines?: string[];
};

export const VIEWBOX_SIZE = 200;

export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

export const circle = (cx: number, cy: number, r: number) => ellipse(cx, cy, r, r);

export const roundRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} ` +
  `H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

export const polygon = (...points: [number, number][]) =>
  `M${points.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;

export const petals = (cx: number, cy: number, count: number, distance: number, r: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return circle(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance, r);
  });
