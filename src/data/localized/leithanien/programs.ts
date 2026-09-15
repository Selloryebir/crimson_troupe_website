import type { AuthoringProgramContent } from '../schema.ts';

export const leithanienPrograms = {
  locations: {
    'propeller-paradise': { cityLabel: 'Propeller Paradise' },
    volsinii: { cityLabel: 'Alt-Volsinii', archiveCityLabel: 'Volsinii' },
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
    'propeller-paradise-1102': {
      index: '14',
      venue:
        'Columbia · Stadtrand der Hauptstadt · Temporäres Theater Propeller Paradise · Großer Saal',
      searchKeywords:
        'Columbia · Propeller Paradise Stadtrand der Hauptstadt · Temporäres Theater Propeller Paradise · Großer Saal',
      operationalNotice: {
        sourceRevision: 'propeller-venue-loss-v1',
        text: 'Die für den {originalDate} am schwebenden Spielort in Propeller Paradise vorgesehene Aufführung wurde abgesagt. Der ursprüngliche Spielort ist abgestürzt; die Aufführung kann daher nicht wie geplant stattfinden. Diese Seite bewahrt den ursprünglichen Termin ausschließlich zur Einsicht auf.',
      },
    },
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Alt-Volsinii · Hoftheater · Freilichtbühne',
      searchKeywords: 'Alt-Volsinii Volsinii',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Stadttheater · Großer Saal',
      searchKeywords: 'Nuova Volsinii',
    },
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
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Vyseheim Sunset Hall · Große Bühne',
      searchKeywords: 'Vyseheim Sunset Hall · Große Bühne',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Zwillingstürme Twin-Tower Theater · Mirror Lake Hall',
      searchKeywords: 'Zwillingstürme Twin-Tower Theater · Mirror Lake Hall',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Londinium Old Royal Theatre · Bell Hall',
      searchKeywords: 'Londinium Old Royal Theatre · Bell Hall',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Londinium Old Royal Theatre · Hauptbühne',
      searchKeywords: 'Londinium Old Royal Theatre · Hauptbühne',
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
      searchKeywords: 'Nuova Volsinii Das Crimson Bankett 1101-10-04',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Norport County · Tourneetheater · Hauptbühne',
      searchKeywords: 'Norport County Die siebte Laterne 1102-04-02',
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
      index: '01',
      venue: 'Vyseheim · Tourneetheater · Hauptbühne',
      searchKeywords: 'Vyseheim · Tourneetheater · Hauptbühne',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinium · Tourneetheater · Hauptbühne',
      searchKeywords: 'Londinium · Tourneetheater · Hauptbühne',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Volsinii · Tourneetheater · Hauptbühne',
      searchKeywords: 'Volsinii · Tourneetheater · Hauptbühne',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Tourneetheater · Hauptbühne',
      searchKeywords: 'Zwillingstürme · Tourneetheater · Hauptbühne',
    },
  },
  ticketZones: { C: 'Zone C', B: 'Zone B', A: 'Zone A', S: 'Zone S', BOX: 'Feld' },
} as const satisfies AuthoringProgramContent;
