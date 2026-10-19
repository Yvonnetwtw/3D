import assert from 'node:assert/strict';
import {buildings} from '../dist/data.js';
import {canStand,advance} from '../dist/collision.js';
assert.ok(canStand(-138,28,buildings),'spawn must be outside all building footprints');
for(const b of buildings)assert.equal(canStand(b.x,b.z,buildings),false,`cannot occupy ${b.code}`);
assert.equal(canStand(-160,0,buildings),false);assert.equal(canStand(0,110,buildings),false);
const gate=buildings.find(b=>b.code==='I');
const blocked=advance({x:-138,z:gate.z},50,0,buildings);
assert.ok(blocked.x<gate.x-gate.w/2-1.2,'a large move must not tunnel through the gate');
let p={x:-138,z:28};
for(let i=0;i<1200;i++){
 const dx=Math.sin(i*.19)*1.2,dz=Math.cos(i*.17)*1.2;
 p=advance(p,dx,dz,buildings);assert.ok(canStand(p.x,p.z,buildings),'movement stays outside buildings and within campus bounds');
}
console.log('PASS: clear spawn; 37 blocked building footprints; campus bounds; no tunneling; 1200 movement steps.');
assert.equal(canStand(-133,-28,buildings),false,'gate tower blocks pedestrian');
assert.equal(canStand(-149,-23,buildings),false,'campus-name wall blocks pedestrian');
console.log('PASS: V6 gate tower and campus-name wall collision.');
