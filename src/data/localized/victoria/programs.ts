import type { AuthoringProgramContent } from '../schema.ts';

export const victoriaPrograms = {
  locations: {
    trimount: { cityLabel: 'Trimounts' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Norport County' },
    linqu: { cityLabel: 'Linqu' },
    qingsui: { cityLabel: 'Qingsui' },
    jiangdu: { cityLabel: 'Jiangdu' },
    zwillingsturme: { cityLabel: 'Zwillingstürme' },
    londinium: { cityLabel: 'Londinium' },
    'calais-blason': { cityLabel: 'Calais-Blason' },
    montelupe: { cityLabel: 'Montelupe' },
    'nuova-volsinii': { cityLabel: 'Nuova Volsinii' },
  },
  performances: {
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'Trimounts Grand Theatre · Main Stage',
      searchKeywords: 'September Trimounts tragedy crown',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Vyseheim Court Theatre · Hall of Mirrors',
      searchKeywords: 'October Vyseheim opera fire',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Norport County Old Station · Temporary Stage',
      searchKeywords: 'October Norport dance snow',
    },
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Old Royal Theatre of Londinium · Mirror Lake Hall',
      searchKeywords: 'Londinium Der Ring Mirror Lake Hall March',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: 'Norport County Clocktower Theatre · West Gallery',
      searchKeywords: 'Norport County One Hundred and One Days clocktower gallery April',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Vyseheim Sunset Hall · Grand Stage',
      searchKeywords: 'Vyseheim The Carnival Sunset Hall May',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Nuova Volsinii Civic Opera · Main Hall',
      searchKeywords: 'Nuova Volsinii Ode au Triomphe civic opera June',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Zwillingstürme Twin-Tower Theatre · Mirror Lake Hall',
      searchKeywords: 'Zwillingstürme Der Ring Mirror Lake August',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Londinium Old Royal Theatre · Bell Hall',
      searchKeywords: 'Londinium One Hundred and One Days Royal Theatre September',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Montelupe Central Theatre · Banquet Hall',
      searchKeywords: 'Montelupe The Carnival banquet September',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Londinium Old Royal Theatre · Main Stage',
      searchKeywords: 'Londinium The Carnival Royal Theatre October',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: 'Zwillingstürme Twin-Tower Theatre · Golden Measure Hall',
      searchKeywords: 'Zwillingstürme Ode au Triomphe Golden Measure October',
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
      index: '10',
      venue: 'Vyseheim · Touring Theatre · Main Stage',
      searchKeywords: 'Vyseheim Lone Wander 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinium · Touring Theatre · Main Stage',
      searchKeywords: 'Londinium Wonderland in Dream 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Touring Theatre · Main Stage',
      searchKeywords: 'Nuova Volsinii Frost Deer and Snow Doe 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Touring Theatre · Main Stage',
      searchKeywords: 'Zwillingstürme Light of Heria 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Touring Theatre · Main Stage',
      searchKeywords: 'Linqu Lone Wander 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Touring Theatre · Main Stage',
      searchKeywords: 'Qingsui Wonderland in Dream 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Touring Theatre · Main Stage',
      searchKeywords: 'Jiangdu Frost Deer and Snow Doe 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimounts · Touring Theatre · Main Stage',
      searchKeywords: 'Trimounts Light of Heria 1085-05-30',
    },
  },
  ticketZones: { C: 'Zone C', B: 'Zone B', A: 'Zone A', S: 'Zone S', BOX: 'Box' },
} as const satisfies AuthoringProgramContent;
