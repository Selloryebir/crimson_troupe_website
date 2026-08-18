export const cities = [
  { value: 'trimount', label: '特里蒙' },
  { value: 'wiesheim', label: '维谢海姆' },
  { value: 'norport', label: '诺伯特郡' },
] as const;

export type CityId = (typeof cities)[number]['value'];
export type ShowVisual = 'moon' | 'flame' | 'snow';
export type Creative = readonly [role: string, name: string];

export interface Show {
  index: string;
  theme: string;
  visual: ShowVisual;
  month: '09' | '10';
  city: CityId;
  title: string;
  kind: string;
  tagline: string;
  premiere: string;
  date: string;
  place: string;
  duration: string;
  durationShort: string;
  language: string;
  heading: string;
  synopsis: string;
  guidance: string;
  searchDetail: string;
  searchKeywords: string;
  creatives: readonly Creative[];
}

export const shows = {
  uncrowned: {
    index: '01',
    theme: 'uncrowned',
    visual: 'moon',
    month: '09',
    city: 'trimount',
    title: '《无冕之夜》',
    kind: '现代悲剧 · 三幕',
    tagline: '王冠落地以后，谁来证明国王曾经存在？',
    premiere: '9月17日',
    date: '1098.09.17 / 19:30',
    place: '特里蒙大剧院 · 主舞台',
    duration: '125 分钟，含一次幕间',
    durationShort: '125分钟',
    language: '维多利亚语演出 · 中文投影字幕',
    heading: '一场关于权力、记忆与见证者的现代悲剧。',
    synopsis:
      '一座移动城市在庆典翌日醒来，却没有人记得昨夜加冕的王。唯一仍坚持演出仪式的报幕人，开始从观众的梦里寻找那顶不存在的王冠。',
    guidance: '建议 12 岁以上观众观看。演出包含短暂强光、舞台烟雾与模拟钟声。',
    searchDetail: '9月17日 · 特里蒙 · 现代悲剧',
    searchKeywords: '九月 9月 特里蒙 悲剧 王冠',
    creatives: [
      ['导演', '洛伦斯·格雷'],
      ['文本', '艾达·温特'],
      ['舞台设计', '米拉·塞恩'],
      ['音乐', '剧团室内乐组'],
    ],
  },
  'caged-fire': {
    index: '02',
    theme: 'caged-fire',
    visual: 'flame',
    month: '10',
    city: 'wiesheim',
    title: '《笼中火》',
    kind: '室内歌剧 · 两幕',
    tagline: '火焰不能离开笼子，歌声却可以。',
    premiere: '10月03日',
    date: '1098.10.03 / 20:00',
    place: '维谢海姆宫廷剧院 · 镜厅',
    duration: '90 分钟，无幕间休息',
    durationShort: '90分钟',
    language: '莱塔尼亚语演唱 · 中维双语字幕',
    heading: '写给一座沉默高塔的室内歌剧。',
    synopsis:
      '守塔人被要求照看一簇永远不能熄灭、也永远不能带出高塔的火。他用七年学会火焰的语言，却在获准离开的那天听见它唱出了自己的名字。',
    guidance: '建议 10 岁以上观众观看。演出使用舞台明火效果、低频音响与持续约 40 秒的黑暗场景。',
    searchDetail: '10月3日 · 维谢海姆 · 室内歌剧',
    searchKeywords: '十月 10月 维谢海姆 歌剧 火',
    creatives: [
      ['作曲', '伊莱亚斯·克莱因'],
      ['导演', '萨宾娜·沃尔夫'],
      ['舞台设计', '奥托·赫兹'],
      ['首席女高音', '塞西莉亚·莱恩'],
    ],
  },
  'second-snow': {
    index: '03',
    theme: 'second-snow',
    visual: 'snow',
    month: '10',
    city: 'norport',
    title: '《第二次雪》',
    kind: '实验舞剧 · 无幕',
    tagline: '第一次雪覆盖道路，第二次雪覆盖记忆。',
    premiere: '10月29日',
    date: '1098.10.29 / 18:45',
    place: '诺伯特郡旧车站 · 临时舞台',
    duration: '70 分钟，无幕间休息',
    durationShort: '70分钟',
    language: '无对白 · 提供文字导赏册',
    heading: '身体、白噪声与一座失温城市的共同记忆。',
    synopsis:
      '六名舞者沿着已经停运的轨道，重复一段没有终点的归乡旅程。每次雪落，他们都会少记得一个地名，也会多出一位同行者。',
    guidance:
      '建议 12 岁以上观众观看。现场温度较低，包含频闪、白噪声与模拟降雪；可索取无频闪场次信息。',
    searchDetail: '10月29日 · 诺伯特郡 · 实验舞剧',
    searchKeywords: '十月 10月 诺伯特 舞剧 雪',
    creatives: [
      ['编舞', '诺亚·芬奇'],
      ['音乐', '白原三重奏'],
      ['灯光设计', '露西·巴赫'],
      ['装置', '诺伯特工坊'],
    ],
  },
} satisfies Record<string, Show>;

export type ShowId = keyof typeof shows;
export const showEntries = Object.entries(shows) as Array<[ShowId, Show]>;

export function isShowId(value: string | undefined): value is ShowId {
  return value !== undefined && Object.hasOwn(shows, value);
}
