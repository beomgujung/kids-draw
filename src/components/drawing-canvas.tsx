import { Canvas, Path, Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';
import { useRef, useState } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';

import { ColorPalette, ToolButton } from '@/components/color-palette';
import { PALETTE } from '@/constants/palette';

type Stroke = { path: SkPath; color: string };

const STROKE_WIDTH = 18;

// Skia 를 직접 import 하므로 웹에서는 반드시 CanvasKit 로드 후에 불러야 한다 (drawing-board.web.tsx 참고).
export default function DrawingCanvas() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [color, setColor] = useState(PALETTE[0]);
  const builder = useRef<SkPathBuilder | null>(null);

  const handleStart = (e: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    builder.current = Skia.PathBuilder.Make().moveTo(x, y).lineTo(x, y);
    setCurrent({ path: builder.current.build(), color });
  };

  const handleMove = (e: GestureResponderEvent) => {
    if (!current || !builder.current) return;
    const { locationX: x, locationY: y } = e.nativeEvent;
    // SkPath 는 불변이므로 빌더에 점을 더하고 새 경로를 만든다.
    setCurrent({ path: builder.current.lineTo(x, y).build(), color: current.color });
  };

  const handleEnd = () => {
    if (!current) return;
    setStrokes((prev) => [...prev, current]);
    setCurrent(null);
    builder.current = null;
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.canvasArea}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleStart}
        onResponderMove={handleMove}
        onResponderRelease={handleEnd}
        onResponderTerminate={handleEnd}
      >
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          {strokes.map((s, i) => (
            <StrokePath key={i} stroke={s} />
          ))}
          {current && <StrokePath stroke={current} />}
        </Canvas>
      </View>

      <ColorPalette selected={color} onSelect={setColor}>
        <ToolButton icon="↩️" label="되돌리기" onPress={() => setStrokes((prev) => prev.slice(0, -1))} />
        <ToolButton icon="🗑️" label="모두 지우기" onPress={() => setStrokes([])} />
      </ColorPalette>
    </View>
  );
}

function StrokePath({ stroke }: { stroke: Stroke }) {
  return (
    <Path
      path={stroke.path}
      color={stroke.color}
      style="stroke"
      strokeWidth={STROKE_WIDTH}
      strokeCap="round"
      strokeJoin="round"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  canvasArea: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
});
