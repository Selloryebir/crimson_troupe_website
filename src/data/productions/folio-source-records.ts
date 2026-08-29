export interface FolioSourceRecord {
  sourceId: `PROD-SRC-${string}`;
  productionId: string;
  sourceLocale: 'zh-CN';
  title: string;
  synopsis: string;
}

/**
 * 人工确认的活页剧目简体中文来源记录。
 *
 * 这些文字用于来源校验；页面仍通过国家版本内容包读取可见文字。炎语内容必须逐字复用
 * 对应记录，其他国家版本基于该记录翻译，并独立进入本地化审核。
 */
export const folioSourceRecords = {
  'ode-au-triomphe': {
    sourceId: 'PROD-SRC-01',
    productionId: 'ode-au-triomphe',
    sourceLocale: 'zh-CN',
    title: '凯旋颂',
    synopsis: '让我们齐唱颂歌，庆祝皇帝凯旋！皇帝万岁！高卢万岁！',
  },
  'der-ring': {
    sourceId: 'PROD-SRC-02',
    productionId: 'der-ring',
    sourceLocale: 'zh-CN',
    title: '湖中至宝',
    synopsis:
      '即使高塔为之倒塌，众人为之相残，莱塔尼亚的至宝终究不会留在卡普里尼的手指上。林中那汪浅浅的湖水，才是它梦寐以求的归宿。',
  },
  'one-hundred-and-one-days': {
    sourceId: 'PROD-SRC-03',
    productionId: 'one-hundred-and-one-days',
    sourceLocale: 'zh-CN',
    title: '一百零一日',
    synopsis:
      '曾经，有位平民向商人讲述了一个精彩绝伦的故事，这个故事经过层层传播，在一百零一日后传入王酋耳中。饶有兴趣的他微服私访前去寻找故事的源头，最后却发现，这位平民早已被自己处死。',
  },
  'lone-wander': {
    sourceId: 'PROD-SRC-04',
    productionId: 'lone-wander',
    sourceLocale: 'zh-CN',
    title: '独行客',
    synopsis:
      '在大地的缝隙中，在城市的阴影下，独行的怪人窥视一切。在丑陋的铁桶面具中，隐藏着阴谋与疯狂。',
  },
  'wonderland-in-dream': {
    sourceId: 'PROD-SRC-05',
    productionId: 'wonderland-in-dream',
    sourceLocale: 'zh-CN',
    title: '梦中奇缘',
    synopsis: '即使到不了远方的城堡，你至少还有同伴，我至少还有你。',
  },
  'frost-deer-and-snow-doe': {
    sourceId: 'PROD-SRC-06',
    productionId: 'frost-deer-and-snow-doe',
    sourceLocale: 'zh-CN',
    title: '霜牡与雪牝',
    synopsis:
      '作为雪祀的亲缘护卫，我们的愿望是，亡于寒铁。\n\n作为血脉相连的双子，我们的愿望是，同生共死。\n\n你们的愿望太多了，只能实现一个，由我来选吧。',
  },
  'light-of-heria': {
    sourceId: 'PROD-SRC-07',
    productionId: 'light-of-heria',
    sourceLocale: 'zh-CN',
    title: '赫里亚之辉',
    synopsis: '在最危难的时刻，英雄们从太阳上落下，行过赫里亚山巅，来到米诺斯身边。',
  },
  'sette-collis-mother-wolf': {
    sourceId: 'PROD-SRC-08',
    productionId: 'sette-collis-mother-wolf',
    sourceLocale: 'zh-CN',
    title: '七丘的狼母',
    synopsis: '狼母离巢前车之鉴，规矩不可逾越。',
  },
  'the-dawn': {
    sourceId: 'PROD-SRC-09',
    productionId: 'the-dawn',
    sourceLocale: 'zh-CN',
    title: '初晓',
    synopsis:
      '有一条光带从身后跑来，掠过城市喧嚣，跃向天与地的接缝。忽然，整个大地抖掉清晨的恍惚，睁开双眸，现出露珠与光亮。',
  },
  'the-golden-fowlbeast': {
    sourceId: 'PROD-SRC-10',
    productionId: 'the-golden-fowlbeast',
    sourceLocale: 'zh-CN',
    title: '金羽兽',
    synopsis: '纯金羽兽纯金卵，纯金羽毛摆又摆，纯金幼崽嘎嘎喊，纯金与人又何干？',
  },
  'wild-gold': {
    sourceId: 'PROD-SRC-11',
    productionId: 'wild-gold',
    sourceLocale: 'zh-CN',
    title: '狂野之金',
    synopsis: '“无论你想做什么，你都需要这些东西，越多越好。”',
  },
  'the-lullaby': {
    sourceId: 'PROD-SRC-12',
    productionId: 'the-lullaby',
    sourceLocale: 'zh-CN',
    title: '摇篮曲',
    synopsis: '干净、舒适、安逸的梦境，从一首摇篮曲开始。睡醒之后，一切都会变得更美好。',
  },
  'the-carnival': {
    sourceId: 'PROD-SRC-13',
    productionId: 'the-carnival',
    sourceLocale: 'zh-CN',
    title: '欢欣鼓舞',
    synopsis: '庆祝吧，朋友！这等好事可不是天天都有。',
  },
} as const satisfies Record<string, FolioSourceRecord>;

export type FolioSourceProductionId = keyof typeof folioSourceRecords;
