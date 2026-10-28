const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync('../MomentGift-play.html','utf8');const css=html.slice(html.indexOf('<style>')+7,html.indexOf('</style>'));
assert(!/url\([^)]*(?:\.\.\/|\.\/|\/)art\//.test(css),'Offline CSS contains unresolved external art paths');
const script=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));const variables={};const context={window:{},document:{documentElement:{style:{setProperty:(k,v)=>variables[k]=v}}}};vm.runInNewContext(script,context);
for(const mode of ['normal','birthday','newyear']){const name=mode+'.png',url=context.window.__MOMENTGIFT_ASSETS__[name];assert(url.startsWith('data:image/png;base64,'));const png=Buffer.from(url.split(',')[1],'base64');assert.equal(png.toString('ascii',1,4),'PNG');assert.equal(variables['--art-'+mode],'url("'+url+'")');assert(css.includes('var(--art-'+mode+')'))}
for(const name of ['materials-premium-pixel.png','flowers-premium-pixel.png','furniture-premium-pixel.png','wall-prints-pixel.png','garden-surfaces-pixel.png'])assert(context.window.__MOMENTGIFT_ASSETS__[name],'Missing new art: '+name);
console.log('Offline: all three preview images, valid PNG payloads, CSS variables and new game artwork verified');
