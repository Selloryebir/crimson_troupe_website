import type { AuthoringProgramContent } from '../schema.ts';

export const leithanienPrograms = {
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
      venue: 'Trimounts Grand Theater · Hauptbühne',
      searchKeywords: 'September Trimounts Tragödie krönt',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Vyseheim Court Theatre · Spiegelsaal',
      searchKeywords: 'Brand im Oktober in der Vyseheim-Oper',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Alter Bahnhof von Norport County · Temporäre Bühne',
      searchKeywords: 'Oktober Norport Tanzschnee',
    },
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Altes königliches Theater von Londinium · Mirror Lake Hall',
      searchKeywords: 'Londinium Der Ring Mirror Lake Hall March',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: 'Norport County Clocktower Theater · West Gallery',
      searchKeywords: 'Norport County One Hundred and One Days Clocktower Gallery April',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Vyseheim Sunset Hall · Große Bühne',
      searchKeywords: 'Vyseheim The Carnival Sunset Hall Mai',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Bürgeroper Nuova Volsinii · Hauptsaal',
      searchKeywords: 'Bürgeroper Nuova Volsinii Ode au Triomphe Juni',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Zwillingstürme Twin-Tower Theater · Mirror Lake Hall',
      searchKeywords: 'Zwillingstürme Der Ring Mirror Lake August',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Londinium Old Royal Theatre · Bell Hall',
      searchKeywords: 'Londinium One Hundred and One Days Royal Theatre September',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Montelupe Central Theatre · Bankettsaal',
      searchKeywords: 'Montelupe Das Karnevalsbankett September',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Londinium Old Royal Theatre · Hauptbühne',
      searchKeywords: 'Londinium Das Carnival Royal Theatre Oktober',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: 'Zwillingstürme Twin-Tower Theater · Golden Measure Hall',
      searchKeywords: 'Zwillingstürme Ode au Triomphe Golden Measure Oktober',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Tourneetheater · Hauptbühne',
      searchKeywords: 'Jiangdu Feuer in einem Käfig 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Tourneetheater · Hauptbühne',
      searchKeywords: 'Zwillingstürme Der zweite Schnee 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Tourneetheater · Hauptbühne',
      searchKeywords: 'Nuova Volsinii Das Crimson Bankett 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Norport County · Tourneetheater · Hauptbühne',
      searchKeywords: 'Norport County Die siebte Laterne 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupe · Tourneetheater · Hauptbühne',
      searchKeywords: 'Montelupe Das Crimson Bankett 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Tourneetheater · Hauptbühne',
      searchKeywords: 'Linqu Die siebte Laterne 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinium · Tourneetheater · Hauptbühne',
      searchKeywords: 'Londinium Die stille Prozession 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Tourneetheater · Hauptbühne',
      searchKeywords: 'Qingsui Die ungekrönte Nacht 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '10',
      venue: 'Vyseheim · Tourneetheater · Hauptbühne',
      searchKeywords: 'Vyseheim Der Einzelwanderer 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinium · Tourneetheater · Hauptbühne',
      searchKeywords: 'Londinium Wunderland im Traum 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Tourneetheater · Hauptbühne',
      searchKeywords: 'Nuova Volsinii Frosthirsch und Schneehindin 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Tourneetheater · Hauptbühne',
      searchKeywords: 'Zwillingstürme Licht von Heria 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Tourneetheater · Hauptbühne',
      searchKeywords: 'Linqu Der Einzelwanderer 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Tourneetheater · Hauptbühne',
      searchKeywords: 'Qingsui Wunderland im Traum 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Tourneetheater · Hauptbühne',
      searchKeywords: 'Jiangdu Frosthirsch und Schneehindin 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimounts · Tourneetheater · Hauptbühne',
      searchKeywords: 'Trimounts Licht von Heria 1085-05-30',
    },
  },
  ticketZones: { C: 'Zone C', B: 'Zone B', A: 'Zone A', S: 'Zone S', BOX: 'Feld' },
} as const satisfies AuthoringProgramContent;
