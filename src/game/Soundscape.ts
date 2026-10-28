import {pathDistance} from './gardenPaths';
import {foleySamples,type FoleyKind} from '../audio/foley';
import type {Mode} from './themes';
import {indoors} from './perspective';
export type SoundCue='wood'|'paper'|'key'|'unlock'|'seal'|'letter'|'door';
type Listener={x:number;y:number;moving:boolean;locked?:boolean};
/** Quiet, local Web Audio foley. Created only after a button gesture; no downloads or microphone. */
export class Soundscape{
 private captureDestination?:MediaStreamAudioDestinationNode;private cache=new Map<string,AudioBuffer>();private take=0;private oneShots=new Set<AudioBufferSourceNode>();constructor(private mode:Mode='normal'){}
 private context?:AudioContext;private master?:GainNode;private wind?:GainNode;private water?:GainNode;private windFilter?:BiquadFilterNode;private noiseBuffer?:AudioBuffer;private loops:AudioBufferSourceNode[]=[];private last?:Listener;private stride=0;private foot=0;private nextBird=0;private doorNear=false;private enabled=false;private disposed=false;
 recordingAudio(){if(!this.context||!this.master)return undefined;if(!this.captureDestination){this.captureDestination=this.context.createMediaStreamDestination();this.master.connect(this.captureDestination)}return this.captureDestination.stream}
 get active(){return this.enabled}
 async enable(){
  if(this.disposed)return false;
  try{
   if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=.7;this.master.connect(this.context.destination);this.noiseBuffer=this.makeNoise(4);
    const ambient=(hz:number,gain:number)=>{const source=this.context!.createBufferSource();source.buffer=this.noiseBuffer!;source.loop=true;const filter=this.context!.createBiquadFilter();filter.type='lowpass';filter.frequency.value=hz;const volume=this.context!.createGain();volume.gain.value=gain;source.connect(filter).connect(volume).connect(this.master!);source.start();this.loops.push(source);return {volume,filter}};
    const breeze=ambient(650,.012);this.wind=breeze.volume;this.windFilter=breeze.filter;this.water=ambient(1600,0).volume;
   }
   await this.context.resume();if(this.disposed)return false;this.enabled=this.context.state==='running';this.nextBird=this.context.currentTime+4;this.last=undefined;return this.enabled;
  }catch{this.enabled=false;return false}
 }
 async mute(){for(const source of this.oneShots){try{source.stop()}catch{}}this.oneShots.clear();this.enabled=false;this.last=undefined;try{await this.context?.suspend()}catch{/* Device disappeared; remain muted. */}}
 private makeNoise(seconds:number){const ctx=this.context!,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*seconds),ctx.sampleRate),data=buffer.getChannelData(0);let smooth=0,seed=2731;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/4294967296*2-1;smooth=(smooth+white*.025)/1.025;data[i]=smooth*3.5+white*.18}const edge=Math.min(2048,data.length/8);for(let i=0;i<edge;i++){const blend=i/edge,dataEnd=data.length-edge+i;data[dataEnd]=data[dataEnd]*(1-blend)+data[i]*blend}for(let i=0;i<256;i++){data[i]*=i/256;data[data.length-1-i]*=i/256}return buffer}
 private tone(at:number,hz:number,duration:number,amount:number,end=hz){const ctx=this.context!,tone=ctx.createOscillator(),gain=ctx.createGain();tone.type='sine';tone.frequency.setValueAtTime(hz,at);tone.frequency.exponentialRampToValueAtTime(end,at+duration);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(amount,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);tone.connect(gain).connect(this.master!);tone.start(at);tone.stop(at+duration+.02);tone.onended=()=>{tone.disconnect();gain.disconnect()}}
 private sample(kind:FoleyKind,amount:number){const ctx=this.context!,take=this.take++%3,key=kind+take;let buffer=this.cache.get(key);if(!buffer){const data=foleySamples(kind,ctx.sampleRate,431+take*173);buffer=ctx.createBuffer(1,data.length,ctx.sampleRate);buffer.getChannelData(0).set(data);this.cache.set(key,buffer)}const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;source.playbackRate.value=.98+take*.02+(Math.random()-.5)*.018;gain.gain.value=amount*(.94+Math.random()*.12);source.connect(gain).connect(this.master!);this.oneShots.add(source);source.onended=()=>{source.disconnect();gain.disconnect();this.oneShots.delete(source)};source.start(ctx.currentTime+.005)}
 effect(cue:SoundCue){if(!this.enabled||!this.context||this.context.state!=='running')return;
  if(cue==='letter'){const t=this.context.currentTime+.005;for(const [i,f]of [523.25,659.25,783.99].entries())this.tone(t+i*.19,f,.85,.009);return}
  const kind:FoleyKind=cue==='wood'?'drawer':cue==='unlock'?'latch':cue;
  this.sample(kind,kind==='key'?.17:kind==='paper'||kind==='seal'?.15:.2);
 }

 update(p:Listener){
  if(!this.enabled||!this.context)return;const ctx=this.context,t=ctx.currentTime,inside=indoors(p.x,p.y);
  this.wind?.gain.setTargetAtTime(inside?.0035:.012*(.9+.1*Math.sin(t*.29)),t,.7);this.windFilter?.frequency.setTargetAtTime(inside?250:650,t,.8);const pond=Math.max(0,1-Math.hypot(p.x-608,p.y-106)/145);this.water?.gain.setTargetAtTime(inside?0:pond*.025,t,.6);
  if(this.last&&p.moving&&!p.locked){const delta=Math.hypot(p.x-this.last.x,p.y-this.last.y);if(delta<20)this.stride+=delta;if(this.stride>=21){this.stride%=21;this.foot++;this.sample(inside?'woodStep':pathDistance(p.x/20,p.y/20)<.7?'stoneStep':'grassStep',inside?.2:.17)}}else this.stride=0;
  const door=Math.hypot(p.x-294,p.y-233)<48;if(door!==this.doorNear&&this.last)this.effect('door');this.doorNear=door;
  if(!inside&&this.mode!=='newyear'&&t>this.nextBird){this.nextBird=t+11+(this.foot%7);this.sample('bird',.025)}this.last={...p};
 }
 async dispose(){this.disposed=true;this.enabled=false;for(const source of this.loops){try{source.stop()}catch{/* Already stopped. */}}this.loops=[];for(const source of this.oneShots){try{source.stop()}catch{}}this.oneShots.clear();this.cache.clear();try{await this.context?.close()}catch{/* Already closed. */}}
}
