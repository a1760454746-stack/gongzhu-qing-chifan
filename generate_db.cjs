const fs = require('fs');

const images = {
  mutton: 'https://images.unsplash.com/photo-1548943487-a2e4d43b4850?w=400&q=80',
  milktea: 'https://images.unsplash.com/photo-1558855567-1a3af4b0a424?w=400&q=80',
  burger: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=400&q=80',
  bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  noodles: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80',
  sichuan: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
  fish: 'https://images.unsplash.com/photo-1580959375944-c7c70c258ebf?w=400&q=80',
  luwei: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80'
};

// 真实品牌Logo (使用维基百科或高质量占位符)
const logos = {
  mcdonalds: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/500px-McDonald%27s_Golden_Arches.svg.png',
  kfc: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/500px-KFC_logo.svg.png',
  luckin: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Luckin_Coffee_logo.svg/500px-Luckin_Coffee_logo.svg.png',
  mixue: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Mixue_Bingcheng_logo.svg/500px-Mixue_Bingcheng_logo.svg.png',
  starbucks: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/500px-Starbucks_Corporation_Logo_2011.svg.png',
  burgerking: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/500px-Burger_King_2020.svg.png',
  chabaidao: 'https://api.dicebear.com/7.x/initials/svg?seed=茶百道&backgroundColor=0055ff',
  juewei: 'https://api.dicebear.com/7.x/initials/svg?seed=绝味&backgroundColor=e60012',
  wallace: 'https://api.dicebear.com/7.x/initials/svg?seed=华莱士&backgroundColor=ff0000',
  yuanji: 'https://api.dicebear.com/7.x/initials/svg?seed=袁记&backgroundColor=008000',
  ziyan: 'https://api.dicebear.com/7.x/initials/svg?seed=紫燕&backgroundColor=8b0000',
  tasting: 'https://api.dicebear.com/7.x/initials/svg?seed=塔斯汀&backgroundColor=ff0000',
  hushang: 'https://api.dicebear.com/7.x/initials/svg?seed=沪上&backgroundColor=008000',
  shuyi: 'https://api.dicebear.com/7.x/initials/svg?seed=书亦&backgroundColor=ff0000',
  guming: 'https://api.dicebear.com/7.x/initials/svg?seed=古茗&backgroundColor=000000',
  yihetang: 'https://api.dicebear.com/7.x/initials/svg?seed=益禾堂&backgroundColor=008000',
  bawang: 'https://api.dicebear.com/7.x/initials/svg?seed=霸王&backgroundColor=8b0000',
  haidilao: 'https://api.dicebear.com/7.x/initials/svg?seed=海底捞&backgroundColor=ff0000'
};

const menus = {
  mutton: [
    { name: '招牌羊肉汤(大份)', desc: '肉质鲜嫩，汤汁浓郁，配秘制干碟', img: images.mutton },
    { name: '招牌羊肉汤(小份)', desc: '适合一人食', img: images.mutton },
    { name: '爆炒羊肝', desc: '大火爆炒，非常下饭', img: images.sichuan },
    { name: '爆炒羊肚', desc: '脆嫩爽口', img: images.sichuan },
    { name: '羊肉格格', desc: '简阳特色粉蒸羊肉', img: images.luwei },
    { name: '凉拌羊肉', desc: '红油凉拌，开胃', img: images.luwei },
    { name: '现打白面锅盔', desc: '搭配羊肉汤绝赞', img: images.dessert },
    { name: '羊肉香肠', desc: '自制特色香肠', img: images.luwei },
    { name: '炒时蔬', desc: '解腻青菜', img: images.sichuan },
    { name: '米饭', desc: '东北大米', img: images.sichuan }
  ],
  milktea: [
    { name: '珍珠奶茶', desc: '经典不过时', img: images.milktea },
    { name: '杨枝甘露', desc: '满满果肉，清爽解腻', img: images.milktea },
    { name: '茉莉奶绿', desc: '清香扑鼻', img: images.milktea },
    { name: '乌龙玛奇朵', desc: '咸甜奶盖', img: images.milktea },
    { name: '芋泥波波奶茶', desc: '软糯芋泥', img: images.milktea },
    { name: '满杯红柚', desc: '酸甜可口', img: images.milktea },
    { name: '芝士莓莓', desc: '草莓与芝士的碰撞', img: images.milktea },
    { name: '烤黑糖波霸鲜奶', desc: '浓郁黑糖', img: images.milktea },
    { name: '冰鲜柠檬水', desc: '解渴神器', img: images.milktea },
    { name: '烧仙草', desc: '料超多', img: images.milktea }
  ],
  burger: [
    { name: '香辣鸡腿堡', desc: '经典汉堡，百吃不厌', img: images.burger },
    { name: '劲脆鸡腿堡', desc: '不辣的选择', img: images.burger },
    { name: '脆皮全鸡', desc: '一整只鸡，撕着吃才爽', img: images.burger },
    { name: '麦乐鸡块(5块)', desc: '配甜酸酱', img: images.burger },
    { name: '奥尔良烤翅(2块)', desc: '鲜嫩多汁', img: images.burger },
    { name: '粗薯条(大)', desc: '外酥里嫩', img: images.burger },
    { name: '老北京鸡肉卷', desc: '经典美味', img: images.burger },
    { name: '葡式蛋挞', desc: '奶香浓郁', img: images.dessert },
    { name: '冰可乐(大杯)', desc: '快乐肥宅水', img: images.coffee },
    { name: '红豆派', desc: '酥脆香甜', img: images.dessert }
  ],
  bbq: [
    { name: '宜宾特色把把烧(半把)', desc: '一口一串，根本停不下来', img: images.bbq },
    { name: '烤五花肉(10串)', desc: '肥而不腻，焦香四溢', img: images.bbq },
    { name: '烤羊肉串(10串)', desc: '正宗羊肉', img: images.bbq },
    { name: '烤牛肉串(10串)', desc: '鲜嫩多汁', img: images.bbq },
    { name: '蒜蓉烤茄子', desc: '烧烤必点素菜', img: images.bbq },
    { name: '特色烤生蚝(半打)', desc: '男人的加油站女人的美容院', img: images.bbq },
    { name: '包浆豆腐', desc: '外皮酥脆，内里爆浆', img: images.bbq },
    { name: '烤韭菜', desc: '烧烤灵魂', img: images.bbq },
    { name: '锡纸花甲', desc: '香辣花甲', img: images.bbq },
    { name: '冰镇啤酒', desc: '烧烤绝配', img: images.coffee }
  ],
  noodles: [
    { name: '老麻抄手(中麻)', desc: '经典口味，麻辣鲜香', img: images.noodles },
    { name: '清汤抄手', desc: '骨汤熬制，鲜美无比', img: images.noodles },
    { name: '红油抄手', desc: '香辣诱人', img: images.noodles },
    { name: '重庆小面', desc: '劲道爽滑，麻辣过瘾', img: images.noodles },
    { name: '豌杂面', desc: '软糯豌豆配杂酱', img: images.noodles },
    { name: '红烧牛肉面', desc: '大块牛肉', img: images.noodles },
    { name: '肥肠面', desc: '处理得很干净', img: images.noodles },
    { name: '鲜肉水饺(15个)', desc: '手工现包', img: images.noodles },
    { name: '凉拌折耳根', desc: '爱的人爱死，恨的人恨死', img: images.luwei },
    { name: '卤蛋', desc: '面条伴侣', img: images.luwei }
  ],
  sichuan: [
    { name: '回锅肉', desc: '川菜之魂', img: images.sichuan },
    { name: '麻婆豆腐', desc: '麻辣鲜香', img: images.sichuan },
    { name: '鱼香肉丝', desc: '酸甜微辣', img: images.sichuan },
    { name: '水煮肉片', desc: '肉片滑嫩', img: images.sichuan },
    { name: '辣子鸡', desc: '辣椒里找鸡', img: images.sichuan },
    { name: '蒜泥白肉', desc: '肥而不腻', img: images.sichuan },
    { name: '干煸四季豆', desc: '下饭神器', img: images.sichuan },
    { name: '番茄煎蛋汤', desc: '浓郁酸甜', img: images.sichuan },
    { name: '米饭', desc: '优质大米', img: images.sichuan },
    { name: '红糖糍粑', desc: '解辣甜品', img: images.dessert }
  ],
  fish: [
    { name: '麻辣诱惑烤鱼', desc: '外焦里嫩，配菜丰富', img: images.fish },
    { name: '蒜香烤鱼', desc: '不吃辣的宝贝点这个', img: images.fish },
    { name: '豆豉烤鱼', desc: '酱香浓郁', img: images.fish },
    { name: '泡椒烤鱼', desc: '酸辣开胃', img: images.fish },
    { name: '烤脑花', desc: '入口即化，香辣过瘾', img: images.bbq },
    { name: '拍黄瓜', desc: '清爽解腻', img: images.luwei },
    { name: '凉拌木耳', desc: '酸辣爽口', img: images.luwei },
    { name: '宽粉(配菜)', desc: '吸满汤汁', img: images.noodles },
    { name: '土豆片(配菜)', desc: '软糯入味', img: images.sichuan },
    { name: '米饭', desc: '优质大米', img: images.sichuan }
  ],
  luwei: [
    { name: '招牌麻辣鸭脖', desc: '越啃越香', img: images.luwei },
    { name: '甜辣鸭锁骨', desc: '肉多入味', img: images.luwei },
    { name: '麻辣鸭肠', desc: '脆脆的口感很好', img: images.luwei },
    { name: '麻辣鸭头', desc: '连骨头都有味', img: images.luwei },
    { name: '五香毛豆', desc: '下酒好菜', img: images.luwei },
    { name: '麻辣藕片', desc: '脆爽可口', img: images.luwei },
    { name: '麻辣海带结', desc: '入味十分', img: images.luwei },
    { name: '麻辣腐竹', desc: '吸满红油', img: images.luwei },
    { name: '夫妻肺片', desc: '经典川味凉菜', img: images.luwei },
    { name: '红油兔丁', desc: '成都特色', img: images.luwei }
  ]
};

const restaurantTemplates = [
  { name: '简阳老字号羊肉汤 (三岔镇总店)', type: 'mutton', logo: images.mutton, desc: '简阳特色，冬日暖胃首选，宝贝多喝点汤~' },
  { name: '三岔湖特色烤鱼', type: 'fish', logo: images.fish, desc: '三岔湖野生鱼，麻辣鲜香，吃鱼不长胖！' },
  { name: '三岔夜市把把烧', type: 'bbq', logo: images.bbq, desc: '深夜放毒，烧烤配可乐，快乐加倍！' },
  { name: '老麻抄手 (三岔老街店)', type: 'noodles', logo: images.noodles, desc: '麻得你跳，辣得你叫！' },
  { name: '麦当劳 (简阳三岔店)', type: 'burger', logo: logos.mcdonalds, desc: '吃点好的，长胖算我的！' },
  { name: '肯德基 (三岔镇店)', type: 'burger', logo: logos.kfc, desc: '疯狂星期四，V我50！' },
  { name: '茶百道 (三岔镇街店)', type: 'milktea', logo: logos.chabaidao, desc: '宝贝最爱的奶茶，喝了心情好~' },
  { name: '蜜雪冰城 (三岔中学店)', type: 'milktea', logo: logos.mixue, desc: '你爱我，我爱你，蜜雪冰城甜蜜蜜~' },
  { name: '瑞幸咖啡 (三岔镇店)', type: 'milktea', logo: logos.luckin, desc: '宝贝今天需要提神吗？' },
  { name: '绝味鸭脖 (三岔客运站店)', type: 'luwei', logo: logos.juewei, desc: '追剧必备小零食~' },
  { name: '华莱士 (三岔镇中心店)', type: 'burger', logo: logos.wallace, desc: '偶尔吃点垃圾食品快乐一下！' },
  { name: '袁记云饺 (三岔农贸市场店)', type: 'noodles', logo: logos.yuanji, desc: '现包现煮，家的味道。' },
  { name: '紫燕百味鸡 (三岔店)', type: 'luwei', logo: logos.ziyan, desc: '带点卤味回家加餐' },
  { name: '塔斯汀中国汉堡 (三岔店)', type: 'burger', logo: logos.tasting, desc: '现烤堡胚，中国人的汉堡' },
  { name: '沪上阿姨 (三岔步行街店)', type: 'milktea', logo: logos.hushang, desc: '鲜果茶，好喝不腻' },
  { name: '书亦烧仙草 (三岔店)', type: 'milktea', logo: logos.shuyi, desc: '半杯都是料' },
  { name: '古茗 (三岔店)', type: 'milktea', logo: logos.guming, desc: '每天一杯，快乐起飞' },
  { name: '益禾堂 (三岔店)', type: 'milktea', logo: logos.yihetang, desc: '烤奶经典，便宜好喝' },
  { name: '霸王茶姬 (三岔店)', type: 'milktea', logo: logos.bawang, desc: '原叶鲜奶茶，清爽不腻' },
  { name: '隆江猪脚饭 (三岔店)', type: 'sichuan', logo: images.sichuan, desc: '男人的浪漫，女人的胶原蛋白' },
  { name: '兰州拉面 (三岔正街店)', type: 'noodles', logo: images.noodles, desc: '一清二白三红四绿五黄' },
  { name: '胖哥俩肉蟹煲 (简阳店)', type: 'sichuan', logo: images.sichuan, desc: '浓郁酱汁，拌饭绝绝子' },
  { name: '冒菜西施 (三岔店)', type: 'sichuan', logo: images.sichuan, desc: '一个人的火锅' },
  { name: '张姐烤肉拌饭', type: 'sichuan', logo: images.sichuan, desc: '学生时代的回忆' },
  { name: '叫了个炸鸡 (三岔店)', type: 'burger', logo: images.burger, desc: '外酥里嫩，汁水丰富' },
  { name: '柳州螺蛳粉 (三岔店)', type: 'noodles', logo: images.noodles, desc: '又臭又香，欲罢不能' },
  { name: '重庆鸡公煲 (三岔店)', type: 'sichuan', logo: images.sichuan, desc: '浓香四溢，超级下饭' },
  { name: '东北饺子馆 (三岔店)', type: 'noodles', logo: images.noodles, desc: '皮薄馅大，好吃不如饺子' },
  { name: '乐山钵钵鸡 (三岔店)', type: 'luwei', logo: images.luwei, desc: '红油/藤椒，一串接一串' },
  { name: '简阳海底捞 (发源地店)', type: 'sichuan', logo: logos.haidilao, desc: '服务至上，味道正宗' },
  { name: '三岔镇李记肥肠粉', type: 'noodles', logo: images.noodles, desc: '手工红薯粉，劲道弹牙' },
  { name: '星巴克 (三岔湖景区店)', type: 'milktea', logo: logos.starbucks, desc: '享受湖景，品味咖啡' }
];

const db = {
  restaurants: [],
  orders: []
};

restaurantTemplates.forEach((tpl, i) => {
  const menuItems = menus[tpl.type].map((m, j) => ({
    id: `m${i}_${j}`,
    name: m.name,
    price: 0,
    image: m.img,
    desc: m.desc
  }));

  db.restaurants.push({
    id: (i + 1).toString(),
    name: tpl.name,
    type: tpl.type,
    image: tpl.logo,
    description: tpl.desc,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    deliveryTime: Math.floor(20 + Math.random() * 30) + '分钟',
    menu: menuItems
  });
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Generated db.json with 32 restaurants and 10 items each.');
