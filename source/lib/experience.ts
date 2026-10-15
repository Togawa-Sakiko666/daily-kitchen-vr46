import {foodForItem,type Meal,type Ingredient,type Settings} from './kitchen';
import {generateDayPlan,type PlanOptions} from './day-plan';
export function mealIdentity(m:Meal){return JSON.stringify([m.label,m.items.map(i=>i.id).sort(),m.seasoning]);}
export function freshPlan(inventory:Ingredient[],settings:Settings,options:PlanOptions,history:string[],seed:number){
 let best=generateDayPlan(inventory,{...settings,seed},options),score=Infinity,bestSeed=seed;
 for(let n=0;n<48;n++){const candidate=generateDayPlan(inventory,{...settings,seed:seed+n},options);const cost=candidate.meals.reduce((sum,m)=>{const index=history.lastIndexOf(mealIdentity(m));return sum+(index<0?0:10+index);},0);if(cost<score){best=candidate;score=cost;bestSeed=seed+n;}if(cost===0)break;}
 return {plan:best,seed:bestSeed+1,repeated:score>0};
}
export function priorityReport(inventory:Ingredient[],settings:Settings,options:PlanOptions,meals:Meal[]){
 const used=new Set(meals.flatMap(m=>m.items.map(i=>i.id)));
 return inventory.filter(i=>i.priority).map(i=>({id:i.id,name:foodForItem(i).name,used:used.has(i.id),reason:settings.excluded.includes(i.id)?'已设为不吃':foodForItem(i).group==='record'?'尚未指定烹饪类型':options.quick||options.slots.every(s=>s==='早餐')?'当前早餐或快手搭配未采用，可选普通午晚餐':'同类食材较多或餐次有限，可增加餐次或换搭配'}));
}
export async function enrichMeals(plan:ReturnType<typeof generateDayPlan>,request:(meal:Meal)=>Promise<Meal>,update:(next:ReturnType<typeof generateDayPlan>,index:number)=>void,valid:()=>boolean){
 const meals=plan.meals.map(m=>({...m}));
 for(let i=0;i<meals.length;i++){if(!valid())break;if(!meals[i].steps.length)continue;meals[i]={...meals[i],aiState:'pending',aiError:undefined};update({...plan,meals:[...meals]},i);
 try{const meal=await request(meals[i]);if(!valid())break;meals[i]=meal;}catch(e){if(!valid())break;meals[i]={...meals[i],aiState:'failed',aiError:e instanceof Error?e.message:'请求失败'};}
 update({...plan,meals:[...meals]},i);
 }return {...plan,meals};
}
