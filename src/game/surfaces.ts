import * as THREE from 'three';
/** Project UVs at one density so wood grain and plaster aren't stretched over long walls. */
export function surfaceUV(geometry:THREE.BufferGeometry,tile=1.8){
 const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv');
 for(let i=0;i<p.count;i++){
  const x=Math.abs(n.getX(i)),y=Math.abs(n.getY(i)),z=Math.abs(n.getZ(i));
  if(y>=x&&y>=z)uv.setXY(i,p.getX(i)/tile,p.getZ(i)/tile);
  else if(x>=z)uv.setXY(i,p.getZ(i)/tile,p.getY(i)/tile);
  else uv.setXY(i,p.getX(i)/tile,p.getY(i)/tile);
 }
 uv.needsUpdate=true;
}
/** Soft, stepped contact shading at the room's wall/floor junctions. */
export function buildWallContact(scene:THREE.Scene){
 const canvas=document.createElement('canvas');canvas.width=4;canvas.height=64;const ctx=canvas.getContext('2d')!;
 for(let y=0;y<64;y++){const fade=Math.pow(y/63,2);ctx.fillStyle=`rgba(48,34,22,${Math.round(fade*12)/32})`;ctx.fillRect(0,y,4,1)}
 const texture=new THREE.CanvasTexture(canvas);texture.magFilter=texture.minFilter=THREE.NearestFilter;
 const mat=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
 const root=new THREE.Group();root.name='wall-contact-shading';scene.add(root);
 const strip=(x:number,z:number,w:number,d:number,angle:number)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);p.rotation.set(-Math.PI/2,0,angle);p.position.set(x,.363,z);root.add(p)};
 strip(8.5,3.25,13.8,.55,Math.PI);strip(7.25,11.17,11.4,.55,0);strip(1.82,7.2,8.1,.55,-Math.PI/2);strip(15.17,7.2,8.1,.55,Math.PI/2);
 return root;
}
