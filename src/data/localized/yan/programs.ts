import type { ProgramContentBase } from '../schema.ts';

export const yanPrograms = {
  locations: {
    volsinii: { cityLabel: '旧沃尔西尼', archiveCityLabel: '沃尔西尼' },
    trimount: { cityLabel: '特里蒙' },
    wiesheim: { cityLabel: '维谢海姆' },
    norport: { cityLabel: '诺伯特郡' },
    linqu: { cityLabel: '临渠' },
    qingsui: { cityLabel: '青隧' },
    jiangdu: { cityLabel: '江渡' },
    zwillingsturme: { cityLabel: '崔林特尔梅' },
    londinium: { cityLabel: '伦蒂尼姆' },
    'calais-blason': { cityLabel: '克莱布拉松' },
    montelupe: { cityLabel: '蒙特卢佩' },
    'nuova-volsinii': { cityLabel: '新沃尔西尼' },
  },
  performances: {
    'volsinii-courtyard-1102': {
      index: '12',
      venue: '旧沃尔西尼 · 庭院剧场 · 露天舞台',
      searchKeywords: '旧沃尔西尼 沃尔西尼',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: '新沃尔西尼 · 市民剧院 · 大厅',
      searchKeywords: '新沃尔西尼',
    },
    'uncrowned-trimount-1102': {
      index: '01',
      venue: '特里蒙大剧院 · 主舞台',
      searchKeywords: '九月 9月 特里蒙 悲剧 王冠',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: '维谢海姆宫廷剧院 · 镜厅',
      searchKeywords: '十月 10月 维谢海姆 歌剧 火',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: '诺伯特郡旧车站 · 临时舞台',
      searchKeywords: '十月 10月 诺伯特 舞剧 雪',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: '维谢海姆夕照厅 · 大舞台',
      searchKeywords: '维谢海姆夕照厅 · 大舞台',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: '崔林特尔梅双塔剧院 · 镜湖厅',
      searchKeywords: '崔林特尔梅双塔剧院 · 镜湖厅',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: '伦蒂尼姆旧王立剧院 · 钟厅',
      searchKeywords: '伦蒂尼姆旧王立剧院 · 钟厅',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: '伦蒂尼姆旧王立剧院 · 主舞台',
      searchKeywords: '伦蒂尼姆旧王立剧院 · 主舞台',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: '江渡 · 巡演剧场 · 主厅',
      searchKeywords: '江渡 《笼中火》 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: '崔林特尔梅 · 巡演剧场 · 主厅',
      searchKeywords: '崔林特尔梅 《第二次雪》 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: '新沃尔西尼 · 巡演剧场 · 主厅',
      searchKeywords: '新沃尔西尼 《猩红宴》 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: '诺伯特郡 · 巡演剧场 · 主厅',
      searchKeywords: '诺伯特郡 《第七盏灯》 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: '蒙特卢佩 · 巡演剧场 · 主厅',
      searchKeywords: '蒙特卢佩 《猩红宴》 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: '临渠 · 巡演剧场 · 主厅',
      searchKeywords: '临渠 《第七盏灯》 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: '伦蒂尼姆 · 巡演剧场 · 主厅',
      searchKeywords: '伦蒂尼姆 《无声巡游》 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: '青隧 · 巡演剧场 · 主厅',
      searchKeywords: '青隧 《无冕之夜》 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '01',
      venue: '维谢海姆 · 巡演剧场 · 主厅',
      searchKeywords: '维谢海姆 · 巡演剧场 · 主厅',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: '伦蒂尼姆 · 巡演剧场 · 主厅',
      searchKeywords: '伦蒂尼姆 · 巡演剧场 · 主厅',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: '沃尔西尼 · 巡演剧场 · 主厅',
      searchKeywords: '沃尔西尼 · 巡演剧场 · 主厅',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: '崔林特尔梅 · 巡演剧场 · 主厅',
      searchKeywords: '崔林特尔梅 · 巡演剧场 · 主厅',
    },
  },
  ticketZones: { C: 'C 区', B: 'B 区', A: 'A 区', S: 'S 区', BOX: '包厢' },
} as const satisfies ProgramContentBase;
