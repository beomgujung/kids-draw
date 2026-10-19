---
name: wiki-lint
description: wiki/ 상태 점검 및 정리. 깨진 [[링크]], 고아 페이지, index 누락, frontmatter 누락, 상충, 오래된 주장, 페이지가 필요한 개념을 찾아 고친다. "위키 점검", "lint", "위키 정리" 요청 시 사용.
---

# wiki-lint

## 기계적 점검 (스크립트로)

`.claude/skills/wiki-lint/check.sh`를 실행해 다음을 확인한다:
- 깨진 `[[링크]]` (대상 파일 없음)
- 고아 페이지 (아무 데서도 링크되지 않음, index/log/overview 제외)
- index.md에 없는 페이지
- frontmatter 없는 페이지

## 판단 점검 (직접 읽고)

- `> ⚠️ 상충:` 블록 목록 — 새 원자료로 해소 가능한지
- 새 원자료에 의해 낡은 주장 (`updated`가 오래되고 관련 source가 그 뒤에 추가된 경우)
- 여러 페이지에서 언급되지만 자체 페이지가 없는 개념
- 출처 없는 사실 주장
- `decisions/` 중 상태가 "제안"으로 오래 남은 것
- 조사하면 좋을 질문/찾아볼 자료

## 처리

- 기계적 문제(링크, index 누락, frontmatter)는 바로 고친다.
- 내용 판단이 필요한 것은 목록으로 사용자에게 보고하고 확인 후 고친다.
- `wiki/log.md`에 append:
  ```
  ## [YYYY-MM-DD] lint | 점검 결과 요약
  - 수정: ...; 남은 이슈: ...
  ```
