import type { AuthoringProgramContent } from '../schema.ts';

export const kazimierzPrograms = {
  locations: {
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
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Stary Teatr Królewski w Londinium · Sala Mirror Lake',
      searchKeywords: 'Londinium Der Ring Mirror Lake Hall w marcu',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: 'Teatr z wieżą zegarową hrabstwa Norport · Galeria Zachodnia',
      searchKeywords: 'Galeria z wieżą zegarową Sto i jeden dzień w hrabstwie Norport, kwiecień',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Sala Zachodzącego Słońca w Vyseheim · Wielka Scena',
      searchKeywords: 'Vyseheim Karnawałowa sala zachodu słońca w maju',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Opera Obywatelska Nuova Volsinii · Sala główna',
      searchKeywords: 'Nuova Volsinii Ode au Triomphe opera obywatelska Czerwiec',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Teatr z dwiema wieżami Zwillingstürme · Sala Mirror Lake',
      searchKeywords: 'Zwillingstürme Der Ring Mirror Lake sierpień',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Stary Teatr Królewski w Londinium · Bell Hall',
      searchKeywords: 'Londinium Sto jeden dni Teatr Królewski wrzesień',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Teatr Centralny w Montelupe · Sala bankietowa',
      searchKeywords: 'Montelupe Bankiet karnawałowy wrzesień',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Stary Teatr Królewski w Londinium · Scena Główna',
      searchKeywords: 'Londinium Karnawałowy Teatr Królewski w październiku',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: 'Teatr z dwiema wieżami Zwillingstürme · Sala Złotej Miarki',
      searchKeywords: 'Zwillingstürme Oda Triomphe Złota Miara Październik',
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
      searchKeywords: 'Nuova Volsinii Karmazynowa Uczta 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Hrabstwo Norport · Teatr objazdowy · Scena główna',
      searchKeywords: 'Hrabstwo Norport Siódma latarnia 1102-02-02',
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
      index: '10',
      venue: 'Vyseheim · Teatr objazdowy · Scena główna',
      searchKeywords: 'Vyseheim Samotny wędrowiec 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinium · Teatr objazdowy · Scena główna',
      searchKeywords: 'Londinium Kraina cudów we śnie 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Teatr objazdowy · Scena główna',
      searchKeywords: 'Nuova Volsinii Jeleń szronu i łania śniegu 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Teatr objazdowy · Scena główna',
      searchKeywords: 'Zwillingstürme Światło Herii 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Teatr objazdowy · Scena główna',
      searchKeywords: 'Linqu Samotny wędrowiec 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Teatr objazdowy · Scena główna',
      searchKeywords: 'Qingsui Kraina cudów we śnie 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Teatr objazdowy · Scena główna',
      searchKeywords: 'Jiangdu Jeleń szronu i łania śniegu 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimounty · Teatr objazdowy · Scena główna',
      searchKeywords: 'Trimounty Światło Herii 1085-05-30',
    },
  },
  ticketZones: { C: 'Strefa C', B: 'Strefa B', A: 'Strefa A', S: 'Strefa S', BOX: 'Pudełko' },
} as const satisfies AuthoringProgramContent;
