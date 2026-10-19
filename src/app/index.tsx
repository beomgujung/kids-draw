import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 kids-draw</Text>
      <Text style={styles.subtitle}>그리기 · 색칠하기</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E7',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 24,
    color: '#666',
  },
});
