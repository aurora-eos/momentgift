import {SPAWN} from '../game/perspective';
import {useEffect,useRef} from 'react';
import Phaser from 'phaser';
import {MapScene} from '../game/MapScene';
import type {Room} from '../game/Room';
import type {Mode} from '../game/themes';
const initial={...SPAWN,moving:false,ritualPlayed:false};
export default function WorldView({scene,mode,mapOpen}:{scene:()=>Room|null;mode:Mode;mapOpen:boolean;disabled:boolean}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!mapOpen||!host.current)return;host.current.parentElement?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const game=new Phaser.Game({type:Phaser.CANVAS,parent:host.current,width:720,height:270,pixelArt:true,roundPixels:true,transparent:false,backgroundColor:'#314c37',audio:{noAudio:true},banner:false,scene:new MapScene(mode,()=>scene()?.getPose()??initial)});return()=>game.destroy(true)},[scene,mode,mapOpen]);
 return <section id="garden-map" hidden={!mapOpen} className="live-map pixel-live-map" aria-label="实时平面地图"><div className="map-title"><b>花园地图 <small>LIVE MAP</small></b><span><i/> 红箭头是你 · 位置与朝向实时同步</span></div><div ref={host} className="running-map"/><p>方向键 / WASD 继续移动 · 木屋入口位于右下方台阶 · 点击地图按钮收起</p></section>;
}
