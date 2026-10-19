import { Canvas, Group, Path, Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { type GestureResponderEvent, type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { BrushPicker } from '@/components/brush-picker';
import { ColorPalette, ToolButton } from '@/components/color-palette';
import { type Brush, DEFAULT_BRUSH } from '@/constants/brushes';
import { PALETTE } from '@/constants/palette';
import { type CategoryId, type ColoringPicture, pickPicture, VIEWBOX_SIZE } from '@/data/coloring';

const OUTLINE_COLOR = '#222222';
const OUTLINE_WIDTH = 3;
const EMPTY_COLOR = '#FFFFFF';
const NEXT_PICTURE_DELAY_MS = 1800;
// 200x200 viewBox 단위.
const SAMPLE_STEP = 3;
// 영역 안 샘플 점 중 이 비율 이상이 붓에 닿으면 그 영역은 다 칠한 것으로 본다.
const DONE_RATIO = 0.85;

type Tool = 'brush' | 'bucket';

// 붓 자국은 시작한 영역 모양으로 잘려서(clip) 선 밖으로 나가지 않는다.
type Action =
  | { type: 'stroke'; region: number; color: string; width: number; points: number[]; path: SkPath }
  | { type: 'fill'; region: number; color: string };

type Board = ReturnType<typeof loadBoard>;

// Skia 를 직접 import 하므로 웹에서는 반드시 CanvasKit 로드 후에 불러야 한다 (coloring-board.web.tsx 참고).
export type ColoringCanvasProps = { category: CategoryId };

export default function ColoringCanvas({ category }: ColoringCanvasProps) {
  const [board, setBoard] = useState(() => loadBoard(pickPicture(category)));
  const [actions, setActions] = useState<Action[]>([]);
  const [drawing, setDrawing] = useState<Extract<Action, { type: 'stroke' }> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [color, setColor] = useState(PALETTE[0]);
  const [tool, setTool] = useState<Tool>('brush');
  const [brush, setBrush] = useState<Brush>(DEFAULT_BRUSH);
  const [isBrushPickerOpen, setIsBrushPickerOpen] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const builder = useRef<SkPathBuilder | null>(null);
  const coverage = useRef<Coverage | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearNextTimer(nextTimer), []);

  // 밑그림을 캔버스 가운데에 여백을 두고 꽉 차게 맞춘다.
  const scale = (Math.min(size.width, size.height) * 0.9) / VIEWBOX_SIZE;
  const offsetX = (size.width - VIEWBOX_SIZE * scale) / 2;
  const offsetY = (size.height - VIEWBOX_SIZE * scale) / 2;

  const toPicture = (e: GestureResponderEvent) => ({
    x: (e.nativeEvent.locationX - offsetX) / scale,
    y: (e.nativeEvent.locationY - offsetY) / scale,
  });

  const getCoverage = () => {
    if (coverage.current?.board !== board) coverage.current = createCoverage(board);
    return coverage.current;
  };

  const goToNextPicture = () => {
    clearNextTimer(nextTimer);
    setBoard(loadBoard(pickPicture(category, board.picture.id)));
    setActions([]);
    setDrawing(null);
    setIsComplete(false);
  };

  const commit = (action: Action) => {
    setActions((prev) => [...prev, action]);
    if (!getCoverage().isComplete()) return;
    setIsComplete(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    nextTimer.current = setTimeout(goToNextPicture, NEXT_PICTURE_DELAY_MS);
  };

  const handleStart = (e: GestureResponderEvent) => {
    setIsBrushPickerOpen(false);
    if (isComplete || scale === 0) return;
    const { x, y } = toPicture(e);
    const region = board.regionAt(x, y);
    if (region === -1) return;

    if (tool === 'bucket') {
      getCoverage().markRegion(region);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      commit({ type: 'fill', region, color });
      return;
    }

    builder.current = Skia.PathBuilder.Make().moveTo(x, y).lineTo(x, y);
    getCoverage().markSegment(region, brush.width, x, y, x, y);
    setDrawing({ type: 'stroke', region, color, width: brush.width, points: [x, y], path: builder.current.build() });
  };

  const handleMove = (e: GestureResponderEvent) => {
    if (!drawing || !builder.current) return;
    const { x, y } = toPicture(e);
    const [lastX, lastY] = drawing.points.slice(-2);
    getCoverage().markSegment(drawing.region, drawing.width, lastX, lastY, x, y);
    setDrawing({ ...drawing, points: [...drawing.points, x, y], path: builder.current.lineTo(x, y).build() });
  };

  const handleEnd = () => {
    if (!drawing) return;
    builder.current = null;
    setDrawing(null);
    commit(drawing);
  };

  const undo = () => {
    if (isComplete) return;
    const remaining = actions.slice(0, -1);
    setActions(remaining);
    coverage.current = createCoverage(board, remaining);
  };

  const clear = () => {
    if (isComplete) return;
    setActions([]);
    coverage.current = createCoverage(board);
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const visibleActions = drawing ? [...actions, drawing] : actions;

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrapper}>
        <View
          style={styles.canvasArea}
          onLayout={handleLayout}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleStart}
          onResponderMove={handleMove}
          onResponderRelease={handleEnd}
          onResponderTerminate={handleEnd}
        >
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            <Group transform={[{ translateX: offsetX }, { translateY: offsetY }, { scale }]}>
              {/* 뒤 영역이 앞 영역을 덮도록 영역마다 바탕색 → 붓 자국 → 외곽선 순서로 그린다. */}
              {board.regions.map((region, i) => (
                <Group key={i}>
                  <Path path={region} color={regionFillColor(visibleActions, i)} />
                  <Group clip={region}>
                    {visibleActions.map((a, j) =>
                      a.type === 'stroke' && a.region === i ? (
                        <Path
                          key={j}
                          path={a.path}
                          color={a.color}
                          style="stroke"
                          strokeWidth={a.width}
                          strokeCap="round"
                          strokeJoin="round"
                        />
                      ) : null,
                    )}
                  </Group>
                  <Path path={region} color={OUTLINE_COLOR} style="stroke" strokeWidth={OUTLINE_WIDTH} strokeJoin="round" />
                </Group>
              ))}
              {board.inks.map((p, i) => (
                <Path key={i} path={p} color={OUTLINE_COLOR} />
              ))}
              {board.lines.map((p, i) => (
                <Path key={i} path={p} color={OUTLINE_COLOR} style="stroke" strokeWidth={OUTLINE_WIDTH} strokeCap="round" />
              ))}
            </Group>
          </Canvas>

          {isComplete && (
            <View style={styles.celebration} pointerEvents="none">
              <Text style={styles.celebrationText}>🎉</Text>
            </View>
          )}
        </View>

        {/* 그림 영역의 형제로 둬야 한다. 안에 있으면 손가락이 살짝만 움직여도 그림 영역이 터치를 가져가 선택이 취소된다. */}
        {isBrushPickerOpen && (
          <View style={styles.brushPicker}>
            <BrushPicker
              selected={brush}
              color={color}
              onSelect={(b) => {
                setBrush(b);
                setTool('brush');
                setIsBrushPickerOpen(false);
              }}
            />
          </View>
        )}
      </View>

      <ColorPalette selected={color} onSelect={setColor}>
        <ToolButton
          icon={brush.icon}
          label="칠하기 도구 고르기"
          selected={tool === 'brush'}
          onPress={() => {
            setTool('brush');
            setIsBrushPickerOpen((open) => !open);
          }}
        />
        <ToolButton
          icon="🪣"
          label="한 번에 채우기"
          selected={tool === 'bucket'}
          onPress={() => {
            setTool('bucket');
            setIsBrushPickerOpen(false);
          }}
        />
        <ToolButton icon="↩️" label="되돌리기" onPress={undo} />
        <ToolButton icon="🧽" label="다시 칠하기" onPress={clear} />
        <ToolButton icon="➡️" label="다음 그림" onPress={goToNextPicture} />
      </ColorPalette>
    </View>
  );
}

// 영역의 바탕색은 그 영역에 마지막으로 쏟은 채우기 색 (없으면 흰색).
function regionFillColor(actions: Action[], region: number) {
  const fill = actions.findLast((a) => a.type === 'fill' && a.region === region);
  return fill?.color ?? EMPTY_COLOR;
}

function loadBoard(picture: ColoringPicture) {
  const parse = (d: string) => {
    const path = Skia.Path.MakeFromSVGString(d);
    if (!path) throw new Error(`잘못된 밑그림 경로 (${picture.id}): ${d}`);
    return path;
  };
  const regions = picture.regions.map(parse);
  // 뒤에 그려진(위에 놓인) 영역부터 찾는다.
  const regionAt = (x: number, y: number) => regions.findLastIndex((p) => p.contains(x, y));

  // 각 영역에서 실제로 보이는 부분에 격자 샘플 점을 깔아 칠한 비율을 잰다.
  const samplesByRegion: { x: number; y: number }[][] = regions.map(() => []);
  for (let y = SAMPLE_STEP / 2; y < VIEWBOX_SIZE; y += SAMPLE_STEP) {
    for (let x = SAMPLE_STEP / 2; x < VIEWBOX_SIZE; x += SAMPLE_STEP) {
      const region = regionAt(x, y);
      if (region !== -1) samplesByRegion[region].push({ x, y });
    }
  }

  return {
    picture,
    regions,
    regionAt,
    samplesByRegion,
    inks: (picture.inks ?? []).map(parse),
    lines: (picture.lines ?? []).map(parse),
  };
}

type Coverage = ReturnType<typeof createCoverage>;

function createCoverage(board: Board, replay: Action[] = []) {
  const covered = board.samplesByRegion.map((samples) => samples.map(() => false));
  const counts = board.samplesByRegion.map(() => 0);

  const markRegion = (region: number) => {
    covered[region].fill(true);
    counts[region] = covered[region].length;
  };

  const markSegment = (region: number, width: number, ax: number, ay: number, bx: number, by: number) => {
    board.samplesByRegion[region].forEach((s, i) => {
      if (covered[region][i] || distanceToSegment(s.x, s.y, ax, ay, bx, by) > width / 2) return;
      covered[region][i] = true;
      counts[region] += 1;
    });
  };

  const isComplete = () => counts.every((count, i) => count >= covered[i].length * DONE_RATIO);

  for (const a of replay) {
    if (a.type === 'fill') {
      markRegion(a.region);
      continue;
    }
    for (let i = 0; i < a.points.length; i += 2) {
      const prev = Math.max(0, i - 2);
      markSegment(a.region, a.width, a.points[prev], a.points[prev + 1], a.points[i], a.points[i + 1]);
    }
  }

  return { board, markRegion, markSegment, isComplete };
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function clearNextTimer(timer: { current: ReturnType<typeof setTimeout> | null }) {
  if (timer.current) clearTimeout(timer.current);
  timer.current = null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  canvasWrapper: {
    flex: 1,
  },
  canvasArea: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  brushPicker: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  celebration: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationText: {
    fontSize: 120,
  },
});
