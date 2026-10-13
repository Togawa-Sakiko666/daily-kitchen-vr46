import type {Food} from './kitchen';
// 出典：日本食品標準成分表（八訂）増補2023年（2026-03-27 更新）。
// Data: https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_02.xlsx
// Per 100 g edible portion; processed meats as sold, edamame cooked unsalted, others raw.
export const extraFoods:Food[] = [
 {
  "id": "sprouts",
  "name": "绿豆芽",
  "jp": "緑豆もやし",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 15,
  "protein": 1.8,
  "fiber": 1.3,
  "salt": 0,
  "tags": [],
  "prep": "豆芽洗净沥干，去掉明显变色部分；翻炒至整体热透、无生味。",
  "sourceCode": "06291",
  "sourceName": "（もやし類）　りょくとうもやし　生"
 },
 {
  "id": "eggplant",
  "name": "茄子",
  "jp": "なす",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 18,
  "protein": 1.1,
  "fiber": 2.2,
  "salt": 0.0,
  "tags": [],
  "prep": "茄子去蒂切薄条，先用沸水煮 3–5 分钟至软，再沥水入锅，避免靠大量油煎软。",
  "sourceCode": "06191",
  "sourceName": "（なす類）　なす　果実　生"
 },
 {
  "id": "daikon",
  "name": "白萝卜",
  "jp": "大根",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 15,
  "protein": 0.4,
  "fiber": 1.3,
  "salt": 0.0,
  "tags": [],
  "prep": "白萝卜去皮切 3–5 mm 薄片，先用水煮 5–8 分钟至软，再沥水入锅。",
  "sourceCode": "06134",
  "sourceName": "（だいこん類）　だいこん　根　皮なし　生"
 },
 {
  "id": "lotus",
  "name": "莲藕",
  "jp": "れんこん",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 66,
  "protein": 1.9,
  "fiber": 2.0,
  "salt": 0.1,
  "tags": [
   "维生素C",
   "B族"
  ],
  "prep": "莲藕去皮切 2–3 mm 薄片，清水洗去表面淀粉，先煮 3–5 分钟再入锅。",
  "sourceCode": "06317",
  "sourceName": "れんこん　根茎　生"
 },
 {
  "id": "burdock",
  "name": "牛蒡",
  "jp": "ごぼう",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 58,
  "protein": 1.8,
  "fiber": 5.7,
  "salt": 0.0,
  "tags": [
   "叶酸",
   "膳食纤维"
  ],
  "prep": "牛蒡刷洗干净切细丝，先煮 5–8 分钟至可咬断，再沥水入锅。",
  "sourceCode": "06084",
  "sourceName": "（ごぼう類）　ごぼう　根　生"
 },
 {
  "id": "pumpkin",
  "name": "南瓜",
  "jp": "西洋かぼちゃ",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 78,
  "protein": 1.9,
  "fiber": 3.5,
  "salt": 0,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸",
   "膳食纤维"
  ],
  "prep": "南瓜去籽切薄片，先用水煮 8–12 分钟至筷子能穿透，再轻轻翻炒。",
  "sourceCode": "06048",
  "sourceName": "（かぼちゃ類）　西洋かぼちゃ　果実　生"
 },
 {
  "id": "lettuce",
  "name": "生菜",
  "jp": "レタス",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 11,
  "protein": 0.6,
  "fiber": 1.1,
  "salt": 0.0,
  "tags": [
   "叶酸"
  ],
  "prep": "生菜逐片洗净沥干，撕成大片，最后入锅炒至刚变软。",
  "sourceCode": "06312",
  "sourceName": "（レタス類）　レタス　土耕栽培　結球葉　生"
 },
 {
  "id": "cucumber",
  "name": "黄瓜",
  "jp": "きゅうり",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 13,
  "protein": 1.0,
  "fiber": 1.1,
  "salt": 0.0,
  "tags": [],
  "prep": "黄瓜洗净切薄片，最后入锅快炒，保留脆感。",
  "sourceCode": "06065",
  "sourceName": "きゅうり　果実　生"
 },
 {
  "id": "zucchini",
  "name": "西葫芦",
  "jp": "ズッキーニ",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 16,
  "protein": 1.3,
  "fiber": 1.3,
  "salt": 0.0,
  "tags": [
   "维生素C"
  ],
  "prep": "西葫芦洗净切约 5 mm 半月片，翻炒 3–5 分钟至熟。",
  "sourceCode": "06116",
  "sourceName": "ズッキーニ　果実　生"
 },
 {
  "id": "okra",
  "name": "秋葵",
  "jp": "オクラ",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 26,
  "protein": 2.1,
  "fiber": 5.0,
  "salt": 0,
  "tags": [
   "叶酸",
   "钙",
   "膳食纤维"
  ],
  "prep": "秋葵洗净，削去蒂部硬边，先煮 2–3 分钟，再切段入锅。",
  "sourceCode": "06032",
  "sourceName": "オクラ　果実　生"
 },
 {
  "id": "asparagus",
  "name": "芦笋",
  "jp": "アスパラガス",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 21,
  "protein": 2.6,
  "fiber": 1.8,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "叶酸",
   "B族"
  ],
  "prep": "芦笋去硬根，粗茎削去下半段硬皮，切段后先煮 2–3 分钟。",
  "sourceCode": "06007",
  "sourceName": "アスパラガス　若茎　生"
 },
 {
  "id": "cauliflower",
  "name": "白花椰菜",
  "jp": "カリフラワー",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 28,
  "protein": 3.0,
  "fiber": 2.9,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "叶酸"
  ],
  "prep": "花椰菜切小朵，洗净后先煮 3–4 分钟，再入锅炒匀。",
  "sourceCode": "06054",
  "sourceName": "カリフラワー　花序　生"
 },
 {
  "id": "chives",
  "name": "韭菜",
  "jp": "にら",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 18,
  "protein": 1.7,
  "fiber": 2.7,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸"
  ],
  "prep": "韭菜洗净切 3 cm 段，最后入锅炒至熟。",
  "sourceCode": "06207",
  "sourceName": "（にら類）　にら　葉　生"
 },
 {
  "id": "shungiku",
  "name": "茼蒿",
  "jp": "春菊",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 20,
  "protein": 2.3,
  "fiber": 3.2,
  "salt": 0.2,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸",
   "钙",
   "膳食纤维",
   "B族"
  ],
  "prep": "茼蒿洗净切段，粗茎先下锅，叶子后下锅炒至熟。",
  "sourceCode": "06099",
  "sourceName": "しゅんぎく　葉　生"
 },
 {
  "id": "bokchoy",
  "name": "青梗菜（上海青）",
  "jp": "チンゲンサイ",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 9,
  "protein": 0.6,
  "fiber": 1.2,
  "salt": 0.1,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸",
   "钙"
  ],
  "prep": "青梗菜逐片洗净，茎叶分开；茎先炒，叶后炒。",
  "sourceCode": "06160",
  "sourceName": "チンゲンサイ　葉　生"
 },
 {
  "id": "greenchili",
  "name": "青辣椒",
  "jp": "青とうがらし",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 72,
  "protein": 3.9,
  "fiber": 10.3,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸",
   "膳食纤维",
   "B族"
  ],
  "prep": "青辣椒去蒂切圈，先少量使用；辣度因品种而异，处理后洗手。",
  "sourceCode": "06171",
  "sourceName": "とうがらし　果実　生",
  "aliases": "青唐辛子 青とうがらし 唐辛子 辣椒"
 },
 {
  "id": "shishito",
  "name": "狮子唐椒",
  "jp": "ししとう",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 24,
  "protein": 1.9,
  "fiber": 3.6,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "膳食纤维"
  ],
  "prep": "狮子唐椒洗净去蒂，表面划小口后翻炒；偶有较辣的个体。",
  "sourceCode": "06093",
  "sourceName": "（ししとう類）　ししとう　果実　生"
 },
 {
  "id": "paprika",
  "name": "红甜椒",
  "jp": "赤パプリカ",
  "category": "蔬菜",
  "group": "veg",
  "kcal": 28,
  "protein": 1.0,
  "fiber": 1.6,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "维生素A",
   "叶酸"
  ],
  "prep": "红甜椒去蒂去籽切条，炒 2–3 分钟至熟。",
  "sourceCode": "06247",
  "sourceName": "（ピーマン類）　赤ピーマン　果実　生"
 },
 {
  "id": "shimeji",
  "name": "真姬菇（蟹味菇/白玉菇）",
  "jp": "ぶなしめじ・ぶなぴー",
  "category": "菌菇",
  "group": "veg",
  "kcal": 26,
  "protein": 2.7,
  "fiber": 3.0,
  "salt": 0.0,
  "tags": [
   "膳食纤维",
   "B族"
  ],
  "prep": "真姬菇切去根部，拆成小簇，炒 4–5 分钟至彻底熟透。",
  "sourceCode": "08016",
  "sourceName": "（しめじ類）　ぶなしめじ　生",
  "aliases": "蟹味菇 白玉菇 海鲜菇 しめじ ブナピー"
 },
 {
  "id": "enoki",
  "name": "金针菇",
  "jp": "えのき",
  "category": "菌菇",
  "group": "veg",
  "kcal": 34,
  "protein": 2.7,
  "fiber": 3.9,
  "salt": 0.0,
  "tags": [
   "叶酸",
   "膳食纤维",
   "B族"
  ],
  "prep": "金针菇切去根部，分散后切两段，炒或煮 3–5 分钟至彻底熟透，不生吃。",
  "sourceCode": "08001",
  "sourceName": "えのきたけ　生"
 },
 {
  "id": "shiitake",
  "name": "鲜香菇",
  "jp": "生しいたけ",
  "category": "菌菇",
  "group": "veg",
  "kcal": 25,
  "protein": 3.1,
  "fiber": 4.9,
  "salt": 0.0,
  "tags": [
   "叶酸",
   "膳食纤维",
   "B族"
  ],
  "prep": "鲜香菇去硬蒂切片，炒 4–5 分钟至熟透；这里不是干香菇。",
  "sourceCode": "08039",
  "sourceName": "しいたけ　生しいたけ　菌床栽培　生"
 },
 {
  "id": "maitake",
  "name": "舞茸",
  "jp": "まいたけ",
  "category": "菌菇",
  "group": "veg",
  "kcal": 22,
  "protein": 2.0,
  "fiber": 3.5,
  "salt": 0.0,
  "tags": [
   "维生素D",
   "叶酸",
   "膳食纤维",
   "B族"
  ],
  "prep": "舞茸去掉硬根，撕成小簇，炒 4–5 分钟至熟透。",
  "sourceCode": "08028",
  "sourceName": "まいたけ　生"
 },
 {
  "id": "eringi",
  "name": "杏鲍菇",
  "jp": "エリンギ",
  "category": "菌菇",
  "group": "veg",
  "kcal": 31,
  "protein": 2.8,
  "fiber": 3.4,
  "salt": 0.0,
  "tags": [
   "维生素D",
   "叶酸",
   "膳食纤维",
   "B族"
  ],
  "prep": "杏鲍菇切约 3 mm 薄片或细条，炒 4–5 分钟至熟透。",
  "sourceCode": "08025",
  "sourceName": "（ひらたけ類）　エリンギ　生"
 },
 {
  "id": "button",
  "name": "口蘑",
  "jp": "マッシュルーム",
  "category": "菌菇",
  "group": "veg",
  "kcal": 15,
  "protein": 2.9,
  "fiber": 2.0,
  "salt": 0.0,
  "tags": [
   "B族"
  ],
  "prep": "口蘑去掉蒂端，擦净或快速冲洗后切片，炒 3–5 分钟至熟透。",
  "sourceCode": "08031",
  "sourceName": "マッシュルーム　生"
 },
 {
  "id": "chicken_skin",
  "name": "带皮鸡腿肉（去骨）",
  "jp": "鶏もも肉・皮つき",
  "category": "肉类",
  "group": "protein",
  "kcal": 190,
  "protein": 16.6,
  "fiber": 0.0,
  "salt": 0.2,
  "tags": [
   "B族"
  ],
  "cook": "chicken_skin",
  "sourceCode": "11221",
  "sourceName": "＜鳥肉類＞　にわとり　［若どり・主品目］　もも　皮つき　生",
  "note": "按连皮吃、去骨后的重量估算；如果去皮，请改选去皮鸡肉并重新称重。"
 },
 {
  "id": "breast_skin",
  "name": "带皮鸡胸肉（去骨）",
  "jp": "鶏むね肉・皮つき",
  "category": "肉类",
  "group": "protein",
  "kcal": 133,
  "protein": 21.3,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [],
  "cook": "chicken_skin",
  "sourceCode": "11219",
  "sourceName": "＜鳥肉類＞　にわとり　［若どり・主品目］　むね　皮つき　生",
  "note": "按连皮吃、去骨后的重量估算；如果去皮，请改选去皮鸡肉并重新称重。"
 },
 {
  "id": "tenderloin",
  "name": "鸡里脊",
  "jp": "ささみ",
  "category": "肉类",
  "group": "protein",
  "kcal": 98,
  "protein": 23.9,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [],
  "cook": "chicken",
  "sourceCode": "11227",
  "sourceName": "＜鳥肉類＞　にわとり　［若どり・副品目］　ささみ　生"
 },
 {
  "id": "chicken_mince",
  "name": "鸡肉末",
  "jp": "鶏ひき肉",
  "category": "肉类",
  "group": "protein",
  "kcal": 171,
  "protein": 17.5,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "mince",
  "sourceCode": "11230",
  "sourceName": "＜鳥肉類＞　にわとり　［二次品目］　ひき肉　生"
 },
 {
  "id": "pork_belly",
  "name": "猪五花薄片",
  "jp": "豚バラ薄切り",
  "category": "肉类",
  "group": "protein",
  "kcal": 366,
  "protein": 14.4,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "pork_fat",
  "sourceCode": "11129",
  "sourceName": "＜畜肉類＞　ぶた　［大型種肉］　ばら　脂身つき　生",
  "maxPortion": 100,
  "note": "五花肉按带脂肪部分计，不套用瘦猪肉营养；健身模式减少份量。"
 },
 {
  "id": "pork_loin",
  "name": "猪外脊薄片（含脂肪）",
  "jp": "豚ロース薄切り",
  "category": "肉类",
  "group": "protein",
  "kcal": 248,
  "protein": 19.3,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "pork",
  "sourceCode": "11123",
  "sourceName": "＜畜肉類＞　ぶた　［大型種肉］　ロース　脂身つき　生"
 },
 {
  "id": "pork_shoulder",
  "name": "猪肩里脊薄片（梅花肉）",
  "jp": "豚肩ロース薄切り",
  "category": "肉类",
  "group": "protein",
  "kcal": 237,
  "protein": 17.1,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "pork",
  "sourceCode": "11119",
  "sourceName": "＜畜肉類＞　ぶた　［大型種肉］　かたロース　脂身つき　生"
 },
 {
  "id": "pork_tenderloin",
  "name": "猪里脊",
  "jp": "豚ヒレ",
  "category": "肉类",
  "group": "protein",
  "kcal": 118,
  "protein": 22.2,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "pork",
  "sourceCode": "11140",
  "sourceName": "＜畜肉類＞　ぶた　［大型種肉］　ヒレ　赤肉　生"
 },
 {
  "id": "pork_mince",
  "name": "猪肉末",
  "jp": "豚ひき肉",
  "category": "肉类",
  "group": "protein",
  "kcal": 209,
  "protein": 17.7,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "mince",
  "sourceCode": "11163",
  "sourceName": "＜畜肉類＞　ぶた　［ひき肉］　生"
 },
 {
  "id": "beef_shoulder",
  "name": "牛肩薄片（普通牛肉）",
  "jp": "牛肩薄切り",
  "category": "肉类",
  "group": "protein",
  "kcal": 160,
  "protein": 19.0,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "beef",
  "sourceCode": "11060",
  "sourceName": "＜畜肉類＞　うし　［輸入牛肉］　かた　脂身つき　生"
 },
 {
  "id": "beef_chuck",
  "name": "牛肩里脊薄片（普通牛肉）",
  "jp": "牛肩ロース薄切り",
  "category": "肉类",
  "group": "protein",
  "kcal": 221,
  "protein": 17.9,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [
   "B族"
  ],
  "cook": "beef",
  "sourceCode": "11064",
  "sourceName": "＜畜肉類＞　うし　［輸入牛肉］　かたロース　脂身つき　生"
 },
 {
  "id": "beef_sirloin",
  "name": "牛外脊（普通牛肉）",
  "jp": "牛サーロイン",
  "category": "肉类",
  "group": "protein",
  "kcal": 273,
  "protein": 17.4,
  "fiber": 0.0,
  "salt": 0.1,
  "tags": [],
  "cook": "beef",
  "sourceCode": "11071",
  "sourceName": "＜畜肉類＞　うし　［輸入牛肉］　サーロイン　脂身つき　生"
 },
 {
  "id": "beef_mince",
  "name": "牛肉末",
  "jp": "牛ひき肉",
  "category": "肉类",
  "group": "protein",
  "kcal": 251,
  "protein": 17.1,
  "fiber": 0.0,
  "salt": 0.2,
  "tags": [
   "B族"
  ],
  "cook": "mince",
  "sourceCode": "11089",
  "sourceName": "＜畜肉類＞　うし　［ひき肉］　生"
 },
 {
  "id": "sausage",
  "name": "维也纳香肠（熟制）",
  "jp": "ウインナー",
  "category": "香肠与加工肉",
  "group": "protein",
  "kcal": 319,
  "protein": 11.5,
  "fiber": 0.0,
  "salt": 1.9,
  "tags": [
   "维生素C",
   "B族"
  ],
  "cook": "sausage",
  "sourceCode": "11186",
  "sourceName": "＜畜肉類＞　ぶた　［ソーセージ類］　ウインナーソーセージ　ウインナーソーセージ",
  "processed": true,
  "maxPortion": 50,
  "note": "加工肉营养按标准成分表估算；不同品牌请优先录入包装数据。香肠按已熟制产品处理，生香肠不能套用。",
  "aliases": "ソーセージ ウィンナー 香肠 火腿肠 热狗肠"
 },
 {
  "id": "frankfurter",
  "name": "法兰克福香肠（熟制）",
  "jp": "フランクフルト",
  "category": "香肠与加工肉",
  "group": "protein",
  "kcal": 295,
  "protein": 12.7,
  "fiber": 0.0,
  "salt": 1.9,
  "tags": [
   "B族"
  ],
  "cook": "sausage",
  "sourceCode": "11189",
  "sourceName": "＜畜肉類＞　ぶた　［ソーセージ類］　フランクフルトソーセージ",
  "processed": true,
  "maxPortion": 50,
  "note": "加工肉营养按标准成分表估算；不同品牌请优先录入包装数据。香肠按已熟制产品处理，生香肠不能套用。"
 },
 {
  "id": "fish_sausage",
  "name": "鱼肉香肠（熟制）",
  "jp": "魚肉ソーセージ",
  "category": "香肠与加工肉",
  "group": "protein",
  "kcal": 158,
  "protein": 11.5,
  "fiber": 0.0,
  "salt": 2.1,
  "tags": [
   "钙",
   "B族"
  ],
  "cook": "sausage",
  "sourceCode": "10388",
  "sourceName": "＜水産練り製品＞　魚肉ソーセージ",
  "processed": true,
  "maxPortion": 50,
  "note": "加工肉营养按标准成分表估算；不同品牌请优先录入包装数据。香肠按已熟制产品处理，生香肠不能套用。"
 },
 {
  "id": "ham",
  "name": "切片火腿",
  "jp": "ロースハム",
  "category": "香肠与加工肉",
  "group": "protein",
  "kcal": 211,
  "protein": 18.6,
  "fiber": 0.0,
  "salt": 2.3,
  "tags": [
   "维生素C",
   "B族"
  ],
  "cook": "ham",
  "sourceCode": "11176",
  "sourceName": "＜畜肉類＞　ぶた　［ハム類］　ロースハム　ロースハム",
  "processed": true,
  "maxPortion": 50,
  "note": "加工肉营养按标准成分表估算；不同品牌请优先录入包装数据。香肠按已熟制产品处理，生香肠不能套用。"
 },
 {
  "id": "bacon",
  "name": "培根",
  "jp": "ベーコン",
  "category": "香肠与加工肉",
  "group": "protein",
  "kcal": 241,
  "protein": 15.4,
  "fiber": 0.0,
  "salt": 2.6,
  "tags": [
   "维生素C",
   "B族"
  ],
  "cook": "bacon",
  "sourceCode": "11183",
  "sourceName": "＜畜肉類＞　ぶた　［ベーコン類］　ばらベーコン　ばらベーコン　",
  "processed": true,
  "maxPortion": 30,
  "note": "加工肉营养按标准成分表估算；不同品牌请优先录入包装数据。香肠按已熟制产品处理，生香肠不能套用。"
 },
 {
  "id": "mixed_mince",
  "name": "牛猪混合肉末",
  "jp": "牛豚合いびき肉",
  "category": "肉类",
  "group": "protein",
  "kcal": 230.0,
  "protein": 17.4,
  "fiber": 0.0,
  "salt": 0.15,
  "tags": [],
  "cook": "mince",
  "sourceCode": "11089+11163",
  "note": "牛猪比例暂按 1:1 估算，实际配比和脂肪含量以包装为准。",
  "aliases": "合挽き 合い挽き 合挽肉 混合肉馅"
 },
 {
  "id": "edamame",
  "name": "熟毛豆仁（无盐）",
  "jp": "枝豆・ゆで・さやなし",
  "category": "蛋与豆制品",
  "group": "protein",
  "kcal": 118,
  "protein": 11.5,
  "fiber": 4.6,
  "salt": 0.0,
  "tags": [
   "维生素C",
   "叶酸",
   "钙",
   "膳食纤维",
   "B族"
  ],
  "cook": "beans",
  "sourceCode": "06016",
  "note": "按去荚后的熟豆仁重量；有盐冷冻毛豆需另计包装标示的盐分。"
 }
];
