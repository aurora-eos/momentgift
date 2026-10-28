import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {PixelArtLibrary} from './PixelArtLibrary';
import type {Mode} from './themes';

/** Wall-attached details keep the existing floor plan and walking clearances. */
export function buildRoomDetails(scene:THREE.Scene,art:PixelArtLibrary,mode:Mode){
 const root=new THREE.Group();root.name='lived-in-room';scene.add(root);
 const materials=new Map<string,THREE.MeshStandardMaterial>();
 const mat=(color:string)=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.92,map:color==='#a77d52'?art.texture('wood'):null}));return materials.get(color)!};
 const box=(p:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:string)=>{const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,1,Math.min(.015,w/6,h/6,d/6)),mat(color));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m};
 const sphere=(p:THREE.Object3D,x:number,y:number,z:number,r:number,color:string)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat(color));m.position.set(x,y,z);m.castShadow=true;p.add(m);return m};
 const wall=(name:string,x:number,y:number,z:number,yaw:number)=>{const g=new THREE.Group();g.name=name;g.position.set(x,y,z);g.rotation.y=yaw;root.add(g);return g};
 const print=(p:THREE.Object3D,name:string,x:number,y:number,w:number,h:number)=>{
  box(p,x+.018,y-.025,.017,w+.14,h+.14,.045,'#82674c');
  box(p,x,y,.055,w+.12,h+.12,.055,'#a77d52');
  box(p,x,y,.089,w,h,.016,'#eee5cc');
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.1,h-.1),new THREE.MeshStandardMaterial({map:art.texture(name),roughness:1}));face.position.set(x,y,.1);face.receiveShadow=true;p.add(face);
  // Raised frame and inner bevel, rather than a floating image plane.
  for(const sign of [-1,1]){box(p,x+sign*(w/2+.028),y,.114,.065,h+.12,.06,'#a77d52');box(p,x,y+sign*(h/2+.028),.114,w+.06,.065,.06,'#bda073')}
 };
 const betweenWindows=wall('window-side-print',9.1,2.2,2.945,0);print(betweenWindows,mode==='birthday'?'birthday-print':mode==='newyear'?'newyear-print':'cottage-print',0,0,.95,1.22);
 const familyPhoto=wall('shelf-side-photograph',4.95,2.28,2.945,0);print(familyPhoto,'cottage-print',0,0,.76,.7);
 const botanical=wall('botanical-wall-print',1.54,2.24,5.35,Math.PI/2);print(botanical,'botanical-print',0,0,1.55,1.68);
 const gallery=wall('memory-gallery',7.3,2.18,11.45,Math.PI);
 print(gallery,mode==='birthday'?'birthday-print':mode==='newyear'?'newyear-print':'cottage-print',0,0,1.72,1.82);
 print(gallery,'cottage-print',2,.34,.87,.72);print(gallery,'botanical-print',1.9,-.58,.61,.7);
 const notes=wall('handwritten-noticeboard',10.5,2.13,11.45,Math.PI);
 box(notes,0,0,.05,1.42,1.34,.09,'#a77d52');box(notes,0,0,.104,1.27,1.19,.035,'#b49a70');
 for(const [i,[x,y,angle]]of [[-.3,.21,-.09],[.29,.13,.07],[-.03,-.31,.04]].entries()){
  const note=new THREE.Group();note.position.set(x,y,.14);note.rotation.z=angle;notes.add(note);
  box(note,0,0,0,.46,.48,.012,i===1?'#e1c4b8':'#f3ead0');sphere(note,0,.19,.027,.025,i===1?'#87987b':'#a66152');
  for(let line=0;line<3;line++)box(note,-.025,-.03+line*.065,.011,.27-(line%2)*.06,.012,.006,'#a99b80');
 }
 // An entry peg rail, hanging linen tote, and shallow shelf stay against the wall.
 const pegs=wall('entry-peg-rail',3.05,1.98,11.45,Math.PI);box(pegs,0,0,.07,1.4,.14,.1,'#a77d52');
 for(const x of [-.48,0,.48]){box(pegs,x,-.045,.18,.045,.13,.18,'#a77d52');sphere(pegs,x,-.1,.27,.045,'#bda073')}
 box(pegs,-.43,-.7,.18,.5,.63,.15,'#c7c5a3');for(const x of [-.57,-.3])box(pegs,x,-.32,.15,.045,.29,.04,'#ded5b5');box(pegs,-.43,-.69,.262,.32,.025,.008,'#95a08d');
 // East-wall clock and a little illustrated calendar fill the reading corner.
 const clock=wall('reading-corner-clock',15.46,2.74,7.25,-Math.PI/2);
 const disc=(r:number,depth:number,color:string,z:number)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,32),mat(color));m.rotation.x=Math.PI/2;m.position.z=z;clock.add(m)};
 disc(.42,.1,'#a77d52',.06);disc(.355,.012,'#eee5cc',.117);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const mark=box(clock,Math.sin(a)*.29,Math.cos(a)*.29,.13,.018,.045,.008,'#8d7a5e');mark.rotation.z=-a}
 const hour=new THREE.Group(),minute=new THREE.Group();hour.name='clock-hour-hand';minute.name='clock-minute-hand';hour.position.z=.145;minute.position.z=.15;box(hour,0,.085,0,.026,.2,.012,'#82674c');box(minute,0,.123,0,.018,.28,.012,'#82674c');clock.add(hour,minute);sphere(clock,0,0,.17,.034,'#a77d52');
 const calendar=wall('illustrated-calendar',15.46,2.08,9.4,-Math.PI/2);print(calendar,'botanical-print',0,.08,.75,.82);box(calendar,0,-.47,.108,.75,.23,.016,'#eee5cc');for(let x=0;x<7;x++)for(let y=0;y<2;y++)box(calendar,-.27+x*.09,-.42-y*.075,.123,.025,.016,.004,'#9e937a');
 // A still life on the existing cabinet: worn books, a ceramic vase, small framed memory.
 for(let i=0;i<3;i++){const b=box(root,12.12,1.77+i*.075,3.94,.62,.065,.4,['#7c927f','#d5bc98','#b38170'][i]);b.rotation.y=(i-1)*.09;box(root,12.12,1.77+i*.075,4.145,.49,.025,.008,'#e3d9bb')}
 const vase=sphere(root,13.12,1.95,3.79,.16,'#d4c4a0');vase.scale.set(.85,1.3,.85);box(root,13.12,2.2,3.79,.022,.3,.022,'#81916b');
 for(let i=0;i<5;i++){const a=i*2.4;const petal=sphere(root,13.12+Math.cos(a)*.075,2.37,3.79+Math.sin(a)*.075,.065,'#e7bdad');petal.scale.y=.45}sphere(root,13.12,2.385,3.79,.04,'#d3b46c');
 const photo=wall('cabinet-keepsake',13.69,2.02,3.42,0);photo.rotation.x=-.08;print(photo,'cottage-print',0,0,.49,.49);
 // A folded throw drapes over one arm, with a stitched hem and fine fringe.
 box(root,10.44,1.165,5.57,.34,.035,.8,'#d4bc98');box(root,10.44,.97,5.99,.34,.37,.035,'#d4bc98');
 for(let i=0;i<5;i++){box(root,10.32+i*.06,1.188,5.57,.014,.006,.77,'#af9d80');box(root,10.32+i*.06,.75,6,.018,.095,.018,'#d4bc98')}
 return {root,update(t:number){const minutes=8*60+20+t/60;minute.rotation.z=-minutes*Math.PI/30;hour.rotation.z=-minutes*Math.PI/360}};
}
