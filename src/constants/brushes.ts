// 색칠 도구. width 는 밑그림 200x200 viewBox 단위 (화면에선 약 2.5~4배로 커진다).
export type Brush = { id: string; icon: string; label: string; width: number };

export const BRUSHES: Brush[] = [
  { id: 'pencil', icon: '✏️', label: '연필', width: 4 },
  { id: 'pen', icon: '🖊️', label: '펜', width: 8 },
  { id: 'crayon', icon: '🖍️', label: '크레용', width: 14 },
  { id: 'brush', icon: '🖌️', label: '큰 붓', width: 24 },
];

export const DEFAULT_BRUSH = BRUSHES[2];
