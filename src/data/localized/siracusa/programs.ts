import type { AuthoringProgramContent } from '../schema.ts';

export const siracusaPrograms = {
  locations: {
    volsinii: { cityLabel: 'Vecchia Volsinii', archiveCityLabel: 'Volsinii' },
    trimount: { cityLabel: 'Trimount' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Contea di Norport' },
    linqu: { cityLabel: 'Linqu' },
    qingsui: { cityLabel: 'Qingsui' },
    jiangdu: { cityLabel: 'Jiangdu' },
    zwillingsturme: { cityLabel: 'Zwillingstürme' },
    londinium: { cityLabel: 'Londinio' },
    'calais-blason': { cityLabel: 'Calais-Blason' },
    montelupe: { cityLabel: 'Montelupe' },
    'nuova-volsinii': { cityLabel: 'Nuova Volsinii' },
  },
  performances: {
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Vecchia Volsinii · Teatro del Cortile · Palco all’aperto',
      searchKeywords: 'Vecchia Volsinii Volsinii',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Teatro Civico · Sala Grande',
      searchKeywords: 'Nuova Volsinii',
    },
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'Trimounts Grand Theatre · Palco principale',
      searchKeywords: 'Corona della tragedia di settembre Trimounts',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Teatro di corte di Vyseheim · Sala degli specchi',
      searchKeywords: "Ottobre Incendio dell'opera di Vyseheim",
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Vecchia stazione della contea di Norport · Stadio temporaneo',
      searchKeywords: 'Ottobre Norport balla la neve',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Sala del tramonto di Vyseheim · Palcoscenico',
      searchKeywords: 'Sala del tramonto di Vyseheim · Palcoscenico',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Teatro delle torri gemelle Zwillingstürme · Mirror Lake Hall',
      searchKeywords: 'Teatro delle torri gemelle Zwillingstürme · Mirror Lake Hall',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Vecchio teatro reale di Londinium · Sala della campana',
      searchKeywords: 'Vecchio teatro reale di Londinium · Sala della campana',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Londinium Old Royal Theatre · Palco principale',
      searchKeywords: 'Londinium Old Royal Theatre · Palco principale',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Jiangdu Fuoco in una gabbia 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Zwillingstürme La seconda neve 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Nuova Volsinii Il banchetto cremisi 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Contea di Norport · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Contea di Norport La settima lanterna 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupe · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Montelupe Il banchetto cremisi 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Linqu La settima lanterna 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinio · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Londinio La processione silenziosa 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Qingsui La notte senza corona 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '01',
      venue: 'Vyseheim · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Vyseheim · Teatro itinerante · Palcoscenico principale',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinio · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Londinio · Teatro itinerante · Palcoscenico principale',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Volsinii · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Volsinii · Teatro itinerante · Palcoscenico principale',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Zwillingstürme · Teatro itinerante · Palcoscenico principale',
    },
  },
  ticketZones: { C: 'Zona C', B: 'Zona B', A: 'Zona A', S: 'Zona S', BOX: 'Casella' },
} as const satisfies AuthoringProgramContent;
