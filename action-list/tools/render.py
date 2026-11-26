"""data.json と config.json を埋め込んで index.html（受講生用）と teacher.html（講師用）を作る。"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
data = (root / 'data.json').read_text(encoding='utf8').replace('<', '\\u003c')
cfg = json.loads((root / 'config.json').read_text(encoding='utf8'))
api = str(cfg.get('apiUrl', '')).strip()
if api and not api.startswith('https://script.google.com/'):
    raise SystemExit('config.json の apiUrl は https://script.google.com/ で始まるURLにしてください')
for src, dst in (('template.html', 'index.html'), ('teacher_template.html', 'teacher.html')):
    t = (root / src).read_text(encoding='utf8')
    (root / dst).write_text(t.replace('__DATA__', data).replace('__API_URL__', api), encoding='utf8')
print('index.html と teacher.html を更新しました' + ('' if api else '（apiUrl が空なので講師との共有はオフ）'))
