import {type Ingredient,type Item,type Settings,type Meal,foodForItem,cookingId,hasNutrition,nutrition,zero,spoonAmount,generateFromIngredients,summarizeMeals} from './kitchen';
export const mealSlots=['早餐','午饭','晚饭'] as const;
export type MealSlot=typeof mealSlots[number];
export type PlanOptions={slots:MealSlot[];quick:boolean};
export const defaultOptions:PlanOptions={slots:['早餐','午饭','晚饭'],quick:false};
export function restorePlanOptions(value:unknown):PlanOptions{
 if(!value||typeof value!=='object')return {...defaultOptions,slots:[...defaultOptions.slots]};
 const v=value as Partial<PlanOptions>;const slots=mealSlots.filter(x=>Array.isArray(v.slots)&&v.slots.includes(x));
 return {slots:slots.length?slots:[...defaultOptions.slots],quick:v.quick===true};
}
const baseId=(i:Ingredient)=>i.custom?.templateId??i.id;
const shortList=['egg','tofu','natto','yogurt','milk','soymilk','bread','wholebread','oats','rice','brown','tomato','cucumber','lettuce','kiwi','banana'];
function simpleMeal(inventory:Ingredient[],s:Settings,label:MealSlot,variant:number):Meal{
 const morning=label==='早餐';
 const available=inventory.filter(i=>!s.excluded.includes(i.id)&&shortList.includes(baseId(i)));
 const choose=(ids:string[])=>{const eligible=available.filter(i=>ids.includes(baseId(i))).sort((a,b)=>Number(b.priority)-Number(a.priority)||ids.indexOf(baseId(a))-ids.indexOf(baseId(b)));const priority=eligible.filter(i=>i.priority);const pool=priority.length?priority:eligible;return pool.length?pool[variant%pool.length]:undefined;};
 const items:Item[]=[],steps:string[]=[],notes:string[]=[],seasoning:string[]=[];
 const take=(i:Ingredient|undefined,g:number)=>{if(i){items.push({...i,grams:g});return i;}return undefined;};
 const base=choose(morning?['wholebread','bread','oats','rice','brown']:['rice','brown','wholebread','bread']);
 take(base,baseId(base??{id:'',priority:false})==='oats'?50:['bread','wholebread'].includes(baseId(base??{id:'',priority:false}))?100:180);
 const main=choose(morning?['egg','natto','yogurt','tofu']:['egg','tofu','natto']);
 if(main)take(main,baseId(main)==='egg'?(s.healthy?100:50):baseId(main)==='natto'?50:baseId(main)==='tofu'?200:200);
 const dairy=choose(['milk','soymilk',...(main&&baseId(main)==='yogurt'?[]:['yogurt'])]);
 if(dairy)take(dairy,baseId(dairy)==='milk'?206:200);
 const veg=choose(['tomato','cucumber','lettuce']);if(veg)take(veg,morning?100:200);
 const fruit=morning?choose(['kiwi','banana']):undefined;if(fruit)take(fruit,100);
 if(!items.length)return {label,title:morning?'先补充简单早餐食材':'没有适合 15 分钟模式的食材',items:[],seasoning:[],steps:[],nutrition:zero(),nutritionComplete:true,tags:[],notes:[morning?'可添加吐司、鸡蛋、牛奶、香蕉等；不会把尚未买的食材加入菜谱。':'可添加鸡蛋或豆腐、熟米饭、番茄。现有肉鱼可关闭快手模式后安排。']};
 const fried=main&&['egg','tofu'].includes(baseId(main));const oil=fried?(s.healthy?2.5:5):0;
 if(oil)seasoning.push('食用油：'+spoonAmount(oil,s.spoon));
 // A deliberately mild breakfast: no assumed sauces, sugar or salt.
 if(fried&&s.sauces.includes('黑胡椒'))seasoning.push('黑胡椒：'+spoonAmount(0.25,s.spoon));
 steps.push('备料（约 3 分钟）：'+items.map(i=>foodForItem(i).name+' '+portionLabel(i)).join('、')+'。蔬果洗净，番茄去蒂切块、黄瓜切片、生菜撕小片；水果按种类去皮切块。只处理本餐列出的食材。');
 if(base){const id=baseId(base),name=foodForItem(base).name;
  if(['bread','wholebread'].includes(id))steps.push(`${name}可直接吃；想吃热的，用干净平底锅小火两面各烘约 1 分钟，不另加油，也不需要烤箱。`);
  else if(id==='oats')steps.push(`燕麦放小锅，加水 ${spoonAmount(150,s.spoon)}，煮开后小火搅拌 3–5 分钟至软；选择包装标示 5 分钟内可煮熟的快熟燕麦。牛奶或酸奶若列出，单独饮用或配着吃，不重复加一份。`);
  else steps.push(`${name}必须是已煮熟的米饭。放锅中加水 ${spoonAmount(15,s.spoon)}，小火翻拌约 3–5 分钟至中心滚烫；冷冻饭先按包装加热。现煮生米不计入本次快手时间。`);
 }
 if(main){const id=baseId(main),name=foodForItem(main).name;
  if(id==='egg')steps.push(variant%2===0?`用本餐全部油润锅，中小火打入鸡蛋煎约 3 分钟，翻面再煎 1–2 分钟，至蛋白与蛋黄完全凝固；没熟继续加热，不需要锅盖。`:`鸡蛋打散。用本餐全部油润锅，中小火倒入蛋液，慢慢推拌约 2–3 分钟，至完全凝固；有黑胡椒时撒入清单中的份量。`);
  if(id==='egg'&&variant%2===0&&s.sauces.includes('黑胡椒'))steps[steps.length-1]+=' 出锅前加入清单中的黑胡椒。';
  if(id==='tofu')steps.push(`${name}沥水切约 1 cm 薄片，用本餐全部油中小火两面各煎约 3 分钟，至中心热透；${s.sauces.includes('黑胡椒')?'出锅前撒入清单中的黑胡椒。':'不另加盐。'}`);
  if(id==='natto')steps.push(`${name}开盒后搅拌，搭配主食直接吃，本方案不加附赠酱包；若自行加酱，盐分需按包装另计。`);
  if(id==='yogurt')steps.push(`${name}直接装碗，不额外加糖；若本餐有水果，可拌入。`);
 }
 if(dairy||veg||fruit)steps.push([dairy?`${foodForItem(dairy).name}取上述份量直接饮用或食用`:'',veg?`${foodForItem(veg).name}作为清洗好的生食配菜，不额外淋沙拉酱`:'',fruit?`${foodForItem(fruit).name}配餐`:''].filter(Boolean).join('；')+'。装盘即可。');
 if(!base)notes.push('缺主食：建议补吐司、快熟燕麦或熟米饭；未计入当前营养。');
 if(!main&&!dairy)notes.push('缺主要蛋白质：建议补鸡蛋、豆腐、纳豆、牛奶或原味酸奶。');
 if(!veg&&!fruit)notes.push('缺蔬果：建议补一份番茄、香蕉或猕猴桃。');
 if(!morning&&(!main||!base))notes.push('当前只够拼出部分餐食，不能当作完整正餐。');
 const n=nutrition(items);n.kcal+=oil*8.28;
 if(s.healthy&&items.every(hasNutrition)&&n.protein<20)notes.push('本餐已知蛋白质不足 20 g，可另外补鸡蛋、牛奶或原味希腊酸奶；是否需要补充要结合全天饮食。');
 if(items.some(i=>!hasNutrition(i)))notes.push('自定义食材缺少标签，营养合计只含已知部分，不能据此判断达标。');
 if(items.some(i=>i.custom))notes.push('自定义食材沿用你指定的做法；请确认产品适用，营养以你录入的标签为准。');
 notes.push('时间包含简单备料，按熟米饭、快熟燕麦估算；熟度与包装要求优先，不能为了赶时间提前关火。');
 const title=[main?baseId(main)==='egg'?(variant%2===0?'煎蛋':'炒蛋'):foodForItem(main).name:'',base?foodForItem(base).name:'',dairy?foodForItem(dairy).name:''].filter(Boolean).join('＋')||(veg?foodForItem(veg).name:foodForItem(items[0]).name);
 return {label,title,items,seasoning,steps,nutrition:n,nutritionComplete:items.every(hasNutrition),tags:[...new Set(items.flatMap(i=>foodForItem(i).tags))],notes,minutes:morning?20:15,timeNote:morning?'约 10–20 分钟':'约 15 分钟'};
}
export function portionLabel(i:Item){const id=cookingId(i);const g=Math.round(i.grams);if(id==='egg')return `约 ${g/50} 个（可食部 ${g} g）`;if(id==='milk')return `约 ${Math.round(g/1.03)} mL`;if(id==='soymilk')return `${g} mL`;if(['bread','wholebread'].includes(id))return `${g} g（约 2 片，按包装厚度调整）`;if(id==='natto')return `${g} g（约 1 盒，不含酱包）`;return `${g} g`;}
export function generateDayPlan(inventory:Ingredient[],s:Settings,options:PlanOptions){
 const selected=mealSlots.filter(x=>options.slots.includes(x));
 const regular=selected.some(x=>x!=='早餐')&&!options.quick?generateFromIngredients(inventory,s).meals:[];
 const meals=selected.map((slot,index)=>slot==='早餐'||options.quick?simpleMeal(inventory,s,slot,s.seed+index):{...regular[slot==='午饭'?0:1],minutes:30,timeNote:'约 20–30 分钟，厚肉或复杂备料需延长'});
 const recorded=inventory.filter(i=>foodForItem(i)?.group==='record'&&!s.excluded.includes(i.id)).map(i=>({...i,grams:1}));
 const summary=summarizeMeals(meals,s,recorded);
 const used=new Set(meals.flatMap(m=>m.items.map(i=>i.id)));
 const unused=inventory.filter(i=>i.priority&&!used.has(i.id));
 for(const i of unused){
  const name=foodForItem(i).name;
  if(s.excluded.includes(i.id))summary.gaps.push(`先吃食材「${name}」未安排：已在“不吃的食材”中排除，排除设置优先。`);
  else if(foodForItem(i).group==='record')summary.gaps.push(`先吃食材「${name}」未安排：需要先指定适用的做法类型。`);
  else if((options.quick||selected.every(slot=>slot==='早餐'))&&!shortList.includes(baseId(i)))summary.gaps.push(`先吃食材「${name}」不适合当前简单早餐/15分钟快手模式；请选午饭或晚饭并关闭快手模式。`);
  else summary.gaps.push(`先吃食材「${name}」本次未排入：同类优先食材较多或当前餐次搭配受限，可增加餐次或换个搭配。`);
 }
 return {meals,...summary};
}
