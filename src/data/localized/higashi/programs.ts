import type { AuthoringProgramContent } from '../schema.ts';

export const higashiPrograms = {
  locations: {
    trimount: { cityLabel: 'トリマウンツ' },
    wiesheim: { cityLabel: 'ヴィシェハイム' },
    norport: { cityLabel: 'ノーポート郡' },
    linqu: { cityLabel: '臨渠' },
    qingsui: { cityLabel: '青隧' },
    jiangdu: { cityLabel: '江渡' },
    zwillingsturme: { cityLabel: 'ツヴィリングシュトゥルメ' },
    londinium: { cityLabel: 'ロンディニウム' },
    'calais-blason': { cityLabel: 'カレー＝ブラゾン' },
    montelupe: { cityLabel: 'モンテルーペ' },
    'nuova-volsinii': { cityLabel: 'ヌオーヴァ・ウォルシーニ' },
  },
  performances: {
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'トリマウンツ大劇場・メインステージ',
      searchKeywords: '9月 トリマウンツ 悲劇 王冠',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'ヴィシェハイム宮廷劇場・鏡の間',
      searchKeywords: '10月 ヴィシェハイム 歌劇 炎',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'ノーポート郡旧駅舎・仮設舞台',
      searchKeywords: '10月 ノーポート 舞踊 雪',
    },
    'der-ring-londinium-1084-0308': {
      index: '一',
      venue: 'ロンディニウム旧王立劇場・鏡湖の間',
      searchKeywords: 'ロンディニウム 湖中の至宝 鏡湖 3月',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: '二',
      venue: 'ノーポート郡時計塔劇場・西回廊',
      searchKeywords: 'ノーポート郡 百日一日物語 時計塔 回廊 4月',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '三',
      venue: 'ヴィシェハイム夕照ホール・大舞台',
      searchKeywords: 'ヴィシェハイム カーニバル 夕照 5月',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: '四',
      venue: 'ヌオーヴァ・ウォルシーニ市立歌劇場・大ホール',
      searchKeywords: 'ヌオーヴァ ウォルシーニ 凱旋の讃歌 歌劇場 6月',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '五',
      venue: 'ツヴィリングシュトゥルメ双塔劇場・鏡湖の間',
      searchKeywords: 'ツヴィリングシュトゥルメ Zwillingstürme 湖中の至宝 8月',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '六',
      venue: 'ロンディニウム旧王立劇場・鐘の間',
      searchKeywords: 'ロンディニウム 百日一日物語 王立劇場 9月',
    },
    'the-carnival-montelupe-1084-0921': {
      index: '七',
      venue: 'モンテルーペ中央劇場・宴会の間',
      searchKeywords: 'モンテルーペ カーニバル 宴会 9月',
    },
    'the-carnival-londinium-1084-1009': {
      index: '八',
      venue: 'ロンディニウム旧王立劇場・メインステージ',
      searchKeywords: 'ロンディニウム カーニバル 王立劇場 10月',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: '九',
      venue: 'ツヴィリングシュトゥルメ双塔劇場・金律の間',
      searchKeywords: 'ツヴィリングシュトゥルメ Zwillingstürme 凱旋の讃歌 10月',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: '江渡 · 巡演劇場・主舞台',
      searchKeywords: '江渡 籠の中の炎 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'ツヴィリングシュトゥルメ · 巡演劇場・主舞台',
      searchKeywords: 'ツヴィリングシュトゥルメ 二度目の雪 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'ヌオーヴァ・ウォルシーニ · 巡演劇場・主舞台',
      searchKeywords: 'ヌオーヴァ・ウォルシーニ 猩紅の宴 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'ノーポート郡 · 巡演劇場・主舞台',
      searchKeywords: 'ノーポート郡 七つ目の灯 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'モンテルーペ · 巡演劇場・主舞台',
      searchKeywords: 'モンテルーペ 猩紅の宴 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: '臨渠 · 巡演劇場・主舞台',
      searchKeywords: '臨渠 七つ目の灯 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'ロンディニウム · 巡演劇場・主舞台',
      searchKeywords: 'ロンディニウム 沈黙の行列 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: '青隧 · 巡演劇場・主舞台',
      searchKeywords: '青隧 無冠の夜 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '10',
      venue: 'ヴィシェハイム · 巡演劇場・主舞台',
      searchKeywords: 'ヴィシェハイム 独り往く者 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'ロンディニウム · 巡演劇場・主舞台',
      searchKeywords: 'ロンディニウム 夢の国の冒険譚 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'ヌオーヴァ・ウォルシーニ · 巡演劇場・主舞台',
      searchKeywords: 'ヌオーヴァ・ウォルシーニ 霜の牡鹿と雪の牝鹿 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'ツヴィリングシュトゥルメ · 巡演劇場・主舞台',
      searchKeywords: 'ツヴィリングシュトゥルメ ヘリアの輝き 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: '臨渠 · 巡演劇場・主舞台',
      searchKeywords: '臨渠 独り往く者 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: '青隧 · 巡演劇場・主舞台',
      searchKeywords: '青隧 夢の国の冒険譚 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: '江渡 · 巡演劇場・主舞台',
      searchKeywords: '江渡 霜の牡鹿と雪の牝鹿 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'トリマウンツ · 巡演劇場・主舞台',
      searchKeywords: 'トリマウンツ ヘリアの輝き 1085-05-30',
    },
  },
  ticketZones: { C: 'C席', B: 'B席', A: 'A席', S: 'S席', BOX: 'ボックス席' },
} as const satisfies AuthoringProgramContent;
