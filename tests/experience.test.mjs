import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshPlan,mealIdentity,priorityReport,enrichMeals,zero,restoreFavorites,saveRecipe} from '../api/api-entry.js';
const inventory=[{id:'egg',priority:false},{id:'tofu',priority:true},{id:'broccoli',priority:false},{id:'mushroom',priority:true},{id:'rice',priority:false}];
const settings={healthy:true,weight:58,height:172,calorie:2100,spoon:15,cuisine:'轮换',sauces:['酱油','黑胡椒','味淋'],excluded:[],other:zero(),seed:0};
const options={slots:['午饭','晚饭'],quick:false};
test('近期搭配去重同时保留先吃优先级',()=>{
 const a=freshPlan(inventory,settings,options,[],0);const history=a.plan.meals.map(mealIdentity);const b=freshPlan(inventory,settings,options,history,0);
 assert.notDeepEqual(b.plan.meals.map(mealIdentity),history);assert.ok(b.plan.meals.every(m=>m.items.some(i=>i.id==='tofu')));
 const report=priorityReport(inventory,settings,options,b.plan.meals);assert.ok(report.every(i=>i.used));
 const excluded=priorityReport(inventory,{...settings,excluded:['tofu']},options,[]);assert.equal(excluded.find(i=>i.id==='tofu').reason,'已设为不吃');
});
test('逐菜显示状态、部分失败继续且保留本地做法',async()=>{
 const base=freshPlan(inventory,settings,options,[],0).plan;let calls=0;const states=[];
 const result=await enrichMeals(base,async m=>{if(calls++===0)throw Error('test outage');return {...m,aiState:'done',aiModel:'test-model'};},p=>states.push(p.meals.map(m=>m.aiState)),()=>true);
 assert.equal(calls,2);assert.equal(result.meals[0].aiState,'failed');assert.deepEqual(result.meals[0].steps,base.meals[0].steps);assert.equal(result.meals[1].aiState,'done');assert.deepEqual(states[0],['pending',undefined]);
});
test('设置改变后不写入旧 AI 结果，中断状态可重试',async()=>{
 const base=freshPlan(inventory,settings,options,[],0).plan;let valid=true,updates=0,calls=0;
 await enrichMeals(base,async m=>{calls++;valid=false;return {...m,title:'stale'};},()=>updates++,()=>valid);
 assert.equal(calls,1);assert.equal(updates,1);
 const restored=restoreFavorites([saveRecipe({...base.meals[0],aiState:'pending'},15)]);assert.equal(restored[0].meal.aiState,'failed');
});
