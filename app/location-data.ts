export type Verification = "师傅已核对" | "公开资料初筛" | "待补充";

export type PublicRentSnapshot = {
  station: string;
  project: string;
  room: string;
  min: number;
  max: number;
  source: string;
  sourceUrl: string;
  observedAt: string;
  warning?: string;
};

export type MentorRentRecord = {
  station: string;
  project: string;
  room: string;
  min: number;
  max: number;
  details: string[];
  observedAt: string;
  warning?: string;
};

export type StationKnowledge = {
  id: string;
  lines: string[];
  station: string;
  district: string;
  communities: string[];
  apartments: string[];
  price?: {
    min: number;
    max: number;
    label: string;
  };
  notes: string[];
  verification: Verification;
  source: string;
  sourceUrl: string;
  researchedAt: string;
};

export const publicRentSnapshots: PublicRentSnapshot[] = [
  {
    station: "潘水",
    project: "青漫里 / 星创雅望居",
    room: "平台广告一居",
    min: 1300,
    max: 1300,
    source: "安居客公开检索",
    sourceUrl: "https://hz.zu.anjuke.com/rmss/zhengzu-281/",
    observedAt: "2026-07-26",
    warning: "页面面积字段明显异常，只作为“有房源广告”的线索，不进入真实参考价。",
  },
  {
    station: "飞虹路",
    project: "飞虹华庭",
    room: "整租二室",
    min: 4800,
    max: 4800,
    source: "贝壳杭州租房公开页",
    sourceUrl: "https://hz.zu.ke.com/zufang",
    observedAt: "2026-07-26",
    warning: "单条挂牌快照，不能代表小区均价。",
  },
  {
    station: "火车南站",
    project: "启寓·杭州南站店",
    room: "开间",
    min: 900,
    max: 1600,
    source: "贝壳品牌公寓页",
    sourceUrl: "https://hz.zu.ke.com/apartment/94296.html",
    observedAt: "2026-07-26",
    warning: "品牌公寓在租房型快照，签约前核对水电、服务费和可租状态。",
  },
  {
    station: "三坝",
    project: "城西银泰附近个人房源",
    room: "整租一室",
    min: 2080,
    max: 2080,
    source: "Wellcee公开房源",
    sourceUrl: "https://www.wellcee.com/tw/rent-apartment/1778919864486842",
    observedAt: "2026-07-20",
    warning: "个人挂牌样本，地铁距离和在租状态需二次确认。",
  },
  {
    station: "明星路",
    project: "保利霞飞郡（商住楼）",
    room: "一室一厅",
    min: 3000,
    max: 3000,
    source: "安居客历史公开房源",
    sourceUrl: "https://hz.zu.anjuke.com/fangyuan/4112412214258688",
    observedAt: "2025-06-21",
    warning: "历史挂牌，仅证明项目与明星路站的配房关系，不作为2026价格。",
  },
];

export const mentorRentRecords: MentorRentRecord[] = [
  {
    station: "振宁路",
    project: "顺发佳境天城",
    room: "隔断单间",
    min: 2200,
    max: 2600,
    details: ["落地窗", "独卫", "独立厨房", "商水商电", "押一付一", "电梯房", "地铁近"],
    observedAt: "2026-07-29",
    warning: "临马路房源噪音较明显，隔音一般。",
  },
  {
    station: "振宁路",
    project: "江南明城",
    room: "隔断单间 / 11号楼公寓",
    min: 2200,
    max: 2600,
    details: ["落地窗为主", "阳台少", "油烟分离", "干湿分离", "商水商电", "电梯房", "距站约100米"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "顺丰家园",
    room: "小单间",
    min: 1500,
    max: 2000,
    details: ["有阳台房也有无阳台房", "内卫 / 外卫都有", "低楼层蚊虫较多"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "金珺澜庭",
    room: "朝南L型阳台主卧",
    min: 2200,
    max: 2500,
    details: ["带阳台", "朝南", "距地铁约1.2–1.3公里"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "金珺澜庭",
    room: "外卫 / 小阳台房",
    min: 1500,
    max: 1700,
    details: ["按房间大小和卫生间位置浮动"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "金珺澜庭",
    room: "飘窗房",
    min: 2100,
    max: 2100,
    details: ["无阳台", "带可坐的大飘窗"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "新中南家园",
    room: "单间",
    min: 1700,
    max: 2300,
    details: ["单间为主", "距地铁约200–300米"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "宁东北苑",
    room: "隔断单间",
    min: 1900,
    max: 2300,
    details: ["飘窗 / 阳台都有", "内卫 / 外卫都有", "商水商电", "部分楼梯房", "距站约500–600米", "房源较少"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "御庭园",
    room: "隔断单间",
    min: 1900,
    max: 2300,
    details: ["飘窗 / 阳台都有", "内卫 / 外卫都有", "商水商电", "楼梯房与电梯房都有", "距站约500–600米"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "丰瑞南苑",
    room: "隔断单间",
    min: 2000,
    max: 2500,
    details: ["2000元起步", "内卫 / 外卫都有", "商水商电", "以电梯房为主", "偏奥体中心方向"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "盈瑞华庭",
    room: "单人居住单间",
    min: 2000,
    max: 2500,
    details: ["邻近奥体印象城", "房间大小与装修决定价格"],
    observedAt: "2026-07-29",
  },
  ...["振盈华庭", "佳宁华庭", "仁孝华庭", "济仁华庭", "飞虹华庭"].map(
    (project): MentorRentRecord => ({
      station: "振宁路",
      project,
      room: "单人居住单间",
      min: 1700,
      max: 2500,
      details: ["同类华庭经验带", "房间大小、朝向、内外卫和装修决定价格"],
      observedAt: "2026-07-29",
    }),
  ),
  {
    station: "振宁路",
    project: "丰东花苑",
    room: "单人居住单间",
    min: 1800,
    max: 2500,
    details: ["常见报价约1800–2400/2500"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "幸福时代公寓",
    room: "公寓单间",
    min: 1600,
    max: 1600,
    details: ["房源较少", "距地铁约1公里"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "华悦中心",
    room: "公寓平层",
    min: 2800,
    max: 3000,
    details: ["常见报价约3000", "谈后约2800–2900"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "海杰德大厦",
    room: "公寓单间",
    min: 2200,
    max: 2200,
    details: ["单人居住经验价"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "百富众望",
    room: "公寓单间",
    min: 1980,
    max: 2500,
    details: ["楼层、采光和装修影响报价"],
    observedAt: "2026-07-29",
  },
  {
    station: "振宁路",
    project: "港汇中心",
    room: "一居室 / 两室一厅",
    min: 2500,
    max: 3000,
    details: ["按户型和装修浮动"],
    observedAt: "2026-07-29",
  },
  {
    station: "飞虹路",
    project: "顺发和美家",
    room: "单人居住单间",
    min: 2000,
    max: 2500,
    details: ["2000元起步", "房源较少", "地铁口近"],
    observedAt: "2026-07-29",
  },
  {
    station: "飞虹路",
    project: "奥体国际村",
    room: "单人居住单间",
    min: 1800,
    max: 2200,
    details: ["师傅提醒近期可能上涨，带看前复核"],
    observedAt: "2026-07-29",
  },
  {
    station: "飞虹路",
    project: "英冠水天城",
    room: "单人居住单间",
    min: 2300,
    max: 2600,
    details: ["按面积、朝向和装修浮动"],
    observedAt: "2026-07-29",
  },
  {
    station: "盈丰路",
    project: "佳丰北苑",
    room: "单人居住单间",
    min: 1800,
    max: 2200,
    details: ["房源相对多", "大小和装修决定价格", "靠近商场与河边"],
    observedAt: "2026-07-29",
  },
  ...["利一花苑", "利二花苑"].map(
    (project): MentorRentRecord => ({
      station: "盈丰路",
      project,
      room: "单人居住单间",
      min: 1800,
      max: 2200,
      details: ["房源较少", "价格主要看房间大小与装修"],
      observedAt: "2026-07-29",
    }),
  ),
  {
    station: "钱江世纪城",
    project: "丽晶国际",
    room: "阁楼 / 阳台房",
    min: 1600,
    max: 2600,
    details: ["有大露台户型", "采光、面积和装修差异大"],
    observedAt: "2026-07-29",
  },
  {
    station: "钱江世纪城",
    project: "山水时代大厦",
    room: "双钥匙公寓",
    min: 2500,
    max: 2600,
    details: ["采光较弱的房源可能更低"],
    observedAt: "2026-07-29",
  },
  {
    station: "钱江世纪城",
    project: "御金台",
    room: "公寓单间",
    min: 2700,
    max: 3000,
    details: ["单人居住经验价"],
    observedAt: "2026-07-29",
  },
  {
    station: "钱江世纪城",
    project: "寓也公寓",
    room: "品牌公寓",
    min: 3200,
    max: 3200,
    details: ["连锁公寓经验价"],
    observedAt: "2026-07-29",
  },
  {
    station: "钱江世纪城",
    project: "港基公寓",
    room: "公寓单间",
    min: 2200,
    max: 2800,
    details: ["按房间和装修浮动"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设三路",
    project: "都市阳光",
    room: "单人居住单间",
    min: 2200,
    max: 2500,
    details: ["师傅认为该站性价比较高的优先项目"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "华润中心",
    room: "公寓 / 单人居住",
    min: 2500,
    max: 3200,
    details: ["按户型与装修浮动"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "雅棠轩",
    room: "单人居住单间",
    min: 1350,
    max: 1650,
    details: ["商品房", "只有一栋集中出租"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "柏丽轩",
    room: "隔断 / 独门独户",
    min: 1500,
    max: 3000,
    details: ["户型跨度大", "独门独户与隔断房价格差异明显"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "华瑞晴庐",
    room: "普通单间",
    min: 1200,
    max: 1500,
    details: ["低价房装修较旧", "部分房源被平台渠道控制"],
    observedAt: "2026-07-29",
    warning: "渠道可租性较弱，推荐前先确认是否能带看。",
  },
  {
    station: "建设一路",
    project: "尚博苑",
    room: "单人居住单间",
    min: 1500,
    max: 2500,
    details: ["房间大小与装修差异大"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "江南学府",
    room: "商品房单间",
    min: 2500,
    max: 2500,
    details: ["房源较少", "2500元起步", "具体上限昨天未问"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "塘湾名苑",
    room: "单人居住单间",
    min: 1500,
    max: 2700,
    details: ["价格主要看房型大小"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "市北公寓",
    room: "公寓单间",
    min: 1500,
    max: 3000,
    details: ["装修差约1500–1600", "装修好约2500–3000", "电费约1.2元/度"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "中旅名门府",
    room: "一居室 / 公寓",
    min: 2800,
    max: 4400,
    details: ["装修与户型差异大"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "新城璟隽公馆",
    room: "公寓单间",
    min: 2200,
    max: 2200,
    details: ["单人居住经验价"],
    observedAt: "2026-07-29",
  },
  {
    station: "建设一路",
    project: "唐巢公寓",
    room: "公寓单间",
    min: 2800,
    max: 3000,
    details: ["建设一路附近公寓经验价"],
    observedAt: "2026-07-29",
  },
];

export const lineStops: Record<string, string[]> = {
  "2号线": [
    "朝阳",
    "曹家桥",
    "潘水",
    "人民路",
    "杭发厂",
    "人民广场",
    "建设一路",
    "建设三路",
    "振宁路",
    "飞虹路",
    "盈丰路",
    "钱江世纪城",
    "钱江路",
    "庆春广场",
    "庆菱路",
    "建国北路",
    "中河北路",
    "凤起路",
    "武林门",
    "沈塘桥",
    "下宁桥",
    "学院路",
    "古翠路",
    "丰潭路",
    "文新",
    "三坝",
    "虾龙圩",
    "三墩",
    "墩祥街",
    "金家渡",
    "白洋",
    "杜甫村",
    "良渚",
  ],
  "5号线": [
    "南湖东",
    "金星",
    "绿汀路",
    "葛巷",
    "创景路",
    "良睦路",
    "杭师大仓前",
    "永福",
    "五常",
    "蒋村",
    "浙大紫金港",
    "三坝",
    "萍水街",
    "和睦",
    "大运河",
    "拱宸桥东",
    "善贤",
    "西文街",
    "东新园",
    "杭氧",
    "打铁关",
    "宝善桥",
    "建国北路",
    "万安桥",
    "城站",
    "江城路",
    "侯潮门",
    "南星桥",
    "长河",
    "聚才路",
    "江晖路",
    "滨康路",
    "博奥路",
    "金鸡路",
    "人民广场",
    "育才北路",
    "通惠中路",
    "火车南站",
    "双桥",
    "姑娘桥",
  ],
  "7号线": [
    "吴山广场",
    "江城路",
    "莫邪塘",
    "观音塘",
    "市民中心",
    "奥体中心",
    "兴议",
    "明星路",
    "建设三路",
    "新兴路",
    "新汉路",
    "新街",
    "合欢路",
    "盈中",
    "坎山",
    "新港",
    "萧山国际机场",
    "永盛路",
    "新镇路",
    "义蓬",
    "塘新线",
    "青六中路",
    "启成路",
    "江东二路",
  ],
  "19号线": [
    "火车西站",
    "创景路",
    "海创园",
    "荆长路",
    "西溪湿地北",
    "五联",
    "文三路",
    "沈塘桥",
    "西湖文化广场",
    "驿城路",
    "火车东站（东广场）",
    "御道",
    "平澜路",
    "耕文路",
    "知行路",
    "萧山国际机场",
    "永盛路",
  ],
};

export const lineColors: Record<string, string> = {
  "2号线": "#ef6a27",
  "5号线": "#23a4aa",
  "7号线": "#6c2a7c",
  "19号线": "#6fc6da",
};

type StationDetail = Pick<
  StationKnowledge,
  "district" | "communities" | "apartments"
> &
  Partial<
    Pick<
      StationKnowledge,
      | "price"
      | "notes"
      | "verification"
      | "source"
      | "sourceUrl"
      | "researchedAt"
    >
  >;

const stationDetails: Record<string, StationDetail> = {
  朝阳: {
    district: "萧山区 · 南部卧城",
    communities: ["桂语朝阳苑", "同进韵动城", "众安朝阳8号", "御湖公馆"],
    apartments: ["朝阳银座"],
    notes: [
      "站口资料可确认：B/C口对应桂语朝阳苑，E口对应同进韵动城",
      "同进韵动城与朝阳银座属于商住/公寓候选，先核对水电和服务费",
    ],
    source: "杭州地铁站点资料＋公开地图/租房平台",
  },
  曹家桥: {
    district: "萧山区 · 南部卧城",
    communities: ["开元名城", "柳桥南和城", "广宁小区"],
    apartments: ["南江商业中心", "朝阳银座"],
  },
  潘水: {
    district: "萧山区 · 城厢",
    communities: ["泰和花园", "南门江住宅区", "潘水南苑", "崇化小区"],
    apartments: ["青漫里", "星创雅望居"],
    notes: [
      "安居客检索出现1300元公寓广告，但面积字段异常，暂不作为真实价格",
      "小区房与商业公寓需分开核价",
    ],
  },
  人民路: {
    district: "萧山区 · 城厢",
    communities: ["横石板弄", "新桥园", "育才东苑", "百尺溇社区"],
    apartments: [],
  },
  杭发厂: {
    district: "萧山区 · 城厢",
    communities: ["广德小区", "山阴小区", "永兴公园小区", "梅花楼社区"],
    apartments: ["恒隆广场"],
  },
  人民广场: {
    district: "萧山区 · 北干",
    communities: ["绿茵园", "山阴小区", "广德小区", "永久社区"],
    apartments: ["开元名都", "恒隆广场"],
  },
  建设一路: {
    district: "萧山区 · 市北",
    communities: [
      "国之璟府",
      "花屿观澜里",
      "御庭园",
      "展望轩",
      "雅棠轩",
      "华瑞晴庐",
      "尚博苑",
      "江南学府",
      "塘湾名苑",
    ],
    apartments: [
      "华润中心",
      "柏丽轩",
      "市北公寓",
      "中旅名门府",
      "新城璟隽公馆",
      "唐巢公寓",
      "欢腾国际",
      "东方壹号公寓",
    ],
    notes: [
      "昨天师傅核价范围均按一个人住的单间、小一居或公寓记录",
      "同一项目的隔断、独门独户和装修档次可能形成很大价差",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋公开地图候选",
    researchedAt: "2026-07-29",
  },
  建设三路: {
    district: "萧山区 · 市北",
    communities: [
      "大成名座",
      "宁安大厦",
      "南岸明珠",
      "都市阳光",
      "中誉万豪广场",
      "德意中兴广场",
      "庆丰拥涛府",
    ],
    apartments: ["绿都百瑞广场", "永泰丰广场", "青集社公寓", "檀青公馆"],
    notes: [
      "师傅建议优先看都市阳光、南岸明珠和大成名座",
      "宁安大厦隔音较弱；翻新房通常会明显更贵",
      "绿都百瑞广场房源少、价格偏高",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋手写沿线表＋公开房源平台",
    researchedAt: "2026-07-29",
  },
  振宁路: {
    district: "萧山区 · 宁围",
    communities: [
      "顺发佳境天城",
      "江南明城",
      "顺丰家园",
      "金珺澜庭",
      "新中南家园",
      "宁东北苑",
      "御庭园",
      "丰瑞南苑",
      "盈瑞华庭",
      "振盈华庭",
      "佳宁华庭",
      "仁孝华庭",
      "济仁华庭",
      "飞虹华庭",
      "丰东花苑",
    ],
    apartments: [
      "幸福时代公寓",
      "华悦中心",
      "海杰德大厦",
      "百富众望",
      "港汇中心",
    ],
    notes: [
      "这批价格均按一个人住的隔断单间、小一居或公寓记录，不是整租套房价",
      "隔断单间普遍按商水商电理解；内卫、外卫、阳台和飘窗需逐套核对",
      "短租房源少，养宠通常需单独确认，不能把小区经验当成现房承诺",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋2号线手写沿线表",
    researchedAt: "2026-07-29",
  },
  飞虹路: {
    district: "萧山区 · 钱江世纪城",
    communities: [
      "盈一佳苑",
      "盈二佳苑",
      "新中北家园",
      "顺发和美家",
      "金色江南",
      "江南丽景",
      "御虹府",
      "奥体国际村",
      "英冠水天城",
    ],
    apartments: ["宝信大厦", "新市民公寓", "融泰云臻", "瑰郦中心"],
    notes: [
      "顺发和美家按2000元起步、常见2000–2500记录",
      "该板块低价房通常面积小或装修旧，需先看片再谈性价比",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋杭州地铁站点页＋手写沿线表",
    researchedAt: "2026-07-29",
  },
  盈丰路: {
    district: "萧山区 · 钱江世纪城",
    communities: [
      "佳丰北苑",
      "利一花苑",
      "利二花苑",
      "丰瑞北苑",
      "仁孝华庭",
      "飞虹华庭",
      "奥体国际村",
    ],
    apartments: [],
    notes: [
      "佳丰北苑房源相对多；利一花苑、利二花苑和丰瑞北苑房源相对少",
      "同地段价差主要由面积、装修、采光和内外卫形成",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋2号线手写沿线表",
    researchedAt: "2026-07-29",
  },
  钱江世纪城: {
    district: "萧山区 · 钱江世纪城",
    communities: ["丽晶国际", "顺发和美家", "世纪之光", "利一家园"],
    apartments: [
      "山水时代大厦",
      "御金台",
      "寓也公寓",
      "港基公寓",
      "朝龙汇",
      "广孚中心",
      "保亿中心",
      "宝盛世纪中心",
    ],
    notes: [
      "站口公开资料可确认丽晶国际、朝龙汇、广孚中心、保亿中心和宝盛世纪中心",
      "写字楼/商住项目需先确认是否真实可住、是否可做饭",
      "师傅价按一个人住的阁楼、双钥匙或公寓单间记录",
    ],
    verification: "师傅已核对",
    source: "2026-07-29师傅口述核价＋2号线手写沿线表＋地铁站口资料",
    researchedAt: "2026-07-29",
  },
  钱江路: {
    district: "上城区 · 钱江新城",
    communities: ["钱江六苑", "钱江三苑", "金基晓庐", "采荷人家"],
    apartments: ["万象城悦玺", "东方君悦"],
  },
  庆春广场: {
    district: "上城区 · 采荷",
    communities: ["玉荷小区", "红菱小区", "庆和苑", "采荷东区"],
    apartments: ["新城市广场", "西子国际"],
  },
  庆菱路: {
    district: "上城区 · 采荷",
    communities: ["双菱新村", "南肖埠小区", "青莼小区", "采荷绿萍"],
    apartments: ["庆春发展大厦"],
  },
  建国北路: {
    district: "拱墅区 · 潮鸣",
    communities: ["东清巷", "珠碧苑", "凤起苑", "青春坊"],
    apartments: ["东联大厦"],
  },
  中河北路: {
    district: "拱墅区 · 环北",
    communities: ["十五家园", "新华坊", "仙林苑", "凤起苑"],
    apartments: ["嘉德广场"],
  },
  凤起路: {
    district: "拱墅区 · 武林",
    communities: ["皇亲苑", "长寿桥小区", "凤起苑", "环西新村"],
    apartments: ["嘉里中心公寓"],
  },
  武林门: {
    district: "拱墅区 · 武林",
    communities: ["武林门新村", "桃花河新村", "昌化新村", "环城西路小区"],
    apartments: ["武林壹号"],
  },
  沈塘桥: {
    district: "拱墅区 · 文晖",
    communities: ["文三新村", "马塍路小区", "沈塘新村", "武林门新村"],
    apartments: ["莫干山路公寓"],
    source: "杭州地铁官方站点页＋公开房源平台",
  },
  下宁桥: {
    district: "西湖区 · 文教",
    communities: ["保俶北路小区", "文二新村", "求智巷", "文教小区"],
    apartments: ["梅苑阁"],
  },
  学院路: {
    district: "西湖区 · 翠苑",
    communities: ["翠苑一区", "九莲新村", "枫华府第", "学院春晓"],
    apartments: ["华门自由21"],
  },
  古翠路: {
    district: "西湖区 · 翠苑",
    communities: ["翠苑三区", "翠苑四区", "世纪新城东区", "嘉绿铭苑"],
    apartments: ["康新花园"],
  },
  丰潭路: {
    district: "西湖区 · 文新",
    communities: ["嘉绿景苑", "嘉绿名苑", "金都新城", "丹桂公寓"],
    apartments: ["丰潭公寓"],
  },
  文新: {
    district: "西湖区 · 文新",
    communities: ["桂花城", "香樟公寓", "香港城", "春天花园"],
    apartments: ["天河西苑"],
  },
  三坝: {
    district: "西湖区 · 申花",
    communities: ["耀江文鼎苑", "西城年华", "锦绣申华坊", "同人家园"],
    apartments: ["申瑞国际", "剑桥公社", "同人广场"],
  },
  虾龙圩: {
    district: "西湖区 · 申花",
    communities: ["三墩颐景园", "紫金文苑", "秀月家园", "丽阳苑"],
    apartments: ["申瑞国际", "剑桥公社", "浙港国际"],
  },
  三墩: {
    district: "西湖区 · 三墩",
    communities: ["秀月家园", "兰韵天城", "吉鸿家园", "中海金溪园"],
    apartments: ["白领公寓"],
  },
  墩祥街: {
    district: "西湖区 · 三墩",
    communities: ["都市水乡", "兰韵天城", "亲亲家园", "三墩颐景园"],
    apartments: [],
  },
  金家渡: {
    district: "余杭区 · 良渚新城",
    communities: ["都市水乡", "亲亲家园", "金地自在城", "铭雅苑"],
    apartments: ["金家渡公寓"],
  },
  白洋: {
    district: "余杭区 · 良渚新城",
    communities: ["赞成美树", "良和雅苑", "万科未来城", "融信澜天"],
    apartments: [],
  },
  杜甫村: {
    district: "余杭区 · 良渚新城",
    communities: [
      "严村里",
      "杜甫新苑杜康苑",
      "杜甫新苑杜雅苑",
      "万科未来城",
      "碧水澜天华庭",
    ],
    apartments: [],
    source: "杭州地铁官方站点页＋公开房源平台",
  },
  良渚: {
    district: "余杭区 · 良渚",
    communities: ["玉鸟流苏", "万科未来城", "赞成美树", "绿城玉园"],
    apartments: ["良渚文化村长租公寓"],
  },
  南湖东: {
    district: "余杭区 · 老余杭",
    communities: ["南湖明月府", "通济家园", "禹航路小区"],
    apartments: ["南湖未来社区人才公寓"],
  },
  金星: {
    district: "余杭区 · 老余杭",
    communities: ["金星家园", "凤新家园", "华坞新苑", "恒厚阳光城"],
    apartments: ["万达公寓"],
  },
  绿汀路: {
    district: "余杭区 · 未来科技城",
    communities: ["绿汀云庐", "欧美金融城住宅区", "海曙金茂府"],
    apartments: ["未来科技城国际人才公寓", "EFC欧美金融城"],
  },
  葛巷: {
    district: "余杭区 · 未来科技城",
    communities: ["溪望路小区", "海曙金茂府", "未来悦"],
    apartments: ["EFC欧美金融城", "奥克斯未来中心"],
  },
  创景路: {
    district: "余杭区 · 未来科技城",
    communities: ["未来悦", "海曙金茂府", "西溪公馆"],
    apartments: ["EFC欧美金融城", "奥克斯未来中心", "海创园人才公寓"],
  },
  良睦路: {
    district: "余杭区 · 仓前",
    communities: ["竹海水韵", "西溪北苑", "福鼎家园"],
    apartments: ["梦想小镇人才公寓"],
  },
  杭师大仓前: {
    district: "余杭区 · 仓前",
    communities: ["仓溢东苑", "仓溢绿苑", "恒和依山郡"],
    apartments: ["梦想小镇人才公寓", "杭师大青年公寓"],
  },
  永福: {
    district: "余杭区 · 五常",
    communities: ["福鼎晓风苑", "西溪悦城", "海曙金茂府"],
    apartments: ["万科天空之城", "未来寓"],
  },
  五常: {
    district: "余杭区 · 五常",
    communities: ["西溪润景", "云空城", "西溪风情", "金都雅苑"],
    apartments: ["宏旺西溪阳光中心"],
  },
  蒋村: {
    district: "西湖区 · 蒋村",
    communities: ["蒋村花园", "西溪蝶园", "西溪里", "河滨之城"],
    apartments: ["西溪银泰城公寓"],
  },
  浙大紫金港: {
    district: "西湖区 · 紫金港",
    communities: ["紫郡西苑", "紫金文苑", "紫西花语城", "政苑小区"],
    apartments: ["西溪银泰城公寓"],
  },
  萍水街: {
    district: "拱墅区 · 申花",
    communities: ["万家花城", "西铭苑", "绅华府", "东方福邸"],
    apartments: ["创道国际洋人街", "西城纪"],
  },
  和睦: {
    district: "拱墅区 · 和睦",
    communities: ["和睦新村", "和睦公寓", "华丰新村", "嘉泰馨庭"],
    apartments: ["汉之昀商业中心"],
  },
  大运河: {
    district: "拱墅区 · 桥西",
    communities: ["凯德湖墅", "悦尚湾", "信步闲庭", "运河宸园"],
    apartments: ["远洋国际中心"],
  },
  拱宸桥东: {
    district: "拱墅区 · 拱宸桥",
    communities: ["风景大院", "红杉雅园", "锦昌文华", "吉如家园"],
    apartments: ["运河上街公寓"],
  },
  善贤: {
    district: "拱墅区 · 善贤",
    communities: ["绍兴新村", "宸麟府", "西文西苑", "善贤人家"],
    apartments: ["新天地商务公寓"],
  },
  西文街: {
    district: "拱墅区 · 东新",
    communities: ["水印康庭", "西文北苑", "西文南苑", "东新园"],
    apartments: [],
    source: "杭州地铁站点页＋公开房源平台",
  },
  东新园: {
    district: "拱墅区 · 东新",
    communities: ["东新园", "颜家村", "水印康庭", "万和玺园"],
    apartments: ["新天地商务公寓"],
  },
  杭氧: {
    district: "拱墅区 · 东新",
    communities: ["香石公寓", "杭氧北苑", "颜家里", "城市风景"],
    apartments: ["新天地中心公寓"],
  },
  打铁关: {
    district: "拱墅区 · 朝晖",
    communities: ["京都苑", "朝晖七区", "现代名苑", "和平小区"],
    apartments: ["野风现代中心"],
  },
  宝善桥: {
    district: "拱墅区 · 艮山门",
    communities: ["头营巷", "流水东苑", "艮园小区", "流水苑"],
    apartments: ["东清大厦"],
  },
  万安桥: {
    district: "上城区 · 小营",
    communities: ["马市街小区", "小营巷", "万安城市花园", "大塔儿巷"],
    apartments: [],
  },
  城站: {
    district: "上城区 · 城站",
    communities: ["清泰南苑", "清泰门社区", "金钱巷社区", "断河头"],
    apartments: ["西湖大道公寓", "杭州城站公寓"],
  },
  江城路: {
    district: "上城区 · 望江",
    communities: ["建国南苑", "陆家河头小区", "金狮苑", "云雀苑", "信余里"],
    apartments: ["通江高层"],
    source: "杭州地铁站点页＋公开房源平台",
  },
  侯潮门: {
    district: "上城区 · 望江",
    communities: ["复兴南苑", "候潮公寓", "御景湾", "木场巷小区"],
    apartments: ["赞成中心"],
  },
  南星桥: {
    district: "上城区 · 南星",
    communities: ["春江花月", "望江府", "金色家园", "钱江时代公寓"],
    apartments: ["赞成太和广场"],
  },
  长河: {
    district: "滨江区 · 长河",
    communities: ["长河小区", "钱塘春晓", "风雅钱塘", "东方郡"],
    apartments: ["星光国际公馆", "中南国际商城"],
  },
  聚才路: {
    district: "滨江区 · 长河",
    communities: ["钱塘春晓", "东方郡", "钱龙名苑", "铂金名筑"],
    apartments: ["中赢康康谷"],
  },
  江晖路: {
    district: "滨江区 · 滨兴",
    communities: ["铂金名筑", "风雅钱塘", "东方郡", "江虹小区"],
    apartments: ["中赢康康谷", "星耀城"],
  },
  滨康路: {
    district: "滨江区 · 西兴",
    communities: ["风雅钱塘", "滨兴小区", "江南文苑", "滨康小区"],
    apartments: ["滨康天曜城"],
  },
  博奥路: {
    district: "萧山区 · 北干",
    communities: ["桂语听澜", "滨水名庭", "博奥城", "白马御府"],
    apartments: ["博奥时代中心"],
  },
  金鸡路: {
    district: "萧山区 · 北干",
    communities: ["龙湖天璞", "国樾府", "顺发旭辉国悦府", "银河小区"],
    apartments: ["加州阳光公寓"],
  },
  育才北路: {
    district: "萧山区 · 北干",
    communities: ["山水苑", "新白马公寓", "家景园", "银河小区"],
    apartments: ["商会大厦"],
  },
  通惠中路: {
    district: "萧山区 · 新塘",
    communities: ["天琅府", "顺和悦府", "中誉现代城"],
    apartments: [
      "耀辰名座",
      "遇见美公寓",
      "运宏公寓",
      "宜人居",
      "景天公寓",
      "创想客E族",
    ],
    price: {
      min: 1400,
      max: 2200,
      label: "景天约1400–1500；宜人居1600–1700；主流1800–2200",
    },
    notes: [
      "顺和悦府约1700–1800，小区隔断需提前说明",
      "天琅府、耀辰名座约2000–2200",
    ],
    verification: "师傅已核对",
    source: "你的性价比笔记＋5号线手写沿线表＋公开地图",
  },
  火车南站: {
    district: "萧山区 · 火车南站",
    communities: ["城品华庭", "新白马公寓", "商城花园", "广宁小区"],
    apartments: ["新城香悦公馆", "南站人才公寓"],
    price: {
      min: 1800,
      max: 2200,
      label: "杭州南站—通惠中路参考带",
    },
    verification: "师傅已核对",
    source: "你的性价比笔记＋公开地图",
  },
  双桥: {
    district: "萧山区 · 新塘",
    communities: ["站文华庭", "双桥学府", "金达长山府"],
    apartments: ["聚缘", "寓遇见", "天羽公寓"],
    price: {
      min: 1700,
      max: 2300,
      label: "站文华庭1700–1900；居也/寓见约2000–2300",
    },
    notes: ["价格跨度较大，先区分小区房和公寓"],
    verification: "师傅已核对",
    source: "你的性价比笔记＋5号线手写沿线表＋公开地图",
  },
  姑娘桥: {
    district: "萧山区 · 新塘",
    communities: ["名望府", "和平桥名苑", "姑娘桥名苑"],
    apartments: ["汽车小镇", "晶耀寓公寓", "向阳小居", "杭驻", "品驿公寓"],
    price: { min: 1500, max: 2000, label: "姑娘桥参考带" },
    notes: ["低预算可优先向终点站方向找"],
    verification: "师傅已核对",
    source: "你的性价比笔记＋5号线手写沿线表＋公开地图",
  },
  吴山广场: {
    district: "上城区 · 吴山",
    communities: ["柳浪新苑", "柳浪阁", "华光路小区", "劳动路小区"],
    apartments: ["清波苑"],
  },
  莫邪塘: {
    district: "上城区 · 望江",
    communities: ["望江新园", "近江家园", "莫邪塘社区", "婺江家园"],
    apartments: ["望江时代中心"],
  },
  观音塘: {
    district: "上城区 · 采荷",
    communities: ["采荷人家", "滨江金色家园", "东方润园", "静怡花苑"],
    apartments: ["采荷嘉业大厦"],
  },
  市民中心: {
    district: "上城区 · 钱江新城",
    communities: ["万象城悦府", "金基晓庐", "金色海岸", "城市之星"],
    apartments: ["万象城悦玺", "迪凯国际公寓"],
  },
  奥体中心: {
    district: "滨江区 · 奥体",
    communities: ["观品", "创世邸", "奥体国际村", "时代奥城"],
    apartments: ["奥邸国际", "杭州之门"],
  },
  兴议: {
    district: "萧山区 · 钱江世纪城",
    communities: ["顺发和美家", "佳丰南苑", "奥体国际村", "仁孝华庭"],
    apartments: ["山水时代大厦"],
  },
  明星路: {
    district: "萧山区 · 市北",
    communities: [
      "明怡花苑",
      "顺发恒园",
      "钱江之光名城",
      "江南丽锦",
      "霞飞郡府",
    ],
    apartments: ["湾区数字公园公寓", "保利霞飞郡（商住楼）"],
    notes: [
      "站口资料可确认霞飞郡府，B口通道与乐创城相连",
      "历史挂牌显示商住一室样本，2026价格仍需重新核对",
    ],
    source: "你的性价比笔记＋站口资料＋公开房源平台",
  },
  新兴路: {
    district: "萧山区 · 新街",
    communities: ["新华缘", "明辉花园", "新华悦府", "宁瑞锦府", "宁税北苑"],
    apartments: ["明彩城", "明悦公寓", "新青社", "唐邦公寓", "明成公寓"],
    notes: ["房源类型多，匹配时先区分小区房、公寓和配套房"],
    verification: "师傅已核对",
    source: "你的性价比笔记＋7号线手写沿线表＋公开地图",
  },
  新汉路: {
    district: "萧山区 · 新街",
    communities: ["新盛景城", "明彩城", "小苹果", "明辉花园"],
    apartments: ["新青年公寓"],
    source: "你的性价比笔记＋7号线手写沿线表＋公开地图",
  },
  新街: {
    district: "萧山区 · 新街",
    communities: ["欣品华庭", "雅逸府", "博印名邸", "碧秀名庭", "花城名苑"],
    apartments: ["融创印时代中心", "永和之星名座", "新青年公寓"],
    price: { min: 1500, max: 1700, label: "雅逸府单间经验参考带" },
    notes: ["公开整租挂牌通常高于你的单间/合租经验价，需分房型核价"],
    verification: "师傅已核对",
    source: "你的性价比笔记＋7号线手写沿线表＋公开房源平台",
  },
  合欢路: {
    district: "萧山区 · 新街",
    communities: ["花城名苑", "枫香府", "新悦湾", "天城府"],
    apartments: ["永和之星名座"],
  },
  盈中: {
    district: "萧山区 · 瓜沥",
    communities: ["盈中佳苑", "盈中村安置房"],
    apartments: [],
    notes: ["公开租房样本稀疏，建议按实际房源向合欢路或坎山外扩"],
  },
  坎山: {
    district: "萧山区 · 瓜沥",
    communities: ["坎山下街社区", "勇建村安置房", "群谊村安置房"],
    apartments: ["瓜沥人才公寓"],
    notes: ["公开租房样本较少，需核对村社房源与地铁实际步行路线"],
  },
  新港: {
    district: "萧山区 · 空港",
    communities: ["德信空港城", "碧桂园前宸府"],
    apartments: ["空港新天地"],
    notes: ["公开平台可见德信空港城距新港站约400米的租房样本"],
  },
  萧山国际机场: {
    district: "萧山区 · 空港",
    communities: ["空港新城安置房"],
    apartments: ["空港新天地", "机场员工公寓"],
    notes: ["交通枢纽站，航站楼周边住宅少，实际配房多向新港或永盛路外扩"],
  },
  永盛路: {
    district: "萧山区 · 靖江",
    communities: [
      "德信空港城",
      "空港新城安置房",
      "花神庙社区",
      "伟南社区",
    ],
    apartments: ["融创港印中心", "空港新天地", "临空SOHO创意港"],
    notes: [
      "站点E口直达空港新天地，周边以社区、工业园和商办混合为主",
      "低预算公寓样本相对多，需区分商业水电与民水民电",
    ],
    source: "杭州地铁站点资料＋公开地图/租房平台",
  },
  新镇路: {
    district: "钱塘区 · 义蓬",
    communities: ["云帆社区", "义蓬东一社区", "义盛社区"],
    apartments: ["大江东人才公寓"],
  },
  义蓬: {
    district: "钱塘区 · 义蓬",
    communities: ["义蓬名苑", "金色和庄", "春益小区", "义盛小区"],
    apartments: ["义蓬购物中心公寓"],
  },
  塘新线: {
    district: "钱塘区 · 义蓬",
    communities: ["春园村安置房", "义蓬东二社区"],
    apartments: [],
    notes: ["站点周边住宅分散，建议结合骑行接驳半径筛选"],
  },
  青六中路: {
    district: "钱塘区 · 大江东",
    communities: ["江东府", "江与河名邸", "龙湖江与城"],
    apartments: ["大江东宝龙广场公寓"],
  },
  启成路: {
    district: "钱塘区 · 大江东",
    communities: ["东裕华庭", "春意江南名邸", "江东壹号"],
    apartments: ["钱塘中心公寓"],
  },
  江东二路: {
    district: "钱塘区 · 大江东",
    communities: ["东裕华庭", "江东壹号", "湖景居"],
    apartments: ["东沙湖人才公寓"],
  },
  火车西站: {
    district: "余杭区 · 云城",
    communities: ["湖境云庐", "杭与城", "西站枢纽安置房"],
    apartments: ["西站枢纽人才公寓", "云城长租公寓"],
    notes: ["枢纽新城仍在开发，需重点核对交付与真实可租状态"],
  },
  海创园: {
    district: "余杭区 · 未来科技城",
    communities: ["未来悦", "海曙金茂府", "西溪公馆"],
    apartments: ["海创园人才公寓", "奥克斯未来中心", "EFC欧美金融城"],
  },
  荆长路: {
    district: "余杭区 · 五常",
    communities: ["西溪华府", "西溪北苑", "乐山红叶", "西溪风情"],
    apartments: ["宏旺西溪阳光中心"],
  },
  西溪湿地北: {
    district: "西湖区 · 西溪",
    communities: ["西溪风情", "西溪融庄", "西溪里", "西溪公馆"],
    apartments: ["西溪银泰城公寓"],
  },
  五联: {
    district: "西湖区 · 文三西路",
    communities: ["西溪诚园", "西溪蝶园", "蒋村花园", "科技新村"],
    apartments: ["西溪锋尚苑"],
  },
  文三路: {
    district: "西湖区 · 文教",
    communities: ["天苑花园", "翠苑一区", "九莲新村", "求智巷"],
    apartments: ["华门自由21", "西溪锋尚苑"],
  },
  西湖文化广场: {
    district: "拱墅区 · 朝晖",
    communities: ["朝晖一区", "朝晖二区", "朝晖三区", "绿洲花园"],
    apartments: ["中山北路公寓", "西子花园"],
  },
  驿城路: {
    district: "上城区 · 城东新城",
    communities: ["新风悦居", "紫玉福邸", "三里家园三小区", "东港嘉苑"],
    apartments: ["克拉公寓", "东站西子国际"],
  },
  "火车东站（东广场）": {
    district: "上城区 · 城东新城",
    communities: ["东港嘉苑", "新风悦居", "明桂苑", "天城府"],
    apartments: ["杭州中央车站广场", "东站西子国际"],
    notes: ["交通枢纽站，需区分东广场与西广场步行距离"],
  },
  御道: {
    district: "上城区 · 钱江新城二期",
    communities: ["钱江御府", "运新花苑", "三堡北苑", "御道家园"],
    apartments: ["钱投新宸商务中心"],
  },
  平澜路: {
    district: "萧山区 · 钱江世纪城",
    communities: ["丰北家园", "佳丰北苑", "江河鸣翠", "滨江星翠澜庭"],
    apartments: ["钱江世纪城人才公寓"],
  },
  耕文路: {
    district: "萧山区 · 科技城",
    communities: ["中骏·钱塘御景", "钱江新村", "盛达名苑"],
    apartments: ["糖果公寓", "杭宁雅居"],
    source: "你的19号线手写沿线表＋公开地图",
  },
  知行路: {
    district: "萧山区 · 科技城",
    communities: ["云潮府", "科技城安置房"],
    apartments: ["云瀚府", "舒行寓", "品驿公寓"],
    notes: ["手写名称仍有待核对项，先按站点候选使用"],
    source: "你的19号线手写沿线表＋公开地图",
  },
};

const lineSourceRoots: Record<string, string> = {
  "2号线": "https://www.hzmetro.com/service_322_show.aspx",
  "5号线": "https://www.hzmetro.com/service_324_show.aspx",
  "7号线": "https://www.hzmetro.com/service_327_show.aspx",
  "19号线": "https://www.hzmetro.com/service_3215_show.aspx",
};

const orderedStations: { station: string; lines: string[] }[] = [];

Object.entries(lineStops).forEach(([line, stops]) => {
  stops.forEach((station) => {
    const existing = orderedStations.find((item) => item.station === station);
    if (existing) {
      existing.lines.push(line);
    } else {
      orderedStations.push({ station, lines: [line] });
    }
  });
});

export const stationKnowledge: StationKnowledge[] = orderedStations.map(
  ({ station, lines }) => {
    const details = stationDetails[station] ?? {
      district: "杭州 · 站点周边",
      communities: [],
      apartments: [],
    };
    const primaryLine = lines[0];
    const defaultNote =
      details.communities.length + details.apartments.length > 0
        ? "候选按站点周边约1–1.5公里初筛，带看前核对真实步行路线"
        : "公开住宅样本不足，等待补充实地房源";
    return {
      id: station,
      lines,
      station,
      district: details.district,
      communities: details.communities,
      apartments: details.apartments,
      price: details.price,
      notes: details.notes ?? [defaultNote],
      verification: details.verification ?? "公开资料初筛",
      source:
        details.source ??
        "杭州地铁站点页＋公开地图/租房平台检索（非成交价）",
      sourceUrl:
        details.sourceUrl ??
        `${lineSourceRoots[primaryLine]}?title=${encodeURIComponent(`${station}站`)}`,
      researchedAt: details.researchedAt ?? "2026-07-26",
    };
  },
);

export const stationCoverage = {
  uniqueStations: stationKnowledge.length,
  lineStationCount: Object.values(lineStops).reduce(
    (total, stops) => total + stops.length,
    0,
  ),
  candidateCount: stationKnowledge.reduce(
    (total, entry) =>
      total + entry.communities.length + entry.apartments.length,
    0,
  ),
};
