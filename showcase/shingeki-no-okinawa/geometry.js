export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dot=(a,b)=>a.x*b.x+a.y*b.y;
export const length=v=>Math.hypot(v.x,v.y);
export function bounds(points){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};}
export function inRing(x,y,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function inPolygons(x,y,polygons){return polygons.some(poly=>inRing(x,y,poly[0])&&!poly.slice(1).some(r=>inRing(x,y,r)));}
export function polygonArea(r){let a=0;for(let i=1;i<r.length;i++)a+=r[i-1][0]*r[i][1]-r[i][0]*r[i-1][1];return Math.abs(a/2);}
export function centroid(r){const b=bounds(r);return [(b.minX+b.maxX)/2,(b.minY+b.maxY)/2];}
export function reflect(v,n){const d=dot(v,n);return {x:v.x-2*d*n.x,y:v.y-2*d*n.y};}
export function sweepPoint(p,d,c,r){
 const x=p.x-c.x,y=p.y-c.y,A=d.x*d.x+d.y*d.y,B=2*(x*d.x+y*d.y),C=x*x+y*y-r*r;
 if(A<1e-12)return null;
 if(C<-.0001){const m=Math.hypot(x,y)||1,n={x:x/m,y:y/m};return dot(d,n)<0?{t:0,n}:null;}
 const disc=B*B-4*A*C;if(disc<0)return null;const t=(-B-Math.sqrt(disc))/(2*A);
 if(t<-.0000001||t>1)return null;
 const nx=x+d.x*t,ny=y+d.y*t,m=Math.hypot(nx,ny)||1;
 return {t:Math.max(0,t),n:{x:nx/m,y:ny/m}};
}
export function sweepSegment(p,d,a,b,r){
 const ex=b[0]-a[0],ey=b[1]-a[1],len=Math.hypot(ex,ey);if(len<1e-8)return sweepPoint(p,d,{x:a[0],y:a[1]},r);
 const tx=ex/len,ty=ey/len,nx=-ty,ny=tx,dist=(p.x-a[0])*nx+(p.y-a[1])*ny,vel=d.x*nx+d.y*ny;
 let best=null;
 for(const sign of [-1,1]){
  if(vel*sign>=-1e-10)continue;
  const t=(sign*r-dist)/vel;if(t<-.0000001||t>1)continue;
  const at=(p.x+d.x*t-a[0])*tx+(p.y+d.y*t-a[1])*ty;
  if(at>=0&&at<=len){const hit={t:Math.max(0,t),n:{x:nx*sign,y:ny*sign}};if(!best||hit.t<best.t)best=hit;}
 }
 for(const q of [a,b]){const hit=sweepPoint(p,d,{x:q[0],y:q[1]},r);if(hit&&(!best||hit.t<best.t))best=hit;}
 return best;
}
export function sweepRect(p,d,rect,r){
 if(Math.max(p.x,p.x+d.x)+r<rect.x||Math.min(p.x,p.x+d.x)-r>rect.x+rect.w||Math.max(p.y,p.y+d.y)+r<rect.y||Math.min(p.y,p.y+d.y)-r>rect.y+rect.h)return null;
 const a=[rect.x,rect.y],b=[rect.x+rect.w,rect.y],c=[rect.x+rect.w,rect.y+rect.h],e=[rect.x,rect.y+rect.h];
 let best=null;for(const [u,v] of [[a,b],[b,c],[c,e],[e,a]]){const h=sweepSegment(p,d,u,v,r);if(h&&(!best||h.t<best.t))best=h;}return best;
}
// Rendering and collision use the same closed rings, including holes and concave coasts.
export function blockShape(rings,extra={}){
 const b=bounds(rings.flat()),segments=[];
 for(const ring of rings)for(let i=1;i<ring.length;i++)if(Math.hypot(ring[i][0]-ring[i-1][0],ring[i][1]-ring[i-1][1])>1e-7)segments.push([ring[i-1],ring[i]]);
 return {x:b.minX,y:b.minY,w:b.maxX-b.minX,h:b.maxY-b.minY,rings,segments,...extra};
}
export function sweepBlock(p,d,block,r){
 if(Math.max(p.x,p.x+d.x)+r<block.x||Math.min(p.x,p.x+d.x)-r>block.x+block.w||Math.max(p.y,p.y+d.y)+r<block.y||Math.min(p.y,p.y+d.y)-r>block.y+block.h)return null;
 let best=null;
 for(const [a,b] of block.segments){const h=sweepSegment(p,d,a,b,r);if(h&&(!best||h.t<best.t))best=h;}
 return best;
}
export function rotatePoint(p,a){const c=Math.cos(a),s=Math.sin(a);return [p[0]*c-p[1]*s,p[0]*s+p[1]*c];}

export class Geography{
 constructor(data){this.data=data;this.byId=new Map();this.chapters=data.chapters;
  for(const p of data.prefectures){this.byId.set(p.id,{...p,rings:p.polygons.map(poly=>poly.map(refs=>this.stitch(refs)))});}
 }
 stitch(refs){const out=[];for(const ref of refs){let arc=this.data.arcs[ref>=0?ref:~ref];if(ref<0)arc=[...arc].reverse();out.push(...(out.length?arc.slice(1):arc));}if(out.length&&(out[0][0]!==out.at(-1)[0]||out[0][1]!==out.at(-1)[1]))out.push(out[0]);return out;}
 get(id){return this.byId.get(id);}
 project([lon,lat]){return [(lon-133)*.82,36-lat];}
 // Translations compact remote islands; outlines and open sea are preserved.
 islandShift(ring,id){const [lon,lat]=centroid(ring);if(id===13&&lat<35.3)return [0,35.15+(lat-35.15)*.12-lat];if(lat>=30||lon>136)return [0,0];return [(130.4+(lon-130.4)*.38)-lon,(30+(lat-30)*.32)-lat];}
 makePaddle(ids,angle=0,W=400){
  if(!ids.length){const r=[[-36,-5],[36,-5],[36,5],[-36,5],[-36,-5]];return this.finishPaddle([{id:0,rings:[r]}],angle,36.4,true);}
  const parts=[],used=new Map();
  for(const id of ids){const p=this.get(id);if(!p)continue;
   p.rings.forEach((rings,i)=>{const shift=this.islandShift(rings[0],id);const projected=rings.map(r=>r.map(([x,y])=>this.project([x+shift[0],y+shift[1]])));parts.push({id,rings:projected,refs:p.polygons[i],shift});
    for(const rr of p.polygons[i])for(const ref of rr){const index=ref>=0?ref:~ref;used.set(index,(used.get(index)||0)+1);}
   });
  }
  const all=parts.flatMap(p=>p.rings.flat()),b=bounds(all),cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2;
  const radius=Math.max(...all.map(([x,y])=>Math.hypot(x-cx,y-cy))),desired=(.22+.38*Math.sqrt((ids.length-1)/46))*W/2,scale=desired/radius;
  const segs=[];
  for(const p of parts){for(const rr of p.refs)for(const ref of rr){const index=ref>=0?ref:~ref;if(used.get(index)>1)continue;let arc=this.data.arcs[index];if(ref<0)arc=[...arc].reverse();for(let i=1;i<arc.length;i++){const transform=q=>{const a=this.project([q[0]+p.shift[0],q[1]+p.shift[1]]);return [(a[0]-cx)*scale,(a[1]-cy)*scale];};segs.push([transform(arc[i-1]),transform(arc[i])]);}}p.rings=p.rings.map(r=>r.map(([x,y])=>[(x-cx)*scale,(y-cy)*scale]));}
  return this.finishPaddle(parts,angle,desired,false,segs);
 }
 finishPaddle(parts,angle,radius,bar=false,segments=null){
  const rad=angle*Math.PI/180;
  if(!segments){segments=[];for(const p of parts)for(const r of p.rings)for(let i=1;i<r.length;i++)segments.push([r[i-1],r[i]]);}
  const ps=parts.map(p=>({id:p.id,rings:p.rings.map(r=>r.map(q=>rotatePoint(q,rad)))}));
  return {parts:ps,segments:segments.map(s=>s.map(q=>rotatePoint(q,rad))),bounds:bounds(ps.flatMap(p=>p.rings.flat())),radius,angle,bar};
 }
 stageShape(id,W=400){
  const p=this.get(id);let polys=p.rings.map(rings=>{const shift=this.islandShift(rings[0],id);return rings.map(r=>r.map(([x,y])=>this.project([x+shift[0],y+shift[1]])));});
  const main=p.rings.reduce((a,b)=>polygonArea(a[0])>polygonArea(b[0])?a:b),shift=this.islandShift(main[0],id);
  const core=this.project([p.capitalPoint[0]+shift[0],p.capitalPoint[1]+shift[1]]);
  const bb=bounds([...polys.flat(2),core]),scale=Math.min((W-62)/(bb.maxX-bb.minX),244/(bb.maxY-bb.minY)),offsetX=(W-(bb.maxX-bb.minX)*scale)/2-bb.minX*scale,offsetY=65-bb.minY*scale;
  polys=polys.map(poly=>poly.map(r=>r.map(([x,y])=>[x*scale+offsetX,y*scale+offsetY])));
  return {polygons:polys,core:{x:core[0]*scale+offsetX,y:core[1]*scale+offsetY},bounds:bounds(polys.flat(2))};
 }
}
