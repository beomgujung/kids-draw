# Log

> append-only 작업 기록. `grep "^## \[" wiki/log.md | tail -5` 로 최근 기록 확인.

## [2026-10-19] setup | 프로젝트 및 LLM Wiki 생성
- 생성: [[overview]], [[product/features]], [[design/toddler-ux-principles]], [[tech/stack]], [[decisions/0001-expo-skia]]
- 요점: Expo SDK 58 + Skia로 스택 결정, wiki-ingest/query/lint 스킬 추가

## [2026-10-19] setup | 그리기 화면 + 웹 실행
- 갱신: [[tech/stack]]
- `/draw` 화면(색 7개, 되돌리기, 모두 지우기) 추가, 웹에서 Skia(CanvasKit) 로드 설정

## [2026-10-19] decision | 색칠 모드: 탭으로 영역 채우기 + 랜덤 밑그림
- 생성: [[decisions/0002-coloring-region-fill]], 갱신: [[overview]], [[product/features]], [[tech/stack]]
- 밑그림 8종(고양이·물고기·나비·꽃·나무·로봇·자동차·로켓), 다 칠하면 다음 그림. 홈에서 그리기/색칠하기 모드 분리

## [2026-10-19] decision | 색칠 모드를 붓 칠하기로 변경
- 갱신: [[decisions/0002-coloring-region-fill]], [[product/features]], [[overview]]
- 사용자 피드백: 탭 한 번에 채워지는 대신 붓으로 칠하고 싶음 → 붓을 시작 영역으로 clip, 샘플 점 85% 기준으로 완성 판정, 🪣 는 보조 도구

## [2026-10-19] decision | 색칠 도구 굵기 선택
- 갱신: [[decisions/0002-coloring-region-fill]], [[product/features]]
- 붓 버튼 → 연필(4)·펜(8)·크레용(14)·큰 붓(24) 선택 창. 완성 판정도 도구 굵기에 맞춰 계산

## [2026-10-19] setup | 버그: 색칠 도구를 골라도 굵기가 그대로
- 갱신: [[tech/stack]]
- 원인 2가지: (1) 도구 창이 그림 영역 안에 있어 살짝 끌면 그림 영역이 터치를 가져가 선택 취소 (2) 웹에서 글자 선택이 클릭(onPress)을 취소. 도구 창을 형제 레이어로 옮기고 `+html.tsx` 로 전역 user-select: none

## [2026-10-19] decision | 색칠 밑그림 카테고리 + 몬스터 생성기
- 갱신: [[decisions/0002-coloring-region-fill]], [[product/features]], [[overview]]
- 👾 몬스터(부품 조합 무한 생성) · 🦖 공룡 6 · 🤖 로봇·자동차 8 · 🌷 동식물 10 · 🎲 랜덤. `/color` 카테고리 선택 → `/color/[category]`
