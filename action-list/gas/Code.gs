/**
 * 恋愛アクションリスト：受講生の進捗を集める Google Apps Script
 *
 * 使い方（くわしくは action-list/gas/README.md）
 *  1. 新しいスプレッドシートを作る →「拡張機能」→「Apps Script」
 *  2. このファイルの中身を全部貼り付けて保存
 *  3. 関数「setup」を選んで実行（初回は許可を求められる）
 *  4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *     実行するユーザー：自分 ／ アクセスできるユーザー：全員 → デプロイ
 *  5. 表示された「ウェブアプリのURL」をアプリの config.json に入れる
 */

const ROSTER = '受講生';   // 講師が書く：名前・受講生コード・担当講師・状態・メモ
const PROGRESS = '進捗';   // アプリが自動で書く
const ROSTER_HEAD = ['名前', '受講生コード', '担当講師', '状態', 'メモ'];
const PROGRESS_HEAD = ['受講生コード', '名前', '最終更新', 'ビジュアル', 'アプリ', 'デート', '全体', '完了数', '完了した項目ID'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('アクションリスト')
    .addItem('受講生コードを発行', 'issueCodes')
    .addItem('講師用パスワードを表示', 'showKey')
    .addItem('講師用パスワードを作り直す', 'resetKey')
    .addSeparator()
    .addItem('初期設定（最初に1回）', 'setup')
    .addToUi();
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  const r = sheet_(ROSTER, ROSTER_HEAD);
  r.setColumnWidth(1, 160); r.setColumnWidth(2, 120); r.setColumnWidth(5, 240);
  r.getRange('D2:D').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['受講中', '終了', '停止'], true).setAllowInvalid(true).build());
  const p = sheet_(PROGRESS, PROGRESS_HEAD);
  p.getRange('D2:G').setNumberFormat('0%');
  p.getRange('C2:C').setNumberFormat('yyyy/mm/dd hh:mm');
  ss.setActiveSheet(r);
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('TEACHER_KEY')) props.setProperty('TEACHER_KEY', randomCode_(10));
  SpreadsheetApp.getUi().alert(
    '初期設定が終わりました。\n\n' +
    '1.「受講生」シートの A列に名前を書き、メニュー「アクションリスト」→「受講生コードを発行」\n' +
    '2. 講師用パスワード：' + props.getProperty('TEACHER_KEY') + '\n\n' +
    'このあと「デプロイ」→「新しいデプロイ」でウェブアプリとして公開してください。');
}

function issueCodes() {
  const sh = sheet_(ROSTER, ROSTER_HEAD);
  const last = sh.getLastRow(); if (last < 2) { SpreadsheetApp.getUi().alert('A列に受講生の名前を入れてください。'); return; }
  const vals = sh.getRange(2, 1, last - 1, 4).getValues();
  const used = new Set(vals.map(v => String(v[1]).trim()).filter(Boolean));
  let n = 0;
  vals.forEach((v, i) => {
    if (String(v[0]).trim() && !String(v[1]).trim()) {
      let c; do { c = randomCode_(6); } while (used.has(c));
      used.add(c); sh.getRange(i + 2, 2).setValue(c);
      if (!String(v[3]).trim()) sh.getRange(i + 2, 4).setValue('受講中');
      n++;
    }
  });
  SpreadsheetApp.getUi().alert(n ? n + '人分のコードを発行しました。B列のコードを各受講生に渡してください。' : '新しく発行する人はいませんでした（名前があってコードが空の行に発行します）。');
}

function showKey() {
  const k = PropertiesService.getScriptProperties().getProperty('TEACHER_KEY');
  SpreadsheetApp.getUi().alert(k ? '講師用パスワード：' + k + '\n\n講師用ページ（teacher.html）でこのパスワードを入力します。' : '先に「初期設定」を実行してください。');
}

function resetKey() {
  const k = randomCode_(10);
  PropertiesService.getScriptProperties().setProperty('TEACHER_KEY', k);
  SpreadsheetApp.getUi().alert('新しい講師用パスワード：' + k + '\n\n前のパスワードは使えなくなりました。');
}

// ---------- ウェブアプリ ----------
function doGet() { return json_({ ok: true, app: 'love-action-list' }); }

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: '送られた内容を読み取れませんでした' }); }
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    switch (req.action) {
      case 'register': return json_(register_(req));
      case 'sync': return json_(sync_(req));
      case 'list': return json_(list_(req));
      default: return json_({ ok: false, error: '不明な操作です' });
    }
  } catch (err) {
    return json_({ ok: false, error: 'サーバーで問題が起きました：' + err.message });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function register_(req) {
  const st = student_(req.code);
  if (!st) return { ok: false, error: '受講生コードが見つかりません。講師に確認してください' };
  if (st.status === '停止') return { ok: false, error: 'この受講生コードは現在使えません。講師に確認してください' };
  const row = progressRow_(st.code);
  return { ok: true, name: st.name, checked: row ? parseIds_(row.values[8]) : [] };
}

function sync_(req) {
  const st = student_(req.code);
  if (!st) return { ok: false, error: '受講生コードが見つかりません。講師に確認してください' };
  if (st.status === '停止') return { ok: false, error: 'この受講生コードは現在使えません' };
  const ids = (Array.isArray(req.checked) ? req.checked : []).map(String).filter(s => /^[a-z]{1,8}[0-9a-f_]{2,14}$/i.test(s)).slice(0, 2000);
  const s = req.stats || {};
  const pct = o => (o && o.n) ? Math.round(o.d / o.n * 1000) / 1000 : 0;
  const values = [st.code, st.name, new Date(), pct(s.visual), pct(s.app), pct(s.date), pct(s.total), ids.length, ids.join(',')];
  const sh = sheet_(PROGRESS, PROGRESS_HEAD);
  const row = progressRow_(st.code);
  if (row) sh.getRange(row.index, 1, 1, values.length).setValues([values]);
  else sh.appendRow(values);
  return { ok: true, savedAt: new Date().toISOString() };
}

function list_(req) {
  const k = PropertiesService.getScriptProperties().getProperty('TEACHER_KEY');
  if (!k || String(req.key || '') !== k) return { ok: false, error: '講師用パスワードが違います' };
  const roster = rosterRows_();
  const prog = {};
  const p = sheet_(PROGRESS, PROGRESS_HEAD);
  if (p.getLastRow() > 1) p.getRange(2, 1, p.getLastRow() - 1, PROGRESS_HEAD.length).getValues()
    .forEach(v => { prog[String(v[0]).trim().toUpperCase()] = v; });
  const students = roster.map(r => {
    const v = prog[r.code];
    return { code: r.code, name: r.name, teacher: r.teacher, status: r.status,
             updatedAt: v && v[2] ? new Date(v[2]).toISOString() : null, checked: v ? parseIds_(v[8]) : [] };
  });
  return { ok: true, students: students };
}

// ---------- helpers ----------
function sheet_(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#eef2f6');
    sh.setFrozenRows(1);
  }
  return sh;
}
function rosterRows_() {
  const sh = sheet_(ROSTER, ROSTER_HEAD);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues()
    .map(v => ({ name: String(v[0]).trim(), code: String(v[1]).trim().toUpperCase(), teacher: String(v[2]).trim(), status: String(v[3]).trim() }))
    .filter(r => r.code);
}
function student_(code) {
  const c = String(code || '').trim().toUpperCase();
  if (!c) return null;
  return rosterRows_().find(r => r.code === c) || null;
}
function progressRow_(code) {
  const sh = sheet_(PROGRESS, PROGRESS_HEAD);
  const last = sh.getLastRow(); if (last < 2) return null;
  const vals = sh.getRange(2, 1, last - 1, PROGRESS_HEAD.length).getValues();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).trim().toUpperCase() === code) return { index: i + 2, values: vals[i] };
  return null;
}
function parseIds_(s) { return String(s || '').split(',').map(x => x.trim()).filter(Boolean); }
function randomCode_(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 見間違えやすい 0/O・1/I は使わない
  let s = ''; for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
