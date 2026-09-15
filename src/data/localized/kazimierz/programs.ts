import type { AuthoringProgramContent } from '../schema.ts';

export const kazimierzPrograms = {
  locations: {
    'propeller-paradise': { cityLabel: 'Propeller Paradise' },
    volsinii: { cityLabel: 'Stare Volsinii', archiveCityLabel: 'Volsinii' },
    trimount: { cityLabel: 'Trimounty' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Hrabstwo Norport' },
    linqu: { cityLabel: 'Linqu' },
    qingsui: { cityLabel: 'Qingsui' },
    jiangdu: { cityLabel: 'Jiangdu' },
    zwillingsturme: { cityLabel: 'Zwillingstürme' },
    londinium: { cityLabel: 'Londinium' },
    'calais-blason': { cityLabel: 'Calais-Blason' },
    montelupe: { cityLabel: 'Montelupa' },
    'nuova-volsinii': { cityLabel: 'Nuova Volsinii' },
  },
  performances: {
    'propeller-paradise-1102': {
      index: '14',
      venue: 'Columbia · Obrzeża stolicy · Tymczasowy teatr Propeller Paradise · Sala główna',
      searchKeywords:
        'Columbia · Propeller Paradise Obrzeża stolicy · Tymczasowy teatr Propeller Paradise · Sala główna',
      operationalNotice: {
        sourceRevision: 'propeller-venue-loss-v1',
        text: 'Przedstawienie zaplanowane na {originalDate} w unoszącym się w powietrzu obiekcie w Propeller Paradise zostało odwołane. Pierwotny obiekt runął, co uniemożliwia realizację przedstawienia zgodnie z planem. Strona zachowuje pierwotny termin wyłącznie do wglądu.',
      },
    },
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Stare Volsinii · Teatr na Dziedzińcu · Scena Plenerowa',
      searchKeywords: 'Stare Volsinii Volsinii',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Teatr Miejski · Wielka Sala',
      searchKeywords: 'Nuova Volsinii',
    },
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'Teatr Wielki Trimounts · Scena Główna',
      searchKeywords: 'Korona tragedii września Trimounts',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Teatr Dworski w Vyseheim · Sala Lustrzana',
      searchKeywords: 'Październikowy pożar opery w Vyseheim',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Stara stacja hrabstwa Norport · Scena tymczasowa',
      searchKeywords: 'Październikowy śnieg taneczny w Norport',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Sala Zachodzącego Słońca w Vyseheim · Wielka Scena',
      searchKeywords: 'Sala Zachodzącego Słońca w Vyseheim · Wielka Scena',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Teatr z dwiema wieżami Zwillingstürme · Sala Mirror Lake',
      searchKeywords: 'Teatr z dwiema wieżami Zwillingstürme · Sala Mirror Lake',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Stary Teatr Królewski w Londinium · Bell Hall',
      searchKeywords: 'Stary Teatr Królewski w Londinium · Bell Hall',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Stary Teatr Królewski w Londinium · Scena Główna',
      searchKeywords: 'Stary Teatr Królewski w Londinium · Scena Główna',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Teatr objazdowy · Scena główna',
      searchKeywords: 'Jiangdu Pożar w klatce 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Teatr objazdowy · Scena główna',
      searchKeywords: 'Zwillingstürme Drugi śnieg 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Teatr objazdowy · Scena główna',
      searchKeywords: 'Nuova Volsinii Karmazynowa Uczta 1101-10-04',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Hrabstwo Norport · Teatr objazdowy · Scena główna',
      searchKeywords: 'Hrabstwo Norport Siódma latarnia 1102-04-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupa · Teatr objazdowy · Scena główna',
      searchKeywords: 'Montelupa Karmazynowa Uczta 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Teatr objazdowy · Scena główna',
      searchKeywords: 'Linqu Siódma latarnia 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinium · Teatr objazdowy · Scena główna',
      searchKeywords: 'Londinium Cicha procesja 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Teatr objazdowy · Scena główna',
      searchKeywords: 'Qingsui Niekoronowana noc 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '01',
      venue: 'Vyseheim · Teatr objazdowy · Scena główna',
      searchKeywords: 'Vyseheim · Teatr objazdowy · Scena główna',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinium · Teatr objazdowy · Scena główna',
      searchKeywords: 'Londinium · Teatr objazdowy · Scena główna',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Volsinii · Teatr objazdowy · Scena główna',
      searchKeywords: 'Volsinii · Teatr objazdowy · Scena główna',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Teatr objazdowy · Scena główna',
      searchKeywords: 'Zwillingstürme · Teatr objazdowy · Scena główna',
    },
  },
  ticketZones: { C: 'Strefa C', B: 'Strefa B', A: 'Strefa A', S: 'Strefa S', BOX: 'Pudełko' },
} as const satisfies AuthoringProgramContent;
