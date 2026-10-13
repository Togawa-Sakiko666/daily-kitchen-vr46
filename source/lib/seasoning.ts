export const seasoningGroups = [
 {name:'酱汁与鲜味',items:['酱油','生抽','老抽','蚝油','郫县豆瓣酱','味噌','鸡精','番茄酱']},
 {name:'酸甜与料酒',items:['味淋','料酒','米醋','糖','柠檬汁']},
 {name:'香辛料',items:['黑胡椒','辣椒粉','孜然粉','干燥香草']},
 {name:'葱姜蒜与香油',items:['蒜','姜','芝麻油']},
];
type Dose={name:string;ml:number;stage:'aroma'|'sauce'|'finish'};
// Approximate kcal and salt-equivalent grams per mL, including assumed densities.
// Brands and powder packing vary: these planning estimates do not replace package labels.
const estimates:Record<string,[number,number]>={
 '酱油':[0.7,0.17],'生抽':[0.7,0.17],'老抽':[1,0.18],'蚝油':[1.5,0.14],
 '郫县豆瓣酱':[1.2,0.2],'味噌':[2.2,0.15],'鸡精':[2,0.5],'番茄酱':[1.3,0.035],
 '味淋':[2.4,0.015],'料酒':[1,0.025],'米醋':[0.25,0],'糖':[3.3,0],'柠檬汁':[0.25,0],
 '黑胡椒':[1.3,0],'辣椒粉':[1.5,0],'孜然粉':[1.8,0],'干燥香草':[0.8,0],
 '蒜':[1.1,0],'姜':[0.5,0],'芝麻油':[8.28,0],'盐':[0,1.2],
};
export function makeSeasoning(s:{healthy:boolean;sauces:string[];spoon:number;saltBudget?:number},cuisine:string,seed:number,slot:number,spoonAmount:(ml:number,spoon:number)=>string){
 const has=(name:string)=>s.sauces.includes(name);
 const soy=has('生抽')?'生抽':has('酱油')?'酱油':null;
 const doses:Dose[]=[];
 const add=(name:string,ml:number,stage:Dose['stage']='sauce')=>{if(ml>0&&(name==='盐'||has(name)))doses.push({name,ml,stage});};
 const amount=(light:number,regular:number)=>s.healthy?light:regular;
 const soyDose=(light=5,regular=10)=>{if(soy)add(soy,amount(light,regular));};
 const profiles:{name:string;available:boolean;apply:()=>void}[]=cuisine==='西式'?[
  {name:'柠檬香草',available:has('柠檬汁'),apply:()=>{add('柠檬汁',5,'finish');add('干燥香草',1.25,'finish');}},
  {name:'番茄风味',available:has('番茄酱'),apply:()=>{add('番茄酱',amount(10,15));add('干燥香草',1.25,'finish');}},
  {name:'蒜香黑椒',available:has('蒜')||has('黑胡椒'),apply:()=>{}},
  {name:'孜然香煎',available:has('孜然粉'),apply:()=>{add('孜然粉',1.25,'finish');add('辣椒粉',0.625,'finish');}},
 ]:cuisine==='日式'?[
  {name:'轻照烧',available:!!soy&&has('味淋'),apply:()=>{soyDose();add('味淋',amount(5,10));}},
  {name:'味噌风味',available:has('味噌'),apply:()=>{add('味噌',amount(5,7.5));add('味淋',amount(2.5,5));}},
  {name:'姜汁酱香',available:!!soy&&has('姜'),apply:()=>{soyDose();}},
  {name:'日式醋香',available:!!soy&&has('米醋'),apply:()=>{soyDose();add('米醋',5,'finish');}},
  {name:'日式清酱',available:!!soy,apply:()=>{soyDose();}},
 ]:[
  {name:'蚝油快炒',available:has('蚝油'),apply:()=>{add('蚝油',amount(5,10));soyDose(1.25,2.5);}},
  {name:'豆瓣微辣',available:has('郫县豆瓣酱'),apply:()=>{add('郫县豆瓣酱',amount(2.5,5),'aroma');soyDose(2.5,5);}},
  {name:'家常糖醋',available:has('米醋')&&has('糖'),apply:()=>{add('米醋',5,'finish');add('糖',amount(1.25,2.5));soyDose(2.5,5);add('番茄酱',amount(5,10));}},
  {name:'孜然快炒',available:has('孜然粉'),apply:()=>{add('孜然粉',1.25,'finish');add('辣椒粉',0.625,'finish');soyDose(2.5,5);}},
  {name:'酱香快炒',available:!!soy,apply:()=>{soyDose();add('老抽',1.25);}},
  {name:'清鲜快炒',available:has('鸡精'),apply:()=>{add('鸡精',amount(0.625,1.25));}},
 ];
 const choices=profiles.filter(p=>p.available);
 const flavor=choices.length?choices[((seed+slot)%choices.length+choices.length)%choices.length]:{name:'清香快炒',apply:()=>{}};
 flavor.apply();
 add('蒜',5,'aroma');if(cuisine!=='西式')add('姜',2.5,'aroma');
 if(cuisine!=='日式'&&!doses.some(d=>d.name==='辣椒粉'||d.name==='郫县豆瓣酱'))add('辣椒粉',0.625,'finish');
 if(cuisine!=='西式')add('料酒',5);
 if(!doses.some(d=>d.name==='孜然粉'||d.name==='郫县豆瓣酱'))add('黑胡椒',0.625,'finish');
 if(cuisine!=='西式')add('芝麻油',1.25,'finish');
 const salty=doses.reduce((v,d)=>v+d.ml*estimates[d.name][1],0);
 // Only use plain salt for otherwise lightly seasoned dishes; do not stack it on salty sauces.
 if(salty<0.25)add('盐',s.healthy?0.5:0.625);
 let reducedSalt=false;
 if(s.saltBudget!==undefined){const total=doses.reduce((v,d)=>v+d.ml*estimates[d.name][1],0);if(total>s.saltBudget){reducedSalt=true;const factor=Math.max(0,s.saltBudget)/total;for(const d of doses)if(estimates[d.name][1]>0)d.ml=Math.floor(d.ml*factor*100)/100;for(let i=doses.length-1;i>=0;i--)if(doses[i].ml<0.05)doses.splice(i,1);}}
 const sesame=doses.find(d=>d.name==='芝麻油')?.ml??0;
 const oil=amount(5,10)-sesame;
 const water=45;
 const describe=(d:Dose)=>`${d.name}${d.name==='蒜'?'（切末）':d.name==='姜'?(flavor.name==='姜汁酱香'?'（磨泥连汁）':'（切末）'):''}：${spoonAmount(d.ml,s.spoon)}${d.name==='盐'?`（细盐约 ${(d.ml*1.2).toFixed(2)} g，用小量勺或秤更准）`:''}`;
 const seasoning=[`食用油：${spoonAmount(oil,s.spoon)}`,`水：${spoonAmount(water,s.spoon)}`,...doses.map(describe)];
 const aroma=doses.filter(d=>d.stage==='aroma');const sauce=doses.filter(d=>d.stage==='sauce');const finish=doses.filter(d=>d.stage==='finish');
 const aromaStep=aroma.length?`蛋白质煎炒熟后先盛出（纯蔬菜菜式直接用本餐食用油热锅），锅转小火，用锅内余油炒${aroma.map(d=>d.name).join('、')}约 20–30 秒，随即下蔬菜或加少量上述水，避免炒焦；不要额外加油。`:'';
 const sauceStep=sauce.length?`将${sauce.map(d=>d.name).join('、')}与上述水调匀（味噌或糖需化开），倒入锅内，放回已炒熟的食材，翻匀再加热 1–2 分钟；不要把油和前面已用的调料重复加入。`:'将已熟的食材放回锅内，必要时加上述水，翻匀加热 1–2 分钟。';
 const finishStep=finish.length?`临出锅前加入${finish.map(d=>d.name).join('、')}，翻匀约 10–20 秒即可。`:'';
 const notes=['调味料能量、盐分按常见配方和密度估算，品牌差异较大；包装标签优先。粉末用平勺，少量可换小量勺。'];
 if(doses.some(d=>['酱油','生抽','蚝油','郫县豆瓣酱','味噌','鸡精'].includes(d.name))&&!doses.some(d=>d.name==='盐'))notes.push('这份调味已含咸味酱料，不再另外加盐。');
 if(reducedSalt)notes.push('已为含盐加工食材下调本餐咸味调料；不要按原份量补回。');
 if(sesame)notes.push('芝麻油已计入本餐总用油量。');
 return {flavor:flavor.name,seasoning,oil,doses,aromaStep,sauceStep,finishStep,notes,kcal:oil*8.28+doses.reduce((v,d)=>v+d.ml*estimates[d.name][0],0),salt:doses.reduce((v,d)=>v+d.ml*estimates[d.name][1],0)};
}
