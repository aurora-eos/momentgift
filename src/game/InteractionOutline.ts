import * as THREE from 'three';
import type {Mode} from './themes';
/** Bounds in the same unscaled coordinates as the modeled props, not map hitboxes. */
export const interactionBounds:Record<string,{center:number[];size:number[]}>= {
 shelf:{center:[2.85,1.72,3.95],size:[2.7,2.88,1.48]},
 drawer:{center:[12.6,1.06,3.91],size:[2.3,1.55,1.65]},
 plant:{center:[14.3,1.24,3.6],size:[1.82,2,1.95]},
 mail:{center:[1.9,1.09,7.75],size:[1.03,1.47,1.03]},
 sign:{center:[23.7,.95,10.8],size:[1,1.65,.3]},
 pond:{center:[30.4,.48,5.3],size:[5.35,.4,3.65]},
 bench:{center:[24.7,.95,4.05],size:[2.85,1.45,1.45]},
 flowers:{center:[33.75,.75,10.05],size:[1.65,1.35,2.25]},
};
const rituals={normal:{center:[33.7,.63,11.5],size:[1.2,.95,.9]},birthday:{center:[28.55,1.04,9.9],size:[1.65,1.55,1.65]},newyear:{center:[33.85,.59,8.85],size:[1.05,.9,1]}};
export function boundsFor(id:string,mode:Mode){return id==='ritual'?rituals[mode]:interactionBounds[id]}
function cornerFrame(){const vertices:number[]=[];for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5])for(let axis=0;axis<3;axis++){const start=[x,y,z],end=[x,y,z];end[axis]+=start[axis]>0?-.16:.16;vertices.push(...start,...end)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));return g}
export class InteractionOutline{
 readonly root=new THREE.Group();
 readonly material=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:1,depthWrite:false,depthTest:true,toneMapped:false});
 private corners=cornerFrame();private full=new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1));private extras=new Map<string,{root:THREE.LineSegments;material:THREE.LineBasicMaterial}>();private group=new THREE.Group();private line:THREE.LineSegments<THREE.BufferGeometry,THREE.LineBasicMaterial>=new THREE.LineSegments(this.full,this.material);
 constructor(scene:THREE.Scene){this.root.name='exploration-white-frame';this.line.name='exploration-frame-lines';this.line.frustumCulled=false;this.line.renderOrder=5;this.root.add(this.line);this.root.visible=false;this.group.name='nearby-white-frames';scene.add(this.root,this.group)}
 update(id:string|undefined,mode:Mode,t:number,reduced:boolean){
  this.line.geometry=this.full;const b=id?boundsFor(id,mode):undefined;this.root.visible=!!b;
  if(!b)return;
  this.root.position.set(b.center[0],b.center[1],b.center[2]);this.root.scale.set(b.size[0],b.size[1],b.size[2]);
  // A slow white pulse stays legible throughout; hidden sides respect scene depth.
  this.material.opacity=reduced?1:.55+.45*(.5+.5*Math.sin(t*Math.PI*1.6));
 }
 updateNearby(ids:string[],selected:string|undefined,mode:Mode,t:number,reduced:boolean){const primary=selected??ids[0];this.update(primary,mode,t,reduced);if(!selected){this.line.geometry=this.corners;this.material.opacity=reduced?.7:.5+.25*(.5+.5*Math.sin(t*Math.PI*1.6))}for(const value of this.extras.values())value.root.visible=false;for(const id of ids){if(id===primary)continue;const b=boundsFor(id,mode);if(!b)continue;let frame=this.extras.get(id);if(!frame){const material=this.material.clone(),root=new THREE.LineSegments(this.corners,material);root.name='nearby-frame-'+id;root.renderOrder=5;this.group.add(root);frame={root,material};this.extras.set(id,frame)}frame.root.visible=true;frame.root.position.set(...b.center as [number,number,number]);frame.root.scale.set(...b.size as [number,number,number]);frame.material.opacity=reduced?.55:.32+.18*(.5+.5*Math.sin(t*Math.PI*1.6))}}
 dispose(){for(const frame of this.extras.values())frame.material.dispose();this.group.removeFromParent();this.full.dispose();this.corners.dispose();this.material.dispose();this.root.removeFromParent()}
}
