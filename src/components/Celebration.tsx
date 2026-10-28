import type {ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {useEffect,useRef} from 'react';
export const celebrationStyle={position:'fixed' as const,inset:0,zIndex:2147483000,pointerEvents:'none' as const};
export function portalForeground(canvas:ReactNode){return createPortal(canvas,document.body)}
export default function Celebration(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext('2d')!,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const w=canvas.width=window.innerWidth,h=canvas.height=window.innerHeight;
  const pieces=Array.from({length:reduced?40:130},(_,i)=>({x:reduced?Math.random()*w:i%2?w:0,y:reduced?-Math.random()*h*.2:h*.65,vx:reduced?0:(i%2?-1:1)*(180+Math.random()*480),vy:reduced?70:-480-Math.random()*600,spin:Math.random()*6,turn:(Math.random()-.5)*4,color:['#e7bc73','#e7a8b9','#9ab897','#b1a2cb','#f5dfaa'][i%5],size:4+Math.random()*4}));
  let raf=0,previous:number|undefined,age=0;
  function draw(now:number){
   const dt=previous===undefined?0:Math.min((now-previous)/1000,.04);previous=now;age+=dt;ctx.clearRect(0,0,w,h);
   for(const p of pieces){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=dt*(reduced?8:460);p.vx*=Math.exp(-.3*dt);p.spin+=p.turn*dt;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.fillStyle=p.color;ctx.globalAlpha=Math.max(0,Math.min(1,(5.5-age)/1.2));ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*(.35+Math.abs(Math.cos(p.spin))*.35));ctx.restore();
   }
   if(age<5.5)raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
 },[]);
 return portalForeground(<canvas ref={ref} className="celebration celebration-foreground" style={celebrationStyle} aria-hidden="true"/>);
}
