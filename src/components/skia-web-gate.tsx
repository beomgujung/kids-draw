import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { type ComponentType, useSyncExternalStore } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type Props<TProps extends object> = {
  // Skia 를 import 하는 모듈은 반드시 여기서 동적 import 해야 한다.
  getComponent: () => Promise<{ default: ComponentType<TProps> }>;
  componentProps: TProps;
};

// 웹 전용(*.web.tsx 에서만 사용): CanvasKit(wasm)을 먼저 로드한 뒤 컴포넌트를 불러온다.
// canvaskit.wasm 은 `npm install` 시 postinstall 로 public/ 에 복사된다.
// 서버 렌더링(web.output: "server") 중에는 wasm 을 로드할 수 없으므로 브라우저에서만 렌더한다.
export function SkiaWebGate<TProps extends object>({ getComponent, componentProps }: Props<TProps>) {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const loading = (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (!isClient) return loading;

  return (
    <WithSkiaWeb
      opts={{ locateFile: (file: string) => `/${file}` }}
      getComponent={getComponent}
      componentProps={componentProps}
      fallback={loading}
    />
  );
}

const noopSubscribe = () => () => {};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E7',
  },
});
