import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import ColoringBoard from '@/components/coloring-board';
import { findCategory } from '@/data/coloring';

export default function ColorScreen() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const category = findCategory(categoryId);
  if (!category) return <Redirect href="/color" />;

  return (
    <>
      <Stack.Screen options={{ title: `${category.icon} ${category.label}` }} />
      {/* 카테고리를 바꾸면 처음부터 새로 시작하도록 key 를 준다. */}
      <ColoringBoard key={category.id} category={category.id} />
    </>
  );
}
