import type {Food} from './kitchen';
const preparations:Record<string,string>={
 broccoli:'切小朵，洗净后先煮 2–3 分钟，再沥水入锅。',komatsuna:'洗净切段，茎叶分开，茎先下锅、叶后下锅。',spinach:'洗净后先焯水约 1 分钟，沥水切段，临近出锅时加入。',
 cabbage:'洗净切片，较硬的梗切薄，先炒梗再炒叶。',hakusai:'洗净切段，菜帮切薄，先炒菜帮再炒叶。',pepper:'去蒂去籽切条，翻炒 2–3 分钟至熟。',carrot:'去皮切薄片，先煮 2–3 分钟至稍软。',
 tomato:'洗净去蒂切块，临近出锅时翻炒 1–2 分钟。',onion:'去皮切丝，先炒约 2 分钟至变软。',negi:'洗净切斜段，先炒约 2 分钟。',mushroom:'去硬根，拆小簇或切片，炒 4–5 分钟至熟透。',
 potato:'去皮切块，另煮 15–20 分钟至筷子能轻松穿透。',sweet:'洗净切块，另煮 15–20 分钟至软透。',
};
export function preparation(food:Food){return food.prep??preparations[food.id]??'洗净去掉不可食部分，按所选做法切成适口大小。';}
export function proteinMethod(food:Food){
 const key=food.cook??({chicken:'chicken',breast:'chicken',pork:'pork',beef:'beef',salmon:'fish',mackerel:'fish',shrimp:'shrimp',egg:'egg',tofu:'tofu',beans:'beans'} as Record<string,string>)[food.id];
 const methods:Record<string,string>={
 chicken:'去筋膜后切约 2 cm 小块；用本餐油的一部分中小火煎 3–4 分钟，翻面再煎 3–4 分钟，按厚度延长。中心达到 75°C 并保持至少 1 分钟后盛出。',
 chicken_skin:'保留鸡皮，去骨切约 2 cm 小块。皮朝下中小火煎出油，翻面煎熟；中心达到 75°C 并保持至少 1 分钟。锅内油脂过多可倒出，不再追加油。',
 pork:'切成薄片，用本餐油的一部分中火翻炒约 4–6 分钟，时间按厚度调整；中心达到 75°C 并保持至少 1 分钟后盛出。',
 pork_fat:'薄片切段，中小火煸出自身油脂，翻炒至中心达到 75°C 并保持至少 1 分钟。多余油脂倒出，后续用锅内余油炒菜，不重复加油。',
 beef:'本方案切成薄片快炒，用本餐油的一部分中火炒约 3–5 分钟，中心达到 75°C 并保持至少 1 分钟后盛出；厚块需要延长，不按颜色判断熟度。',
 mince:'用锅铲打散成小颗粒，中火炒约 5–7 分钟，避免大块结团；中心达到 75°C 并保持至少 1 分钟。肉末不沿用整块牛排的熟度规则。',
 fish:'擦干、去刺，用本餐油的一部分中小火煎两面各约 4–5 分钟，中心达到 75°C 并保持至少 1 分钟；厚块延长。',
 salted_fish:'检查并去除鱼刺，擦干表面；已含盐，不再腌制。用本餐油的一部分，中小火煎两面各约 4–5 分钟，厚块延长，中心达到 75°C 并保持至少 1 分钟；包装烹调要求优先。单独装盘，不回锅裹酱。',
 marinated_fish:'检查小刺，按包装要求处理表面多余腌料，不再加盐或酱油。用本餐油的一部分，小火煎两面各约 4–5 分钟防止糖和味噌烧焦；按厚度延长，中心达到 75°C 并保持至少 1 分钟。包装加热方法优先，只有明确标示可微波的容器才可入微波炉。单独装盘，不回锅裹酱。',
 shrimp:'去壳去虾线并沥干，用本餐油的一部分翻炒约 3–5 分钟，中心达到 75°C 并保持至少 1 分钟；时间随大小调整。',
 egg:'打散，用本餐油的一部分中小火炒至完全凝固后盛出，其余油留给蔬菜，不重复加油。',
 tofu:'沥干切块，用本餐油的一部分中小火煎两面各 2–3 分钟；回锅时轻翻，避免弄碎。',
 beans:'使用已煮熟、无盐的豆，沥水后在收尾时加入，加热 3–5 分钟至整体热透；冷冻熟毛豆按包装先加热，不能把生豆直接这样处理。',
 sausage:'按包装确认是已熟制香肠。按标示时间水煮或小火煎热，再切段与蔬菜拌匀；不同粗细按包装处理。生香肠不能套用本步骤，应另按生肉充分加热。',
 ham:'确认包装食用方法后切片或切条，随蔬菜回锅加热至热透；需加热的产品以包装要求为准。',
 bacon:'切小片，中小火煎出油，按包装要求充分加热；多余油脂倒出，用余油炒蔬菜，后续不重复加油。',
 };
 return methods[key]??'按包装或已确认的食材专用方法充分加热；不确定做法时先不要安排烹饪。';
}
export const quickVegetables=new Set(['lettuce','cucumber','chives','shungiku','spinach','tomato']);

type CookingPart={food:Food;name:string;grams:number};
type FlavorPlan={flavor:string;oil:number;doses:{name:string;ml:number;stage:string}[]};
// Compose a chronological recipe from cooking operations, never from catalogue prose.
export function recipeSteps(parts:CookingPart[],flavor:FlavorPlan,spoon:number,measure:(ml:number,spoon:number)=>string){
 const steps:string[]=[];const mains=parts.filter(p=>p.food.group==='protein'),veg=parts.filter(p=>p.food.group==='veg'),carbs=parts.filter(p=>p.food.group==='carb');
 const names=(p:CookingPart[])=>p.map(x=>x.name).join('、');
 const kind=(p:CookingPart)=>p.food.cook??({chicken:'chicken',breast:'chicken',pork:'pork',beef:'beef',salmon:'fish',mackerel:'fish',shrimp:'shrimp',egg:'egg',tofu:'tofu',beans:'beans'} as Record<string,string>)[p.food.id];
 const ginger=flavor.flavor==='姜汁酱香';
 const sauced=parts.some(p=>p.food.group==='veg'||(p.food.group==='protein'&&!p.food.preseasoned));
 const dose=(d:{name:string;ml:number})=>d.name+' '+measure(d.ml,spoon);
 const aroma=flavor.doses.filter(d=>d.stage==='aroma'&&!(ginger&&d.name==='姜'));
 const sauce=flavor.doses.filter(d=>d.stage==='sauce'||(ginger&&d.name==='姜'));
 const finish=flavor.doses.filter(d=>d.stage==='finish');
 const preboil:Record<string,string>={broccoli:'切小朵，粗茎削皮切薄片，沸水煮 2–3 分钟',carrot:'去皮切 2 mm 薄片，沸水煮 2–3 分钟',spinach:'洗净，沸水焯约 1 分钟后捞出过凉、挤水切段',eggplant:'去蒂切薄条，沸水煮 3–5 分钟至软',daikon:'去皮切 3 mm 薄片，沸水煮 5–8 分钟至软',lotus:'去皮切 2 mm 薄片，洗去淀粉，沸水煮 3–5 分钟',burdock:'刷净切细丝，沸水煮 5–8 分钟至能咬断',pumpkin:'去籽切薄片，水煮 8–12 分钟至筷子能穿透',okra:'洗净削去蒂部硬边，沸水煮 2–3 分钟后切段',asparagus:'去硬根、削去粗茎硬皮，切段，沸水煮 2–3 分钟',cauliflower:'切小朵洗净，沸水煮 3–4 分钟'};
 const cuts:Record<string,string>={onion:'去皮切约 5 mm 的丝',negi:'洗净，斜切约 2–3 cm 的段',pepper:'去蒂去籽，切约 1 cm 宽的条',paprika:'去蒂去籽切条',tomato:'洗净去蒂切小块',cucumber:'洗净切薄片',lettuce:'逐片洗净沥干，撕大片',zucchini:'洗净切 5 mm 半月片',greenchili:'去蒂切圈，处理后洗手',shishito:'洗净去蒂，表面划小口',enoki:'切去根部，拆散后切两段',shiitake:'去硬蒂切片',eringi:'切约 3 mm 薄片',button:'擦净或快速冲洗，去蒂端切片',maitake:'去硬根，撕成小簇',shimeji:'切去根部，拆成小簇',mushroom:'去硬根，拆小簇或切片'};
 const leafy=new Set(['komatsuna','cabbage','hakusai','bokchoy','shungiku','chives']);
 const boiled=veg.filter(p=>preboil[p.food.id]);
 const raw=veg.filter(p=>!preboil[p.food.id]);
 if(carbs.some(p=>['potato','sweet'].includes(p.food.id)))steps.push('先煮主食｜'+carbs.filter(p=>['potato','sweet'].includes(p.food.id)).map(p=>`${p.name} ${p.grams} g 洗净切约 2 cm 块${p.food.id==='potato'?'并去皮':''}，放小锅加足以没过食材的水，煮开后中小火煮 15–20 分钟；筷子能轻松穿透后沥水备用`).join('；')+'。煮主食时可以准备其他食材。');
 if(raw.length)steps.push('切配蔬菜｜'+raw.map(p=>`${p.name}：${cuts[p.food.id]??(leafy.has(p.food.id)?'洗净切约 3 cm 段，硬茎切薄，茎叶分开放':'洗净去不可食部分，切薄片')}`).join('；')+'。此时只切配，暂不下锅。');
 if(boiled.length)steps.push('预煮配菜｜'+boiled.map(p=>`${p.name}：${preboil[p.food.id]}，沥干备用`).join('；')+'。这部分已经预煮，稍后只需回锅热透；焯菜用水另备，倒掉，不计入酱汁。');
 if(sauced){steps.push(`${ginger?'调姜汁酱汁':'提前调味'}｜${ginger?'把清单中的姜磨成细泥，连汁使用。':''}${sauce.length?'小碗放入'+sauce.map(dose).join('、')+'，加水 '+measure(30,spoon)+' 搅匀'+(sauce.some(d=>d.name==='味噌'||d.name==='糖')?'，将味噌或糖充分化开':'')+'。':'量好水 '+measure(30,spoon)+'，留作回锅时润锅。'}另留水 ${measure(15,spoon)} 防粘锅，未用完的最后倒入锅内。${aroma.length?'另备'+aroma.map(dose).join('、')+'；蒜姜切末，暂不加入酱汁。':''}${finish.length?'收尾用的'+finish.map(dose).join('、')+'先放一旁。':''}`);}
 const oily=mains.some(p=>['chicken_skin','pork_fat','bacon'].includes(kind(p)));
 const oilText=measure(flavor.oil,spoon);
 steps.push(`分配用油｜本餐食用油共 ${oilText}，先量在小碟中。${oily?'带皮或肥肉先用自身油脂煎，粘锅时才从这份油里少量取用；后续配菜用锅内余油。':'先取这份油的一半润锅，剩余的留给后续需要煎炒的食材。'}后续提到的油都从这份里取，不另倒一份。`);
 const held:CookingPart[]=[],fish:CookingPart[]=[],late:CookingPart[]=[];
 for(const p of mains){const k=kind(p);const n=p.name;
  if(['beans','ham'].includes(k)){late.push(p);steps.push('准备'+n+'｜'+(k==='beans'?`${n}使用已煮熟的产品，沥水备用；冷冻熟豆先按包装加热，不使用生豆。`:`${n}按包装确认食用方法，切小片备用。`));continue;}
  if(k==='chicken_skin'||k==='chicken'){
   steps.push('处理'+n+'｜'+(k==='chicken_skin'?'保留鸡皮，':'去掉明显筋膜，')+'切成约 2 cm、厚薄一致的小块，用厨房纸吸干水分。生肉不用冲洗；处理完洗手并清洁刀和砧板。');
   steps.push('煎'+n+'｜平底锅中小火加热，'+(k==='chicken_skin'?'鸡皮朝下铺开，煎约 4–5 分钟；先别频繁翻动，等鸡皮上色、能自然离锅再翻面。':'用分配好的油润锅，鸡肉铺开，煎约 3–4 分钟再翻面。')+'另一面再煎约 3–4 分钟，厚块适当延长；中心达到 75°C 并保持至少 1 分钟。先盛在干净盘中'+(k==='chicken_skin'?'，锅里留下薄薄一层鸡油，多余油脂倒掉':'')+'。');
  }else if(k==='tofu'){
   steps.push('沥水切豆腐｜'+n+'倒掉盒里的水，用厨房纸吸干表面，静置沥水约 5 分钟，切约 1 cm 厚片。表面太湿容易溅油、粘锅。');
   steps.push('煎豆腐定型｜锅中小火，用分配好的油润锅，'+n+'平铺。第一面煎约 3 分钟，底部浅金黄、轻推能移动后再翻面；另一面煎 2–3 分钟。用锅铲托住盛出，后面只轻轻翻动。');
  }else if(k==='egg')steps.push('先炒鸡蛋｜'+n+'打散。锅中小火，用分配好的油润锅，倒入蛋液，等边缘凝固后向中间轻推，约 1–2 分钟至完全凝固，立刻盛出，避免一直炒到变硬。');
  else if(k==='mince')steps.push('炒散'+n+'｜锅中火，用分配好的油润锅，加入肉末后用锅铲压散，炒约 5–7 分钟至没有大团块；中心达到 75°C 并保持至少 1 分钟。盛出备用。肉末不沿用整块牛排的熟度规则。');
  else if(['fish','salted_fish','marinated_fish'].includes(k)){steps.push('单独煎'+n+'｜'+proteinMethod(p.food)+' 用宽锅铲托起，放在干净盘中，避免反复翻碎。'+(p.food.preseasoned?'鱼不再回锅裹酱；以下调味只给配菜。':'稍后把配菜放在旁边、酱汁少量淋在鱼上，不把鱼块混入锅中翻炒。'));fish.push(p);continue;}
  else steps.push('煎炒'+n+'｜'+proteinMethod(p.food)+(k==='sausage'?' 用干净盘子盛出备用。':' 熟后盛出备用。'));
  held.push(p);
 }
 if(aroma.length&&sauced)steps.push('小火炒香｜'+(mains.length?'保持主料盛出，锅转小火，用锅内余油':'锅转小火，用分配好的油')+'加入'+aroma.map(dose).join('、')+'，炒约 '+(aroma.some(d=>d.name==='郫县豆瓣酱')?'30–40':'15–20')+' 秒，闻到香味就进行下一步，别等蒜末发黑。');
 const mushrooms=raw.filter(p=>p.food.category==='菌菇'||p.food.id==='mushroom');
 const onions=raw.filter(p=>['onion','negi'].includes(p.food.id));
 const greens=raw.filter(p=>leafy.has(p.food.id));
 const fast=raw.filter(p=>['tomato','cucumber','lettuce'].includes(p.food.id));
 const firm=raw.filter(p=>!mushrooms.includes(p)&&!onions.includes(p)&&!greens.includes(p)&&!fast.includes(p));
 if(onions.length)steps.push('炒香'+names(onions)+'｜'+(aroma.length?'紧接着加入':'用锅内余油或预留的油下入')+names(onions)+'，中火炒约 2 分钟。'+(onions.some(p=>p.food.id==='negi')?'大葱切面略焦黄、葱香出来即可。':'洋葱边缘变透明、开始变软即可。')+'暂时留在锅中。');
 if(mushrooms.length)steps.push('炒熟'+names(mushrooms)+'｜加入'+names(mushrooms)+'，中火摊开，先煎约 1 分钟再翻动，继续翻炒约 3–4 分钟，直到菌菇出水后变软、彻底熟透。锅干时从预留的 '+measure(15,spoon)+' 水中少量加入，不靠追加油来防粘。');
 if(firm.length)steps.push('加入'+names(firm)+'｜'+firm.map(p=>`${p.name}中火翻炒${p.food.id==='zucchini'?' 3–5':' 2–3'}分钟，${['pepper','paprika','shishito'].includes(p.food.id)?'表面略起皱、断生后仍保留一点脆感':'炒至熟透'}`).join('；')+'。前面已炒好的配菜留在锅中，持续翻动以免局部焦糊。');
 if(greens.length)steps.push('炒叶菜｜先加入'+names(greens)+'的硬茎，中火炒约 1–2 分钟；再加入叶片炒约 1 分钟，至茎熟、叶片塌软。韭菜没有粗硬茎时整段一起下锅即可。');
 if(fast.length)steps.push('加入'+names(fast)+'｜'+fast.map(p=>p.food.id==='tomato'?`${p.name}中火炒约 2 分钟，轻压几块让汁水出来`:`${p.name}翻炒约 1 分钟，至刚变软`).join('；')+'。');
 if(boiled.length)steps.push('放入预煮配菜｜将沥干的'+names(boiled)+'加入锅中，中火轻翻约 1 分钟热透，不再重复焯煮。');
 if(late.length)steps.push('加热'+names(late)+'｜把'+names(late)+'加入锅中，加入预留水，中小火翻拌约 3–5 分钟至中心热透；包装要求更长时以包装为准。这一步用过的预留水后面不再重复加。');
 if(sauced){const tender=held.some(p=>['tofu','egg'].includes(kind(p)));const glaze=['轻照烧','姜汁酱香','味噌风味','家常糖醋'].includes(flavor.flavor);steps.push((glaze?'加酱汁收味':'回锅调味')+'｜'+(held.length?'将'+names(held)+'放回锅中，':'')+(sauce.length?'倒入小碗里调好的'+(ginger?'姜汁酱汁':'酱汁'):'加入备好的 '+measure(30,spoon)+' 水')+'，'+(late.length?'':'未用完的预留水也倒入。')+(tender?'中小火轻推、晃锅，让调味均匀沾上，约 1–2 分钟即可；已煎好的主料不必久煮，避免破碎或变硬。':glaze?'中小火煮约 2–3 分钟，边煮边翻面，让表面挂上薄薄一层汁；锅底仍留少量流动的汁就停火，不要烧干。':'中火翻匀约 1 分钟，让调味均匀附着；锅底留一点汁就可以，不必反复炒干。'));
 if(finish.length)steps.push('最后调香｜转小火，撒入或淋入'+finish.map(dose).join('、')+'，'+(held.some(p=>kind(p)==='tofu')?'轻晃锅':'翻拌')+'约 10 秒后关火。'+(finish.some(d=>d.name==='米醋'||d.name==='柠檬汁')?'酸味调料最后加入，避免久煮失去香味。':''));}
 steps.push('装盘｜'+(carbs.length?carbs.map(p=>['rice','brown'].includes(p.food.id)?`${p.name} ${p.grams} g 充分加热至中心滚烫后装碗`:`煮好的${p.name}装盘`).join('；')+'。':'')+(fish.length?'把'+names(fish)+'与配菜分开放好'+(fish.some(p=>!p.food.preseasoned)&&sauced?'，配菜汁可少量淋在未腌制的鱼上':'')+'。':'盛出锅里的菜，剩余少量酱汁淋在菜上即可。'));
 return steps;
}
