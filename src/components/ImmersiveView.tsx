import type {StoryOptions} from '../game/WorldStory';
import {useEffect,useRef,useState} from 'react';
import {PerspectiveGarden} from '../game/PerspectiveGarden';
import type {Room} from '../game/Room';
import type {Mode} from '../game/themes';
import {indoors,SPAWN} from '../game/perspective';
const initial={...SPAWN,moving:false,ritualPlayed:false,interaction:undefined,mailUnlocked:false,near:undefined,nearby:[],visited:[],keyCollected:false,keySource:undefined};
export default function ImmersiveView({scene,mode,disabled,run,gift}:{gift:StoryOptions;scene:()=>Room|null;mode:Mode;disabled:boolean;run:number}){
 const host=useRef<HTMLDivElement>(null),drag=useRef<{id:number;x:number;y:number}|null>(null),[pose,P]=useState<ReturnType<Room['getPose']>>(initial),[error,E]=useState(false);
 useEffect(()=>{let view:PerspectiveGarden|undefined,attached:Room|null=null;E(false);const bind=()=>{const current=scene();if(current!==attached){attached?.setVisibilityProbe();attached=current;attached?.setVisibilityProbe((f,discovery)=>view?.canSee(f.id,discovery)??false)}};let timer:number|undefined;try{view=new PerspectiveGarden(host.current!,mode,()=>scene()?.getPose()??initial,gift);bind();timer=window.setInterval(bind,100)}catch(e){console.error('Perspective renderer failed',e);E(true)}return()=>{window.clearInterval(timer);attached?.setVisibilityProbe();view?.dispose()}},[mode,scene,run,gift.to,gift.from,gift.hiding]);
 useEffect(()=>{const timer=window.setInterval(()=>P(scene()?.getPose()??initial),100);return()=>clearInterval(timer)},[scene]);
 return <div className="immersive-layer"><div className="immersive-canvas" ref={host} onPointerDown={e=>{if(disabled)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY}}} onPointerMove={e=>{const d=drag.current;if(!d||disabled||d.id!==e.pointerId)return;scene()?.look((e.clientX-d.x)*.006,(d.y-e.clientY)*.004);d.x=e.clientX;d.y=e.clientY}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}/>{error?<div className="perspective-error">立体场景未能启动，请使用支持 WebGL 的浏览器并开启硬件加速。</div>:<><div className="location-chip">{indoors(pose.x,pose.y)?'屋内 · 心意收藏室':'花园 · 秘密小径'}</div><span className="aim-dot" aria-hidden="true"/>{!disabled&&pose.near&&<div className="perspective-prompt"><kbd>E</kbd> 探索 · {pose.near.name}</div>}{!disabled&&!pose.near&&pose.nearby.length>0&&<div className="approach-prompt">白框标记了附近的发现 · 看向它，走近后按 E</div>}<div className="look-tip">拖动 / Q R 环顾 · 看向白框物品按 E 探索</div></>}</div>;
}


