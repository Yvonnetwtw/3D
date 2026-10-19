import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {buildings,colors} from './data.js';
import {createAudio} from './audio.js';
import {createWalker} from './walk.js';
import {addLandscape,setupStatuePreview} from './landscape.js';

const $=s=>document.querySelector(s),host=$('#scene'),labelHost=$('#labels');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(e){$('#loading').textContent='此裝置未能啟用 3D 顯示。你仍可使用左側清單查看建築名稱，或以其他支援 WebGL 的瀏覽器開啟。';}
const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9eddf);
const camera=new THREE.PerspectiveCamera(38,1,1,1500);camera.position.set(240,255,320);
const controls=renderer?new OrbitControls(camera,renderer.domElement):null;
if(renderer){host.appendChild(renderer.domElement);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;controls.target.set(0,0,5);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=30;controls.maxDistance=1200;controls.maxPolarAngle=Math.PI*.47;controls.autoRotateSpeed=.5;}
scene.add(new THREE.HemisphereLight(0xffffff,0x7a8a60,2.8));
const sun=new THREE.DirectionalLight(0xfff4dd,3.1);sun.position.set(-100,210,100);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-220,right:220,top:220,bottom:-220,near:1,far:550});sun.shadow.bias=-.0005;scene.add(sun);
const groundMat=new THREE.MeshStandardMaterial({color:0xdbe3c9,roughness:1});
function box(w,h,d,color,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.85}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
box(322,4,224,0xd3dcc4,0,-3,6);box(316,.9,218,0xe1e6d2,0,-.5,6);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(2500,2500),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-5.1;ground.receiveShadow=true;scene.add(ground);
function road(points,width,color=0xf5f3e7){for(let i=1;i<points.length;i++){const a=new THREE.Vector3(points[i-1][0],.07,points[i-1][1]),b=new THREE.Vector3(points[i][0],.07,points[i][1]),len=a.distanceTo(b);const m=box(width,.15,len,color,(a.x+b.x)/2,.04,(a.z+b.z)/2);m.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);}}
road([[-137,105],[-137,-60]],9);road([[-137,103],[132,103]],9);road([[-128,-29],[-15,-29],[42,-36],[113,-53]],9);road([[-23,-30],[-43,101]],10);road([[4,12],[8,90]],9);road([[0,2],[45,-32],[131,-55]],10);road([[-122,42],[-44,42]],7);road([[-130,-2],[-52,-2]],7);road([[31,13],[89,39],[140,37]],7);
box(67,.2,40,0xcbd2bc,-69,.1,-9);box(26,.25,19,0xecebdc,-96,.15,8);
// Sports fields are simplified footprint cues from the diagram, not to scale.
const track=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.2,64),new THREE.MeshStandardMaterial({color:0xc2a895,roughness:1}));track.scale.set(36,1,22);track.position.set(133,.22,-48);scene.add(track);
const field=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.21,64),new THREE.MeshStandardMaterial({color:0xa8bd82,roughness:1}));field.scale.set(29,1,15);field.position.set(133,.35,-48);scene.add(field);
box(69,.2,33,0xc5d4a9,89,.18,40);box(46,.2,32,0xb3bcb1,60,.2,-2);
for(let i=0;i<3;i++){const x=44+i*15;road([[x,-16],[x,12]],.3,0xeff2e7);road([[x,-16],[x+13,-16],[x+13,12],[x,12],[x,-16]],.3,0xeff2e7);}
const windowMat=new THREE.MeshStandardMaterial({color:0x5b7772,roughness:.5,metalness:.15});
function addWindows(b,parent){let y=3;while(y<b.h-1){const count=Math.max(1,Math.floor((b.w-3)/4));for(let j=0;j<count;j++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.65,1.55,.16),windowMat);m.position.set(-b.w/2+2.5+j*((b.w-5)/Math.max(1,count-1)),y,b.d/2+.12);parent.add(m);const back=m.clone();back.position.z=-b.d/2-.12;parent.add(back);}box(b.w+.3,.28,b.d+.3,0xdce1d4,0,y-1.2,0,parent);y+=3.9;}}
const pickables=[];
for(const b of buildings){const g=new THREE.Group();g.position.set(b.x,0,b.z);scene.add(g);b.group=g;
 let body;if(b.shape==='round'){body=new THREE.Mesh(new THREE.CylinderGeometry(b.w*.49,b.w*.5,b.h,24),new THREE.MeshStandardMaterial({color:colors[b.category],roughness:.85}));body.position.y=b.h/2;g.add(body);body.castShadow=body.receiveShadow=true;for(let y=4;y<b.h;y+=4){const ring=new THREE.Mesh(new THREE.CylinderGeometry(b.w*.51,b.w*.51,.45,24),new THREE.MeshStandardMaterial({color:0xf3f0e3}));ring.position.y=y;g.add(ring);}box(13,5,12,0xe2e2d4,0,b.h+2.5,0,g);}
 else{body=box(b.w,b.h,b.d,colors[b.category],0,b.h/2,0,g);addWindows(b,g);box(b.w+1,.7,b.d+1,0xe9e9db,0,b.h+.35,0,g);box(b.w*.5,1.3,b.d*.48,0xc5cdbb,0,b.h+1.35,0,g);}
 body.userData.building=b;pickables.push(body);b.body=body;

 const el=document.createElement('button');el.className='map-label';el.textContent=b.code;el.title=b.name;el.setAttribute('aria-label',`${b.code} ${b.name}`);el.addEventListener('click',()=>select(b));labelHost.appendChild(el);b.label=el;
}
addLandscape(scene,buildings);setupStatuePreview();

let selected=null,category='all',query='',fly=null,topView=false,tourIndex=-1,tourNext=0;
function introduction(b){return b?`這裡是${b.name}，在嘉南藥理大學官方校園配置圖上的代碼為 ${b.code}。您可以旋轉或放大模型，觀察它與周邊建築的相對位置。這是示意模型，建築外觀與樓高仍待現場照片核對。`:'歡迎走進嘉南藥理大學。按下進入校園，使用方向鍵，跟著角色探索。您也可以回到鳥瞰，搜尋並點選建築，聆聽介紹。按下開始導覽，鏡頭會帶您依序觀察校門、行政大樓、教學區、圖書館與體育館。這個模型依校方配置圖製作，建築外觀與樓高為示意。';}
const audio=createAudio({announce,getIntroduction:()=>introduction(selected),getNarrationKey:()=>selected?.code||'intro'});
const route=['I','A','C','L','Q','P','U'];
const walker=createWalker({scene,camera,controls,buildings,onEnter:()=>{fly=null;topView=false;document.querySelector('#top').setAttribute('aria-pressed','false');stopTour();closeDetail();resetFilters();},onExit:()=>{document.querySelector('#exhibitNote').hidden=true;home();},announce});
function landmarkView(kind){if(walker.isEnabled())walker.exit();stopTour();closeDetail();topView=false;document.querySelector('#top').setAttribute('aria-pressed','false');if(kind==='gate'){flyTo(new THREE.Vector3(-131,7,-10),new THREE.Vector3(-203,37,43));document.querySelector('#viewName').textContent='校門入口意象';announce('校門依官方照片簡化重建，尺寸與細部仍為示意。');}else{flyTo(new THREE.Vector3(95,5,64),new THREE.Vector3(63,35,115));document.querySelector('#viewName').textContent='林蔭步道意象';announce('林蔭及格架依官方照片風格重建，未逐棵定位。');}}
document.querySelector('#gateView').addEventListener('click',()=>landmarkView('gate'));
document.querySelector('#treesView').addEventListener('click',()=>landmarkView('trees'));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function announce(text){$('#status').textContent=text;}
function flyTo(target,pos){if(!controls)return;if(reduced){controls.target.copy(target);camera.position.copy(pos);controls.update();return;}fly={start:performance.now(),from:camera.position.clone(),to:pos.clone(),fromTarget:controls.target.clone(),target:target.clone()};}
function select(b,move=true){selected=b;for(const x of buildings){x.body.material.emissive.setHex(x===b?0x355d37:0);x.body.material.emissiveIntensity=x===b?.32:0;x.label.classList.toggle('selected',x===b);x.label.textContent=x===b?`${x.code} ${x.name}`:x.code;}
 $('#detail').hidden=false;$('#detailCategory').textContent=`${b.category} · 建築資訊`;$('#detailCode').textContent=b.code;$('#detailName').textContent=b.name;
 $('#detailText').textContent=b.code==='V'||b.code==='D12'?'官方圖將同一建築的不同樓層分列為 V 與 D12。本版以分離體塊顯示代碼，實際整體外觀待照片核對。':b.code==='C'?'官方圖以多個 C 標示綜合教學大樓。本版合併成簡化體塊；中庭與連通結構仍待補充。':`在校方配置圖中，以「${b.code}」標示此建築。可轉動模型觀察它與周邊建築的相對位置。`;
 document.querySelectorAll('.building-row').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.code===b.code)));
 if(move&&!walker.isEnabled()){flyTo(new THREE.Vector3(b.x,5,b.z),new THREE.Vector3(b.x+72,b.h+87,b.z+110));topView=false;$('#top').setAttribute('aria-pressed','false');$('#viewName').textContent='建築觀察';}
 announce(`已選擇 ${b.code} ${b.name}`);audio.speak(introduction(b));
}
function closeDetail(){audio.stopSpeech();selected=null;$('#detail').hidden=true;for(const b of buildings){b.body.material.emissive.setHex(0);b.label.classList.remove('selected');b.label.textContent=b.code;}document.querySelectorAll('.building-row').forEach(x=>x.setAttribute('aria-pressed','false'));}
function matches(b){return(category==='all'||b.category===category)&&(!query||`${b.code} ${b.name}`.toLowerCase().includes(query));}
function renderList(){const list=$('#buildingList');list.replaceChildren();let count=0;for(const b of buildings){const visible=matches(b);b.group.visible=visible;b.label.hidden=!visible;if(!visible)continue;count++;const row=document.createElement('button');row.className='building-row';row.dataset.code=b.code;row.setAttribute('aria-pressed',String(selected===b));const code=document.createElement('span');code.className='code';code.textContent=b.code;const name=document.createElement('span');name.className='row-title';name.textContent=b.name;const arrow=document.createElement('span');arrow.className='arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');row.append(code,name,arrow);row.addEventListener('click',()=>{stopTour();select(b);if(innerWidth<=760)host.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});});list.appendChild(row);}
 $('#resultCount').textContent=`${count} / ${buildings.length}`;if(!count){const p=document.createElement('p');p.className='empty';p.textContent='找不到符合的建築。請試試名稱片段或代碼。';list.appendChild(p);}if(selected&&!matches(selected))closeDetail();}
renderList();
function resetFilters(){query='';category='all';$('#buildingSearch').value='';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));renderList();}
$('#buildingSearch').addEventListener('input',e=>{stopTour();query=e.target.value.trim().toLowerCase();renderList();});
document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{stopTour();category=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));renderList();}));
function stopTour(){if(tourIndex>=0)audio.stopSpeech();tourIndex=-1;$('#tour').setAttribute('aria-pressed','false');$('#tour').innerHTML='開始導覽 <span>▶</span>';$('#tourText').textContent='讓鏡頭帶你走一圈';}
function homePosition(){const factor=Math.max(1,1.2/camera.aspect);return new THREE.Vector3(240,255,320).multiplyScalar(factor);}
function home(){if(walker.isEnabled()){walker.exit();return;}stopTour();closeDetail();resetFilters();topView=false;$('#top').setAttribute('aria-pressed','false');$('#viewName').textContent='立體鳥瞰';flyTo(new THREE.Vector3(0,0,5),homePosition());}
$('#home').addEventListener('click',home);$('#detailClose').addEventListener('click',closeDetail);$('#focus').addEventListener('click',()=>{stopTour();if(selected){const b=selected;flyTo(new THREE.Vector3(b.x,b.h*.3,b.z),new THREE.Vector3(b.x+38,b.h+33,b.z+55));}});
$('#top').addEventListener('click',()=>{if(walker.isEnabled())walker.exit();stopTour();topView=!topView;$('#top').setAttribute('aria-pressed',String(topView));$('#viewName').textContent=topView?'垂直俯視':'立體鳥瞰';flyTo(new THREE.Vector3(0,0,5),topView?new THREE.Vector3(0,380*Math.max(1,1.2/camera.aspect),5.1):homePosition());});
for(const [id,factor] of [['zoomIn',.78],['zoomOut',1.28]])$('#'+id).addEventListener('click',()=>{stopTour();if(!controls)return;const offset=camera.position.clone().sub(controls.target).multiplyScalar(factor);offset.clampLength(controls.minDistance,controls.maxDistance);flyTo(controls.target.clone(),controls.target.clone().add(offset));});
$('#rotate').addEventListener('click',()=>{stopTour();if(!controls)return;controls.autoRotate=!controls.autoRotate;$('#rotate').setAttribute('aria-pressed',String(controls.autoRotate));});
function nextStop(){tourIndex++;if(tourIndex>=route.length){stopTour();announce('校園鏡頭導覽已完成');return;}const b=buildings.find(x=>x.code===route[tourIndex]);select(b);$('#tourText').textContent=`${tourIndex+1} / ${route.length} · ${b.name}`;tourNext=performance.now()+6200;}
$('#tour').addEventListener('click',()=>{if(walker.isEnabled())walker.exit();if(tourIndex>=0){stopTour();return;}resetFilters();if(controls){controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');}tourIndex=-1;$('#tour').setAttribute('aria-pressed','true');$('#tour').innerHTML='停止導覽 <span>■</span>';nextStop();});
if(controls)controls.addEventListener('start',()=>{fly=null;stopTour();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){stopTour();closeDetail();}if(e.target===host&&controls&&!walker.isEnabled()){const offset=camera.position.clone().sub(controls.target);const angle=e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0;if(angle){offset.applyAxisAngle(new THREE.Vector3(0,1,0),angle);camera.position.copy(controls.target).add(offset);e.preventDefault();}if(e.key==='Home')home();}});
$('#sourcesOpen').addEventListener('click',()=>$('#sourcesDialog').showModal());$('#sourcesClose').addEventListener('click',()=>$('#sourcesDialog').close());
if(renderer){let down=null;renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const rect=renderer.domElement.getBoundingClientRect(),pointer=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pickables.filter(x=>x.parent.visible))[0];if(hit){stopTour();select(hit.object.userData.building);}});
 let lastPortrait=null;const resize=()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();const portrait=width<height;if(lastPortrait!==portrait&&!selected&&!walker.isEnabled()){fly=null;camera.position.copy(topView?new THREE.Vector3(0,380*Math.max(1,1.2/camera.aspect),5.1):homePosition());controls.target.set(0,0,5);controls.update();}lastPortrait=portrait;};new ResizeObserver(resize).observe(host);resize();$('#loading').hidden=true;
 let lastFrame=performance.now();function loop(now){requestAnimationFrame(loop);const delta=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;walker.update(delta);if(fly){const t=Math.min(1,(now-fly.start)/1000),s=t*t*(3-2*t);camera.position.lerpVectors(fly.from,fly.to,s);controls.target.lerpVectors(fly.fromTarget,fly.target,s);if(t===1)fly=null;}if(tourIndex>=0&&now>=tourNext&&!audio.isSpeaking())nextStop();controls.update();renderer.render(scene,camera);
 const rect=host.getBoundingClientRect(),occupied=[];const ordered=[...buildings].sort((a,b)=>(b===selected)-(a===selected));for(const b of ordered){if(!matches(b)){b.label.style.display='none';continue;}const p=new THREE.Vector3(b.x,b.h+4,b.z).project(camera),x=(p.x*.5+.5)*rect.width,y=(-p.y*.5+.5)*rect.height;const width=b===selected?Math.min(230,50+b.name.length*11):38,height=22;const box={l:x-width/2,r:x+width/2,t:y-height,b:y};const collision=occupied.some(o=>box.l<o.r&&box.r>o.l&&box.t<o.b&&box.b>o.t);const visible=p.z<1&&p.z>-1&&x>15&&x<rect.width-15&&y>55&&y<rect.height-125&&(!collision||b===selected);b.label.style.display=visible?'block':'none';if(visible){b.label.style.left=x+'px';b.label.style.top=y+'px';occupied.push(box);}}}
 requestAnimationFrame(loop);
}

function visitExhibit(){walker.visitExhibit();document.querySelector('#exhibitNote').hidden=false;}
document.querySelector('#visitConfucius').addEventListener('click',visitExhibit);
document.querySelector('#exhibitClose').addEventListener('click',()=>document.querySelector('#exhibitNote').hidden=true);
