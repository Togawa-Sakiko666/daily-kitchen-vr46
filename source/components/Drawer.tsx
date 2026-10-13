"use client";
import {useEffect,useRef,useId,type ReactNode} from 'react';
import {X} from 'lucide-react';
export default function Drawer({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null),id=useId();
 useEffect(()=>{const d=ref.current;const previous=document.activeElement as HTMLElement|null;d?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d?.close();document.body.style.overflow=overflow;previous?.focus();};},[]);
 return <dialog ref={ref} className="side-drawer" aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}}><div className="drawer-head"><h2 id={id}>{title}</h2><button className="icon" aria-label="关闭面板" onClick={onClose}><X size={22}/></button></div><div className="drawer-body">{children}</div></dialog>;
}
