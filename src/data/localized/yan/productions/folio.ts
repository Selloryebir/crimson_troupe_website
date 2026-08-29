import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const yanFolioProductions = {
  'der-ring': createFolioProductionContent('yan', 'der-ring', {
    kind: '幻想剧 · 三幕',
    duration: '约 110 分钟，设一次休止',
    durationShort: '约110分钟',
    language: '莱塔尼亚语演出 · 备有炎语场序单',
    heading: '一出关于倒影、誓约与无主珍宝的幻想剧。',
    guidance: '全场使用低照度、水面反光与舞台烟雾；部分段落包含近距离耳语。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['湖面机关', '无名镜匠'],
      ['乐章', '双塔弦乐组'],
      ['服装', '绛纱作坊'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent('yan', 'one-hundred-and-one-days', {
    kind: '纪事剧 · 五章',
    duration: '约 135 分钟，设两次休止',
    durationShort: '约135分钟',
    language: '维多利亚语演出 · 备有炎语场序单',
    heading: '由一百封未寄出的信组成的漫长纪事。',
    guidance: '包含钟声、纸张燃烧效果与较长静默。迟到观众须待下一章入场。',
    creatives: [
      ['文本', '无名书记员'],
      ['执导', '旧剧团编演室'],
      ['舞台机关', '长廊工坊'],
      ['诵读', '巡演合唱组'],
    ],
  }),
  'the-carnival': createFolioProductionContent('yan', 'the-carnival', {
    kind: '庆典剧 · 七景',
    duration: '约 95 分钟，无休止',
    durationShort: '约95分钟',
    language: '多语混合演出 · 无字幕',
    heading: '鼓点、彩纸与一场无法宣布结束的巡游。',
    guidance: '演员会进入观众通道；包含突然鼓点、纸屑、低照度与近距离互动。',
    creatives: [
      ['庆典执导', '旧剧团编演室'],
      ['鼓乐', '无名鼓手'],
      ['面具', '绛纱作坊'],
      ['巡游编排', '夜行队列'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('yan', 'ode-au-triomphe', {
    kind: '颂歌剧 · 四折',
    duration: '约 120 分钟，设一次休止',
    durationShort: '约120分钟',
    language: '叙拉古语与莱塔尼亚语演唱 · 备有炎语场序单',
    heading: '为一场没有胜者的凯旋准备的颂歌剧。',
    guidance: '包含高音量合唱、模拟礼炮、焚香与短暂强光。',
    creatives: [
      ['乐章', '无弦室内乐社'],
      ['执导', '旧剧团编演室'],
      ['合唱', '巡演合唱组'],
      ['仪典服装', '金线裁缝室'],
    ],
  }),
  'lone-wander': createFolioProductionContent('yan', 'lone-wander', {
    kind: '寓言剧 · 三景',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '一名旅人沿着没有同伴的道路寻找最后一座客栈。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('yan', 'wonderland-in-dream', {
    kind: '梦境剧 · 四幕',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '一场以倒置花园、纸门与沉睡向导组成的梦境巡游。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('yan', 'frost-deer-and-snow-doe', {
    kind: '冬夜歌剧 · 三幕',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '关于追猎、守望与两头白鹿的冬夜歌剧。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('yan', 'light-of-heria', {
    kind: '圣像剧 · 五章',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '以金色圣像、长阶和逐次熄灭的灯组成的仪式剧。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  }),
} as const satisfies Record<FolioProductionId, ProductionContent>;
