import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';

const sources={gate:'https://www.cnu.edu.tw/content-photo.asp?fid=7&id=619&sid=608&type=2',statue:'https://libcvod.cnu.edu.tw/media/1495',trees:'https://www.cnu.edu.tw/content-photo.asp?fid=7&id=619&sid=608&type=2'};
function material(color){return new THREE.MeshStandardMaterial({color,roughness:.85});}
function solid(parent,geo,mat,x,y,z){const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cube(parent,w,h,d,color,x,y,z){return solid(parent,new THREE.BoxGeometry(w,h,d),material(color),x,y,z);}
function textPanel(parent,text,w,h,x,y,z,angle=0){const c=document.createElement('canvas');c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#edece1';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#204f7c';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 91px "Microsoft JhengHei",sans-serif';ctx.fillText(text,512,82,965);ctx.font='22px Georgia';ctx.fillText('CHIA NAN UNIVERSITY OF PHARMACY & SCIENCE',512,157,950);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));panel.position.set(x,y,z);panel.rotation.y=angle;parent.add(panel);return panel;}

export function addLandscape(scene,buildings){
 const ground=new THREE.Group();ground.name='V6-photo-referenced-landscape';scene.add(ground);
 const exhibit=new THREE.Group();exhibit.name='Confucius in front of Library - user confirmed area';exhibit.position.set(-65.36,0,-38);ground.add(exhibit);buildStatue(exhibit);
 cube(ground,15,.12,18,0xe8d8b3,-65.36,.08,-34);
 // Rebuild the existing guard-house cue; the prior overhead bar was illustrative.
 const guard=buildings.find(b=>b.code==='I');
 if(guard){const g=guard.group;const glazing=material(0x79969b);const curved=solid(g,new THREE.CylinderGeometry(4.5,4.5,5.5,24,1,false,0,Math.PI),glazing,-5.5,3.4,0);curved.rotation.y=Math.PI;cube(g,18,.7,10,0xe9e5d5,-3,6.8,0);}
 // Entrance composition based on the university's 2023 photo; all dimensions illustrative.
 cube(ground,4,18,8,0xd7d0b9,-133,9,-28);
 cube(ground,4.3,.6,8.3,0xe8e4d6,-133,18.3,-28);
 textPanel(ground,'嘉南藥理大學',18,3.8,-150.1,3.8,-23,-Math.PI/2);
 cube(ground,2,5.7,23,0xe8e5d8,-149,2.85,-23);
 // Put the sign just outside the stone wall's street face.
 for(let i=0;i<4;i++){cube(ground,2.6,.4,24+i*.4,0xc6c5b9,-149,.2+i*.15,-23);}
 const banner=new THREE.Group();banner.position.set(-135.08,10,-28);banner.rotation.y=-Math.PI/2;ground.add(banner);
 textPanel(banner,'嘉南藥理大學',6,1.9,0,0,0);
 // Front-facing campus-name panel on the Songtian building mass.
 const songtian=buildings.find(b=>b.code==='B');if(songtian)textPanel(songtian.group,'嘉南藥理大學',17,3,-songtian.w/2-.08,songtian.h-4,0,-Math.PI/2);
 for(const z of [-42,-34,-18]){cube(ground,6,.6,5,0xb3bc91,-145,.3,z);broadTree(-145,z,3.3);}
 function broadTree(x,z,size=4){const tree=new THREE.Group();tree.position.set(x,0,z);ground.add(tree);const bark=material(0x827b5d);solid(tree,new THREE.CylinderGeometry(.4,.65,5.3,8),bark,0,2.6,0);for(const sign of [-1,1]){const branch=solid(tree,new THREE.CylinderGeometry(.18,.34,3.7,7),bark,sign*.8,5,0);branch.rotation.z=-sign*.5;}for(let i=0;i<5;i++){const crown=solid(tree,new THREE.IcosahedronGeometry(size*(.68+(i%2)*.1),2),material(i%2?0x78945d:0x6d8956),Math.cos(i*2.4)*size*.5,6+(i%3)*.6,Math.sin(i*2.4)*size*.35);crown.scale.set(1.35,.62,1.1);}return tree;}
 // Natural layered canopies replace the old spherical border planting.
 for(let i=0;i<21;i++)broadTree(-151+i*14,111,3.7+(i%3)*.5);
 for(let i=0;i<13;i++){const z=-91+i*15;if(z>-47&&z<-10)continue;broadTree(-151,z,3.7);}
 for(let i=0;i<12;i++)broadTree(-137+i*15,-96,3.7);
 // Short shaded-walkway study, inspired by the official Jiannan Avenue photo.
 // This is a design cue rather than a geolocated reconstruction.
 cube(ground,43,.18,12,0xe8e3d1,95,.12,64.5);
 for(let i=0;i<6;i++){const x=77.5+i*7;cube(ground,.6,7,.6,0x9fae8d,x,3.5,60);cube(ground,.6,7,.6,0x9fae8d,x,3.5,69);cube(ground,.55,.35,10,0x8b9c77,x,7,64.5);}
 for(let i=0;i<9;i++)cube(ground,36,.2,.15,0x91a37a,95,7.25,60+i*1.12);
 for(let i=0;i<6;i++)broadTree(76+i*8,53,4.3);
 return {sources};
}

export function buildStatue(parent){
 const bronze=material(0x594d45),stone=material(0x99958b),dark=material(0x3d3832);
 cube(parent,8,.4,7,0xb6b0a2,0,.2,0);cube(parent,7,.45,6,0xa5a194,0,.62,0);cube(parent,6,.45,5,0x99968e,0,1.07,0);
 cube(parent,3.2,2.1,2.7,0x77776e,0,2.35,0);cube(parent,3.55,.35,3,0x63645d,0,3.57,0);
 const body=new THREE.Group();body.position.y=3.75;parent.add(body);
 solid(body,new THREE.CylinderGeometry(.66,1.12,3.9,18),bronze,0,1.95,0);
 // Two folded-sleeve volumes and crossed hands; simplified from the public photo.
 const l=solid(body,new THREE.CapsuleGeometry(.39,1.5,8,12),bronze,-.76,2.9,.27);l.rotation.z=-.4;
 const r=solid(body,new THREE.CapsuleGeometry(.39,1.5,8,12),bronze,.76,2.9,.27);r.rotation.z=.4;
 const la=solid(body,new THREE.CapsuleGeometry(.18,.8,6,10),bronze,-.24,3.45,.62);la.rotation.z=-.85;
 const ra=solid(body,new THREE.CapsuleGeometry(.18,.8,6,10),bronze,.24,3.45,.69);ra.rotation.z=.85;
 solid(body,new THREE.SphereGeometry(.52,18,14),bronze,0,4.48,0);
 const hair=solid(body,new THREE.SphereGeometry(.53,18,10,0,Math.PI*2,0,Math.PI*.46),dark,0,4.62,-.025);
 const beard=solid(body,new THREE.ConeGeometry(.29,.95,12),dark,0,3.98,.39);beard.rotation.z=Math.PI;
 solid(body,new THREE.SphereGeometry(.13,10,8),bronze,0,4.45,.5).scale.set(.6,1,.9);
 for(const sign of [-1,1]){const brow=cube(body,.24,.055,.06,0x3d3832,sign*.23,4.65,.46);brow.rotation.z=sign*.12;}
 for(let i=-2;i<=2;i++){const fold=cube(body,.04,2.9,.05,0x4c423c,i*.29,1.65,.72+Math.abs(i)*.08);fold.rotation.z=i*.055;}
 // Rocks and lawn framing echo the photo without reproducing its image.
 for(const [x,z,s] of [[-4,-.6,1.3],[4,0,1.1]]){const rock=solid(parent,new THREE.IcosahedronGeometry(s,1),material(0xc1bfb4),x,s*.7,z);rock.scale.set(1.2,.8,.8);}
 return parent;
}

export function setupStatuePreview(){
 const dialog=document.querySelector('#statueDialog'),host=document.querySelector('#statueScene');let renderer,controls,scene,camera,frame,observer;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelector('#statueOpen').addEventListener('click',()=>{dialog.showModal();if(!renderer){try{renderer=new THREE.WebGLRenderer({antialias:true});}catch{host.textContent='無法開啟立像 3D 檢視，請查看下方校方照片來源。';return;}host.appendChild(renderer.domElement);renderer.setPixelRatio(Math.min(devicePixelRatio,2));scene=new THREE.Scene();scene.background=new THREE.Color(0xe9eddf);scene.add(new THREE.HemisphereLight(0xffffff,0x7a8068,3));const light=new THREE.DirectionalLight(0xffffff,2.6);light.position.set(-7,12,9);scene.add(light);camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(10,9,17);controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,4,0);controls.minDistance=9;controls.maxDistance=35;controls.maxPolarAngle=Math.PI*.49;controls.autoRotate=!reduced;controls.autoRotateSpeed=.45;const group=new THREE.Group();buildStatue(group);scene.add(group);const lawn=solid(scene,new THREE.CylinderGeometry(7.5,7.5,.12,48),material(0xbecba6),0,-.07,0);}
 const resize=()=>{const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();};resize();observer?.disconnect();observer=new ResizeObserver(resize);observer.observe(host);const animate=()=>{if(!dialog.open)return;frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);};animate();});
 document.querySelector('#statueClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{cancelAnimationFrame(frame);observer?.disconnect();});
}
