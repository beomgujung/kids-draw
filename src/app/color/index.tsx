import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { type Category, CATEGORIES } from '@/data/coloring';

// 색칠할 그림 종류 고르기. 글을 못 읽어도 고를 수 있게 큰 아이콘 + 색 카드.
export default function ColorCategoryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: '색칠하기' }} />
      {CATEGORIES.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </ScrollView>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Pressable
      accessibilityLabel={category.label}
      onPress={() => router.push({ pathname: '/color/[category]', params: { category: category.id } })}
      style={[styles.card, { backgroundColor: category.color }]}
    >
      <Text selectable={false} style={styles.icon}>
        {category.icon}
      </Text>
      <Text selectable={false} style={styles.label}>
        {category.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
    backgroundColor: '#FFF8E7',
  },
  card: {
    width: 150,
    height: 170,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 68,
  },
  label: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
