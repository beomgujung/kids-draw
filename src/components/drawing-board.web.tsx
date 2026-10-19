import { SkiaWebGate } from './skia-web-gate';

export default function DrawingBoard() {
  return <SkiaWebGate getComponent={() => import('./drawing-canvas')} componentProps={{}} />;
}
