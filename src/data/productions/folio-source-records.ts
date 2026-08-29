export interface FolioSourceRecord {
  readonly sourceId: `PROD-SRC-${string}`;
  readonly productionId: string;
  readonly titleForms: Readonly<Record<'zh-CN' | 'en' | 'ja-JP', string>>;
  readonly synopsis: {
    readonly sourceLocale: 'zh-CN';
    readonly text: string;
  };
}

/**
 * 人工确认的活页剧目来源记录。
 *
 * 三种来源标题与官方简体中文描述并排保存；页面仍通过国家版本内容包读取可见文字。
 * 运行时采用的国家版本来源文本统一位于 localized/folio-source-texts.ts。
 */
export const folioSourceRecords = {
  'ode-au-triomphe': {
    sourceId: 'PROD-SRC-01',
    productionId: 'ode-au-triomphe',
    titleForms: {
      'zh-CN': '凯旋颂',
      en: 'Ode au Triomphe',
      'ja-JP': '凱旋の讃歌',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '让我们齐唱颂歌，庆祝皇帝凯旋！皇帝万岁！高卢万岁！',
    },
  },
  'der-ring': {
    sourceId: 'PROD-SRC-02',
    productionId: 'der-ring',
    titleForms: {
      'zh-CN': '湖中至宝',
      en: 'Der Ring',
      'ja-JP': '湖中の至宝',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '即使高塔为之倒塌，众人为之相残，莱塔尼亚的至宝终究不会留在卡普里尼的手指上。林中那汪浅浅的湖水，才是它梦寐以求的归宿。',
    },
  },
  'one-hundred-and-one-days': {
    sourceId: 'PROD-SRC-03',
    productionId: 'one-hundred-and-one-days',
    titleForms: {
      'zh-CN': '一百零一日',
      en: 'One Hundred and One Days',
      'ja-JP': '百日一日物語',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '曾经，有位平民向商人讲述了一个精彩绝伦的故事，这个故事经过层层传播，在一百零一日后传入王酋耳中。饶有兴趣的他微服私访前去寻找故事的源头，最后却发现，这位平民早已被自己处死。',
    },
  },
  'lone-wander': {
    sourceId: 'PROD-SRC-04',
    productionId: 'lone-wander',
    titleForms: {
      'zh-CN': '独行客',
      en: 'Lone Wander',
      'ja-JP': '独り往く者',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '在大地的缝隙中，在城市的阴影下，独行的怪人窥视一切。在丑陋的铁桶面具中，隐藏着阴谋与疯狂。',
    },
  },
  'wonderland-in-dream': {
    sourceId: 'PROD-SRC-05',
    productionId: 'wonderland-in-dream',
    titleForms: {
      'zh-CN': '梦中奇缘',
      en: 'Wonderland in Dream',
      'ja-JP': '夢の国の冒険譚',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '即使到不了远方的城堡，你至少还有同伴，我至少还有你。',
    },
  },
  'frost-deer-and-snow-doe': {
    sourceId: 'PROD-SRC-06',
    productionId: 'frost-deer-and-snow-doe',
    titleForms: {
      'zh-CN': '霜牡与雪牝',
      en: 'Frost Deer and Snow Doe',
      'ja-JP': '霜の牡鹿と雪の牝鹿',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '作为雪祀的亲缘护卫，我们的愿望是，亡于寒铁。\n\n作为血脉相连的双子，我们的愿望是，同生共死。\n\n你们的愿望太多了，只能实现一个，由我来选吧。',
    },
  },
  'light-of-heria': {
    sourceId: 'PROD-SRC-07',
    productionId: 'light-of-heria',
    titleForms: {
      'zh-CN': '赫里亚之辉',
      en: 'Light of Heria',
      'ja-JP': 'ヘリアの輝き',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '在最危难的时刻，英雄们从太阳上落下，行过赫里亚山巅，来到米诺斯身边。',
    },
  },
  'sette-collis-mother-wolf': {
    sourceId: 'PROD-SRC-08',
    productionId: 'sette-collis-mother-wolf',
    titleForms: {
      'zh-CN': '七丘的狼母',
      en: "Sette colli's Mother Wolf",
      'ja-JP': '七丘の母狼',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '狼母离巢前车之鉴，规矩不可逾越。',
    },
  },
  'the-dawn': {
    sourceId: 'PROD-SRC-09',
    productionId: 'the-dawn',
    titleForms: {
      'zh-CN': '初晓',
      en: 'The Dawn',
      'ja-JP': '曙光',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '有一条光带从身后跑来，掠过城市喧嚣，跃向天与地的接缝。忽然，整个大地抖掉清晨的恍惚，睁开双眸，现出露珠与光亮。',
    },
  },
  'the-golden-fowlbeast': {
    sourceId: 'PROD-SRC-10',
    productionId: 'the-golden-fowlbeast',
    titleForms: {
      'zh-CN': '金羽兽',
      en: 'The Golden Fowlbeast',
      'ja-JP': '金色の羽獣',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '纯金羽兽纯金卵，纯金羽毛摆又摆，纯金幼崽嘎嘎喊，纯金与人又何干？',
    },
  },
  'wild-gold': {
    sourceId: 'PROD-SRC-11',
    productionId: 'wild-gold',
    titleForms: {
      'zh-CN': '狂野之金',
      en: 'Wild Gold',
      'ja-JP': 'ワイルドゴールド',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '“无论你想做什么，你都需要这些东西，越多越好。”',
    },
  },
  'the-lullaby': {
    sourceId: 'PROD-SRC-12',
    productionId: 'the-lullaby',
    titleForms: {
      'zh-CN': '摇篮曲',
      en: 'The Lullaby',
      'ja-JP': '子守り歌',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '干净、舒适、安逸的梦境，从一首摇篮曲开始。睡醒之后，一切都会变得更美好。',
    },
  },
  'the-carnival': {
    sourceId: 'PROD-SRC-13',
    productionId: 'the-carnival',
    titleForms: {
      'zh-CN': '欢欣鼓舞',
      en: 'The Carnival',
      'ja-JP': 'カーニバル',
    },
    synopsis: {
      sourceLocale: 'zh-CN',
      text: '庆祝吧，朋友！这等好事可不是天天都有。',
    },
  },
} as const satisfies Record<string, FolioSourceRecord>;

export type FolioSourceProductionId = keyof typeof folioSourceRecords;
