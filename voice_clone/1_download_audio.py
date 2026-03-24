#!/usr/bin/env python3
"""
Step 1: stand.fm から音声をダウンロードする
"""

import subprocess
import sys
import os
from pathlib import Path

EPISODE_URL = "https://stand.fm/episodes/68024083dac4656db0f6bbdc"
OUTPUT_DIR = Path(__file__).parent / "audio"
OUTPUT_DIR.mkdir(exist_ok=True)


def download_with_ytdlp(url: str, output_dir: Path) -> bool:
    """yt-dlp で音声ダウンロードを試みる"""
    output_template = str(output_dir / "%(title)s.%(ext)s")
    cmd = [
        "yt-dlp",
        "--extract-audio",
        "--audio-format", "wav",
        "--audio-quality", "0",
        "-o", output_template,
        "--no-playlist",
        url,
    ]
    print(f"実行: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0


def main():
    print("=" * 60)
    print("stand.fm 音声ダウンロード")
    print("=" * 60)

    success = download_with_ytdlp(EPISODE_URL, OUTPUT_DIR)

    if success:
        files = list(OUTPUT_DIR.glob("*.wav")) + list(OUTPUT_DIR.glob("*.mp3"))
        if files:
            print(f"\n✓ ダウンロード成功: {files[-1]}")
            print(f"\n次のステップ: python3 2_preprocess_audio.py")
        else:
            success = False

    if not success:
        print("\n⚠ 自動ダウンロードに失敗しました。")
        print("\n手動ダウンロード方法:")
        print("1. ブラウザで以下URLを開く:")
        print(f"   {EPISODE_URL}")
        print("2. ブラウザの開発者ツール (F12) → Network タブを開く")
        print("3. 音声を再生する")
        print("4. '.m4a' または '.mp3' のリクエストを探す")
        print("5. そのURLをコピーして以下でダウンロード:")
        print("   wget -O audio/episode.m4a '<URL>'")
        print("\nまたは Chrome拡張 'Audio Downloader Prime' を使用")
        print(f"\nダウンロードしたファイルを: {OUTPUT_DIR}/ に配置してください")


if __name__ == "__main__":
    main()
