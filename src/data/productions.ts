export type ProductionVisual = 'moon' | 'flame' | 'snow' | 'banquet' | 'lantern' | 'masks';
export type CreativeCredit = readonly [role: string, name: string];

export interface Production {
  productionId: string;
  title: string;
  kind: string;
  tagline: string;
  duration: string;
  durationShort: string;
  language: string;
  heading: string;
  synopsis: string;
  guidance: string;
  visual: ProductionVisual;
  creatives: readonly CreativeCredit[];
}

export const productions = {
  uncrowned: {
    productionId: 'uncrowned',
    title: '《无冕之夜》',
    kind: '现代悲剧 · 三幕',
    tagline: '王冠落地以后，谁来证明国王曾经存在？',
    duration: '125 分钟，含一次幕间',
    durationShort: '125分钟',
    language: '维多利亚语演出 · 中文投影字幕',
    heading: '一场关于权力、记忆与见证者的现代悲剧。',
    synopsis:
      '一座移动城市在庆典翌日醒来，却没有人记得昨夜加冕的王。唯一仍坚持演出仪式的报幕人，开始从观众的梦里寻找那顶不存在的王冠。',
    guidance: '建议 12 岁以上观众观看。演出包含短暂强光、舞台烟雾与模拟钟声。',
    visual: 'moon',
    creatives: [
      ['导演', '洛伦斯·格雷'],
      ['文本', '艾达·温特'],
      ['舞台设计', '米拉·塞恩'],
      ['音乐', '剧团室内乐组'],
    ],
  },
  'caged-fire': {
    productionId: 'caged-fire',
    title: '《笼中火》',
    kind: '室内歌剧 · 两幕',
    tagline: '火焰不能离开笼子，歌声却可以。',
    duration: '90 分钟，无幕间休息',
    durationShort: '90分钟',
    language: '莱塔尼亚语演唱 · 中维双语字幕',
    heading: '写给一座沉默高塔的室内歌剧。',
    synopsis:
      '守塔人被要求照看一簇永远不能熄灭、也永远不能带出高塔的火。他用七年学会火焰的语言，却在获准离开的那天听见它唱出了自己的名字。',
    guidance: '建议 10 岁以上观众观看。演出使用舞台明火效果、低频音响与持续约 40 秒的黑暗场景。',
    visual: 'flame',
    creatives: [
      ['作曲', '伊莱亚斯·克莱因'],
      ['导演', '萨宾娜·沃尔夫'],
      ['舞台设计', '奥托·赫兹'],
      ['首席女高音', '塞西莉亚·莱恩'],
    ],
  },
  'second-snow': {
    productionId: 'second-snow',
    title: '《第二次雪》',
    kind: '实验舞剧 · 无幕',
    tagline: '第一次雪覆盖道路，第二次雪覆盖记忆。',
    duration: '70 分钟，无幕间休息',
    durationShort: '70分钟',
    language: '无对白 · 提供文字导赏册',
    heading: '身体、白噪声与一座失温城市的共同记忆。',
    synopsis:
      '六名舞者沿着已经停运的轨道，重复一段没有终点的归乡旅程。每次雪落，他们都会少记得一个地名，也会多出一位同行者。',
    guidance:
      '建议 12 岁以上观众观看。现场温度较低，包含频闪、白噪声与模拟降雪；可索取无频闪场次信息。',
    visual: 'snow',
    creatives: [
      ['编舞', '诺亚·芬奇'],
      ['音乐', '白原三重奏'],
      ['灯光设计', '露西·巴赫'],
      ['装置', '诺伯特工坊'],
    ],
  },
  'red-banquet': {
    productionId: 'red-banquet',
    title: '《猩红宴》',
    kind: '典礼剧 · 四折',
    tagline: '请将姓名留在门外，宴席只认得赴约的人。',
    duration: '约 140 分钟，设两次休止',
    durationShort: '约140分钟',
    language: '炎语演出 · 备有手抄节目册',
    heading: '为长夜、空席与一位迟到主宾举行的典礼剧。',
    synopsis:
      '十二位侍宴人依照一份没有落款的席次簿准备盛宴。每当钟声响起，桌边便会多出一副餐具；他们必须在最后一盏灯熄灭以前，决定谁有资格坐上主位。',
    guidance: '演出包含焚香、低照度场景与近距离巡行。迟到观众须待第二折结束后入场。',
    visual: 'banquet',
    creatives: [
      ['总执事', '洛弥欧'],
      ['仪典编排', '白榆夫人'],
      ['乐章', '无弦室内乐社'],
      ['服装与面具', '绛纱作坊'],
    ],
  },
  'seventh-lantern': {
    productionId: 'seventh-lantern',
    title: '《第七盏灯》',
    kind: '灯影剧 · 七景',
    tagline: '六盏照见归路，第七盏只照见你。',
    duration: '约 75 分钟，无休止',
    durationShort: '约75分钟',
    language: '炎语演出 · 无字幕',
    heading: '一出只在日落以后开演的灯影剧。',
    synopsis:
      '送灯人沿旧道寻回六位迷途旅客，却发现队伍末尾始终跟着第七道影子。为在天亮前关上城门，他必须请观众辨认谁从未真正踏上归途。',
    guidance: '全场低照度，包含移动灯火与短暂静默。建议八岁以上观众观看。',
    visual: 'lantern',
    creatives: [
      ['灯影执导', '晦明'],
      ['唱词', '折枝'],
      ['影偶', '百目工房'],
      ['击乐', '渡鸦三人组'],
    ],
  },
  'procession-of-masks': {
    productionId: 'procession-of-masks',
    title: '《无声巡游》',
    kind: '假面默剧 · 五场',
    tagline: '巡游经过以后，请不要数还剩多少张脸。',
    duration: '约 60 分钟，无休止',
    durationShort: '约60分钟',
    language: '无对白 · 入场时提供场序单',
    heading: '由假面、鼓点与一条不断折返的街道组成的默剧。',
    synopsis:
      '一支没有领队的巡游队伍在城中寻找庆典广场。每次经过同一道门，他们都会换上一副更像观众的面具，直到鼓手再也无法分辨队伍与看客。',
    guidance: '演出包含演员进入观众通道、突然鼓点与纸屑。前排观众可能被邀请举起巡游旗帜。',
    visual: 'masks',
    creatives: [
      ['巡游执导', '阿尔特罗'],
      ['假面设计', '绛纱作坊'],
      ['鼓乐', '赫默与无名鼓手'],
      ['场序', '旧剧团编演室'],
    ],
  },
} as const satisfies Record<string, Production>;

export type ProductionId = keyof typeof productions;
export const productionEntries = Object.entries(productions) as Array<[ProductionId, Production]>;

export function isProductionId(value: string | undefined): value is ProductionId {
  return value !== undefined && Object.hasOwn(productions, value);
}
