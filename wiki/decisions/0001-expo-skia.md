---
title: "0001: Expo(React Native) + Skia 채택"
type: decision
tags: [tech]
sources: []
updated: 2026-10-19
---

# 0001: Expo(React Native) + Skia 채택

- 상태: 채택
- 날짜: 2026-10-19

## 맥락
iOS/Android 태블릿·폰에서 부드러운 손가락 드로잉이 필요. 팀은 React/TypeScript 경험이 많다.

## 결정
Expo(React Native) + @shopify/react-native-skia.

## 대안
- Flutter: 캔버스 성능 우수하나 SDK 미설치, Dart 학습 비용
- 웹 PWA: 빠른 개발이지만 스토어 배포·네이티브 경험 약함

## 결과
- 네이티브 모듈 때문에 development build 필요
- 관련: [[tech/stack]]
