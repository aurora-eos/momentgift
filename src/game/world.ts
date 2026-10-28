import type {Furniture} from './config';import {furniture} from './config';
export const gardenObjects:Furniture[]=[{id:'sign',name:'入口路牌',x:474,y:216,w:15,h:18,text:'沿花径走走吧，池塘旁的长椅上，有人为你留了一张便笺。'},{id:'pond',name:'锦鲤许愿池',x:608,y:106,w:96,h:61,text:'锦鲤缓缓游过睡莲，水面映着细碎的光。你许下一个小愿望：希望收到这份心意的人，每一天都开心一点。'},{id:'bench',name:'玫瑰长椅',x:494,y:82,w:51,h:29,text:'靠垫旁留着一张手写便笺。'},{id:'flowers',name:'秘密花圃',x:675,y:201,w:28,h:40,text:'花圃里有一张卡片：“愿你的生活，总有新的花开。”'}];
export const themeObjects:Record<string,Furniture>={normal:{id:'ritual',name:'花园浇水壶',x:674,y:230,w:12,h:13,text:'给花圃浇水'},birthday:{id:'ritual',name:'生日蜡烛',x:571,y:198,w:24,h:18,text:'点亮生日蜡烛'},newyear:{id:'ritual',name:'新年烟花盒',x:677,y:177,w:16,h:18,text:'点燃新年烟花'}};
export function objects(mode:string){return [...furniture,...gardenObjects,themeObjects[mode]]}
const inBox=(x:number,y:number,cx:number,cy:number,w:number,h:number)=>x>cx-w/2-5&&x<cx+w/2+5&&y>cy-h/2&&y<cy+h/2+5;
export function blocked(x:number,y:number,mode:string){if(x<31||x>700||y>264)return true;if(x>=345){if(y<51||y>248)return true;return objects(mode).filter(f=>f.x>=345).some(f=>inBox(x,y,f.x,f.y,f.w,f.h))||Math.hypot((x-381)/25,(y-86)/17)<1||Math.hypot((x-380)/25,(y-181)/16)<1||Math.hypot((x-668)/24,(y-78)/18)<1}if(x>310)return y<228||y>264;if(y>231)return x<264||x>320||y>264;return y<70||furniture.some(f=>inBox(x,y,f.x,f.y,f.w,f.h))||inBox(x,y,135,151,53,29)||inBox(x,y,224,111,33,35)||inBox(x,y,76,219,23,18)||inBox(x,y,245,126,18,16)}
export function clue(hiding:string){return {drawer:'木头的小肚子，拉开就有故事。去看看小屋右上方的抽屉。',shelf:'许多故事并肩站立，答案躲在书页之间。去看看小屋左上方的书架。',plant:'新叶向着阳光生长，心意藏在根旁。去看看小屋右上方的花盆。'}[hiding]??''}




