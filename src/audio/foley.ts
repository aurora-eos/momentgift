export type FoleyKind='woodStep'|'stoneStep'|'grassStep'|'paper'|'drawer'|'door'|'latch'|'key'|'seal'|'bird';
export const foleyDuration:Record<FoleyKind,number>={woodStep:.26,stoneStep:.22,grassStep:.3,paper:.48,drawer:.56,door:.62,latch:.24,key:.4,seal:.5,bird:.32};
/** Band-limited noise and damped resonances, with small seeded variations per take. */
export function foleySamples(kind:FoleyKind,rate:number,seed:number){
 const duration=foleyDuration[kind],samples=new Float32Array(Math.ceil(duration*rate));let low=0,mid=0,phase=0;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1};const variation=1+random()*.045;
 const ring=(t:number,hz:number,decay:number)=>t<0||hz>=rate*.45?0:Math.sin(t*hz*variation*Math.PI*2)*Math.exp(-t/decay);
 for(let i=0;i<samples.length;i++){
  const t=i/rate,white=random();low+=Math.min(.95,550/rate)*(white-low);mid+=Math.min(.95,3600/rate)*(white-mid);const scratch=mid-low;
  let value=0;
  if(kind==='woodStep')value=.37*ring(t,82,.032)+.15*ring(t,147,.045)+low*.9*Math.exp(-t/.045)+scratch*.16*Math.exp(-Math.max(0,t-.03)/.065);
  else if(kind==='stoneStep')value=.16*ring(t,180,.022)+.08*ring(t,620,.009)+scratch*.35*Math.exp(-t/.027)+low*.35*Math.exp(-t/.04);
  else if(kind==='grassStep')value=.14*ring(t,57,.03)+scratch*(.35+.22*Math.sin(t*107))*Math.sin(Math.PI*Math.min(1,t/.23))*Math.exp(-t/.17);
  else if(kind==='paper'||kind==='seal'){const grain=.32+.2*Math.sin(t*73)+.15*Math.sin(t*139);value=scratch*grain*Math.pow(Math.sin(Math.PI*t/duration),.7);if(kind==='seal')value+=scratch*.6*Math.exp(-Math.abs(t-.065)/.008)}
  else if(kind==='drawer'||kind==='door'){value=(low*.65+scratch*.1)*(.45+.2*Math.sin(t*41))*Math.sin(Math.PI*t/duration);value+=.15*ring(t-.02,kind==='door'?93:175,.035)+.2*ring(t-duration*.78,kind==='door'?126:211,.03)}
  else if(kind==='latch')value=scratch*.5*Math.exp(-t/.028)+.2*ring(t,1670,.02)+.19*ring(t-.07,198,.035);
  else if(kind==='key'){for(const [j,f]of [2170,3540,5030,6170].entries()){value+=ring(t,f,.075-j*.012)*.12/(j+1)+ring(t-.095,f*1.07,.045-j*.008)*.095/(j+1)}value+=scratch*.12*Math.exp(-t/.012)}
  else{const chirp=Math.max(0,Math.sin(Math.PI*Math.min(1,t/.095)))+Math.max(0,Math.sin(Math.PI*Math.max(0,Math.min(1,(t-.15)/.13))));const hz=Math.min(rate*.35,2550+650*Math.sin(t*29)+230*Math.sin(t*79));phase+=Math.PI*2*hz/rate;value=(Math.sin(phase)+.13*Math.sin(phase*2)+scratch*.08)*chirp*.32}
  const edge=Math.min(1,i/(rate*.006),(samples.length-1-i)/(rate*.015));samples[i]=Math.max(-.85,Math.min(.85,value*edge));
 }
 return samples;
}
