#!/usr/bin/env bash
# wiki/ 기계적 점검: 깨진 링크, 고아 페이지, index 누락, frontmatter 누락
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)/wiki"

pages=$(find . -name '*.md' | sed 's|^\./||; s|\.md$||' | sort)
links=$(grep -rhoE '\[\[[^]|#]+' --include='*.md' . | sed 's/^\[\[//' | sort -u)

resolve() { # [[name]] 은 경로 또는 파일명만으로도 매칭
  local l="$1"
  echo "$pages" | grep -qxF "$l" && return 0
  echo "$pages" | grep -qE "(^|/)${l##*/}\$" && return 0
  return 1
}

echo "== 깨진 링크 =="
for l in $links; do resolve "$l" || { echo "[[${l}]] <- $(grep -rlF "[[${l}" --include='*.md' . | tr '\n' ' ')"; }; done

echo "== 고아 페이지 =="
for p in $pages; do
  case "$p" in index|log|overview) continue;; esac
  echo "$links" | grep -qE "(^|/)${p##*/}\$" || echo "$p"
done

echo "== index.md 누락 =="
for p in $pages; do
  case "$p" in index|log) continue;; esac
  grep -qE "\[\[(${p}|${p##*/})\]\]" index.md || echo "$p"
done

echo "== frontmatter 누락 =="
for p in $pages; do
  case "$p" in index|log) continue;; esac
  head -1 "$p.md" | grep -q '^---$' || echo "$p"
done
