export function timeSuggestions(text:string):number[]{
 const seconds=[...text.matchAll(/(\d+(?:\.\d+)?)(?:[–—~－-](\d+(?:\.\d+)?))?\s*(分钟|秒)/g)].map(m=>Math.round(Number(m[2]??m[1])*(m[3]==='分钟'?60:1)));
 return [...new Set(seconds.filter(n=>n>0&&n<=10800))];
}
export function secondsLeft(deadline:number,now:number){return Math.max(0,Math.ceil((deadline-now)/1000));}
export function clock(seconds:number){return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;}
