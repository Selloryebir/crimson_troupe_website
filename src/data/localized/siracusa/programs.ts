import type { AuthoringProgramContent } from '../schema.ts';

export const siracusaPrograms = {
  locations: {
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
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Vecchio teatro reale di Londinium · Mirror Lake Hall',
      searchKeywords: 'Londinium Der Ring Mirror Lake Hall marzo',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: "Teatro della torre dell'orologio della contea di Norport · Galleria ovest",
      searchKeywords:
        "Galleria della torre dell'orologio dei centouno giorni della contea di Norport aprile",
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Sala del tramonto di Vyseheim · Palcoscenico',
      searchKeywords: 'Vyseheim Sala del tramonto del CarnevaleMag',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Opera Civica Nuova Volsinii · Sala Grande',
      searchKeywords: 'Nuova Volsinii Ode au Triomphe opera civica giugno',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Teatro delle torri gemelle Zwillingstürme · Mirror Lake Hall',
      searchKeywords: 'Zwillingstürme Der Ring Mirror Lake Agosto',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Vecchio teatro reale di Londinium · Sala della campana',
      searchKeywords: 'Londinium Teatro Reale dei Centouno Giorni Settembre',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Teatro Centrale di Montelupe · Sala Banchetti',
      searchKeywords: 'Montelupe Il banchetto di Carnevale Settembre',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Londinium Old Royal Theatre · Palco principale',
      searchKeywords: 'Londinium Il Carnevale Teatro Reale Ottobre',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: "Teatro delle torri gemelle Zwillingstürme · Sala della Misura d'Oro",
      searchKeywords: "Zwillingstürme Ode au Triomphe Misura d'Oro Ottobre",
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
      index: '10',
      venue: 'Vyseheim · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Vyseheim Viandante solitario 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinio · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Londinio Meraviglia nel sogno 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Nuova Volsinii Cervo di brina e cerva di neve 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Zwillingstürme Luce di Heria 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Linqu Viandante solitario 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Qingsui Meraviglia nel sogno 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Jiangdu Cervo di brina e cerva di neve 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimount · Teatro itinerante · Palcoscenico principale',
      searchKeywords: 'Trimount Luce di Heria 1085-05-30',
    },
  },
  ticketZones: { C: 'Zona C', B: 'Zona B', A: 'Zona A', S: 'Zona S', BOX: 'Casella' },
} as const satisfies AuthoringProgramContent;
