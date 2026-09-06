import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Geography,blockShape,inPolygons} from '../geometry.js';
import {Game,makeStage,BALL_RADIUS} from '../engine.js';
import {BLOCK_LAYOUTS} from '../block-layouts.js';
import {NEW_SAVE,validateSave} from '../progression.js';

const geo=new Geography(JSON.parse(fs.readFileSync(new URL('../japan.json',import.meta.url))));
const create=(id=47,options={})=>new Game(geo,{id,cleared:[],...options});
const distance=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);};

test('Okinawa uses double-width cells and a double-radius, unshielded core',()=>{
 const s=makeStage(geo,47),old=BLOCK_LAYOUTS[47];
 assert.equal(s.cell,old.cell*2);assert.equal(s.core.r,old.core.r*2);
 assert.equal(s.core.hp,1);assert.equal(s.core.shieldR,0);
 assert.deepEqual([s.core.x,s.core.y],[old.core.x,old.core.y]);
 assert.ok(s.blocks.length<old.blocks.length);
 assert.ok(s.blocks.some(b=>Math.abs(b.w-s.cell*.92)<.00002&&Math.abs(b.h-s.cell*.92)<.00002));
 for(const b of s.blocks){
  assert.equal(b.hp,1);
  assert.ok(!b.segments.some(([a,c])=>distance([s.core.x,s.core.y],a,c)<=s.core.r));
 }
 assert.equal(s.blocks.filter(b=>b.kind==='extra').length,1);
 assert.equal(s.blocks.filter(b=>b.kind==='barrier').length,1);
});

test('larger Okinawa blocks still match the coastline and collision geometry',()=>{
 const s=makeStage(geo,47),coast=s.polygons.flatMap(poly=>poly.flatMap(r=>r.slice(1).map((q,i)=>[r[i],q])));
 for(const b of s.blocks){
  assert.ok(inPolygons(...b.icon,[b.rings]));
  const rebuilt=blockShape(b.rings);assert.deepEqual(b.segments,rebuilt.segments);
  for(const [a,c] of b.segments)for(const q of [a,[(a[0]+c[0])/2,(a[1]+c[1])/2]])
   assert.ok(inPolygons(...q,s.polygons)||coast.some(([u,v])=>distance(q,u,v)<.00002));
 }
});

test('one real collision clears Okinawa in normal, easy, practice and replay modes',()=>{
 for(const options of [{},{easy:true},{practice:true},{cleared:[47,46]}]){
  const g=create(47,options);g.launch();
  g.balls=[{x:g.core.x,y:g.core.y+g.core.r+BALL_RADIUS+.01,vx:0,vy:-g.speed,r:BALL_RADIUS}];
  g.tick(1/120);
  assert.equal(g.status,'won');assert.equal(g.core.hp,0);
  assert.ok(!g.events.some(e=>e.type==='shield'));
  assert.equal(g.events.filter(e=>e.type==='win').length,1);
  assert.ok(g.blocks.every(b=>b.hp===1));
 }
});

test('the other 46 layouts, shields and two-hit clears stay unchanged',()=>{
 for(const p of geo.byId.values()){
  if(p.id===47)continue;
  const g=create(p.id),old=BLOCK_LAYOUTS[p.id];
  assert.equal(g.stage.cell,old.cell);assert.deepEqual(g.core,old.core);
  assert.deepEqual(g.blocks.map(b=>b.rings),old.blocks.map(b=>b.rings));
  g.launch();g.hitCore();assert.equal(g.core.hp,1);assert.equal(g.status,'playing');
  g.hitCore();assert.equal(g.status,'won');
 }
});

test('only old Okinawa runs restart; earned prefectures, records and other runs survive',()=>{
 const old={...NEW_SAVE(),cleared:[47,46],records:{47:{normal:{time:42,angle:15,noMiss:true}}},angles:{47:15},current:create().snapshot()};
 delete old.current.tutorialLayout;
 const next=validateSave(old);
 assert.equal(next.current,null);assert.deepEqual(next.cleared,old.cleared);
 assert.equal(next.records[47].normal.time,42);assert.equal(next.angles[47],15);
 assert.throws(()=>create(47,{snapshot:old.current}),/沖縄/);
 for(const id of [46,1]){
  const snapshot=create(id).snapshot();assert.deepEqual(validateSave({...old,current:snapshot}).current,snapshot);
 }
});

test('new Okinawa runs resume deterministically with damage, items and no shield',()=>{
 const g=create();g.launch();g.hitBlock(g.blocks.find(b=>b.kind==='barrier'));
 for(let i=0;i<90;i++)g.tick(1/120);
 const snapshot=JSON.parse(JSON.stringify(g.snapshot()));
 assert.equal(snapshot.tutorialLayout,2);assert.equal(snapshot.coreHP,1);
 assert.deepEqual(validateSave({...NEW_SAVE(),current:snapshot}).current,snapshot);
 const resumed=create(47,{snapshot});
 for(let i=0;i<90;i++){g.tick(1/120);resumed.tick(1/120);}
 assert.deepEqual(resumed.snapshot(),g.snapshot());
 for(let i=0;i<5;i++)resumed.loseBall();assert.equal(resumed.lives,3);
});

test('the finale remains a shieldless 60-second bonus with 84 blocks',()=>{
 const g=create(1,{cleared:geo.chapters.flat(),finale:true});
 assert.equal(g.blocks.length,84);assert.equal(g.core.hp,0);
 const snapshot=g.snapshot();assert.deepEqual(validateSave({...NEW_SAVE(),current:snapshot}).current,snapshot);
 const resumed=create(1,{finale:true,snapshot});resumed.launch();resumed.time=59.999;resumed.tick(1/120);
 assert.equal(resumed.status,'won');
});
