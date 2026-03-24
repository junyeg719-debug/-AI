#!/usr/bin/env python3
"""
Step 1: YouTube / stand.fm から音声をダウンロードする
"""

import subprocess
import sys
import os
from pathlib import Path

# ダウンロード対象URL
YOUTUBE_URL = "https://youtu.be/i0S3vkVVNj8"
STANDFM_URL = "https://stand.fm/episodes/68024083dac4656db0f6bbdc"

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
    result = subprocess.run(cmd)
    return result.returncode == 0


def main():
    print("=" * 60)
    print("音声ダウンロード")
    print("=" * 60)

    # YouTube を優先試行
    print(f"\nYouTube からダウンロード試行...")
    print(f"URL: {YOUTUBE_URL}")
    success = download_with_ytdlp(YOUTUBE_URL, OUTPUT_DIR)

    if success:
        files = list(OUTPUT_DIR.glob("*.wav")) + list(OUTPUT_DIR.glob("*.mp3"))
        if files:
            print(f"\n✓ ダウンロード成功: {files[-1]}")
            print(f"\n次のステップ: python3 2_preprocess_audio.py")
            return

    # 手動ダウンロード案内
    print("\n" + "=" * 60)
    print("⚠ 自動ダウンロード失敗 → 手動でダウンロードしてください")
    print("=" * 60)
    print(f"""
【方法1】yt-dlp をローカルPC で実行（推奨）
  yt-dlp -x --audio-format wav -o "voice.%(ext)s" \\
    "{YOUTUBE_URL}"
  → 生成された voice.wav を voice_clone/audio/ に配置

【方法2】ブラウザ拡張を使用
  1. Chrome拡張「yt-dlp for YouTube」や「4K Video Downloader」
  2. {YOUTUBE_URL} を開いて音声ダウンロード
  3. voice_clone/audio/ に配置

【方法3】オンラインツール
  ※ 音質劣化の可能性あり

ダウンロード後:
  python3 2_preprocess_audio.py
""")


if __name__ == "__main__":
    main()
