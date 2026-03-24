# 声質クローン → コンテンツ生成パイプライン

stand.fm の音声から声質をクローンし、テキストをその声で読み上げます。

## 全体フロー

```
stand.fm音声 → 前処理 → [Google Colab] RVC学習 → テキスト読み上げ → コンテンツ
```

---

## セットアップ

```bash
pip3 install -r requirements.txt
```

---

## Step 1: 音声ダウンロード

```bash
python3 1_download_audio.py
```

自動ダウンロードが失敗する場合は手動で:
1. ブラウザで stand.fm エピソードを開く
2. 開発者ツール (F12) → Network タブ
3. 音声を再生 → `.m4a` または `.mp3` のURLをコピー
4. `wget -O audio/episode.m4a '<URL>'` でダウンロード

---

## Step 2: 音声前処理

```bash
python3 2_preprocess_audio.py
```

`audio/dataset/` に分割済み `.wav` ファイルが生成されます。

---

## Step 3: RVC モデル学習 (Google Colab)

1. `audio/dataset/` の内容を Google Drive `/MyDrive/rvc_dataset/` にアップロード
2. `3_train_rvc_colab.ipynb` を Google Colab で開く
3. ランタイムを **GPU (T4)** に設定
4. 全セルを順番に実行
5. 完成した `.pth` と `.index` を `models/` に配置

---

## Step 4: テキストを声質変換で読み上げ

```bash
# テキスト直接指定
python3 4_generate_speech.py --text "ここに読み上げるテキストを入力"

# ファイルから読み込み
python3 4_generate_speech.py --file input.txt

# 出力ファイル名を指定
python3 4_generate_speech.py --text "テキスト" --output episode_01
```

出力は `output/` フォルダに保存されます。

---

## フォルダ構成

```
voice_clone/
├── audio/
│   ├── (元音声ファイルを配置)
│   └── dataset/  (前処理済みセグメント)
├── models/
│   ├── *.pth     (RVC学習済みモデル ← Colabからダウンロード)
│   └── *.index   (RVCインデックス ← Colabからダウンロード)
├── output/       (生成された音声コンテンツ)
├── 1_download_audio.py
├── 2_preprocess_audio.py
├── 3_train_rvc_colab.ipynb
├── 4_generate_speech.py
└── requirements.txt
```

---

## RVC モデルについて

| 設定 | 推奨値 |
|------|--------|
| サンプリングレート | 40kHz |
| 学習エポック | 100-300 |
| ピッチ抽出 | rmvpe |
| 必要音声データ | 10分以上推奨 |

---

## TTS ベース音声の変更

`4_generate_speech.py` の `EDGE_TTS_VOICE` を変更:

| 音声ID | 説明 |
|--------|------|
| `ja-JP-NanamiNeural` | 女性・自然（デフォルト） |
| `ja-JP-KeitaNeural` | 男性・自然 |
| `ja-JP-AoiNeural` | 女性・明るい |
