// Open the actual URL only after Vite is listening; occupied ports are handled by Vite.
const {spawn}=require('node:child_process');
const path=require('node:path');
const server=spawn(process.execPath,[path.resolve('node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','4185','--configLoader','runner'],{stdio:['inherit','pipe','inherit']});
let opened=false,buffer='';
server.stdout.on('data',data=>{
 process.stdout.write(data);buffer=(buffer+data.toString().replace(/\u001b\[[0-9;]*m/g,'')).slice(-4096);
 const url=buffer.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
 if(url&&!opened){opened=true;const browser=spawn('cmd.exe',['/d','/c','start','',url],{stdio:'ignore',windowsHide:true});browser.on('error',()=>console.log('Open this address in your browser: '+url))}
});
server.on('error',error=>{console.error(error.message);process.exitCode=1});
server.on('exit',code=>{process.exitCode=code??0});
process.on('SIGINT',()=>server.kill('SIGINT'));
