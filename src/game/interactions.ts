import type {Furniture} from './config';
import type {Mode} from './themes';
import {indoors,VIEW} from './perspective';
export type AimPose={x:number;y:number;yaw:number};
/** Distance to the prop's footprint, with aim taking priority over mere proximity. */
export function selectInteraction(p:AimPose,items:Furniture[],_mode:Mode,visible:(f:Furniture)=>boolean=()=>true){
 const inside=indoors(p.x,p.y);
 return items.filter(f=>(f.x<345)===inside).map(f=>{
  const dx=f.x-p.x,dz=f.y-p.y,center=Math.hypot(dx,dz);
  const distance=Math.hypot(Math.max(0,Math.abs(dx)-f.w/2),Math.max(0,Math.abs(dz)-f.h/2));
  const delta=Math.atan2(Math.sin(Math.atan2(dx,-dz)-p.yaw),Math.cos(Math.atan2(dx,-dz)-p.yaw));
  const halfAngle=Math.atan2(Math.min(f.w,f.h)/2,Math.max(1,center));
  const angle=Math.max(0,Math.abs(delta)-halfAngle*.65);
  return {f,distance,angle,delta};
 }).filter(v=>v.distance<48&&Math.abs(v.delta)<Math.PI*.6&&v.angle<VIEW.fov*Math.PI/360)
 .sort((a,b)=>(a.angle*30+a.distance*.35)-(b.angle*30+b.distance*.35))
 .find(v=>visible(v.f))?.f;
}

/** Discovery is broad and independent of aim; actionable selection remains view-aware. */
export function nearbyDiscoveries(p:AimPose,items:Furniture[],visible:(f:Furniture)=>boolean=()=>true){return items.filter(f=>(f.x<345)===indoors(p.x,p.y)).map(f=>({f,d:Math.hypot(Math.max(0,Math.abs(f.x-p.x)-f.w/2),Math.max(0,Math.abs(f.y-p.y)-f.h/2))})).filter(v=>v.d<72).sort((a,b)=>a.d-b.d).filter(v=>visible(v.f)).slice(0,5).map(v=>v.f)}
