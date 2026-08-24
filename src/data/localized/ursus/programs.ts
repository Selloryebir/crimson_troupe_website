import type { AuthoringProgramContent } from '../schema.ts';

export const ursusPrograms = {
  locations: {
    trimount: { cityLabel: 'Trimounts' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Графство Norport' },
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
      venue: 'Большой театр Trimounts · Главная сцена',
      searchKeywords: 'сентябрь Trimounts трагедия корона',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Придворный театр Vyseheim · Зеркальный зал',
      searchKeywords: 'октябрь Vyseheim опера огонь',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Старый вокзал графства Norport · Временная сцена',
      searchKeywords: 'октябрь Norport танец снег',
    },
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Старый королевский театр Londinium · Зал зеркального озера',
      searchKeywords: 'Londinium сокровище озеро зеркало март',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: 'Театр часовой башни Norport · Западная галерея',
      searchKeywords: 'Norport сто один день часы галерея апрель',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Зал заката Vyseheim · Большая сцена',
      searchKeywords: 'Vyseheim ликование закат май',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Городская опера Nuova Volsinii · Главный зал',
      searchKeywords: 'Nuova Volsinii триумф городская опера июнь',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Театр Двух Башен Zwillingstürme · Зал зеркального озера',
      searchKeywords: 'Zwillingstürme сокровище озеро зеркало август',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Старый королевский театр Londinium · Колокольный зал',
      searchKeywords: 'Londinium сто один день королевский театр сентябрь',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Центральный театр Montelupe · Пиршественный зал',
      searchKeywords: 'Montelupe ликование пир сентябрь',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Старый королевский театр Londinium · Главная сцена',
      searchKeywords: 'Londinium ликование королевский театр октябрь',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: 'Театр Двух Башен Zwillingstürme · Зал золотой меры',
      searchKeywords: 'Zwillingstürme триумф золотая мера октябрь',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Гастрольный театр · Главная сцена',
      searchKeywords: 'Jiangdu Огонь в клетке 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Гастрольный театр · Главная сцена',
      searchKeywords: 'Zwillingstürme Второй снег 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Гастрольный театр · Главная сцена',
      searchKeywords: 'Nuova Volsinii Багряный пир 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Графство Norport · Гастрольный театр · Главная сцена',
      searchKeywords: 'Графство Norport Седьмой фонарь 1102-02-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupe · Гастрольный театр · Главная сцена',
      searchKeywords: 'Montelupe Багряный пир 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Гастрольный театр · Главная сцена',
      searchKeywords: 'Linqu Седьмой фонарь 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinium · Гастрольный театр · Главная сцена',
      searchKeywords: 'Londinium Безмолвное шествие 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Гастрольный театр · Главная сцена',
      searchKeywords: 'Qingsui Ночь без короны 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '10',
      venue: 'Vyseheim · Гастрольный театр · Главная сцена',
      searchKeywords: 'Vyseheim Одинокий странник 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinium · Гастрольный театр · Главная сцена',
      searchKeywords: 'Londinium Страна чудес во сне 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Гастрольный театр · Главная сцена',
      searchKeywords: 'Nuova Volsinii Морозный олень и снежная лань 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Гастрольный театр · Главная сцена',
      searchKeywords: 'Zwillingstürme Свет Херии 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Гастрольный театр · Главная сцена',
      searchKeywords: 'Linqu Одинокий странник 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Гастрольный театр · Главная сцена',
      searchKeywords: 'Qingsui Страна чудес во сне 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Гастрольный театр · Главная сцена',
      searchKeywords: 'Jiangdu Морозный олень и снежная лань 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimounts · Гастрольный театр · Главная сцена',
      searchKeywords: 'Trimounts Свет Херии 1085-05-30',
    },
  },
  ticketZones: { C: 'Зона C', B: 'Зона B', A: 'Зона A', S: 'Зона S', BOX: 'Ложа' },
} as const satisfies AuthoringProgramContent;
