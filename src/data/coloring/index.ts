import { DINOSAUR_PICTURES } from './dinosaurs';
import { MACHINE_PICTURES } from './machines';
import { generateMonster } from './monsters';
import { NATURE_PICTURES } from './nature';
import { type ColoringPicture } from './shapes';

export { type ColoringPicture, VIEWBOX_SIZE } from './shapes';

export type CategoryId = 'monster' | 'dinosaur' | 'machine' | 'nature' | 'random';

export type Category = { id: CategoryId; icon: string; label: string; color: string };

export const CATEGORIES: Category[] = [
  { id: 'monster', icon: '👾', label: '몬스터', color: '#8338EC' },
  { id: 'dinosaur', icon: '🦖', label: '공룡', color: '#6BCB3D' },
  { id: 'machine', icon: '🤖', label: '로봇·자동차', color: '#3A86FF' },
  { id: 'nature', icon: '🌷', label: '동식물', color: '#FF70A6' },
  { id: 'random', icon: '🎲', label: '랜덤', color: '#FF9F1C' },
];

export function findCategory(id: string | undefined) {
  return CATEGORIES.find((c) => c.id === id);
}

const FIXED_PICTURES: Partial<Record<CategoryId, ColoringPicture[]>> = {
  dinosaur: DINOSAUR_PICTURES,
  machine: MACHINE_PICTURES,
  nature: NATURE_PICTURES,
};

const pickFrom = (pictures: ColoringPicture[], excludeId?: string) => {
  const candidates = pictures.filter((p) => p.id !== excludeId);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

// 몬스터는 매번 새로 만들고, 나머지는 방금 본 그림을 빼고 무작위로 고른다.
export function pickPicture(category: CategoryId, excludeId?: string): ColoringPicture {
  if (category === 'random') {
    const all = [...DINOSAUR_PICTURES, ...MACHINE_PICTURES, ...NATURE_PICTURES];
    // 몬스터는 무한히 만들 수 있으니 카테고리 비율(1/4)만큼만 섞는다.
    return Math.random() < 0.25 ? generateMonster() : pickFrom(all, excludeId);
  }
  if (category === 'monster') return generateMonster();
  return pickFrom(FIXED_PICTURES[category] ?? [], excludeId);
}
