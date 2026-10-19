@AGENTS.md

# kids-draw

유아(약 2~7세)가 손가락으로 자유롭게 그림을 그리고, 밑그림에 색칠할 수 있는 태블릿/폰 앱.

- 스택: Expo (SDK 58) + Expo Router + TypeScript, 그리기 엔진은 `@shopify/react-native-skia`
- 앱 코드: `src/` (화면/레이아웃만 `src/app/`)
- 실행: `npx expo start` → Skia 등 네이티브 모듈 때문에 Expo Go가 아닌 development build 필요할 수 있음
- 완료 전 확인: `npx expo lint`, `npx tsc --noEmit`

작업 전에 `wiki/index.md`를 먼저 읽고, 관련 위키 페이지(제품 요구사항, 디자인 원칙, 결정 기록)를 참고해서 일한다.

---

# LLM Wiki

이 저장소는 코드와 함께 **LLM이 유지보수하는 지식 위키**를 가진다.
사람은 원자료를 `raw/`에 넣고 질문을 던지며, 위키를 쓰고 고치는 건 LLM(Claude)의 몫이다.

## 3개 레이어

| 경로 | 소유자 | 규칙 |
|---|---|---|
| `raw/` | 사람 | 원자료(기사, 논문, 경쟁앱 리뷰, 회의록, 스크린샷 등). **LLM은 절대 수정/삭제하지 않는다.** 읽기 전용. |
| `wiki/` | LLM | 요약·개념·결정 페이지. LLM이 생성·갱신하고 상호 링크를 유지한다. |
| `CLAUDE.md` | 사람+LLM | 이 스키마. 규칙을 바꿀 때는 사용자와 합의 후 수정. |

## wiki/ 구조

```
wiki/
  index.md        # 모든 페이지 카탈로그 (카테고리별, 한 줄 요약). 질의 시 가장 먼저 읽는다.
  log.md          # 시간순 작업 기록 (append-only)
  overview.md     # 프로젝트 한 장 요약 — 가장 중요한 결론들
  product/        # 기능, 사용자(아이·보호자), 요구사항
  design/         # 유아 UX 원칙, 색/소리/햅틱, 접근성
  tech/           # 아키텍처, 라이브러리, 구현 노트
  research/       # 원자료 요약 (raw 1개 ↔ 페이지 1개) 및 주제별 종합
  decisions/      # ADR 형식 결정 기록 (NNNN-제목.md)
```

## 페이지 규칙

- 파일명: 영문 kebab-case (`finger-painting-ux.md`). 본문은 한국어.
- 모든 페이지 맨 위 frontmatter:
  ```yaml
  ---
  title: 페이지 제목
  type: source | concept | entity | decision | overview
  tags: [ux, coloring]
  sources: [raw/파일명.md]   # 근거가 된 원자료 (없으면 [])
  updated: YYYY-MM-DD
  ---
  ```
- 내부 링크는 `[[페이지명]]`(확장자 없는 파일명) 형식. 새 개념이 나오면 링크부터 걸고 페이지가 없으면 만든다.
- 사실 주장에는 출처를 단다: `(출처: [[research/source-xxx]])`.
- 원자료끼리 충돌하면 덮어쓰지 말고 `> ⚠️ 상충:` 블록으로 양쪽을 기록한다.
- 추측/의견은 `> 💡 제안:` 블록으로 사실과 구분한다.

## log.md 형식

append-only. 각 항목은 grep 가능한 헤더로 시작:

```
## [YYYY-MM-DD] ingest | 원자료 제목
- 생성: [[...]], 갱신: [[...]]
- 요점 한두 줄
```

종류: `ingest`, `query`, `lint`, `decision`, `setup`.

## 작업(Operations)

- **ingest** — `/wiki-ingest [raw 경로]` : 원자료를 읽고 요약 페이지 생성 → 관련 개념/제품/디자인 페이지 갱신 → index.md, log.md 갱신. 하나의 원자료가 10여 개 페이지를 건드릴 수 있다.
- **query** — `/wiki-query 질문` : index.md → 관련 페이지 순으로 읽고 출처와 함께 답한다. 가치 있는 답은 새 위키 페이지로 저장(사용자 동의 시).
- **lint** — `/wiki-lint` : 깨진 링크, 고아 페이지, 상충, 오래된 주장, index 누락, 페이지가 필요한 개념을 점검하고 고친다.
