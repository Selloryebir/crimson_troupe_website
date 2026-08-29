import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const higashiFolioProductions = {
  'der-ring': createFolioProductionContent('higashi', 'der-ring', {
    kind: '幻想劇・三幕',
    duration: '約110分、休止1回',
    durationShort: '約110分',
    language: 'リターニア語上演・極東語進行表あり',
    heading: '映り込み、誓約、持ち主のない宝をめぐる幻想劇。',
    guidance: '低照度、水面反射、舞台煙、観客席近くの囁きを含みます。',
    creatives: [
      ['脚色', '旧劇団制作室'],
      ['湖面装置', '名なき鏡職人'],
      ['音楽', '双塔弦楽団'],
      ['衣装', '緋紗工房'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent('higashi', 'one-hundred-and-one-days', {
    kind: '年代記劇・五章',
    duration: '約135分、休止2回',
    durationShort: '約135分',
    language: 'ヴィクトリア語上演・極東語進行表あり',
    heading: '送られなかった百通の手紙からなる長い年代記。',
    guidance: '鐘、紙が燃える演出、長い沈黙を含みます。遅刻者は次章まで入場できません。',
    creatives: [
      ['脚本', '名なき書記'],
      ['演出', '旧劇団制作室'],
      ['舞台装置', '回廊工房'],
      ['朗読', '巡演合唱団'],
    ],
  }),
  'the-carnival': createFolioProductionContent('higashi', 'the-carnival', {
    kind: '祝祭劇・七景',
    duration: '約95分、休止なし',
    durationShort: '約95分',
    language: '多言語上演・字幕なし',
    heading: '太鼓、紙飾り、終わりを告げられない行列。',
    guidance: '役者が客席通路へ入ります。突然の太鼓、紙吹雪、低照度、近距離交流を含みます。',
    creatives: [
      ['祝祭演出', '旧劇団制作室'],
      ['太鼓', '名なき太鼓手'],
      ['仮面', '緋紗工房'],
      ['行列構成', '夜の隊列'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('higashi', 'ode-au-triomphe', {
    kind: '頌歌劇・四折',
    duration: '約120分、休止1回',
    durationShort: '約120分',
    language: 'シラクーザ語とリターニア語歌唱・極東語進行表あり',
    heading: '勝者のいない凱旋のために用意された頌歌劇。',
    guidance: '大音量の合唱、模擬礼砲、香、短い強光を含みます。',
    creatives: [
      ['音楽', '無弦室内楽会'],
      ['演出', '旧劇団制作室'],
      ['合唱', '巡演合唱団'],
      ['儀礼衣装', '金糸仕立室'],
    ],
  }),
  'lone-wander': createFolioProductionContent('higashi', 'lone-wander', {
    kind: '寓話劇・三景',
    duration: '約105分・休憩1回',
    durationShort: '約105分',
    language: '旧劇団巡演演目・場序表あり',
    heading: '旅人が無人の道で最後の宿を探す寓話劇。',
    guidance: '低照度、舞台煙、近距離音響を使用します。案内係の指示に従ってください。',
    creatives: [
      ['演出', '旧劇団演目室'],
      ['舞台', '長廊工房'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('higashi', 'wonderland-in-dream', {
    kind: '夢幻劇・四幕',
    duration: '約105分・休憩1回',
    durationShort: '約105分',
    language: '旧劇団巡演演目・場序表あり',
    heading: '逆さの庭、紙の扉、眠る案内人による夢の行列。',
    guidance: '低照度、舞台煙、近距離音響を使用します。案内係の指示に従ってください。',
    creatives: [
      ['演出', '旧劇団演目室'],
      ['舞台', '長廊工房'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('higashi', 'frost-deer-and-snow-doe', {
    kind: '冬夜歌劇・三幕',
    duration: '約105分・休憩1回',
    durationShort: '約105分',
    language: '旧劇団巡演演目・場序表あり',
    heading: '狩りと見張り、二頭の白鹿をめぐる冬夜歌劇。',
    guidance: '低照度、舞台煙、近距離音響を使用します。案内係の指示に従ってください。',
    creatives: [
      ['演出', '旧劇団演目室'],
      ['舞台', '長廊工房'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('higashi', 'light-of-heria', {
    kind: '聖像劇・五章',
    duration: '約105分・休憩1回',
    durationShort: '約105分',
    language: '旧劇団巡演演目・場序表あり',
    heading: '金の聖像、長い階段、順に消える灯で構成された儀式劇。',
    guidance: '低照度、舞台煙、近距離音響を使用します。案内係の指示に従ってください。',
    creatives: [
      ['演出', '旧劇団演目室'],
      ['舞台', '長廊工房'],
    ],
  }),
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
