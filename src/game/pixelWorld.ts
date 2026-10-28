import {assetUrl} from '../data/assets';
import type {Mode} from './themes';
// Logical coordinates are shared by the playable world and the live map.
export type PlayerPose={x:number;y:number;direction:string;moving:boolean;yaw?:number;pitch?:number;ritualPlayed:boolean;nearby?:{id?:string;x:number;y:number;w?:number;h?:number;name:string}[];near?:{id?:string;x:number;y:number;w?:number;h?:number;name:string}};
export const WORLD={width:720,height:270};
export function directionRow(direction:string){return ({down:0,up:1,left:2,right:3} as Record<string,number>)[direction]??0}
export function mapMarker(x:number,y:number,direction:string){return {left:x/WORLD.width*100,top:y/WORLD.height*100,rotation:({up:0,right:90,down:180,left:270} as Record<string,number>)[direction]??0}}
export function artUrl(mode:Mode){return assetUrl(mode+'.png')}

