import {selectInteraction,nearbyDiscoveries} from './interactions';
import Phaser from 'phaser';
import {blocked,objects} from './world';
import {relativeMove,facing,indoors,SPAWN} from './perspective';
import type {Furniture} from './config';
import type {Mode} from './themes';
/** One authoritative controller. Both perspective renderer and old map read this state. */
export class Room extends Phaser.Scene{
 player!:Phaser.GameObjects.Container;near?:Furniture;nearby:Furniture[]=[];locked=false;private awarenessAt=-1000;
 private keys!:Record<string,Phaser.Input.Keyboard.Key>;private touch={up:false,down:false,left:false,right:false};private turn=0;private yaw=SPAWN.yaw;private pitch=SPAWN.pitch;private moving=false;private interaction:string|undefined;private visited=new Set<string>();private keyCollected=false;private keySource:string|undefined;private visibilityProbe:(f:Furniture,discovery?:boolean)=>boolean=()=>true;private mailUnlocked=false;private ritualPlayed=false;
 constructor(private onExplore:(f:Furniture)=>void,private mode:Mode='normal'){super('room')}
 create(){this.player=this.add.container(SPAWN.x,SPAWN.y);this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,Q,R,E') as Record<string,Phaser.Input.Keyboard.Key>;this.input.keyboard!.on('keydown-E',(e:KeyboardEvent)=>{if(!e.repeat)this.explore()});this.game.events.on(Phaser.Core.Events.BLUR,this.resetControls,this);this.events.once('shutdown',()=>this.game.events.off(Phaser.Core.Events.BLUR,this.resetControls,this))}
 update(_time:number,dt:number){if(!this.player)return;if(this.locked){this.moving=false;this.near=undefined;this.nearby=[];return}const k=this.keys,seconds=Math.min(dt,40)/1000;this.yaw+=(Number(k.R.isDown)-Number(k.Q.isDown)+this.turn)*1.65*seconds;const strafe=Number(k.D.isDown||k.RIGHT.isDown||this.touch.right)-Number(k.A.isDown||k.LEFT.isDown||this.touch.left),forward=Number(k.W.isDown||k.UP.isDown||this.touch.up)-Number(k.S.isDown||k.DOWN.isDown||this.touch.down);const v=relativeMove(strafe,forward,this.yaw),distance=66*seconds,oldX=this.player.x,oldY=this.player.y;if(!blocked(oldX+v.x*distance,oldY,this.mode))this.player.x+=v.x*distance;if(!blocked(this.player.x,oldY+v.y*distance,this.mode))this.player.y+=v.y*distance;this.moving=Math.hypot(this.player.x-oldX,this.player.y-oldY)>.001;this.refreshTarget();if(_time-this.awarenessAt>=100){this.awarenessAt=_time;this.nearby=nearbyDiscoveries({x:this.player.x,y:this.player.y,yaw:this.yaw},objects(this.mode),f=>this.visibilityProbe(f,true))}}
 getPose(){return {x:this.player?.x??SPAWN.x,y:this.player?.y??SPAWN.y,yaw:this.yaw,pitch:this.pitch,direction:facing(this.yaw),moving:this.moving,ritualPlayed:this.ritualPlayed,visited:[...this.visited],keyCollected:this.keyCollected,keySource:this.keySource,interaction:this.locked?this.interaction:undefined,mailUnlocked:this.mailUnlocked,near:this.locked?undefined:this.near,nearby:this.locked?[]:this.nearby}}
 look(dx:number,dy:number){if(this.locked)return;this.yaw+=dx;this.pitch=Phaser.Math.Clamp(this.pitch+dy,-.65,.65)}
 setTurn(value:number){this.turn=value}
 setControl(direction:'up'|'down'|'left'|'right',value:boolean){this.touch[direction]=value}
 resetControls(){this.touch={up:false,down:false,left:false,right:false};this.turn=0;this.input.keyboard?.resetKeys()}
 setVisibilityProbe(probe?:(f:Furniture,discovery?:boolean)=>boolean){this.visibilityProbe=probe??(()=>true)}
 private refreshTarget(){if(this.player&&!this.locked)this.near=selectInteraction({x:this.player.x,y:this.player.y,yaw:this.yaw},objects(this.mode),this.mode,this.visibilityProbe)}
 explore(){this.refreshTarget();if(!this.locked&&this.near){this.interaction=this.near.id;this.visited.add(this.near.id);this.resetControls();this.onExplore(this.near)}}
 collectKey(source:string){this.keyCollected=true;this.keySource=source}
 unlockMail(){this.mailUnlocked=true}
 celebrateRitual(){this.ritualPlayed=true}
}
