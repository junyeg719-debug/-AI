#!/usr/bin/env bash
# スプレッドシート（リンクを知っている全員が閲覧可）から最新の内容を取り込み、index.html を作り直す。
# 使い方: bash tools/update_from_sheet.sh [スプレッドシートID]
set -euo pipefail
ID="${1:-1G0EkcJpXle5mdSbf67yNcs9AgadsLeXIOm3H0ngFCEQ}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
BASE="https://docs.google.com/spreadsheets/d/$ID"
# gid: ビジュアル・マインド / アプリ / 音声添削 / デート前チェック
# 話題リスト: アイスブレイク / 仕事 / 趣味 / 過去
for g in 350199277 1816342099 1591807583 1420343896 481702765 1607959523 982862729 99621133; do
  curl -fsSL -o "$TMP/$g.csv" "$BASE/gviz/tq?tqx=out:csv&gid=$g"
  curl -fsSL -o "$TMP/h_$g.html" "$BASE/htmlview/sheet?headers=true&gid=$g"
done
python3 "$ROOT/tools/build.py" "$TMP" "$ROOT/data.json"
python3 "$ROOT/tools/render.py"
echo "sw.js の VERSION を上げると、インストール済みの端末にも新しい内容が届きます。"
