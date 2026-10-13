'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,ChefHat,Pause,Play,RotateCcw,Timer,X} from 'lucide-react';
import type {Meal} from '@/lib/kitchen';
import {foodForItem} from '@/lib/kitchen';
import StepText from './StepText';
import {portionLabel} from '@/lib/day-plan';
import {clock,secondsLeft,timeSuggestions} from '@/lib/cook-timer';
export default function CookingMode({meal,spoon,onClose}:{meal:Meal;spoon:number;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [step,setStep]=useState(0),[done,setDone]=useState<number[]>([]),[seasoned,setSeasoned]=useState<number[]>([]);
 const [minutes,setMinutes]=useState('3'),[left,setLeft]=useState(0),[deadline,setDeadline]=useState<number|null>(null),[timerStep,setTimerStep]=useState(0),[started,setStarted]=useState(false);
 useEffect(()=>{const d=dialog.current;d?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d?.close();document.body.style.overflow=overflow;};},[]);
 useEffect(()=>{if(deadline===null)return;const tick=()=>{const next=secondsLeft(deadline,Date.now());setLeft(next);if(next===0)setDeadline(null);};tick();const id=setInterval(tick,250);return()=>clearInterval(id);},[deadline]);
 const start=(seconds:number)=>{setLeft(seconds);setDeadline(Date.now()+seconds*1000);setStarted(true);setTimerStep(step);};
 const toggle=(index:number)=>setDone(a=>a.includes(index)?a.filter(i=>i!==index):[...a,index]);
 const complete=done.length===meal.steps.length;
 const valid=Number.isFinite(Number(minutes))&&Number(minutes)>=0.1&&Number(minutes)<=180;
 return <dialog ref={dialog} className="cook-dialog" aria-labelledby="cook-title" onCancel={e=>{e.preventDefault();onClose();}}>
  <div className="cook-top"><span><ChefHat size={19}/> 做饭模式 · {meal.label}</span><button className="icon" onClick={onClose} aria-label="退出做饭模式"><X/></button></div>
  <h2 id="cook-title">{meal.title}</h2>
  <div className="cook-progress"><span>已完成 {done.length} / {meal.steps.length} 步</span><progress value={done.length} max={meal.steps.length}/></div>
  <details className="cook-ingredients"><summary>查看食材与建议用量</summary><div className="food-list">{meal.items.map(i=><span key={i.id}>{foodForItem(i).name} <b>{portionLabel(i)}</b></span>)}</div></details>
  <section className="cook-current" key={step}><div className="row-between"><span className="step-kicker">STEP {String(step+1).padStart(2,'0')}</span><button className={'step-check '+(done.includes(step)?'checked':'')} aria-pressed={done.includes(step)} onClick={()=>toggle(step)}><Check size={17}/>{done.includes(step)?'已完成':'标记完成'}</button></div><StepText text={meal.steps[step]}/></section>
  <section className="cook-timer"><div className="row-between"><h3><Timer size={18}/> 厨房计时</h3><output className={started&&left===0?'timer-done':''} aria-label="剩余时间">{clock(left)}</output></div>
   {started&&left===0?<p role="alert" className="timer-alert">计时结束，请检查食物状态。</p>:started&&<p className="muted">第 {timerStep+1} 步的计时{deadline?'运行中':'已暂停'} · 切换步骤不会停止</p>}
   {timeSuggestions(meal.steps[step]).length>0&&<div className="timer-presets">{timeSuggestions(meal.steps[step]).map(t=><button className="small" key={t} disabled={deadline!==null} onClick={()=>start(t)}>{t>=60?`${t/60} 分钟`:`${t} 秒`} 参考计时</button>)}</div>}
   <div className="timer-controls"><label>自定分钟<input type="number" min="0.1" max="180" step="0.1" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label><button className="small" disabled={!valid||deadline!==null} onClick={()=>start(Math.round(Number(minutes)*60))}><Play size={15}/>{started?'重新计时':'开始'}</button>{deadline!==null?<button className="small" onClick={()=>{setLeft(secondsLeft(deadline,Date.now()));setDeadline(null);}}><Pause size={15}/>暂停</button>:left>0&&<button className="small" onClick={()=>setDeadline(Date.now()+left*1000)}><Play size={15}/>继续</button>}<button className="icon" aria-label="清除计时" onClick={()=>{setDeadline(null);setLeft(0);setStarted(false);}}><RotateCcw size={18}/></button></div>
   <p className="muted">参考时间取步骤中的上限，仍需检查熟度。请保持页面打开，退出此模式会停止计时。</p>
  </section>
  <details className="cook-seasoning"><summary>调味清单 · 一勺 {spoon} mL · 已备 {seasoned.length}/{meal.seasoning.length}</summary><p className="muted">勾选代表已备好，按当前步骤加入，避免重复放。</p>{meal.seasoning.map((s,i)=><button key={i} className={'season-check '+(seasoned.includes(i)?'checked':'')} aria-pressed={seasoned.includes(i)} onClick={()=>setSeasoned(a=>a.includes(i)?a.filter(x=>x!==i):[...a,i])}><span className="check-box">{seasoned.includes(i)&&<Check size={15}/>}</span><span>{s.split('：')[0]}<strong>{s.split('：').slice(1).join('：')}</strong></span></button>)}</details>
  {complete&&<div className="finish-emblem"><img src="/rossi-sun-moon.png" width="1367" height="1151" alt="日月 46 完成徽章"/><span>SESSION COMPLETE</span></div>}
  {complete&&<p className="notice" role="status">这道菜的步骤已完成。食材清单会保留，吃完后可手动删除。</p>}
  <nav className="cook-nav" aria-label="做饭步骤"><button className="small" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowLeft size={18}/>上一步</button><button className="primary" onClick={()=>{setDone(a=>a.includes(step)?a:[...a,step]);if(step<meal.steps.length-1)setStep(s=>s+1);}}><Check size={18}/>{step===meal.steps.length-1?'完成最后一步':'完成本步并继续'}{step<meal.steps.length-1&&<ArrowRight size={18}/>}</button><button className="small" disabled={step===meal.steps.length-1} onClick={()=>setStep(s=>s+1)} aria-label="查看下一步"><ArrowRight size={18}/></button></nav>
 </dialog>;
}
