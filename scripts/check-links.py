from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT=Path(__file__).resolve().parents[1]
SITES={'localhost:4321':ROOT/'dist','localhost:4322':ROOT/'learning/dist'}
class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.ids=set()
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.add(attrs['id'])
        if tag=='a' and attrs.get('href'):self.links.append(attrs['href'])
        if tag in ['script','img'] and attrs.get('src'):self.links.append(attrs['src'])
        if tag=='link' and attrs.get('rel')=='stylesheet':self.links.append(attrs.get('href',''))

parsed={}
for host,directory in SITES.items():
    for p in directory.rglob('*.html'):
        parser=Links();parser.feed(p.read_text());parsed[(host,p.resolve())]=parser
broken=[];checked=0
for (host,path),parser in parsed.items():
    for href in parser.links:
        u=urlsplit(href)
        if u.scheme and u.scheme not in ['http','https']:continue
        target_host=u.netloc or host
        if target_host not in SITES:continue
        dest=unquote(u.path)
        target=(SITES[target_host]/dest.lstrip('/')) if dest.startswith('/') else (path.parent/dest if dest else path)
        if target.is_dir():target/= 'index.html'
        target=target.resolve();checked+=1
        if not target.exists():broken.append({'from':str(path.relative_to(ROOT)),'href':href,'reason':'missing file'})
        elif u.fragment and target.suffix=='.html' and (target_host,target) in parsed and unquote(u.fragment) not in parsed[(target_host,target)].ids:
            broken.append({'from':str(path.relative_to(ROOT)),'href':href,'reason':'missing anchor'})
print(json.dumps({'pages':len(parsed),'links_checked':checked,'broken':broken},ensure_ascii=False,indent=2))
(ROOT/'artifacts/link-results.json').write_text(json.dumps({'pages':len(parsed),'links_checked':checked,'broken':broken},indent=2))
raise SystemExit(bool(broken))
