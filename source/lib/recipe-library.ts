import {type Meal,type Ingredient,type Settings,foodForItem,summarizeMeals} from './kitchen';
import {generateDayPlan,type PlanOptions} from './day-plan';
export type Favorite={id:string;title:string;meal:Meal|null;spoon:number};
export function recipeKey(m:Meal){let hash=2166136261;for(const c of JSON.stringify([m.title,m.items,m.seasoning,m.steps]))hash=Math.imul(hash^c.charCodeAt(0),16777619);return 'recipe-'+(hash>>>0).toString(16);}
export function saveRecipe(m:Meal,spoon:number):Favorite{return {id:recipeKey(m),title:m.title,meal:JSON.parse(JSON.stringify(m)),spoon};}
export function restoreFavorites(value:unknown):Favorite[]{
 if(!Array.isArray(value))return [];
 return value.slice(0,100).flatMap((v,index)=>{
  if(typeof v==='string')return [{id:'legacy-'+index,title:v,meal:null,spoon:15}];
  if(!v||typeof v.title!=='string')return [];
  if(v.meal===null)return [{id:String(v.id),title:v.title,meal:null,spoon:15}];
  const m=v.meal;
  if(!m||typeof m.title!=='string'||typeof m.label!=='string'||!Array.isArray(m.items)||!m.items.every((i:any)=>i&&Number.isFinite(i.grams)&&i.grams>0&&foodForItem(i))||!['steps','seasoning','tags','notes'].every(k=>Array.isArray(m[k])&&m[k].every((x:unknown)=>typeof x==='string'))||!m.nutrition||!['kcal','protein','fiber','salt'].every(k=>Number.isFinite(m.nutrition[k])))return [];
  return [saveRecipe(m.aiState==='pending'?{...m,aiState:'failed',aiError:'上次请求已中断，请重试'}:m,[5,10,15].includes(v.spoon)?v.spoon:15)];
 });
}
export function missingIngredients(m:Meal,inventory:Ingredient[]){return m.items.filter(i=>!inventory.some(x=>x.id===i.id));}
export function replaceMeal(plan:ReturnType<typeof generateDayPlan>,inventory:Ingredient[],settings:Settings,options:PlanOptions,index:number,seen:string[],seed:number){
 const current=plan.meals[index];if(!current)return {plan,seed,changed:false};
 const blocked=new Set([...seen,...plan.meals.map(m=>m.title)]);
 for(let attempt=1;attempt<=48;attempt++){
  const nextSeed=seed+attempt,candidate=generateDayPlan(inventory,{...settings,seed:nextSeed},options).meals.find(m=>m.label===current.label);
  if(!candidate?.steps.length||blocked.has(candidate.title))continue;
  const meals=plan.meals.map((m,i)=>i===index?candidate:m);
  const recorded=inventory.filter(i=>foodForItem(i)?.group==='record'&&!settings.excluded.includes(i.id)).map(i=>({...i,grams:1}));
  return {plan:{meals,...summarizeMeals(meals,settings,recorded)},seed:nextSeed,changed:true};
 }
 return {plan,seed:seed+48,changed:false};
}
