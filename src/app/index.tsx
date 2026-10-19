import { type Href, router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// 글을 못 읽는 아이도 고를 수 있게 큰 그림 + 색으로 두 모드를 구분한다.
export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>🎨 kids-draw</Text>
      <View style={styles.modes}>
        <ModeCard href="/draw" icon="✏️" label="그리기" color="#FF9F1C" />
        <ModeCard href="/color" icon="🖍️" label="색칠하기" color="#3A86FF" />
      </View>
    </View>
  );
}

function ModeCard({ href, icon, label, color }: { href: Href; icon: string; label: string; color: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={() => router.push(href)}
      style={[styles.modeCard, { backgroundColor: color }]}
    >
      <Text selectable={false} style={styles.modeIcon}>{icon}</Text>
      <Text selectable={false} style={styles.modeLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF8E7',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
  },
  modes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    marginTop: 40,
  },
  modeCard: {
    width: 160,
    height: 180,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: {
    fontSize: 72,
  },
  modeLabel: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
