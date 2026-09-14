import type { AuthoringProgramContent } from '../schema.ts';

export const minosPrograms = {
  locations: {
    'propeller-paradise': { cityLabel: 'Propeller Paradise' },
    volsinii: { cityLabel: 'Παλαιό Βολσίνι', archiveCityLabel: 'Βολσίνι' },
    trimount: { cityLabel: 'Trimounts' },
    wiesheim: { cityLabel: 'Vyseheim' },
    norport: { cityLabel: 'Κομητεία Norport' },
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
        'Columbia · Περίχωρα της πρωτεύουσας · Προσωρινό θέατρο Propeller Paradise · Κεντρική αίθουσα',
      searchKeywords:
        'Columbia · Propeller Paradise Περίχωρα της πρωτεύουσας · Προσωρινό θέατρο Propeller Paradise · Κεντρική αίθουσα',
      operationalNotice: {
        sourceRevision: 'propeller-venue-loss-v1',
        text: 'Η παράσταση που είχε προγραμματιστεί για {originalDate} στον εναέριο χώρο του Propeller Paradise ακυρώθηκε. Ο αρχικός χώρος κατέπεσε, καθιστώντας αδύνατη την παράσταση όπως είχε προγραμματιστεί. Η σελίδα διατηρεί το αρχικό πρόγραμμα μόνο για ενημέρωση.',
      },
    },
    'volsinii-courtyard-1102': {
      index: '12',
      venue: 'Παλαιό Βολσίνι · Θέατρο της Αυλής · Υπαίθρια Σκηνή',
      searchKeywords: 'Παλαιό Βολσίνι Βολσίνι',
    },
    'nuova-volsinii-civic-1102': {
      index: '13',
      venue: 'Nuova Volsinii · Δημοτικό Θέατρο · Μεγάλη Αίθουσα',
      searchKeywords: 'Nuova Volsinii',
    },
    'uncrowned-trimount-1102': {
      index: '01',
      venue: 'Μεγάλο Θέατρο Trimounts · Κύρια Σκηνή',
      searchKeywords: 'Σεπτέμβριος Trimounts τραγωδία στέμμα',
    },
    'caged-fire-wiesheim-1102': {
      index: '02',
      venue: 'Αυλικό Θέατρο Vyseheim · Αίθουσα Κατόπτρων',
      searchKeywords: 'Οκτώβριος Vyseheim όπερα φωτιά',
    },
    'second-snow-norport-1102': {
      index: '03',
      venue: 'Παλιός Σταθμός Κομητείας Norport · Προσωρινή Σκηνή',
      searchKeywords: 'Οκτώβριος Norport χορός χιόνι',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: '04',
      venue: 'Αίθουσα Ηλιοβασιλέματος Vyseheim · Μεγάλη Σκηνή',
      searchKeywords: 'Αίθουσα Ηλιοβασιλέματος Vyseheim · Μεγάλη Σκηνή',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: '05',
      venue: 'Θέατρο Δίδυμων Πύργων Zwillingstürme · Αίθουσα Λίμνης Κατόπτρων',
      searchKeywords: 'Θέατρο Δίδυμων Πύργων Zwillingstürme · Αίθουσα Λίμνης Κατόπτρων',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: '06',
      venue: 'Παλιό Βασιλικό Θέατρο Londinium · Αίθουσα Καμπάνας',
      searchKeywords: 'Παλιό Βασιλικό Θέατρο Londinium · Αίθουσα Καμπάνας',
    },
    'the-carnival-londinium-1084-1009': {
      index: '07',
      venue: 'Παλιό Βασιλικό Θέατρο Londinium · Κύρια Σκηνή',
      searchKeywords: 'Παλιό Βασιλικό Θέατρο Londinium · Κύρια Σκηνή',
    },
    'caged-fire-jiangdu-1101-0521': {
      index: '04',
      venue: 'Jiangdu · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Jiangdu Φωτιά σε Κλουβί 1101-05-21',
    },
    'second-snow-zwillingsturme-1101-0808': {
      index: '05',
      venue: 'Zwillingstürme · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Zwillingstürme Το Δεύτερο Χιόνι 1101-08-08',
    },
    'red-banquet-nuova-volsinii-1101-1119': {
      index: '06',
      venue: 'Nuova Volsinii · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Nuova Volsinii Το Πορφυρό Συμπόσιο 1101-10-04',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Κομητεία Norport · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Κομητεία Norport Ο Έβδομος Λύχνος 1102-04-02',
    },
    'red-banquet-montelupe-1102-0606': {
      index: '08',
      venue: 'Montelupe · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Montelupe Το Πορφυρό Συμπόσιο 1102-06-06',
    },
    'seventh-lantern-linqu-1102-1212': {
      index: '09',
      venue: 'Linqu · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Linqu Ο Έβδομος Λύχνος 1102-12-12',
    },
    'procession-of-masks-londinium-1103-0214': {
      index: '10',
      venue: 'Londinium · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Londinium Η Σιωπηλή Πομπή 1103-02-14',
    },
    'uncrowned-qingsui-1103-0404': {
      index: '11',
      venue: 'Qingsui · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Qingsui Η Αστέφανη Νύχτα 1103-04-04',
    },
    'lone-wander-wiesheim-1083-0814': {
      index: '01',
      venue: 'Vyseheim · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Vyseheim · Περιοδεύον θέατρο · Κεντρική σκηνή',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '02',
      venue: 'Londinium · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Londinium · Περιοδεύον θέατρο · Κεντρική σκηνή',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '03',
      venue: 'Βολσίνι · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Βολσίνι · Περιοδεύον θέατρο · Κεντρική σκηνή',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '08',
      venue: 'Zwillingstürme · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Zwillingstürme · Περιοδεύον θέατρο · Κεντρική σκηνή',
    },
  },
  ticketZones: { C: 'Ζώνη C', B: 'Ζώνη B', A: 'Ζώνη A', S: 'Ζώνη S', BOX: 'Θεωρείο' },
} as const satisfies AuthoringProgramContent;
