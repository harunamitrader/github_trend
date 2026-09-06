import {clamp,blockShape,sweepBlock,sweepPoint,sweepSegment,reflect,length,rotatePoint} from './geometry.js';
import {BLOCK_LAYOUTS} from './block-layouts.js';
import {OKINAWA_LAYOUT} from './okinawa-layout.js';
export const WIDTH=400,HEIGHT=600,BALL_RADIUS=5.2,BARRIER_Y=596;
const HORIZONTAL_STALL_SECONDS=3,HORIZONTAL_RATIO=.08,RECOVERY_RATIO=.2;
export function makeStage(geo,id){
 const pref=geo.get(id),shape=geo.stageShape(id),layout=id===47?OKINAWA_LAYOUT:BLOCK_LAYOUTS[id];
 if(!layout)throw new Error('ブロックの地形データがありません。');
 const blocks=layout.blocks.map((b,i)=>blockShape(b.rings,{...b,id:i,kind:'normal',hp:1,maxHp:1}));
 // Exactly one of each item. Prefer broad, lower blocks so their symbols are legible.
 const available=blocks.filter(b=>b.area>=layout.cell**2*.45&&Math.min(b.w,b.h)>=8);
 const interior=available.filter(b=>!b.edge);
 const candidates=interior.length>=2?interior:available.length>=2?available:[...blocks].sort((a,b)=>b.area-a.area).slice(0,8);
 for(const [kind,ratio] of [['extra',.32],['barrier',.68]]){
  const tx=shape.bounds.minX+(shape.bounds.maxX-shape.bounds.minX)*ratio,ty=shape.bounds.minY+(shape.bounds.maxY-shape.bounds.minY)*.72;
  const chosen=candidates.filter(b=>b.kind==='normal').sort((a,b)=>Math.hypot(a.icon[0]-tx,a.icon[1]-ty)-Math.hypot(b.icon[0]-tx,b.icon[1]-ty))[0];
  if(chosen)chosen.kind=kind;
 }
 return {id,pref,...shape,core:{...layout.core},blocks,cell:layout.cell};
}
export class Game{
 constructor(geo,{id,cleared=[],angle=0,easy=false,practice=false,finale=false,paddleIds=null,snapshot=null}){
  this.geo=geo;this.id=id;this.paddleIds=paddleIds||[...cleared];this.angle=angle;this.easy=easy;this.practice=practice;this.finale=finale;
  this.stage=makeStage(geo,id);this.blocks=this.stage.blocks.map(b=>({...b}));this.core={...this.stage.core};
  this.paddle=geo.makePaddle(this.paddleIds,angle);this.paddleX=200;this.targetX=200;this.paddleY=464;
  this.speed=(id===47?222:245+this.stage.pref.chapter*8)*(easy?.75:1);
  this.status='ready';this.lives=3;this.balls=[];this.time=0;this.misses=0;this.broken=0;this.combo=0;this.bestCombo=0;
  this.barrierActive=false;this.events=[];
  if(finale){this.core.hp=0;this.speed=290;this.blocks=[];for(let row=0;row<7;row++)for(let col=0;col<12;col++){const x=22+col*30,y=72+row*26;this.blocks.push(blockShape([[[x,y],[x+25,y],[x+25,y+20],[x,y+20],[x,y]]],{id:row*12+col,kind:'normal',hp:1,maxHp:1,icon:[x+12.5,y+10]}));}}
  if(snapshot)this.restore(snapshot);else this.resetBall();
 }
 emit(type,extra={}){this.events.push({type,...extra});}
 resetBall(){this.balls=[{x:this.paddleX,y:this.paddleY+this.paddle.bounds.minY-17,vx:this.speed*.29,vy:-this.speed*Math.sqrt(1-.29**2),r:BALL_RADIUS,horizontalTime:0}];}
 launch(){if(this.status!=='ready')return;this.status='playing';this.emit('launch');}
 setTarget(x){this.targetX=clamp(x,9-this.paddle.bounds.minX,WIDTH-9-this.paddle.bounds.maxX);}
 tick(dt){
  if(this.status==='won'||this.status==='lost'||this.status==='paused')return;
  const oldX=this.paddleX;this.setTarget(this.targetX);this.paddleX+=clamp(this.targetX-this.paddleX,-800*dt,800*dt);const ux=(this.paddleX-oldX)/dt;
  if(this.status==='ready'){this.resetBall();return;}
  this.time+=dt;
  if(this.finale&&this.time>=60){this.win();return;}
  const speed=this.speed;
  for(const ball of [...this.balls]){
   if(this.status!=='playing')break;
   let m=length({x:ball.vx,y:ball.vy})||1;ball.vx=ball.vx/m*speed;ball.vy=ball.vy/m*speed;
   this.moveBall(ball,dt,oldX,ux,speed);
  }
  if(this.status!=='playing')return;
  this.balls=this.balls.filter(b=>b.y<=HEIGHT+b.r+2);
  if(!this.balls.length)this.loseBall();
  if(this.finale&&this.blocks.every(b=>!b.hp))for(const b of this.blocks)b.hp=b.maxHp;
 }
 findHit(ball,d,paddleX,ux,remaining){
  let best=null;const consider=(h,type,obj)=>{if(h&&h.t>=0&&h.t<=1&&(!best||h.t<best.t-1e-9))best={...h,type,obj};};
  if(d.x<0)consider({t:(ball.r-ball.x)/d.x,n:{x:1,y:0}},'wall');
  if(d.x>0)consider({t:(WIDTH-ball.r-ball.x)/d.x,n:{x:-1,y:0}},'wall');
  if(d.y<0)consider({t:(36+ball.r-ball.y)/d.y,n:{x:0,y:1}},'wall');
  for(const b of this.blocks)if(b.hp>0)consider(sweepBlock(ball,d,b,ball.r),'block',b);
  if(this.barrierActive&&d.y>0&&ball.y+ball.r<=BARRIER_Y+1e-7)consider({t:(BARRIER_Y-ball.r-ball.y)/d.y,n:{x:0,y:-1}},'barrier');
  if(this.core.hp>0)consider(sweepPoint(ball,d,this.core,ball.r+(this.core.hp===2?this.core.shieldR:this.core.r)),'core',this.core);
  const p={x:ball.x-paddleX,y:ball.y-this.paddleY},rd={x:d.x-ux*remaining,y:d.y},bb=this.paddle.bounds;
  if(Math.max(p.x,p.x+rd.x)+ball.r>=bb.minX&&Math.min(p.x,p.x+rd.x)-ball.r<=bb.maxX&&Math.max(p.y,p.y+rd.y)+ball.r>=bb.minY&&Math.min(p.y,p.y+rd.y)-ball.r<=bb.maxY){
   for(const [a,b] of this.paddle.segments){
    if(Math.max(p.x,p.x+rd.x)+ball.r<Math.min(a[0],b[0])||Math.min(p.x,p.x+rd.x)-ball.r>Math.max(a[0],b[0])||Math.max(p.y,p.y+rd.y)+ball.r<Math.min(a[1],b[1])||Math.min(p.y,p.y+rd.y)-ball.r>Math.max(a[1],b[1]))continue;
    consider(sweepSegment(p,rd,a,b,ball.r),'paddle');
   }
  }
  return best;
 }
 trackHorizontal(ball,dt,speed){
  ball.horizontalTime=Math.abs(ball.vy)<speed*HORIZONTAL_RATIO?Math.min(HORIZONTAL_STALL_SECONDS,(ball.horizontalTime??0)+dt):0;
 }
 moveBall(ball,dt,oldX,ux,speed){
  let remaining=dt,elapsed=0;
  for(let iteration=0;iteration<10&&remaining>1e-7;iteration++){
   const d={x:ball.vx*remaining,y:ball.vy*remaining},hit=this.findHit(ball,d,oldX+ux*elapsed,ux,remaining);
   if(!hit){this.trackHorizontal(ball,remaining,speed);ball.x+=d.x;ball.y+=d.y;return;}
   const consumed=remaining*hit.t;ball.x+=d.x*hit.t;ball.y+=d.y*hit.t;elapsed+=consumed;remaining-=consumed;
   this.trackHorizontal(ball,consumed,speed);
   if(hit.type!=='wall')ball.horizontalTime=0;
   if(hit.type==='core'){this.hitCore();if(this.status==='won')return;}
   const item=hit.type==='block'?this.hitBlock(hit.obj):null;
   if(hit.type==='barrier'){this.barrierActive=false;this.emit('barrier-save',{x:ball.x,y:BARRIER_Y});}
   const v=reflect({x:ball.vx-(hit.type==='paddle'?ux:0),y:ball.vy},hit.n);
   if(hit.type==='paddle'){v.x+=ux;this.emit('bounce',{x:ball.x,y:ball.y});this.combo=0;}
   const m=length(v)||1;ball.vx=v.x/m*speed;ball.vy=v.y/m*speed;
   // Only break an idle, near-horizontal wall loop. Real terrain contacts reset
   // the timer; the recovery keeps speed and never aims toward a target or paddle.
   if(hit.type==='wall'&&Math.abs(hit.n.x)===1&&ball.horizontalTime>=HORIZONTAL_STALL_SECONDS){
    ball.vy=speed*RECOVERY_RATIO;ball.vx=Math.sign(ball.vx)*Math.sqrt(speed*speed-ball.vy*ball.vy);ball.horizontalTime=0;
    this.emit('unstuck',{x:ball.x,y:ball.y});
   }
   ball.x+=hit.n.x*.015;ball.y+=hit.n.y*.015;
   if(item==='extra')this.addBall(ball,hit.n);
   // Consume a microscopic amount of time after a zero-time contact.
   if(consumed<1e-8){remaining=Math.max(0,remaining-1e-6);elapsed+=1e-6;}
  }
 }
 hitBlock(b){
  if(!b.hp)return null;
  b.hp=0;this.broken++;this.combo++;this.bestCombo=Math.max(this.bestCombo,this.combo);
  const [x,y]=b.icon||[b.x+b.w/2,b.y+b.h/2];
  this.emit('hit',{x,y,kind:b.kind,destroyed:true});
  if(b.kind==='barrier'){this.barrierActive=true;this.emit('barrier-on',{x,y});}
  return b.kind;
 }
 addBall(source,normal){
  // Spawn after reflection, moving away from the struck face; no hidden aiming assist.
  const choices=[-.32,.32].map(a=>rotatePoint([source.vx,source.vy],a));
  choices.sort((a,b)=>(b[0]*normal.x+b[1]*normal.y)-(a[0]*normal.x+a[1]*normal.y));
  const [vx,vy]=choices[0];this.balls.push({...source,vx,vy,horizontalTime:0});
  this.emit('extra',{x:source.x,y:source.y});
 }
 hitCore(){
  if(this.core.hp<=0)return;
  this.core.hp--;
  if(this.core.hp===1){this.emit('shield',{x:this.core.x,y:this.core.y});return;}
  this.emit('core',{x:this.core.x,y:this.core.y});this.win();
 }
 win(){if(this.status==='won')return;this.status='won';this.emit('win',{time:this.time,broken:this.broken,total:this.blocks.length,misses:this.misses});}
 loseBall(){
  this.misses++;this.combo=0;this.emit('miss');
  if(!this.practice&&!this.finale&&this.id!==47)this.lives--;
  if(this.lives<=0){this.status='lost';this.emit('lost');return;}
  this.status='ready';this.resetBall();this.emit('ready');
 }
 recall(){if(!['playing','ready'].includes(this.status))return;this.balls=[];this.loseBall();}
 snapshot(){return {format:5,...(this.id===47&&!this.finale?{tutorialLayout:2}:{}),id:this.id,paddleIds:this.paddleIds,angle:this.angle,easy:this.easy,finale:this.finale,paddleX:this.paddleX,time:this.time,lives:this.lives,misses:this.misses,broken:this.broken,bestCombo:this.bestCombo,combo:this.combo,coreHP:this.core.hp,blocks:this.blocks.map(b=>b.hp),balls:this.balls.map(b=>({...b})),barrierActive:this.barrierActive,status:this.status};}
 restore(s){
  if(this.id===47&&!this.finale&&s.tutorialLayout!==2)throw new Error('沖縄のブロック配置が更新されました。ステージを最初から始めてください。');
  const finite=(v,a,b)=>Number.isFinite(v)&&v>=a&&v<=b;
  if(s.format!==5||s.id!==this.id||!Array.isArray(s.blocks)||s.blocks.length!==this.blocks.length||(!Number.isInteger(s.coreHP)||!finite(s.coreHP,0,this.stage.core.hp))||!finite(s.time,0,1e7)||!finite(s.lives,0,3))throw new Error('中断データを読み込めませんでした。');
  if(!Array.isArray(s.balls)||s.balls.length>(this.finale?1:2)||s.balls.some(b=>!finite(b.x,-100,500)||!finite(b.y,-100,720)||!finite(b.vx,-1500,1500)||!finite(b.vy,-1500,1500)))throw new Error('球の中断データが不正です。');
  s.blocks.forEach((hp,i)=>{if(!Number.isInteger(hp)||hp<0||hp>this.blocks[i].maxHp)throw new Error('ブロックの中断データが不正です。');this.blocks[i].hp=hp;});
  this.core.hp=s.coreHP;this.time=s.time;this.lives=s.lives;this.paddleX=finite(s.paddleX,0,400)?s.paddleX:200;this.targetX=this.paddleX;
  this.misses=finite(s.misses,0,1e7)?s.misses:0;this.broken=this.blocks.filter(b=>!b.hp).length;this.bestCombo=finite(s.bestCombo,0,10000)?s.bestCombo:0;
  this.balls=s.balls.map(b=>({...b,r:BALL_RADIUS,horizontalTime:finite(b.horizontalTime,0,HORIZONTAL_STALL_SECONDS)?b.horizontalTime:0}));this.barrierActive=!!s.barrierActive;this.combo=finite(s.combo,0,this.blocks.length)?s.combo:0;
  this.status=['ready','playing'].includes(s.status)?s.status:'ready';
  if(!this.core.hp&&!this.finale)throw new Error('クリア済みの中断データです。');
 }
}
