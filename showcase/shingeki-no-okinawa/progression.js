export const CHAPTER_NAMES=['沖縄','九州','四国','中国','近畿','中部','関東','東北','北海道'];
export const CHAPTER_LINES=[
 '沖縄県「もっと、でっかい県になりたい。」都道府県をひとつずつ吸収して、日本まるごと沖縄県を目指す。まずは自分の形を完成させよう。',
 '沖縄県「鹿児島さん、その半島いただきます。」九州を吸収すれば、沖縄県はぐっと大きくなる。',
 '沖縄県「次は四国。うどんも一緒に吸収していい？」県も名物も、だいたい欲しい。',
 '沖縄県「本州、長いな。食べきれるかな。」大丈夫。ひと県ずつなら、たぶんいける。',
 '沖縄県「吸収しすぎて、体がギザギザしてきた。」大きさと使いやすさは、別の話らしい。',
 '沖縄県「山も湾も半島も、ぜんぶ沖縄県にします。」いびつな巨大化は、まだまだ続く。',
 '沖縄県「東京も吸収したら、首都はどこになるんだろう。」とりあえず、那覇で。',
 '沖縄県「寒い。でも巨大化はやめられない。」東北を吸収したら、いよいよ北海道。',
 '沖縄県「北海道、その広さをまるごとください。」札幌の核を壊して、最後の大地を吸収しよう。'
];
export function chapterIndex(geo,cleared){const set=new Set(cleared);return geo.chapters.findIndex(c=>!c.every(id=>set.has(id)));}
export function availableIds(geo,cleared){
 const set=new Set(cleared),chapter=chapterIndex(geo,cleared);if(chapter<0)return [];
 if(chapter===0)return [47];if(chapter===8)return [1];
 const entries={1:46,2:38,3:33};
 return geo.chapters[chapter].filter(id=>!set.has(id)&&(id===entries[chapter]||geo.get(id).neighbors.some(n=>set.has(n))));
}
export const NEW_SAVE=()=>({version:5,cleared:[],angles:{},records:{},options:{sound:true,easy:false,reduced:false,sensitivity:1.3},current:null,seenChapters:[],finaleSeen:false});
export function validateSave(s){
 if(!s||![2,3,4,5].includes(s.version)||!Array.isArray(s.cleared)||s.cleared.some(n=>!Number.isInteger(n)||n<1||n>47))throw new Error('セーブデータの形式が違います。');
 const d=NEW_SAVE();d.cleared=[...new Set(s.cleared)];
 for(const [id,a] of Object.entries(s.angles||{}))if(+id>=1&&+id<=47&&Number.isFinite(a))d.angles[id]=((a%360)+360)%360;
 if(s.records&&typeof s.records==='object')for(const [id,r] of Object.entries(s.records)){if(+id<1||+id>47||!r||typeof r!=='object')continue;d.records[id]={};for(const mode of ['normal','easy','normalCheckpoint','easyCheckpoint']){const v=r[mode];if(v&&Number.isFinite(v.time)&&v.time>=0)d.records[id][mode]={time:v.time,noMiss:!!v.noMiss,timed:!!v.timed,angle:Number.isFinite(v.angle)?v.angle:0,broken:Number.isFinite(v.broken)?Math.max(0,v.broken):0,total:Number.isFinite(v.total)?Math.max(1,v.total):1,checkpoint:mode.endsWith('Checkpoint')};}}
 for(const k of ['sound','easy','reduced'])if(typeof s.options?.[k]==='boolean')d.options[k]=s.options[k];
 if(Number.isFinite(s.options?.sensitivity))d.options.sensitivity=Math.max(.5,Math.min(2.5,s.options.sensitivity));
 d.seenChapters=Array.isArray(s.seenChapters)?s.seenChapters.filter(v=>Number.isInteger(v)&&v>=0&&v<=8):[];
 d.finaleSeen=!!s.finaleSeen;
 if(s.current&&typeof s.current==='object'&&Number.isInteger(s.current.id)&&s.current.id>=1&&s.current.id<=47&&s.version===5&&s.current.format===5)d.current=s.current;
 return d;
}
export function recordClear(save,id,result){
 const first=!save.cleared.includes(id);if(first)save.cleared.push(id);
 const mode=(result.easy?'easy':'normal')+(result.checkpoint?'Checkpoint':''),old=save.records[id]?.[mode];
 const best=!old||result.time<old.time;
 save.records[id]={...save.records[id],[mode]:{...(best?result:old),noMiss:!!(old?.noMiss||result.noMiss),timed:!!(old?.timed||result.timed)}};
 save.current=null;return first;
}
