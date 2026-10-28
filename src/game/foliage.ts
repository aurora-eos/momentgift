import * as THREE from 'three';
/** A folded, tapered blade; geometry rather than shaded spheres or camera-facing posters. */
export function leafGeometry(){
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.38,.045,.28,-.44,.075,.56,0,.12,1,.44,.075,.56,.38,.045,.28,0,.095,.52],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([.5,0,0,.28,0,.56,.5,1,1,.56,1,.28,.5,.52],2));g.setIndex([0,1,6,1,2,6,2,3,6,3,4,6,4,5,6,5,0,6]);g.setAttribute('color',new THREE.Float32BufferAttribute([.65,.72,.55,.76,.84,.67,.87,.94,.78,1,1,.88,.8,.89,.7,.68,.77,.56,1,1,.92],3));g.computeVertexNormals();return g;
}
export function branch(parent:THREE.Object3D,from:THREE.Vector3,to:THREE.Vector3,r:number,material:THREE.Material){const delta=to.clone().sub(from),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r,delta.length(),7),material);mesh.position.copy(from).add(to).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh}
export function plantLeaves(parent:THREE.Object3D,material:THREE.Material,seed:number,count:number,radius:number,height:number){
 const mesh=new THREE.InstancedMesh(leafGeometry(),material,count),dummy=new THREE.Object3D();
 for(let i=0;i<count;i++){
  const a=i*2.399963+seed,y=.2+(i/count)*height,reach=radius*(.6+.4*Math.sin(i*1.7+seed));
  dummy.position.set(Math.cos(a)*reach*.3,y,Math.sin(a)*reach*.3);dummy.rotation.set(-.38+Math.sin(i*.9)*.24,-a-Math.PI/2,Math.cos(i)*.22);dummy.scale.set(radius*.7,.65,reach*1.4);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color().setHSL(.22+(i%4)*.012,.21,.36+(i%5)*.037));
 }
 mesh.castShadow=mesh.receiveShadow=true;mesh.name='sculpted-plant-leaves';parent.add(mesh);return mesh;
}
