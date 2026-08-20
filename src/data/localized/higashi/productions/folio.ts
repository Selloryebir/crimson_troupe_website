import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const higashiFolioProductions = {
  'der-ring': {
    title: '湖中の至宝',
    kind: '幻想劇・三幕',
    tagline: '湖は宝を求めた者と、彼らが残した名をすべて覚えている。',
    duration: '約110分、休止1回',
    durationShort: '約110分',
    language: 'リターニア語上演・極東語進行表あり',
    heading: '映り込み、誓約、持ち主のない宝をめぐる幻想劇。',
    synopsis:
      '湖守は持ち出せない指輪を来訪者へ預ける。三度月が沈んだあとも指輪は元の場所にあり、預かった者の影だけが一人ずつ湖底へ沈んでいく。',
    guidance: '低照度、水面反射、舞台煙、観客席近くの囁きを含みます。',
    creatives: [
      ['脚色', '旧劇団制作室'],
      ['湖面装置', '名なき鏡職人'],
      ['音楽', '双塔弦楽団'],
      ['衣装', '緋紗工房'],
    ],
  },
  'one-hundred-and-one-days': {
    title: '百日一日物語',
    kind: '年代記劇・五章',
    tagline: '百日目は生者へ。最後の日は帰らぬ者へ。',
    duration: '約135分、休止2回',
    durationShort: '約135分',
    language: 'ヴィクトリア語上演・極東語進行表あり',
    heading: '送られなかった百通の手紙からなる長い年代記。',
    synopsis:
      '書記は遠くの受取人へ同じ手紙を毎日書き写す。百通目が完成すると二つ目の机が現れ、百日一日目に誰が署名するのか誰も語ろうとしない。',
    guidance: '鐘、紙が燃える演出、長い沈黙を含みます。遅刻者は次章まで入場できません。',
    creatives: [
      ['脚本', '名なき書記'],
      ['演出', '旧劇団制作室'],
      ['舞台装置', '回廊工房'],
      ['朗読', '巡演合唱団'],
    ],
  },
  'the-carnival': {
    title: 'カーニバル',
    kind: '祝祭劇・七景',
    tagline: '祝祭に客が欠けることはない。ただ、帰る者が欠けることはある。',
    duration: '約95分、休止なし',
    durationShort: '約95分',
    language: '多言語上演・字幕なし',
    heading: '太鼓、紙飾り、終わりを告げられない行列。',
    synopsis:
      '伝令が七度祝祭の開始を告げ、太鼓のたびに役者と観客の境が薄れる。最後の旗が上がるとき、まだ座っている者は舞台で終礼を完成するよう招かれる。',
    guidance: '役者が客席通路へ入ります。突然の太鼓、紙吹雪、低照度、近距離交流を含みます。',
    creatives: [
      ['祝祭演出', '旧劇団制作室'],
      ['太鼓', '名なき太鼓手'],
      ['仮面', '緋紗工房'],
      ['行列構成', '夜の隊列'],
    ],
  },
  'ode-au-triomphe': {
    title: '凱旋の讃歌',
    kind: '頌歌劇・四折',
    tagline: '凱旋者はまだ戻らず、讃歌はすでにその声を覚えている。',
    duration: '約120分、休止1回',
    durationShort: '約120分',
    language: 'シラクーザ語とリターニア語歌唱・極東語進行表あり',
    heading: '勝者のいない凱旋のために用意された頌歌劇。',
    synopsis:
      '出発しなかった一団のため城門が開き、合唱団は空白の名簿から帰還者を讃える。最後の鐘までに、観客は自分の名で立ち上がるかを決めなければならない。',
    guidance: '大音量の合唱、模擬礼砲、香、短い強光を含みます。',
    creatives: [
      ['音楽', '無弦室内楽会'],
      ['演出', '旧劇団制作室'],
      ['合唱', '巡演合唱団'],
      ['儀礼衣装', '金糸仕立室'],
    ],
  },
} as const satisfies Record<FolioProductionId, ProductionContent>;
