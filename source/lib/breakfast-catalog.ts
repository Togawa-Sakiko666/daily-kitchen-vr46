import type {Food} from './kitchen';
// Approximate generic values per 100 g; branded products should use their label.
export const breakfastFoods:Food[]=[
 {id:'bread',name:'原味吐司',jp:'食パン',group:'extra',category:'主食',kcal:248,protein:8.9,fiber:4.2,salt:1.2,tags:['碳水化合物'],aliases:'面包 トースト',note:'早餐与快手餐使用。按普通吐司估算，每片厚度不同；包装标签优先。'},
 {id:'wholebread',name:'全麦面包',jp:'全粒粉パン',group:'extra',category:'主食',kcal:251,protein:8.8,fiber:4.5,salt:1.2,tags:['膳食纤维'],aliases:'吐司 食パン',note:'早餐与快手餐使用。全麦比例因品牌而异，营养为通用估值。'},
 {id:'milk',name:'牛奶',jp:'牛乳',group:'extra',category:'水果与乳品',kcal:61,protein:3.3,fiber:0,salt:0.1,tags:['钙'],note:'以普通牛奶估算。200 mL 约按 206 g 计；低脂奶、调味奶请按标签自定义。'},
 {id:'soymilk',name:'无糖豆奶',jp:'無調整豆乳',group:'extra',category:'水果与乳品',kcal:43,protein:3.6,fiber:0.2,salt:0,tags:['植物蛋白'],aliases:'豆乳 豆浆',note:'不默认强化钙。早餐与快手餐使用；营养为通用估值，品牌标签优先。'},
 {id:'natto',name:'纳豆（不含酱包）',jp:'納豆',group:'extra',category:'蛋与豆制品',kcal:184,protein:16.5,fiber:6.7,salt:0,tags:['膳食纤维','植物蛋白'],note:'早餐与快手餐使用。每盒通常约 40–50 g；本估值不含酱包，不自动添加酱包。'},
];
