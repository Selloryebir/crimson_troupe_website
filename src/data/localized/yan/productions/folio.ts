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
} as const satisfies Record<FolioProductionId, ProductionContent>;
