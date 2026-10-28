// Arrival faces north into the garden, toward the rose arch and bench.
export const SPAWN={x:502,y:238,yaw:0,pitch:-.06,direction:'up' as const};
export const VIEW={fov:62,eyeHeight:1.55,pitchLimit:.65,near:.05,far:45,renderWidth:720,renderHeight:540};
export function indoors(x:number,y:number){return x>=31&&x<=310&&y>=60&&y<232}
export function relativeMove(strafe:number,forward:number,yaw:number){const length=Math.hypot(strafe,forward)||1;return {x:(Math.cos(yaw)*strafe+Math.sin(yaw)*forward)/length,y:(Math.sin(yaw)*strafe-Math.cos(yaw)*forward)/length}}
export function facing(yaw:number){return Math.abs(Math.sin(yaw))>Math.abs(Math.cos(yaw))?(Math.sin(yaw)>0?'right':'left'):(Math.cos(yaw)>0?'up':'down')}
export function floorHeight(x:number,y:number){return indoors(x,y)?.36:x<345?Math.max(.14,.36-(y-232)/32*.22):.14}

export const WORLD_SCALE={horizontal:.5,vertical:.75};
export function worldPosition(x:number,y:number){return {x:x/20*WORLD_SCALE.horizontal,y:floorHeight(x,y)*WORLD_SCALE.vertical,z:y/20*WORLD_SCALE.horizontal}}
