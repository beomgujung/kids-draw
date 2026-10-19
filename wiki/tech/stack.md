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

결정 배경: [[decisions/0001-expo-skia]]
