import {gift} from './gift';
export type GiftConfig=typeof gift & {mode:'normal'|'birthday'|'newyear';question:string;answer:string; hiding:string};
export const defaults:GiftConfig={...gift,mode:'normal',question:'我们第一次见面是在哪个季节？',answer:'夏天',hiding:'drawer'};
export function readGift():GiftConfig|null{try{const raw=new URLSearchParams(location.hash.slice(1)).get('gift');if(!raw)return null;const c=JSON.parse(raw);if(!['normal','birthday','newyear'].includes(c.mode)||!['drawer','shelf','plant'].includes(c.hiding)||['to','from','title','message','question','answer'].some(k=>typeof c[k]!=='string'||!c[k].trim()))return null;return c}catch{return null}}
export function shareLink(c:GiftConfig){return location.href.split('#')[0]+'#'+new URLSearchParams({gift:JSON.stringify(c)}).toString()}

export function saveDraft(c:GiftConfig){try{localStorage.setItem('momentgift-draft',JSON.stringify(c));return true}catch{return false}}
export function loadDraft():GiftConfig{try{const raw=localStorage.getItem('momentgift-draft');if(raw){const c=JSON.parse(raw);if(['normal','birthday','newyear'].includes(c.mode)&&['drawer','shelf','plant'].includes(c.hiding)&&['to','from','title','message','question','answer'].every(k=>typeof c[k]==='string'))return c}}catch{}return {...defaults}}
