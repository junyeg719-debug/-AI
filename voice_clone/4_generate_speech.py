#!/usr/bin/env python3
"""
Step 4: テキストをクローンした声で読み上げる

フロー:
  テキスト → edge-tts (日本語TTS) → RVC voice conversion → 出力音声

使い方:
  python3 4_generate_speech.py --text "読み上げるテキスト"
  python3 4_generate_speech.py --file input.txt
"""

import argparse
import asyncio
import subprocess
import sys
import os
import tempfile
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"
MODELS_DIR = Path(__file__).parent / "models"
OUTPUT_DIR.mkdir(exist_ok=True)

# Edge TTS の日本語音声（ベース音声として使用）
EDGE_TTS_VOICE = "ja-JP-NanamiNeural"  # 女性声（自然な日本語）
# 他の選択肢: "ja-JP-KeitaNeural" (男性), "ja-JP-AoiNeural" (女性)


async def text_to_speech_edge(text: str, output_path: Path) -> bool:
    """edge-tts でテキストを音声に変換"""
    try:
        import edge_tts
    except ImportError:
        print("edge-tts をインストールします...")
        subprocess.run([sys.executable, "-m", "pip", "install", "edge-tts"], check=True)
        import edge_tts

    print(f"TTS生成中 (voice: {EDGE_TTS_VOICE})...")
    communicate = edge_tts.Communicate(text, EDGE_TTS_VOICE)
    await communicate.save(str(output_path))
    print(f"✓ TTS音声: {output_path}")
    return True


def apply_rvc_conversion(input_path: Path, output_path: Path, model_path: Path) -> bool:
    """RVC で声質変換を適用する"""
    # RVC Python パッケージを使用
    try:
        from rvc_python.infer import RVCInference
    except ImportError:
        print("rvc-python をインストールします...")
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "rvc-python"],
            check=True
        )
        try:
            from rvc_python.infer import RVCInference
        except ImportError:
            print("⚠ rvc-python のインポートに失敗しました")
            return False

    print(f"声質変換中 (model: {model_path.name})...")

    # モデルファイル確認
    pth_files = list(model_path.parent.glob("*.pth")) if model_path.is_dir() else [model_path]
    index_files = list(MODELS_DIR.glob("**/*.index"))

    if not pth_files:
        print(f"⚠ .pth モデルファイルが見つかりません: {MODELS_DIR}/")
        return False

    model_file = pth_files[0]
    index_file = index_files[0] if index_files else None

    rvc = RVCInference(device="cpu")
    rvc.load_model(str(model_file))

    result = rvc.infer(
        input_path=str(input_path),
        output_path=str(output_path),
        f0_up_key=0,           # ピッチ変換 (0=変更なし)
        f0_method="rmvpe",     # ピッチ抽出アルゴリズム
        index_path=str(index_file) if index_file else "",
        index_rate=0.75,       # インデックス使用率 (0.0-1.0)
        protect=0.33,
    )

    print(f"✓ 変換完了: {output_path}")
    return True


def find_rvc_model() -> Path | None:
    """models/ ディレクトリからRVCモデルを探す"""
    pth_files = list(MODELS_DIR.glob("**/*.pth"))
    if pth_files:
        print(f"モデル発見: {pth_files[0]}")
        return pth_files[0]
    return None


async def generate(text: str, output_name: str = "output"):
    """メイン生成フロー"""
    print("=" * 60)
    print("音声コンテンツ生成")
    print("=" * 60)
    print(f"\nテキスト: {text[:50]}{'...' if len(text) > 50 else ''}")

    # Step 1: TTS
    tts_path = OUTPUT_DIR / f"{output_name}_tts.mp3"
    ok = await text_to_speech_edge(text, tts_path)
    if not ok:
        print("✗ TTS生成失敗")
        return

    # Step 2: RVC変換
    model_path = find_rvc_model()
    if not model_path:
        print("\n⚠ RVCモデルが見つかりません")
        print(f"  Colabで学習後、.pth ファイルを {MODELS_DIR}/ に配置してください")
        print(f"\nTTSのみの音声: {tts_path}")
        print("(RVCモデルなしの場合、この音声がベースとなります)")
        return

    final_path = OUTPUT_DIR / f"{output_name}_rvc.wav"
    ok = apply_rvc_conversion(tts_path, final_path, model_path)
    if ok:
        print(f"\n✓ 完成! 声質変換済み音声: {final_path}")
    else:
        print(f"\n⚠ RVC変換失敗。TTS音声を使用: {tts_path}")


def main():
    parser = argparse.ArgumentParser(description="クローン声質でテキストを読み上げる")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--text", type=str, help="読み上げるテキスト")
    group.add_argument("--file", type=str, help="読み上げるテキストファイル")
    parser.add_argument("--output", type=str, default="output", help="出力ファイル名（拡張子なし）")
    parser.add_argument("--voice", type=str, default=EDGE_TTS_VOICE,
                        help=f"Edge TTS音声 (default: {EDGE_TTS_VOICE})")
    args = parser.parse_args()

    if args.file:
        text = Path(args.file).read_text(encoding="utf-8")
    else:
        text = args.text

    global EDGE_TTS_VOICE
    EDGE_TTS_VOICE = args.voice

    asyncio.run(generate(text, args.output))


if __name__ == "__main__":
    main()
