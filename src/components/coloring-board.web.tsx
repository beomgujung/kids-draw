// `import type` 은 빌드 때 지워지므로 Skia 모듈을 정적으로 불러오지 않는다.
import type { ColoringCanvasProps } from './coloring-canvas';
import { SkiaWebGate } from './skia-web-gate';

export default function ColoringBoard(props: ColoringCanvasProps) {
  return <SkiaWebGate getComponent={() => import('./coloring-canvas')} componentProps={props} />;
}
