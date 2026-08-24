import type { ProgramContentBase } from '../schema.ts';

export const yanPrograms = {
  locations: {
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
    'der-ring-londinium-1084-0308': {
      index: '壹',
      venue: '伦蒂尼姆旧王家剧院 · 镜湖厅',
      searchKeywords: '伦蒂尼姆 湖中至宝 镜湖厅 三月',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: '贰',
      venue: '诺伯特郡钟楼剧场 · 西廊',
      searchKeywords: '诺伯特郡 一百零一日 钟楼 西廊 四月',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '叁',
      venue: '维谢海姆夕照厅 · 大舞台',
      searchKeywords: '维谢海姆 欢欣鼓舞 夕照厅 五月',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: '肆',
      venue: '新沃尔西尼市政歌剧院 · 主厅',
      searchKeywords: '新沃尔西尼 凯旋颂 歌剧院 六月',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '伍',
      venue: '崔林特尔梅双塔剧院 · 镜湖厅',
      searchKeywords: '崔林特尔梅 Zwillingstürme 湖中至宝 八月',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '陆',
      venue: '伦蒂尼姆旧王立剧院 · 钟厅',
      searchKeywords: '伦蒂尼姆 一百零一日 王立剧院 九月',
    },
    'the-carnival-montelupe-1084-0921': {
      index: '柒',
      venue: '蒙特卢佩中央剧场 · 宴会厅',
      searchKeywords: '蒙特卢佩 欢欣鼓舞 宴会厅 九月',
    },
    'the-carnival-londinium-1084-1009': {
      index: '捌',
      venue: '伦蒂尼姆旧王立剧院 · 主舞台',
      searchKeywords: '伦蒂尼姆 欢欣鼓舞 王立剧院 十月',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: '玖',
      venue: '崔林特尔梅双塔剧院 · 金律厅',
      searchKeywords: '崔林特尔梅 Zwillingstürme 凯旋颂 十月',
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
      index: '10',
      venue: '维谢海姆 · 巡演剧场 · 主厅',
      searchKeywords: '维谢海姆 独行客 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: '伦蒂尼姆 · 巡演剧场 · 主厅',
      searchKeywords: '伦蒂尼姆 梦中奇缘 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: '新沃尔西尼 · 巡演剧场 · 主厅',
      searchKeywords: '新沃尔西尼 霜牡与雪牝 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: '崔林特尔梅 · 巡演剧场 · 主厅',
      searchKeywords: '崔林特尔梅 赫里亚之辉 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: '临渠 · 巡演剧场 · 主厅',
      searchKeywords: '临渠 独行客 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: '青隧 · 巡演剧场 · 主厅',
      searchKeywords: '青隧 梦中奇缘 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: '江渡 · 巡演剧场 · 主厅',
      searchKeywords: '江渡 霜牡与雪牝 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: '特里蒙 · 巡演剧场 · 主厅',
      searchKeywords: '特里蒙 赫里亚之辉 1085-05-30',
    },
  },
  ticketZones: { C: 'C 区', B: 'B 区', A: 'A 区', S: 'S 区', BOX: '包厢' },
} as const satisfies ProgramContentBase;
