const fs=require('node:fs'),path=require('node:path');
function installEmbeddedAssets(assets){window.__MOMENTGIFT_ASSETS__=assets;for(const [name,url]of Object.entries(assets)){document.documentElement.style.setProperty('--art-'+name.replace('.png',''),'url("'+url+'")')}}
function packageOffline(){
const root=path.resolve('dist'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const assets=Object.fromEntries(fs.readdirSync(path.join(root,'art')).filter(n=>n.endsWith('.png')).map(name=>[name,'data:image/png;base64,'+fs.readFileSync(path.join(root,'art',name)).toString('base64')]));
const js=html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1],css=html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];if(!js||!css)throw Error('Build assets missing');
const styles=fs.readFileSync(path.join(root,css),'utf8').replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g,(all,_quote,value)=>{const clean=value.trim().split(/[?#]/)[0],filename=path.posix.basename(clean);return /(?:^|\/)art\//.test(clean)&&assets[filename]?'var(--art-'+filename.replace('.png','')+')':all});
if(/url\([^)]*(?:\.\.\/|\.\/|\/)art\//.test(styles))throw Error('Unembedded art URL remains');
const code=fs.readFileSync(path.join(root,js),'utf8').replace(/<\/script/gi,'<\\/script');const bootstrap='('+installEmbeddedAssets.toString()+')('+JSON.stringify(assets)+');';
const result='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MomentGift · 沉浸式像素试玩</title><style>'+styles+'</style></head><body><div id="root"></div><script>'+bootstrap+'</script><script type="module">'+code+'</script></body></html>';
const target=path.resolve('../MomentGift-play.html');fs.writeFileSync(target,result);console.log('Offline game:',target,Math.round(Buffer.byteLength(result)/1024/1024)+' MB')}
if(require.main===module)packageOffline();module.exports={installEmbeddedAssets,packageOffline};
