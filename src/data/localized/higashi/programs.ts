import type { AuthoringProgramContent } from '../schema.ts';

export const higashiPrograms = {
  locations: {
    volsinii: { cityLabel: '旧ヴォルシーニ', archiveCityLabel: 'ヴォルシーニ' },
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
    'volsinii-courtyard-1102': {
      index: '12',
      venue: '旧ヴォルシーニ · 中庭劇場 · 野外舞台',
      searchKeywords: '旧ヴォルシーニ ヴォルシーニ',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'ヌオーヴァ・ウォルシーニ · 市民劇場 · 大ホール',
      searchKeywords: 'ヌオーヴァ・ウォルシーニ',
    },
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
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'ヴィシェハイム夕照ホール・大舞台',
      searchKeywords: 'ヴィシェハイム夕照ホール・大舞台',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'ツヴィリングシュトゥルメ双塔劇場・鏡湖の間',
      searchKeywords: 'ツヴィリングシュトゥルメ双塔劇場・鏡湖の間',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'ロンディニウム旧王立劇場・鐘の間',
      searchKeywords: 'ロンディニウム旧王立劇場・鐘の間',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'ロンディニウム旧王立劇場・メインステージ',
      searchKeywords: 'ロンディニウム旧王立劇場・メインステージ',
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
      index: '01',
      venue: 'ヴィシェハイム · 巡演劇場・主舞台',
      searchKeywords: 'ヴィシェハイム · 巡演劇場・主舞台',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'ロンディニウム · 巡演劇場・主舞台',
      searchKeywords: 'ロンディニウム · 巡演劇場・主舞台',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'ヴォルシーニ · 巡演劇場・主舞台',
      searchKeywords: 'ヴォルシーニ · 巡演劇場・主舞台',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'ツヴィリングシュトゥルメ · 巡演劇場・主舞台',
      searchKeywords: 'ツヴィリングシュトゥルメ · 巡演劇場・主舞台',
    },
  },
  ticketZones: { C: 'C席', B: 'B席', A: 'A席', S: 'S席', BOX: 'ボックス席' },
} as const satisfies AuthoringProgramContent;
