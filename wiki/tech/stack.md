---
title: 기술 스택
type: concept
tags: [tech]
sources: []
updated: 2026-10-19
---

# 기술 스택

- **Expo SDK 58**, React Native 0.88, React 19.3, TypeScript
- **Expo Router**: `src/app/` 파일 기반 라우팅
- **@shopify/react-native-skia**: 캔버스 렌더링(드로잉 경로, 이미지 스냅샷)
- **react-native-gesture-handler / reanimated**: 터치 입력을 UI 스레드에서 처리
- **expo-media-library**: 작품을 사진첩에 저장
- **expo-haptics**: 터치 피드백

## 주의
- Skia는 네이티브 모듈이라 Expo Go 대신 development build 필요 (`npx expo run:ios` 또는 EAS)
- Expo API는 버전마다 바뀜 → 코드 작성 전 v58 문서 확인 (AGENTS.md)
- Skia 2.14부터 `SkPath`는 불변 → 경로는 `Skia.PathBuilder`로 만들고 `build()`

## 웹 실행
- `npm run web` (`expo start --web`). 웹은 Skia를 CanvasKit(wasm)으로 돌린다.
- `public/canvaskit.wasm`은 `postinstall`(`setup-skia-web public`)로 복사, git 미추적.
- `*-board.web.tsx`가 `SkiaWebGate`(`WithSkiaWeb`)로 wasm 로드 후 캔버스를 동적 import. Skia를 쓰는 캔버스 모듈을 웹에서 정적 import 하면 안 된다.
- `app.json`의 `web.output: "server"` 때문에 서버 렌더링이 일어나므로, Skia는 브라우저에서만 로드하도록 막아 둠.
- dev 서버의 서버 렌더링 번들이 옛 코드로 남는 경우가 있다 → 이상하면 `npx expo start --clear`
- `Link asChild` 자식에 스타일 배열을 주면 expo-router가 에러를 던진다 → 홈 카드는 `Pressable` + `router.push`
- 웹에서 `Pressable`의 onPress 는 브라우저 click 에 의존하는데, 누르다 살짝 끌어 **글자가 선택되면 클릭이 취소**된다 → `src/app/+html.tsx` 에서 `body { user-select: none }` 으로 전역 차단.
- 버튼/팝업을 responder(`onMoveShouldSetResponder`)를 가진 그림 영역 **안에** 두지 말 것. 손가락이 조금만 움직여도 그림 영역이 터치를 가져가 버튼 선택이 취소된다 → 형제 레이어로 띄운다.
- 입력은 RN responder(`onResponderMove`)로 받아 웹 마우스/터치와 네이티브 터치를 같은 코드로 처리.

결정 배경: [[decisions/0001-expo-skia]]
