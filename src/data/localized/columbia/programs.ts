import type { AuthoringProgramContent } from '../schema.ts';

export const columbiaPrograms = {
  locations: {
    volsinii: { cityLabel: 'Old Volsinii', archiveCityLabel: 'Volsinii' },
    trimount: { cityLabel: 'Trimounts' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Norport County' },
    linqu: { cityLabel: 'Linqu' },
    qingsui: { cityLabel: 'Qingsui' },
    jiangdu: { cityLabel: 'Jiangdu' },
    zwillingsturme: { cityLabel: 'Zwillingstürme' },
    londinium: { cityLabel: 'Londinium' },
    montelupe: { cityLabel: 'Montelupe' },
    'nuova-volsinii': { cityLabel: 'Nuova Volsinii' },
  },
  performances: {
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Old Volsinii · Courtyard Theater · Open-air Stage',
      searchKeywords: 'Old Volsinii Volsinii',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Civic Theater · Grand Hall',
      searchKeywords: 'Nuova Volsinii',
    },
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'Trimounts Grand Theater · Main Stage',
      searchKeywords: 'September Trimounts tragedy crown',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Vyseheim Court Theater · Hall of Mirrors',
      searchKeywords: 'October Vyseheim opera fire',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Norport County Old Station · Temporary Stage',
      searchKeywords: 'October Norport dance snow',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Vyseheim Sunset Hall · Grand Stage',
      searchKeywords: 'Vyseheim Sunset Hall · Grand Stage',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Zwillingstürme Twin-Tower Theater · Mirror Lake Hall',
      searchKeywords: 'Zwillingstürme Twin-Tower Theater · Mirror Lake Hall',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Londinium Old Royal Theater · Bell Hall',
      searchKeywords: 'Londinium Old Royal Theater · Bell Hall',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Londinium Old Royal Theater · Main Stage',
      searchKeywords: 'Londinium Old Royal Theater · Main Stage',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Touring Theatre · Main Stage',
      searchKeywords: 'Jiangdu Fire in a Cage 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Touring Theatre · Main Stage',
      searchKeywords: 'Zwillingstürme The Second Snow 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Touring Theatre · Main Stage',
      searchKeywords: 'Nuova Volsinii The Crimson Banquet 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Norport County · Touring Theatre · Main Stage',
      searchKeywords: 'Norport County The Seventh Lantern 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupe · Touring Theatre · Main Stage',
      searchKeywords: 'Montelupe The Crimson Banquet 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Touring Theatre · Main Stage',
      searchKeywords: 'Linqu The Seventh Lantern 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinium · Touring Theatre · Main Stage',
      searchKeywords: 'Londinium The Silent Procession 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Touring Theatre · Main Stage',
      searchKeywords: 'Qingsui The Uncrowned Night 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '01',
      venue: 'Vyseheim · Touring Theatre · Main Stage',
      searchKeywords: 'Vyseheim · Touring Theatre · Main Stage',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinium · Touring Theatre · Main Stage',
      searchKeywords: 'Londinium · Touring Theatre · Main Stage',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Volsinii · Touring Theatre · Main Stage',
      searchKeywords: 'Volsinii · Touring Theatre · Main Stage',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Touring Theatre · Main Stage',
      searchKeywords: 'Zwillingstürme · Touring Theatre · Main Stage',
    },
  },
  ticketZones: { C: 'Zone C', B: 'Zone B', A: 'Zone A', S: 'Zone S', BOX: 'Box' },
} as const satisfies AuthoringProgramContent;
