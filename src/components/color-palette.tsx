import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/constants/palette';

type Props = {
  selected: string;
  onSelect: (color: string) => void;
  // 색 옆에 붙는 도구 버튼들 (되돌리기, 다음 그림 등)
  children?: ReactNode;
};

export function ColorPalette({ selected, onSelect, children }: Props) {
  return (
    <View style={styles.toolbar}>
      {PALETTE.map((c) => (
        <Pressable
          key={c}
          accessibilityLabel={`색 ${c}`}
          onPress={() => onSelect(c)}
          style={[styles.swatch, { backgroundColor: c }, c === selected && styles.swatchSelected]}
        />
      ))}
      {children}
    </View>
  );
}

type ToolButtonProps = { icon: string; label: string; selected?: boolean; onPress: () => void };

export function ToolButton({ icon, label, selected = false, onPress }: ToolButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.toolButton, selected && styles.toolButtonSelected]}
    >
      <Text selectable={false} style={styles.toolIcon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: '#333333',
    transform: [{ scale: 1.15 }],
  },
  toolButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  toolButtonSelected: {
    borderWidth: 4,
    borderColor: '#333333',
  },
  toolIcon: {
    fontSize: 28,
  },
});
