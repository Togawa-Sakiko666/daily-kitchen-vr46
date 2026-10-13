import {test} from 'node:test';
import assert from 'node:assert/strict';
process.env.LOGIN_USERNAME='chef';process.env.LOGIN_PASSWORD='test-password-only';process.env.SESSION_SECRET='test-secret-with-at-least-32-characters';process.env.APP_ORIGIN='http://localhost:3210';process.env.NODE_ENV='test';delete process.env.OPENAI_API_KEY;
const {createServer}=await import('../server.mjs');const {recipes}=await import('../recipes.mjs');
const {makeVisionRequest,parseVisionResponse,validateImages}=await import('../api/api-entry.js');
const meal={label:'午饭',title:'煎蛋',items:[{id:'egg',grams:50}],seasoning:['油：1/3勺'],steps:['备料'],notes:[],nutrition:{kcal:100}};
test('登录、页面保护、来源校验、退出、秘密隔离、缺少密钥',async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const post=(path,data,cookie='',origin=process.env.APP_ORIGIN)=>fetch(base+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(data)});
 try{
  assert.equal((await fetch(base+'/healthz')).status,200);assert.equal((await fetch(base+'/',{redirect:'manual'})).status,302);assert.equal((await post('/api/recipes',{})).status,401);
  assert.equal((await post('/api/login',{username:'chef',password:'bad'})).status,401);assert.equal((await post('/api/login',{},'','https://evil.test')).status,403);
  const r=await post('/api/login',{username:'chef',password:'test-password-only'});assert.equal(r.status,200);const set=r.headers.get('set-cookie');assert.match(set,/HttpOnly/);assert.match(set,/SameSite=Strict/);const cookie=set.split(';')[0];
  assert.equal((await fetch(base+'/',{headers:{cookie}})).status,200);
  for(const path of ['/.env.local','/server.mjs','/source/app/page.tsx','/%2e%2e%2fserver.mjs'])assert.equal((await fetch(base+path,{headers:{cookie}})).status,404);
  assert.equal((await (await fetch(base+'/api/identify',{headers:{cookie}})).json()).ready,false);
  assert.equal((await post('/api/identify',{images:['https://evil.test']},cookie)).status,400);
  const missing=await post('/api/recipes',{meals:[meal],spoon:15},cookie);assert.equal(missing.status,502);assert.match((await missing.json()).error,/OPENAI_API_KEY/);
  assert.equal((await post('/api/logout',{},cookie)).status,200);assert.equal((await fetch(base+'/api/identify',{headers:{cookie}})).status,401);
 }finally{await new Promise(r=>server.close(r));}
});
test('逐菜调用、保存食材调料营养、拒绝错误 AI 返回',async()=>{
 process.env.OPENAI_API_KEY='mock-test-only';const original=globalThis.fetch;let requests=[];
 globalThis.fetch=async(url,options)=>{const payload=JSON.parse(options.body);requests.push(payload);const input=JSON.parse(payload.input);assert.equal(input.length,1);return {ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({recipes:[{index:input[0].index,title:input[0].title,steps:['备料｜洗切','下锅｜中小火煎','装盘｜确认熟透'],minutes:10}]})}]}]})};};
 try{const r=await recipes({meals:[meal,{...meal,label:'晚饭'}],spoon:15});assert.equal(requests.length,2);assert.equal(requests[0].store,false);assert.deepEqual(r.meals[0].items,meal.items);assert.deepEqual(r.meals[0].nutrition,meal.nutrition);assert.deepEqual(r.meals[0].seasoning,meal.seasoning);await assert.rejects(()=>recipes({meals:[meal],spoon:0}));
 globalThis.fetch=async()=>({ok:true,json:async()=>({output:[{content:[{type:'output_text',text:'{"recipes":[]}'}]}]})});await assert.rejects(()=>recipes({meals:[meal],spoon:15}));
 }finally{globalThis.fetch=original;delete process.env.OPENAI_API_KEY;}
});
test('照片协议、识图结构解析',()=>{
 const image='data:image/png;base64,aGVsbG8=';assert.deepEqual(validateImages({images:[image]}),[image]);assert.throws(()=>validateImages({images:['https://example.com']}));assert.equal(makeVisionRequest([image],'gpt-4.1-mini').input[0].content[1].type,'input_image');
 const value={items:[{id:'egg',name:'鸡蛋',grams:null,templateId:null,confidence:'high',note:'核对数量'}],notes:'核对后添加'};assert.deepEqual(parseVisionResponse({output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]}),value);assert.throws(()=>parseVisionResponse({output:[]}));
});
test('原有食材、收藏、自动保存数据可恢复',async()=>{
 const {writeKitchen,saveRecipe,restoreFavorites,generateDayPlan,defaultOptions,zero,restoreIngredients}=await import('../api/api-entry.js');
 const inventory=[{id:'egg',priority:true},{id:'rice',priority:false},{id:'broccoli',priority:false}];
 const settings={healthy:true,weight:58,height:172,calorie:2100,spoon:15,cuisine:'轮换',sauces:['酱油','黑胡椒','味淋'],excluded:[],other:zero(),seed:0};
 const plan=generateDayPlan(inventory,settings,defaultOptions);assert.equal(plan.meals.length,3);
 const favorite=saveRecipe(plan.meals[0],15);let value;const storage={setItem:(k,v)=>{value=v;},getItem:()=>value};writeKitchen(storage,{inventory,settings,favorites:[favorite],result:plan});
 const restored=JSON.parse(value);assert.deepEqual(restoreIngredients(restored.inventory),inventory);assert.deepEqual(restoreFavorites(restored.favorites),[favorite]);assert.deepEqual(restored.result,plan);
});
test('先吃始终优先于随机轮换，单餐/换菜种子/早餐和快手限制',async()=>{
 const {generateDayPlan,zero}=await import('../api/api-entry.js');
 const base={healthy:false,weight:58,height:172,calorie:2100,spoon:15,cuisine:'轮换',sauces:['酱油','黑胡椒'],excluded:[],other:zero()};
 const inventory=[{id:'chicken',priority:false},{id:'egg',priority:false},{id:'tofu',priority:true},{id:'broccoli',priority:false},{id:'onion',priority:false},{id:'mushroom',priority:true},{id:'rice',priority:false}];
 for(let seed=0;seed<20;seed++)for(const slots of [['午饭'],['晚饭'],['午饭','晚饭']]){
  const plan=generateDayPlan(inventory,{...base,seed},{slots,quick:false});
  for(const meal of plan.meals){assert.equal(meal.items[0].id,'tofu',`seed ${seed} ${meal.label} must choose priority protein`);assert.ok(meal.items.some(i=>i.id==='mushroom'),`seed ${seed} ${meal.label} must include priority vegetable`);}
 }
 const excluded=generateDayPlan(inventory,{...base,seed:7,excluded:['tofu','mushroom']},{slots:['午饭'],quick:false});assert.ok(excluded.meals.every(m=>m.items.every(i=>!['tofu','mushroom'].includes(i.id))));assert.ok(excluded.gaps.some(g=>g.includes('排除设置优先')));
 const quick=generateDayPlan([{id:'chicken',priority:true},{id:'egg',priority:false},{id:'rice',priority:false}],{...base,seed:2},{slots:['午饭'],quick:true});assert.ok(quick.gaps.some(g=>g.includes('关闭快手模式')));
 const breakfast=generateDayPlan([{id:'chicken',priority:true},{id:'egg',priority:false},{id:'rice',priority:false}],{...base,seed:2},{slots:['早餐'],quick:false});assert.ok(breakfast.gaps.some(g=>g.includes('简单早餐')));
 const multiple=generateDayPlan(inventory.map(i=>i.id==='chicken'?{...i,priority:true}:i),{...base,seed:1},{slots:['午饭','晚饭'],quick:false});assert.deepEqual(new Set(multiple.meals.map(m=>m.items[0].id)),new Set(['chicken','tofu']));
});
