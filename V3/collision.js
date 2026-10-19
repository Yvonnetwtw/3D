import {landscapeObstacles} from './obstacles.js';
export function canStand(x,z,buildings){
 return x>-153&&x<153&&z>-94&&z<105&&![...buildings,...landscapeObstacles].some(b=>b.shape==='round'?Math.hypot(x-b.x,z-b.z)<b.w*.5+1.2:Math.abs(x-b.x)<b.w/2+1.2&&Math.abs(z-b.z)<b.d/2+1.2);
}
export function advance(position,dx,dz,buildings){
 let {x,z}=position;
 const parts=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.7));
 for(let i=0;i<parts;i++){if(canStand(x+dx/parts,z,buildings))x+=dx/parts;if(canStand(x,z+dz/parts,buildings))z+=dz/parts;}
 return {x,z};
}
