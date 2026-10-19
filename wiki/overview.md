---
title: 프로젝트 개요
type: overview
tags: []
sources: []
updated: 2026-10-19
---

# kids-draw 개요

유아(약 2~7세)가 손가락으로 자유 그림을 그리고 밑그림에 색칠하는 모바일/태블릿 앱.

## 핵심 결론 (현재)
- 스택: Expo(React Native) + Skia → [[decisions/0001-expo-skia]], [[tech/stack]]
- MVP: 자유 그리기 + 색칠하기 + 갤러리 저장 → [[product/features]]
- 색칠: 카테고리(몬스터·공룡·로봇·자동차·동식물·랜덤) 선택, 선 안에서만 칠해지는 붓(+채우기 보조), 다 칠하면 다음 랜덤 밑그림 → [[decisions/0002-coloring-region-fill]]
- 디자인: 글 없이 아이콘·색·소리로 조작, 큰 터치 영역, 실수 걱정 없는 경험 → [[design/toddler-ux-principles]]

## 열린 질문
- 대상 연령을 세분화할지 (2~4세 / 5~7세)
- 수익 모델 (유료 / 구독 / 무료+보호자 잠금 인앱)
