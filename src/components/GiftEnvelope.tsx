import {useEffect,useRef,useState} from 'react';
import type {GiftConfig} from '../data/settings';
export default function GiftEnvelope({gift,onRead,onOpen}:{gift:GiftConfig;onRead:()=>void;onOpen:()=>void}){
 const [opening,O]=useState(false),done=useRef(false),skip=useRef<HTMLButtonElement>(null);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function finish(){if(done.current)return;done.current=true;onRead()}
 useEffect(()=>{if(!opening)return;skip.current?.focus();const timer=window.setTimeout(finish,reduced?100:1150);return()=>window.clearTimeout(timer)},[opening]);
 return <div className="shade gift-reveal-shade"><article role="dialog" aria-modal="true" aria-label="等待拆开的信" className="envelope-dialog crafted-envelope"><label>A LETTER, JUST FOR YOU</label><div className={'envelope-stage'+(opening?' is-opening':'')} aria-hidden="true"><div className="envelope-back"/><div className="envelope-paper"><i/><i/><i/><b>致 {gift.to}</b></div><div className="envelope-front"/><div className="envelope-flap"/><div className="wax-seal">M</div></div><h2>{opening?'让心意，慢慢展开。':'有人，认真地给你写了封信。'}</h2><p>致 {gift.to} · 来自 {gift.from}</p><p className="envelope-whisper" role="status">{opening?'封口已打开，信纸正在展开……':'一路找来的小惊喜，现在交到你手里。'}</p>{opening?<button ref={skip} className="skip-reveal" onClick={finish}>直接阅读</button>:<button onClick={()=>{onOpen();O(true)}}>拆开这封信 <span aria-hidden="true">→</span></button>}</article></div>;
}
