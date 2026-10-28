import {SPAWN} from './perspective';
import {assetUrl} from '../data/assets';
import Phaser from 'phaser';
import type {Mode} from './themes';
import type {PlayerPose} from './pixelWorld';
import {artUrl,directionRow} from './pixelWorld';
/** A running version of the original flat scene. Movement is read, never simulated twice. */
export class MapScene extends Phaser.Scene{
 private focus!:Phaser.GameObjects.Graphics;private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;private avatar!:Phaser.GameObjects.Image;private arrow!:Phaser.GameObjects.Graphics;private halo!:Phaser.GameObjects.Ellipse;
 constructor(private mode:Mode,private readPose:()=>PlayerPose){super('live-map')}
 preload(){this.load.image('map',artUrl(this.mode));this.load.image('map-traveler',assetUrl('traveler.png'))}
 create(){const start=this.readPose();this.add.image(0,0,'map').setOrigin(0).setDisplaySize(720,270);const atlas=this.textures.get('map-traveler'),image=atlas.getSourceImage() as HTMLImageElement;for(let row=0;row<4;row++)for(let col=0;col<4;col++)atlas.add(row+'-'+col,0,col*image.width/4,row*image.height/4,image.width/4,image.height/4);this.avatar=this.add.image(start.x,start.y,'map-traveler',directionRow(start.direction)+'-0').setDisplaySize(38,38).setOrigin(.5,.97);this.halo=this.add.ellipse(start.x,start.y,24,10,0xf24545,.2).setStrokeStyle(2,0xffefca);this.arrow=this.add.graphics();this.arrow.lineStyle(2,0xfff5d8,1);this.arrow.fillStyle(0xef353e,1);this.arrow.beginPath();this.arrow.moveTo(0,-17);this.arrow.lineTo(10,6);this.arrow.lineTo(0,2);this.arrow.lineTo(-10,6);this.arrow.closePath();this.arrow.fillPath();this.arrow.strokePath();this.arrow.setPosition(start.x,start.y-26).setRotation(start.yaw??SPAWN.yaw);this.focus=this.add.graphics();
 for(let i=0;i<4;i++){const water=this.add.rectangle(579+i*14,113+i%2*7,7,1,0xffedc6,.5);this.tweens.add({targets:water,alpha:.06,x:water.x+4,duration:1800+i*170,yoyo:true,repeat:-1})}
 }
 update(time:number){if(!this.avatar)return;const p=this.readPose();this.focus.clear();for(const f of (p.nearby??(p.near?[p.near]:[]))){this.focus.lineStyle(2,0xffffff,this.reduced?1:.55+.45*(.5+.5*Math.sin(time/1000*Math.PI*1.6)));this.focus.strokeRect(f.x-(f.w??24)/2-3,f.y-(f.h??24)/2-3,(f.w??24)+6,(f.h??24)+6)}this.avatar.setPosition(p.x,p.y).setFrame(directionRow(p.direction)+'-'+(p.moving?Math.floor(time/140)%4:0));this.halo.setPosition(p.x,p.y);this.arrow.setPosition(p.x,p.y-26-Math.sin(time/240)*2);this.arrow.setRotation(p.yaw??(({up:0,right:Math.PI/2,down:Math.PI,left:-Math.PI/2} as Record<string,number>)[p.direction]??0))}
}
