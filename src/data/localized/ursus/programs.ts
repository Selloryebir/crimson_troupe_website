import type { AuthoringProgramContent } from '../schema.ts';

export const ursusPrograms = {
  locations: {
    volsinii: { cityLabel: 'Старый Вольсиний', archiveCityLabel: 'Вольсиний' },
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
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Старый Вольсиний · Дворовый театр · Открытая сцена',
      searchKeywords: 'Старый Вольсиний Вольсиний',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Городской театр · Большой зал',
      searchKeywords: 'Nuova Volsinii',
    },
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
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Зал заката Vyseheim · Большая сцена',
      searchKeywords: 'Зал заката Vyseheim · Большая сцена',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Театр Двух Башен Zwillingstürme · Зал зеркального озера',
      searchKeywords: 'Театр Двух Башен Zwillingstürme · Зал зеркального озера',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Старый королевский театр Londinium · Колокольный зал',
      searchKeywords: 'Старый королевский театр Londinium · Колокольный зал',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Старый королевский театр Londinium · Главная сцена',
      searchKeywords: 'Старый королевский театр Londinium · Главная сцена',
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
      index: '01',
      venue: 'Vyseheim · Гастрольный театр · Главная сцена',
      searchKeywords: 'Vyseheim · Гастрольный театр · Главная сцена',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinium · Гастрольный театр · Главная сцена',
      searchKeywords: 'Londinium · Гастрольный театр · Главная сцена',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Вольсиний · Гастрольный театр · Главная сцена',
      searchKeywords: 'Вольсиний · Гастрольный театр · Главная сцена',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Гастрольный театр · Главная сцена',
      searchKeywords: 'Zwillingstürme · Гастрольный театр · Главная сцена',
    },
  },
  ticketZones: { C: 'Зона C', B: 'Зона B', A: 'Зона A', S: 'Зона S', BOX: 'Ложа' },
} as const satisfies AuthoringProgramContent;
