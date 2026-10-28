/** Time-based paths in unscaled map-world units. No accumulated positional drift. */
export function balloonMotion(t:number,i:number){return {x:Math.sin(t*.72+i*1.7)*.045,y:Math.sin(t*.91+i*2.1)*.035,z:Math.sin(t*.53+i)*.025,tilt:Math.sin(t*.72+i*1.7)*.045}}
export function butterflyMotion(t:number,i:number){const a=t*(.3+i*.015)+i*1.8;return {x:Math.cos(a)*.5,y:Math.sin(a*2+i)*.12,z:Math.sin(a)*.34,yaw:Math.atan2(-Math.cos(a)*.34,-Math.sin(a)*.5),wing:.25+Math.sin(t*15+i)*.65}}
export function koiMotion(t:number,i:number){const a=t*(.105+i*.009)+i*1.6,rx=1.35-i*.09,rz=.59-i*.035;return {x:30.4+Math.cos(a)*rx,y:.355+Math.sin(a*1.8+i)*.012,z:5.3+Math.sin(a)*rz,yaw:Math.atan2(-Math.cos(a)*rz,-Math.sin(a)*rx),tail:Math.sin(t*3.1+i)*.2}}
export function crownMotion(t:number,i:number){return Math.sin(t*.47+i*1.9)*.004+Math.sin(t*.83+i)*.0015}
