"""data.json を template.html に埋め込んで index.html を作る。"""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
t = (root / 'template.html').read_text(encoding='utf8')
d = (root / 'data.json').read_text(encoding='utf8').replace('<', '\\u003c')
(root / 'index.html').write_text(t.replace('__DATA__', d), encoding='utf8')
print('index.html を更新しました')
