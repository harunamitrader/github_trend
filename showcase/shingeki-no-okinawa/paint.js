import {WIDTH,HEIGHT,BARRIER_Y} from './engine.js';
import {bounds,clamp} from './geometry.js';
// Stable per-prefecture colors; the same land keeps its color everywhere.
export const prefectureColor=id=>id?`hsl(${Math.round((id*137.508+12)%360)} 72% ${id%2?64:58}%)`:'#26bdad';
export function pathRings(ctx,rings){ctx.beginPath();for(const ring of rings){ring.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}}
export function fitCanvas(canvas,w,h){const dpr=Math.min(globalThis.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return ctx;}
export function svgPath(polys,transform=p=>p){return polys.map(poly=>poly.map(r=>r.map((p,i)=>`${i?'L':'M'}${transform(p).map(n=>n.toFixed(2)).join(',')}`).join('')+'Z').join('')).join('');}
export function smallShape(geo,id,width=130,height=105){const p=geo.get(id),points=p.rings.flat(2),b=bounds(points),s=Math.min((width-14)/((b.maxX-b.minX)*.82),(height-14)/(b.maxY-b.minY));const f=([x,y])=>[width/2+(x-(b.minX+b.maxX)/2)*s*.82,height/2-(y-(b.minY+b.maxY)/2)*s];const c=f(p.capitalPoint);return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><path d="${svgPath(p.rings,f)}" fill="currentColor" fill-rule="evenodd"/><circle cx="${c[0]}" cy="${c[1]}" r="3.5" fill="#ff516d" stroke="#fff" stroke-width="1.5"/></svg>`;}
export function drawPaddle(ctx,paddle,x,y,geo,{scale=1,highlight=0,alpha=1,reveal=1}={}){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha=alpha;
 for(const part of paddle.parts){ctx.save();if(part.id===highlight){ctx.globalAlpha=alpha*reveal;ctx.translate(0,-50*(1-reveal)/scale);}pathRings(ctx,part.rings);ctx.fillStyle=prefectureColor(part.id);ctx.fill('evenodd');ctx.strokeStyle='#ffffff';ctx.lineWidth=1/scale;ctx.stroke();ctx.restore();}
 if(reveal>=1){ctx.beginPath();for(const [a,b] of paddle.segments){ctx.moveTo(...a);ctx.lineTo(...b);}ctx.strokeStyle='#243b57';ctx.lineWidth=1.1/scale;ctx.stroke();}ctx.restore();
}
export function drawDial(canvas,paddle,geo){
 const ctx=fitCanvas(canvas,360,258);ctx.clearRect(0,0,360,258);ctx.strokeStyle='#b5dae3';ctx.lineWidth=1.5;
 for(let i=0;i<72;i++){const a=i/72*Math.PI*2,r=i%18===0?107:i%3===0?114:118;ctx.beginPath();ctx.moveTo(180+Math.cos(a)*r,128+Math.sin(a)*r);ctx.lineTo(180+Math.cos(a)*122,128+Math.sin(a)*122);ctx.stroke();}
 ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(26,128);ctx.lineTo(334,128);ctx.moveTo(180,9);ctx.lineTo(180,247);ctx.stroke();ctx.setLineDash([]);
 drawPaddle(ctx,paddle,180,128,geo,{scale:Math.min(1.7,98/paddle.radius)});
 const a=(paddle.angle-90)*Math.PI/180;ctx.fillStyle='#ff765c';ctx.beginPath();ctx.arc(180+Math.cos(a)*122,128+Math.sin(a)*122,5,0,Math.PI*2);ctx.fill();
 // Keep north attached to the same rotation as the paddle and its rim marker.
 ctx.fillStyle='#22758b';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('北',180+Math.cos(a)*106,128+Math.sin(a)*106);
}
export class Painter{
 constructor(canvas,game,options){this.canvas=canvas;this.game=game;this.options=options;this.ctx=fitCanvas(canvas,WIDTH,HEIGHT);this.particles=[];this.rings=[];this.notice='';this.noticeTime=0;}
 event(e){
  if(['hit','core','shield','bounce'].includes(e.type)){
   const big=e.type==='core',shield=e.type==='shield',count=this.options.reduced?0:big?66:shield?24:e.destroyed?9:3;
   const palette=big?['#ff5179','#ffb72c','#fd758a','#6dcebb']:shield?['#25b5ed','#8adbff','#4199eb']:e.type==='bounce'?['#24bfae']:['#ffbc4c','#ff9273'];
   for(let i=0;i<count;i++){const a=i/count*Math.PI*2+(e.x||0)*.01,s=big?70+(i%15)*12:shield?70+(i%9)*13:30+i*9;this.particles.push({x:e.x,y:e.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:big?1.2:shield?.75:.45,maxLife:big?1.2:shield?.75:.45,color:palette[i%palette.length],size:big?3+i%4:shield?4+i%3:3,shard:shield,rotation:a});}
   if((big||shield)&&!this.options.reduced)this.rings.push({x:e.x,y:e.y,life:big?.85:.55,maxLife:big?.85:.55,color:big?'#ff6984':'#2ab4ee',maxRadius:big?105:62});
   if(shield){this.notice='パリン！ あと1回！';this.noticeTime=1.3;}
   if(big){this.notice='やったー！ 核をこわした！';this.noticeTime=1.3;}
  }
  if(e.type==='extra'){this.notice='ボール ＋1';this.noticeTime=1.4;}
  if(e.type==='unstuck'){this.notice='横の往復から脱出';this.noticeTime=1.4;}
  if(e.type==='barrier-on'){this.notice='バリア展開！ 落下を1回ガード';this.noticeTime=1.6;}
  if(e.type==='barrier-save'){
   this.notice='バリアでセーフ！';this.noticeTime=1.3;
   if(!this.options.reduced)for(let i=0;i<30;i++){const life=.65;this.particles.push({x:10+i*13,y:BARRIER_Y,vx:(i-15)*4,vy:-50-(i%5)*15,life,maxLife:life,color:i%2?'#35bfd6':'#8cedf4',size:3,shard:true,rotation:i});}
  }
  if(e.type==='notice'){this.notice=e.text;this.noticeTime=2.3;}
  if(e.type==='miss'){this.notice='ドンマイ！ もう1球！';this.noticeTime=1.4;}
 }
 draw(dt=0){
  const ctx=this.ctx,g=this.game;ctx.clearRect(0,0,WIDTH,HEIGHT);
  ctx.fillStyle='#ecf9ff';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#c1e4f3';
  for(let x=20;x<WIDTH;x+=30)for(let y=49;y<HEIGHT-15;y+=30){ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();}
  ctx.strokeStyle='#6faece';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(5,36);ctx.lineTo(5,570);ctx.moveTo(395,36);ctx.lineTo(395,570);ctx.stroke();
  ctx.font='12px system-ui';ctx.fillStyle='#487580';ctx.textAlign='left';ctx.fillText(g.practice?'おためし中':g.finale?'巨大な沖縄県で、ひと遊び':g.core.hp===2?'① シールド → ② 赤い核':g.core.hp===1?'あと1回！ 赤い核をねらおう':'クリア！',16,23);
  ctx.textAlign='right';ctx.fillText(g.finale?`${Math.max(0,Math.ceil(60-g.time))} 秒`:`${Math.floor(g.time/60)}:${String(Math.floor(g.time%60)).padStart(2,'0')}`,WIDTH-16,23);
  if(!g.finale){ctx.fillStyle='#d5eff1';ctx.strokeStyle='#8bc6cd';ctx.lineWidth=1.1;for(const poly of g.stage.polygons){pathRings(ctx,poly);ctx.fill('evenodd');ctx.stroke();}}
  for(const b of g.blocks){
   if(!b.hp)continue;
   const fill=b.kind==='extra'?'#ffc34f':b.kind==='barrier'?'#65d8ec':prefectureColor(g.id);
   ctx.save();ctx.translate(0,1.8);pathRings(ctx,b.rings);ctx.fillStyle='#73a5af55';ctx.fill('evenodd');ctx.restore();
   pathRings(ctx,b.rings);ctx.fillStyle=fill;ctx.fill('evenodd');ctx.strokeStyle='#24406085';ctx.lineWidth=1;ctx.stroke();
   if(b.kind!=='normal'){
    ctx.save();pathRings(ctx,b.rings);ctx.clip('evenodd');const [x,y]=b.icon,size=Math.min(b.w,b.h,22);
    ctx.fillStyle='#675020';ctx.textAlign='center';ctx.textBaseline='middle';
    if(b.kind==='extra'){ctx.font=`900 ${Math.max(8,size*.56)}px system-ui`;ctx.fillText('+1',x,y);}
    else{const r=Math.min(5,size*.3);ctx.strokeStyle='#20738b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-r,y-r*.9);ctx.lineTo(x+r,y-r*.9);ctx.lineTo(x+r*.85,y+r*.3);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.85,y+r*.3);ctx.closePath();ctx.stroke();}
    ctx.restore();
   }
  }
  if(g.core.hp>0){const c=g.core;
   if(c.hp===2){ctx.fillStyle='#66d8ff44';ctx.strokeStyle='#279bdb';ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.x,c.y,c.shieldR,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.x,c.y,c.shieldR-2,Math.PI*1.05,Math.PI*1.55);ctx.stroke();}
   ctx.save();ctx.shadowColor='#ff6981';ctx.shadowBlur=this.options.reduced?0:Math.min(3,c.r*.6);ctx.fillStyle='#ff4263';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle='#ffe4ea';ctx.beginPath();ctx.arc(c.x-c.r*.26,c.y-c.r*.34,c.r*.27,0,Math.PI*2);ctx.fill();
  }
  drawPaddle(ctx,g.paddle,g.paddleX,g.paddleY,g.geo);
  if(g.status==='ready'){ctx.fillStyle='#4d7f8e';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('左右に動かして、発射！',200,Math.min(560,g.paddleY+g.paddle.bounds.maxY+37));}
  for(const b of g.balls){ctx.save();ctx.shadowColor='#379dca';ctx.shadowBlur=this.options.reduced?0:7;ctx.fillStyle='#fff';ctx.strokeStyle='#267895';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();}
  for(const ring of this.rings){ring.life-=dt;const t=1-ring.life/ring.maxLife;ctx.globalAlpha=clamp(1-t,0,1);ctx.strokeStyle=ring.color;ctx.lineWidth=4*(1-t)+1;ctx.beginPath();ctx.arc(ring.x,ring.y,12+t*ring.maxRadius,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;this.rings=this.rings.filter(r=>r.life>0);
  for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.rotation+=dt*3;ctx.save();ctx.globalAlpha=clamp(p.life/p.maxLife*2,0,1);ctx.fillStyle=p.color;ctx.translate(p.x,p.y);ctx.rotate(p.rotation);if(p.shard){ctx.beginPath();ctx.moveTo(-p.size/2,-p.size/2);ctx.lineTo(p.size,0);ctx.lineTo(0,p.size);ctx.closePath();ctx.fill();}else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);ctx.restore();}this.particles=this.particles.filter(p=>p.life>0);
  if(this.noticeTime>0){this.noticeTime-=dt;ctx.font='bold 16px system-ui';ctx.textAlign='center';const w=ctx.measureText(this.notice).width+30;ctx.fillStyle='#ffffffee';ctx.strokeStyle='#243b57';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(200-w/2,347,w,38,18);ctx.fill();ctx.stroke();ctx.fillStyle='#243b57';ctx.fillText(this.notice,200,372);}
  if(g.combo>=3&&g.status==='playing'){ctx.fillStyle='#c47024';ctx.textAlign='right';ctx.font='bold 18px system-ui';ctx.fillText(`${g.combo} 連続！`,378,335);}
  if(g.barrierActive){
   ctx.save();ctx.shadowColor='#39cfe4';ctx.shadowBlur=this.options.reduced?0:10;ctx.strokeStyle='#32bcd4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,BARRIER_Y);ctx.lineTo(WIDTH,BARRIER_Y);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#e7ffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,BARRIER_Y-1);ctx.lineTo(WIDTH,BARRIER_Y-1);ctx.stroke();ctx.restore();
  }else{ctx.strokeStyle='#f6a4a7';ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(16,HEIGHT-3);ctx.lineTo(WIDTH-16,HEIGHT-3);ctx.stroke();ctx.setLineDash([]);}
 }
}
