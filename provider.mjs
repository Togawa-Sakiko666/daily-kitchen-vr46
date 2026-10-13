import {providerError} from './api/api-entry.js';
export const cfg=process.env;
export async function ai(payload){
 const key=process.env.OPENAI_API_KEY;
 if(!key)throw Error('服务器尚未配置 OPENAI_API_KEY，请在 Render 环境变量中添加。');
 const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(payload),signal:AbortSignal.timeout(90000)});
 const d=await r.json();
 if(!r.ok){if(r.status===404)throw Error('模型不可用，请检查服务器模型环境变量。');throw Error(providerError(r.status,d.error?.code).message);}
 if(d.status==='incomplete')throw Error('AI 输出未完成，请重试。');
 return d;
}
