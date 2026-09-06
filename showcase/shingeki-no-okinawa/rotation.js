// Shortest signed turn, including swipes across the -180° / 180° seam.
export const angularDelta=(from,to)=>((to-from+540)%360)-180;
export const coastStep=(velocity,dt)=>({delta:velocity*(1-Math.exp(-5*dt))/5,velocity:velocity*Math.exp(-5*dt)});
export function bindRotation(canvas,{getAngle,setAngle,reducedMotion=false}){
 let drag=null,raf=0;
 const stop=()=>{cancelAnimationFrame(raf);raf=0;drag=null;};
 const point=e=>{const b=canvas.getBoundingClientRect();return {x:e.clientX-b.left-b.width/2,y:e.clientY-b.top-b.height/2};};
 canvas.addEventListener('pointerdown',e=>{
  if(drag)return;stop();canvas.setPointerCapture(e.pointerId);
  const p=point(e);drag={id:e.pointerId,p,polar:Math.atan2(p.y,p.x)*180/Math.PI,ring:Math.hypot(p.x,p.y)>45,time:e.timeStamp,velocity:0};
 });
 canvas.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const p=point(e),polar=Math.atan2(p.y,p.x)*180/Math.PI;
  const delta=drag.ring&&Math.hypot(p.x,p.y)>30?angularDelta(drag.polar,polar):(p.x-drag.p.x)*1.2;
  const dt=Math.max(.008,(e.timeStamp-drag.time)/1000);
  drag.velocity=Math.max(-1080,Math.min(1080,delta/dt));drag.p=p;drag.polar=polar;drag.time=e.timeStamp;
  setAngle(getAngle()+delta);
 });
 canvas.addEventListener('pointerup',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  let velocity=e.timeStamp-drag.time<90?drag.velocity:0,last=performance.now();drag=null;
  if(reducedMotion)return;
  const coast=now=>{
   if(!canvas.isConnected)return;
   const step=coastStep(velocity,Math.min(.05,(now-last)/1000));last=now;velocity=step.velocity;
   setAngle(getAngle()+step.delta);
   if(Math.abs(velocity)>3)raf=requestAnimationFrame(coast);
  };
  raf=requestAnimationFrame(coast);
 });
 canvas.addEventListener('pointercancel',stop);
 return stop;
}
