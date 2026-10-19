import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type Brush, BRUSHES } from '@/constants/brushes';

type Props = {
  selected: Brush;
  color: string;
  onSelect: (brush: Brush) => void;
};

// 글을 못 읽는 아이를 위해 도구 아이콘 옆에 실제 굵기만 한 점을 지금 색으로 보여준다.
export function BrushPicker({ selected, color, onSelect }: Props) {
  return (
    <View style={styles.panel}>
      {BRUSHES.map((brush) => (
        <Pressable
          key={brush.id}
          accessibilityLabel={brush.label}
          accessibilityState={{ selected: brush.id === selected.id }}
          onPress={() => onSelect(brush)}
          style={[styles.option, brush.id === selected.id && styles.optionSelected]}
        >
          <Text selectable={false} style={styles.icon}>{brush.icon}</Text>
          <View style={styles.dotBox}>
            <View
              style={{
                width: brush.width * 1.6,
                height: brush.width * 1.6,
                borderRadius: brush.width,
                backgroundColor: color,
              }}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  option: {
    width: 72,
    height: 96,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFF8E7',
  },
  optionSelected: {
    borderColor: '#333333',
  },
  icon: {
    fontSize: 30,
  },
  dotBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
