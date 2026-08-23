import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const yanFolioProductions = {
  'der-ring': {
    title: '湖中至宝',
    kind: '幻想剧 · 三幕',
    tagline: '湖水记得每一位索取宝物的人，也记得他们留下的名字。',
    duration: '约 110 分钟，设一次休止',
    durationShort: '约110分钟',
    language: '莱塔尼亚语演出 · 备有炎语场序单',
    heading: '一出关于倒影、誓约与无主珍宝的幻想剧。',
    synopsis:
      '守湖人将一枚无人能够带走的指环交给来访者保管。三次月落以后，指环仍在原处，保管者的倒影却一个接一个沉入湖底。',
    guidance: '全场使用低照度、水面反光与舞台烟雾；部分段落包含近距离耳语。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['湖面机关', '无名镜匠'],
      ['乐章', '双塔弦乐组'],
      ['服装', '绛纱作坊'],
    ],
  },
  'one-hundred-and-one-days': {
    title: '一百零一日',
    kind: '纪事剧 · 五章',
    tagline: '第一百日写给生者，最后一日留给没有归期的人。',
    duration: '约 135 分钟，设两次休止',
    durationShort: '约135分钟',
    language: '维多利亚语演出 · 备有炎语场序单',
    heading: '由一百封未寄出的信组成的漫长纪事。',
    synopsis:
      '一位书记员每天为远方的收信人誊写同一封信。第一百封完成时，剧场里出现了第二张书桌，而无人愿意解释第一百零一日应由谁落款。',
    guidance: '包含钟声、纸张燃烧效果与较长静默。迟到观众须待下一章入场。',
    creatives: [
      ['文本', '无名书记员'],
      ['执导', '旧剧团编演室'],
      ['舞台机关', '长廊工坊'],
      ['诵读', '巡演合唱组'],
    ],
  },
  'the-carnival': {
    title: '欢欣鼓舞',
    kind: '庆典剧 · 七景',
    tagline: '庆典从不缺少来宾，只偶尔缺少离场的人。',
    duration: '约 95 分钟，无休止',
    durationShort: '约95分钟',
    language: '多语混合演出 · 无字幕',
    heading: '鼓点、彩纸与一场无法宣布结束的巡游。',
    synopsis:
      '报幕人连续七次宣布庆典开始，演员与观众席之间的界线随鼓点逐渐消失。最后一面旗帜升起时，仍然坐着的人将被请上舞台完成谢幕。',
    guidance: '演员会进入观众通道；包含突然鼓点、纸屑、低照度与近距离互动。',
    creatives: [
      ['庆典执导', '旧剧团编演室'],
      ['鼓乐', '无名鼓手'],
      ['面具', '绛纱作坊'],
      ['巡游编排', '夜行队列'],
    ],
  },
  'ode-au-triomphe': {
    title: '凯旋颂',
    kind: '颂歌剧 · 四折',
    tagline: '凯旋者尚未归来，颂歌已经记住了他的声音。',
    duration: '约 120 分钟，设一次休止',
    durationShort: '约120分钟',
    language: '叙拉古语与莱塔尼亚语演唱 · 备有炎语场序单',
    heading: '为一场没有胜者的凯旋准备的颂歌剧。',
    synopsis:
      '城门为一支从未出发的队伍打开，合唱团依照空白名册逐一赞颂归来者。钟楼敲响最后一声以前，观众必须决定是否为名单上的自己起立。',
    guidance: '包含高音量合唱、模拟礼炮、焚香与短暂强光。',
    creatives: [
      ['乐章', '无弦室内乐社'],
      ['执导', '旧剧团编演室'],
      ['合唱', '巡演合唱组'],
      ['仪典服装', '金线裁缝室'],
    ],
  },
  'lone-wander': {
    title: '独行客',
    kind: '寓言剧 · 三景',
    tagline: '独自上路的人，总会在身后听见第二组脚步。',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '一名旅人沿着没有同伴的道路寻找最后一座客栈。',
    synopsis:
      '他每晚只登记一位住客，清晨的账簿却总有两个名字。终点出现时，旅人必须决定哪一个脚印属于自己。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  },
  'wonderland-in-dream': {
    title: '梦中奇缘',
    kind: '梦境剧 · 四幕',
    tagline: '梦境为每位来客准备了入口，却没有准备醒来的方向。',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '一场以倒置花园、纸门与沉睡向导组成的梦境巡游。',
    synopsis: '少女循着会倒着生长的路标穿过四重花园；每次醒来，观众席都比梦中少一排。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  },
  'frost-deer-and-snow-doe': {
    title: '霜牡与雪牝',
    kind: '冬夜歌剧 · 三幕',
    tagline: '两道蹄印在雪线上相遇，只有一道继续走向春天。',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '关于追猎、守望与两头白鹿的冬夜歌剧。',
    synopsis: '猎人追随交错蹄印进入无声林地，直到霜牡与雪牝从相反方向说出同一句告别。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  },
  'light-of-heria': {
    title: '赫里亚之辉',
    kind: '圣像剧 · 五章',
    tagline: '那道光照亮城门，也把城内所有影子引向同一处。',
    duration: '约 105 分钟，设一次休止',
    durationShort: '约105分钟',
    language: '旧剧团巡演语汇 · 备有炎语场序单',
    heading: '以金色圣像、长阶和逐次熄灭的灯组成的仪式剧。',
    synopsis:
      '赫里亚的守灯人逐级点亮高塔，城市却随每一次钟声失去一条街道；最后的光只为迟到者保留。',
    guidance: '包含低照度、舞台烟雾与近距离声响；请依照引座员指示入席。',
    creatives: [
      ['编演', '旧剧团编演室'],
      ['舞台', '长廊工坊'],
    ],
  },
} as const satisfies Record<FolioProductionId, ProductionContent>;
