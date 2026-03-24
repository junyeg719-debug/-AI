#!/usr/bin/env python3
"""
Step 2: RVC学習用に音声を前処理する
- ノイズ除去
- 無音部分のトリミング
- 10秒以下のセグメントに分割
- サンプリングレートを40kHzに統一
"""

import os
import sys
import subprocess
from pathlib import Path

AUDIO_DIR = Path(__file__).parent / "audio"
DATASET_DIR = Path(__file__).parent / "audio" / "dataset"
DATASET_DIR.mkdir(exist_ok=True)

TARGET_SR = 40000  # RVC推奨サンプリングレート
SEGMENT_DURATION = 8  # 秒


def check_ffmpeg():
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def preprocess_with_ffmpeg(input_path: Path):
    """ffmpegで音声を前処理・分割する"""
    output_pattern = str(DATASET_DIR / f"{input_path.stem}_%03d.wav")
    cmd = [
        "ffmpeg", "-i", str(input_path),
        "-ar", str(TARGET_SR),  # サンプリングレート変換
        "-ac", "1",              # モノラル化
        "-af", "silenceremove=start_periods=1:start_silence=0.2:start_threshold=-50dB,"
               "silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-50dB",  # 無音除去
        "-f", "segment",
        "-segment_time", str(SEGMENT_DURATION),
        "-reset_timestamps", "1",
        output_pattern,
        "-y"
    ]
    print(f"前処理中: {input_path.name}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"エラー: {result.stderr}")
        return False
    return True


def preprocess_with_librosa(input_path: Path):
    """librosaで音声を前処理・分割する（ffmpegなし）"""
    try:
        import librosa
        import soundfile as sf
        import numpy as np

        print(f"librosaで処理中: {input_path.name}")
        y, sr = librosa.load(str(input_path), sr=TARGET_SR, mono=True)

        # 無音部分のトリミング
        y_trimmed, _ = librosa.effects.trim(y, top_db=30)

        # セグメントに分割
        segment_samples = SEGMENT_DURATION * TARGET_SR
        segments = []
        for i in range(0, len(y_trimmed), segment_samples):
            segment = y_trimmed[i:i + segment_samples]
            # 1秒未満のセグメントはスキップ
            if len(segment) >= TARGET_SR:
                segments.append(segment)

        # 保存
        for idx, segment in enumerate(segments):
            out_path = DATASET_DIR / f"{input_path.stem}_{idx:03d}.wav"
            sf.write(str(out_path), segment, TARGET_SR)

        print(f"✓ {len(segments)} セグメントを生成: {DATASET_DIR}")
        return True

    except ImportError as e:
        print(f"必要なライブラリがありません: {e}")
        print("インストール: pip3 install librosa soundfile")
        return False


def main():
    print("=" * 60)
    print("音声前処理 (RVC学習データ準備)")
    print("=" * 60)

    # 音声ファイルを探す
    audio_files = []
    for ext in ["*.wav", "*.mp3", "*.m4a", "*.flac", "*.ogg"]:
        audio_files.extend(AUDIO_DIR.glob(ext))

    if not audio_files:
        print(f"\n⚠ 音声ファイルが見つかりません: {AUDIO_DIR}/")
        print("先に 1_download_audio.py を実行するか、音声ファイルを配置してください")
        sys.exit(1)

    print(f"\n見つかった音声ファイル:")
    for f in audio_files:
        size_mb = f.stat().st_size / (1024 * 1024)
        print(f"  - {f.name} ({size_mb:.1f} MB)")

    # 前処理実行
    has_ffmpeg = check_ffmpeg()
    processor = "ffmpeg" if has_ffmpeg else "librosa"
    print(f"\n使用するプロセッサ: {processor}")

    success_count = 0
    for audio_file in audio_files:
        if has_ffmpeg:
            ok = preprocess_with_ffmpeg(audio_file)
        else:
            ok = preprocess_with_librosa(audio_file)
        if ok:
            success_count += 1

    # 結果確認
    output_files = list(DATASET_DIR.glob("*.wav"))
    print(f"\n結果: {len(output_files)} セグメントファイルを生成")
    total_duration = len(output_files) * SEGMENT_DURATION
    print(f"推定合計時間: 約 {total_duration // 60} 分 {total_duration % 60} 秒")

    if total_duration < 600:
        print("\n⚠ 推奨: RVC学習には10分以上の音声データが望ましいです")
    else:
        print("\n✓ 十分な学習データです")

    print(f"\nデータセット: {DATASET_DIR}")
    print(f"次のステップ: 3_train_rvc_colab.ipynb をGoogle Colabで開く")


if __name__ == "__main__":
    main()
