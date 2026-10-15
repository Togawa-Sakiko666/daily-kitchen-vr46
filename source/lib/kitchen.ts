import {makeSeasoning} from './seasoning';
import {breakfastFoods} from './breakfast-catalog';
import {extraFoods} from './food-catalog';
import {fishFoods} from './fish-catalog';
import {recipeSteps} from './cooking';
export type Nutrients = { kcal:number; protein:number; fiber:number; salt:number };
export type Food = {id:string; name:string; jp:string; group:string; kcal:number; protein:number; fiber:number; salt?:number; tags:string[]; nutritionKnown?:boolean; templateId?:string; category?:string; prep?:string; cook?:string; processed?:boolean; preseasoned?:boolean; maxPortion?:number; note?:string; sourceCode?:string; sourceName?:string; aliases?:string};
export const foods:Food[] = [
 ['chicken','去皮鸡腿肉','鶏もも肉（皮なし）','protein',127,19,0,'B族'],
 ['breast','鸡胸肉','鶏むね肉（皮なし）','protein',110,23,0,'B族'],
 ['salmon','未腌制鲑鱼','生鮭','protein',200,20,0,'维生素D,Omega-3'],
 ['mackerel','未腌制鲭鱼','生さば','protein',210,20,0,'维生素D,Omega-3'],
 ['pork','瘦猪肉','豚もも肉','protein',150,21,0,'维生素B1'],
 ['beef','瘦牛肉','牛もも肉','protein',180,21,0,'铁,B族'],
 ['shrimp','虾仁','むきえび','protein',90,20,0,'B族'],
 ['tofu','木棉豆腐','木綿豆腐','protein',73,7,1,'钙（依凝固剂）'],
 ['egg','鸡蛋','卵','protein',142,12.5,0,'胆碱,维生素D'],
 ['broccoli','西兰花','ブロッコリー','veg',34,2.8,3.5,'维生素C,叶酸'],
 ['komatsuna','小松菜','小松菜','veg',14,1.5,1.9,'维生素A,钙'],
 ['spinach','菠菜','ほうれん草','veg',23,2.6,2.8,'维生素A,叶酸'],
 ['cabbage','甘蓝','キャベツ','veg',25,1.3,1.8,'维生素C'],
 ['hakusai','白菜','白菜','veg',14,0.8,1.3,'叶酸'],
 ['pepper','青椒','ピーマン','veg',22,0.9,2.3,'维生素C'],
 ['carrot','胡萝卜','にんじん','veg',35,0.8,2.8,'维生素A'],
 ['tomato','番茄','トマト','veg',20,0.8,1.2,'维生素C'],
 ['onion','洋葱','玉ねぎ','veg',37,1,1.6,'少量维生素C'],
 ['negi','大葱','長ねぎ','veg',28,1.4,2.5,'叶酸'],
 ['mushroom','蘑菇（口蘑/舞茸/香菇等）','きのこ','veg',25,2.5,3,'B族'],
 ['beans','熟鹰嘴豆/杂豆','ゆで豆','protein',140,8,6,'叶酸,铁'],
 ['rice','熟米饭','ごはん','carb',156,2.5,0.5,'碳水化合物'],
 ['brown','熟糙米饭','玄米ごはん','carb',152,2.8,1.4,'B族'],
 ['potato','土豆','じゃがいも','carb',76,1.6,1.5,'维生素C'],
 ['sweet','红薯','さつまいも','carb',130,1.2,2.5,'钾'],
 ['oats','燕麦（干重）','オートミール','extra',380,13,9,'膳食纤维'],
 ['yogurt','原味希腊酸奶','無糖ギリシャヨーグルト','extra',65,10,0,'钙'],
 ['kiwi','猕猴桃（可食部）','キウイ','extra',60,1,3,'维生素C'],
 ['banana','香蕉（可食部）','バナナ','extra',90,1.1,1.5,'钾'],
 ].map(([id,name,jp,group,kcal,protein,fiber,tags])=>({id:String(id),name:String(name),jp:String(jp),group:String(group),kcal:Number(kcal),protein:Number(protein),fiber:Number(fiber),tags:String(tags).split(',')}));
foods.push(...extraFoods,...fishFoods,...breakfastFoods);
export const foodCategories=['蔬菜','菌菇','肉类','香肠与加工肉','鱼虾','腌制与加工鱼','蛋与豆制品','主食','水果与乳品'];
export function foodCategory(f:Food){return f.category??(f.id==='mushroom'?'菌菇':f.group==='veg'?'蔬菜':['chicken','breast','pork','beef'].includes(f.id)?'肉类':['salmon','mackerel','shrimp'].includes(f.id)?'鱼虾':f.group==='protein'?'蛋与豆制品':f.group==='carb'?'主食':'水果与乳品');}
const normalizeFood=(text:string)=>text.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s/g,'');
export function filterFoods(query:string,category='全部'){const q=normalizeFood(query);return foods.filter(f=>(category==='全部'||foodCategory(f)===category)&&normalizeFood(f.name+f.jp+(f.aliases??'')).includes(q));}

export type Item = {id:string; grams:number; priority:boolean; custom?:Food; enteredAmount?:string};
export type Ingredient = Omit<Item,'grams'|'enteredAmount'>;
export type Meal = {aiState?:"pending"|"done"|"failed"; aiError?:string; aiModel?:string; aiResponseId?:string;label:string; title:string; items:Item[]; seasoning:string[]; steps:string[]; nutrition:Nutrients; nutritionComplete:boolean; tags:string[]; notes:string[]; minutes?:number; timeNote?:string};
export type Settings = {healthy:boolean; weight:number; height:number; calorie:number; spoon:number; cuisine:string; sauces:string[]; excluded:string[]; other:Nutrients; seed:number};
export const zero=():Nutrients=>({kcal:0,protein:0,fiber:0,salt:0});
export const add=(a:Nutrients,b:Nutrients):Nutrients=>({kcal:a.kcal+b.kcal,protein:a.protein+b.protein,fiber:a.fiber+b.fiber,salt:a.salt+b.salt});
export const foodById=(id:string)=>foods.find(f=>f.id===id)!;
export const foodForItem=(item:Pick<Item,'id'|'custom'>):Food=>item.custom??foodById(item.id);
export const cookingId=(item:Item)=>item.custom?.templateId??item.id;
export const cookingFood=(item:Item):Food=>foodById(cookingId(item))??foodForItem(item);
export const hasNutrition=(item:Pick<Item,'id'|'custom'>)=>foodForItem(item)?.nutritionKnown!==false;
export type CustomDraft={name:string;quantity:number;unit:string;unitGrams:number;templateId:string;nutrients?:Nutrients};
export function createCustomItem(d:CustomDraft):Item {
 const name=d.name.trim();if(!name||name.length>40)throw Error('食材名称请填写 1–40 个字。');
 if(!['g','个','根','盒','袋'].includes(d.unit))throw Error('请选择有效单位。');
 if(!Number.isFinite(d.quantity)||d.quantity<=0)throw Error('请输入大于 0 的数量。');
 const grams=d.unit==='g'?d.quantity:d.quantity*d.unitGrams;
 if(d.unit!=='g'&&(!Number.isFinite(d.unitGrams)||d.unitGrams<=0))throw Error('按个、根、盒或袋输入时，请确认每单位重量。');
 if(!Number.isFinite(grams)||grams<=0||grams>20000)throw Error('总重量需在 0–20000 g 之间。');
 const base=foodById(d.templateId);if(d.templateId&&!base)throw Error('请选择有效的做法类型。');
 const n=d.nutrients;
 if(n&&Object.values(n).some(v=>!Number.isFinite(v)||v<0))throw Error('营养数据需填写非负数，四项都以每 100 g 为基准。');
 const id='custom-'+crypto.randomUUID();
 return {id,grams,priority:false,enteredAmount:d.unit==='g'?undefined:`录入 ${d.quantity} ${d.unit}，每${d.unit} ${d.unitGrams} g`,custom:{id,name,jp:'自定义食材',group:base?.group??'record',templateId:base?.id,kcal:n?.kcal??0,protein:n?.protein??0,fiber:n?.fiber??0,salt:n?.salt??0,nutritionKnown:!!n,tags:[]}};
}
export function restoreInventory(value:unknown):Item[]{
 if(!Array.isArray(value))return [];
 return value.filter((i):i is Item=>{if(!i||typeof i.id!=='string'||!Number.isFinite(i.grams)||i.grams<=0)return false;if(!i.custom)return !!foodById(i.id);const f=i.custom;return i.id.startsWith('custom-')&&f.id===i.id&&typeof f.name==='string'&&f.name.length>0&&f.name.length<=40&&Array.isArray(f.tags)&&typeof f.nutritionKnown==='boolean'&&[f.kcal,f.protein,f.fiber,f.salt??0].every(v=>Number.isFinite(v)&&v>=0)&&(!f.templateId||!!foodById(f.templateId));});
}
// Inventory now records availability only. Accept legacy weighted records without retaining weight.
export function restoreIngredients(value:unknown):Ingredient[]{
 if(!Array.isArray(value))return [];
 const seen=new Set<string>();
 return restoreInventory(value.map(i=>i&&typeof i==='object'?{...i,grams:1}:i)).flatMap(({id,priority,custom})=>{if(seen.has(id))return [];seen.add(id);return [{id,priority:!!priority,...(custom?{custom}: {})}];});
}
export function createCustomIngredient(d:Pick<CustomDraft,'name'|'templateId'|'nutrients'>):Ingredient{
 const {id,priority,custom}=createCustomItem({...d,quantity:1,unit:'g',unitGrams:0});
 return {id,priority,custom};
}
export function generateFromIngredients(inventory:Ingredient[],s:Settings){
 const {remaining,...plan}=generate(inventory.map(i=>({...i,grams:1})),s,true);
 return plan;
}
export function nutrition(items:Item[]):Nutrients {return items.reduce((n,i)=>{const f=foodForItem(i); return f&&hasNutrition(i)?add(n,{kcal:f.kcal*i.grams/100,protein:f.protein*i.grams/100,fiber:f.fiber*i.grams/100,salt:(f.salt??0)*i.grams/100}):n;},zero());}
export function spoonAmount(ml:number,spoon:number){const n=ml/spoon; const fractions:[[number,string],[number,string],[number,string],[number,string],[number,string],[number,string],[number,string]]=[[1/12,'1/12'],[1/6,'1/6'],[1/4,'1/4'],[1/3,'1/3'],[1/2,'1/2'],[2/3,'2/3'],[1,'1']];const f=fractions.find(([v])=>Math.abs(v-n)<0.015);return `${f?f[1]:Number(n.toFixed(2))} 勺（${ml} mL）`;}
export function generate(inventory:Item[],s:Settings,availabilityOnly=false):{meals:Meal[];remaining:Item[];total:Nutrients;nutritionComplete:boolean;gaps:string[];targets:{protein:number;fiber:number}} {
 const available=inventory.filter(i=>foodForItem(i)&&Number.isFinite(i.grams)&&i.grams>0&&!s.excluded.includes(i.id)).map(i=>({...i,grams:availabilityOnly?Infinity:i.grams}));
 const meals:Meal[]=[];
 for(let slot=0;slot<2;slot++) {
   const items:Item[]=[]; const notes:string[]=[];
   const take=(i:Item,g:number)=>{const cap=cookingFood(i).maxPortion;const amount=Math.min(i.grams,g,cap?(s.healthy?cap:cap*1.6):Infinity);if(amount>0){items.push({...i,grams:amount});i.grams-=amount;}};
   const sort=(group:string)=>available.filter(i=>i.grams>0&&foodForItem(i).group===group).sort((a,b)=>Number(b.priority)-Number(a.priority)|| (s.healthy?Number(!!cookingFood(a).processed)-Number(!!cookingFood(b).processed):0)|| (s.healthy?foodForItem(b).protein-foodForItem(a).protein:0));
   const proteins=sort('protein');
   if(proteins.length){const priorityProteins=proteins.filter(p=>p.priority);const pool=priorityProteins.length?priorityProteins:proteins;const p=pool[(s.seed+slot)%pool.length];const desired=cookingId(p)==='egg'?150:cookingId(p)==='tofu'?250:cookingId(p)==='beans'?200:180;take(p,Math.min(desired,slot===0&&proteins.length===1?p.grams/2:p.grams));}
   if(s.healthy&&items.every(hasNutrition)&&nutrition(items).protein<28){const backup=sort('protein').find(p=>!items.some(i=>i.id===p.id));if(backup)take(backup,Math.min(cookingId(backup)==='egg'?100:150,slot===0?backup.grams/2:backup.grams));}
   const vegetables=sort('veg');
   // Rotate within each tier: variety must never move a non-priority food ahead of a priority food.
   const rotate=(group:Item[])=>{const offset=group.length?(s.seed+slot)%group.length:0;return group.slice(offset).concat(group.slice(0,offset));};
   const candidates=[...rotate(vegetables.filter(v=>v.priority)),...rotate(vegetables.filter(v=>!v.priority))];
   let vegNeed=s.healthy?250:200;
   for(const v of candidates){if(vegNeed<=0)break;const portion=Math.min(vegNeed,cookingId(v)==='greenchili'?5:cookingId(v)==='negi'?30:cookingId(v)==='onion'?80:cookingId(v)==='chives'?50:150,slot===0?v.grams/2:v.grams);take(v,portion);vegNeed-=portion;}
   const carb=sort('carb')[0];if(carb)take(carb,Math.min(cookingId(carb)==='potato'||cookingId(carb)==='sweet'?250:200,slot===0?carb.grams/2:carb.grams));
   if(!items.length){meals.push({label:slot===0?'午饭':'晚饭',title:'食材不足，先补充食材',items:[],seasoning:[],steps:[],nutrition:zero(),nutritionComplete:true,tags:[],notes:['没有足够的已确认食材来安排这一餐。']});continue;}
   const mains=items.filter(i=>foodForItem(i).group==='protein');const veg=items.filter(i=>foodForItem(i).group==='veg');const carbs=items.filter(i=>foodForItem(i).group==='carb');
   const cuisine=s.cuisine==='轮换'?['中式','西式','日式'][(s.seed+slot)%3]:s.cuisine;
   const processed=mains.filter(i=>cookingFood(i).processed);
   const preseasoned=mains.filter(i=>cookingFood(i).preseasoned);
   const foodSalt=nutrition(items).salt;
   const flavor=makeSeasoning({...s,saltBudget:preseasoned.length?0:processed.length?Math.max(0,(s.healthy?1.5:2)-foodSalt):undefined},cuisine,s.seed,slot,spoonAmount);
   if(processed.length)notes.push('加工食材已控制份量，已知的食材盐分计入合计；缺少标签的部分仍需补录。');
   if(preseasoned.length)notes.push('已调味鱼单独装盘，本餐不再加咸味调料；下面除食用油外的调味只用于配菜和未调味的蛋白质。');
   const sides=veg.length>0||mains.some(i=>!cookingFood(i).preseasoned);
   if(preseasoned.length&&!sides){flavor.seasoning=flavor.seasoning.slice(0,1);flavor.kcal=flavor.oil*8.28;flavor.salt=0;}
   const seasoning=preseasoned.length&&sides?flavor.seasoning.map((x,i)=>i===0?x:'配菜用 '+x):flavor.seasoning;notes.push(...flavor.notes);
   const title=(preseasoned.length?'香煎':flavor.flavor)+(mains.length?foodForItem(mains[0]).name:'时蔬')+(veg.length?'配'+foodForItem(veg[0]).name:'')+(carbs.length?'与'+foodForItem(carbs[0]).name:'');
   const steps=recipeSteps(items.map(i=>({food:cookingFood(i),name:foodForItem(i).name,grams:Math.round(i.grams)})),flavor,s.spoon,spoonAmount);
   if(!mains.length)notes.push('这一餐缺少主要蛋白质：补鸡胸肉、鱼、鸡蛋或豆腐。');
   if(!carbs.length)notes.push('没有确认的主食：补米饭/土豆，不把少吃主食当成健身的必要条件。');
   if(veg.reduce((n,i)=>n+i.grams,0)<200)notes.push('蔬菜不足 200 g，建议补西兰花或小松菜。');
   for(const item of items.filter(i=>i.custom))notes.push(`${foodForItem(item).name} 使用你选择的「${foodById(cookingId(item)).name}」做法；请确认切法与烹饪要求适用。`);
   for(const i of items){const note=cookingFood(i).note;if(note&&!notes.includes(note))notes.push(note);}
   const missing=items.filter(i=>!hasNutrition(i));if(missing.length)notes.push(`营养未完整计算：${missing.map(i=>foodForItem(i).name).join('、')} 尚无标签数据，下面仅显示已知部分。`);
   const n=nutrition(items);n.kcal+=flavor.kcal;n.salt+=flavor.salt;
   meals.push({label:slot===0?'午饭':'晚饭',title,items,seasoning,steps,nutrition:n,nutritionComplete:items.every(hasNutrition),tags:[...new Set(items.flatMap(i=>foodForItem(i).tags))],notes});
 }
 const summary=summarizeMeals(meals,s,available.filter(i=>foodForItem(i).group==='record'));
 return {meals,remaining:[...available.filter(i=>i.grams>0),...inventory.filter(i=>s.excluded.includes(i.id))],...summary};
}
export function summarizeMeals(meals:Meal[],s:Settings,recordedOnly:Item[]=[]){
 const targetProtein=s.healthy?Math.round(s.weight*1.6):Math.round(s.weight); const targets={protein:targetProtein,fiber:25};
 const total=meals.reduce((n,m)=>add(n,m.nutrition),s.other);const gaps:string[]=[];const nutritionComplete=meals.every(m=>m.nutritionComplete);
 const unknown=[...new Set(meals.flatMap(m=>m.items).filter(i=>!hasNutrition(i)).map(i=>foodForItem(i).name))];
 if(unknown.length)gaps.push(`缺少 ${unknown.join("、")} 的营养数据。合计只含已知部分，不能判断全天是否达标；可补录每 100 g 的包装标签。`);
 if(recordedOnly.length)gaps.push(`以下食材仅记录、未安排烹饪：${recordedOnly.map(i=>foodForItem(i).name).join("、")}。需要指定适用的做法类型后才能参与配餐。`);
 if(nutritionComplete&&total.protein<targetProtein)gaps.push(`蛋白质距离参考目标还差约 ${Math.ceil(targetProtein-total.protein)} g。可补原味希腊酸奶 200 g（约 20 g 蛋白质）、鸡蛋或豆腐；额外食物尚未计入当前合计。`);
 if(nutritionComplete&&total.fiber<25)gaps.push(`膳食纤维还差约 ${Math.ceil(25-total.fiber)} g。可补燕麦、猕猴桃，另加熟豆类/糙米；这些是补充建议，尚未计入合计。`);
 if(nutritionComplete&&total.kcal<s.calorie-150)gaps.push(`距离你设置的全天能量参考还差约 ${Math.round(s.calorie-total.kcal)} kcal。请把未选餐次、加餐和饮料一并考虑，不要只靠当前方案撑一天。`);
 if(total.kcal>s.calorie+150)gaps.push('当前合计超过你设定的能量参考；可先减少额外零食/油，再根据训练、饥饿感和体重趋势调整。');
 if(total.salt>=6)gaps.push('记录的食盐相当量达到 6 g；检查酱油、加工食品和汤汁的用量。');
 const tags=new Set(meals.flatMap(m=>m.tags));if(!tags.has('维生素C'))gaps.push('目前所选餐次的维生素 C 来源偏少，可补青椒、西兰花或猕猴桃。');
 if(!tags.has('钙')&&!tags.has('钙（依凝固剂）'))gaps.push('钙来源需检查：可在早餐/加餐补奶或原味酸奶。');
 if(!tags.has('维生素D'))gaps.push('维生素 D 来源偏少，可在本周安排鲑鱼/鲭鱼。');
 return {total,nutritionComplete,gaps,targets};
}
