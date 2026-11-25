"""スプレッドシートのCSV/HTMLから data.json を作る。使い方: python3 build.py <CSVのフォルダ> <出力先data.json>"""
import csv, json, re, sys, html, urllib.parse
D=sys.argv[1]
def links(g):
    try: h=open(f"{D}/h_{g}.html",encoding="utf8").read()
    except: return {}
    m={}
    for href,txt in re.findall(r'<a [^>]*href="([^"]*)"[^>]*>([^<]*)</a>',h):
        href=html.unescape(href); txt=html.unescape(txt).strip()
        if 'google.com/url?q=' in href:
            href=urllib.parse.parse_qs(urllib.parse.urlparse(href).query)['q'][0]
        if txt and href.startswith('https://'): m.setdefault(txt,href)
    return m
def rows(g): return list(csv.reader(open(f"{D}/{g}.csv",encoding="utf8")))[1:]
def build(g,prefix):
    L=links(g); cats=[]; cur=None; lastType=""; parent=None; n=0
    R=rows(g)
    for i,r in enumerate(R):
        r=(r+[""]*7)[:7]
        cat,task,typ,note=r[0].strip(),r[1].strip(),r[2].strip(),r[3].strip()
        if cat: cur={"name":cat,"items":[]}; cats.append(cur); lastType=""; parent=None
        if not task and not note: continue
        if typ: lastType=typ
        else: typ=lastType
        nxt=(R[i+1]+[""]*4) if i+1<len(R) else ["x","x","",""]
        n+=1; it={"id":f"{prefix}{n}","type":typ}
        if task:
            parent=task
            if not nxt[1].strip() and nxt[3].strip() and not nxt[0].strip() and len(note)<40 and "\n" not in note:
                it["group"]=task; it["title"]=note; it["note"]=""
            else:
                it["title"]=task; it["note"]=note
        else:
            it["group"]=parent; it["title"]=note; it["note"]=""
        it["links"]={k:v for k,v in L.items() if k in note}
        cur["items"].append(it)
    return cats
out={"visual":build("350199277","v"),"app":build("1816342099","a"),"date":build("1591807583","d")}
# date checklist
chk=[]; sec="身だしなみ"
for r in rows("1420343896"):
    if not r[0] and r[1]: sec=r[1]; continue
    if r[1]: chk.append({"id":"c"+r[0],"title":r[1],"sec":sec})
out["checklist"]=chk
for k in ["visual","app","date"]:
    tot=sum(1 for c in out[k] for i in c["items"] if i["type"] not in("対象者のみ","カスタム"))
    print(k,[(c["name"],len(c["items"])) for c in out[k]],"counted",tot, file=sys.stderr)
dest=sys.argv[2] if len(sys.argv)>2 else f"{D}/../data.json"
json.dump(out,open(dest,"w",encoding="utf8"),ensure_ascii=False)
