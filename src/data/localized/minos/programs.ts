import type { AuthoringProgramContent } from '../schema.ts';

export const minosPrograms = {
  locations: {
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
    'der-ring-londinium-1084-0308': {
      index: 'I',
      venue: 'Παλιό Βασιλικό Θέατρο Londinium · Αίθουσα Λίμνης Κατόπτρων',
      searchKeywords: 'Londinium πετράδι λίμνη κάτοπτρο Μάρτιος',
    },
    'one-hundred-and-one-days-norport-1084-0419': {
      index: 'II',
      venue: 'Θέατρο Πύργου Ρολογιού Norport · Δυτικός Εξώστης',
      searchKeywords: 'Norport εκατόν μία ημέρες ρολόι εξώστης Απρίλιος',
    },
    'the-carnival-wiesheim-1084-0511': {
      index: 'III',
      venue: 'Αίθουσα Ηλιοβασιλέματος Vyseheim · Μεγάλη Σκηνή',
      searchKeywords: 'Vyseheim γιορτή ηλιοβασίλεμα Μάιος',
    },
    'ode-au-triomphe-nuova-volsinii-1084-0623': {
      index: 'IV',
      venue: 'Δημοτική Όπερα Nuova Volsinii · Κύρια Αίθουσα',
      searchKeywords: 'Nuova Volsinii θρίαμβος δημοτική όπερα Ιούνιος',
    },
    'der-ring-zwillingsturme-1084-0817': {
      index: 'V',
      venue: 'Θέατρο Δίδυμων Πύργων Zwillingstürme · Αίθουσα Λίμνης Κατόπτρων',
      searchKeywords: 'Zwillingstürme πετράδι λίμνη κάτοπτρο Αύγουστος',
    },
    'one-hundred-and-one-days-londinium-1084-0903': {
      index: 'VI',
      venue: 'Παλιό Βασιλικό Θέατρο Londinium · Αίθουσα Καμπάνας',
      searchKeywords: 'Londinium εκατόν μία ημέρες βασιλικό θέατρο Σεπτέμβριος',
    },
    'the-carnival-montelupe-1084-0921': {
      index: 'VII',
      venue: 'Κεντρικό Θέατρο Montelupe · Αίθουσα Συμποσίου',
      searchKeywords: 'Montelupe γιορτή συμπόσιο Σεπτέμβριος',
    },
    'the-carnival-londinium-1084-1009': {
      index: 'VIII',
      venue: 'Παλιό Βασιλικό Θέατρο Londinium · Κύρια Σκηνή',
      searchKeywords: 'Londinium γιορτή βασιλικό θέατρο Οκτώβριος',
    },
    'ode-au-triomphe-zwillingsturme-1084-1028': {
      index: 'IX',
      venue: 'Θέατρο Δίδυμων Πύργων Zwillingstürme · Αίθουσα Χρυσού Μέτρου',
      searchKeywords: 'Zwillingstürme θρίαμβος χρυσό μέτρο Οκτώβριος',
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
      searchKeywords: 'Nuova Volsinii Το Πορφυρό Συμπόσιο 1101-11-19',
    },
    'seventh-lantern-norport-1102-0202': {
      index: '07',
      venue: 'Κομητεία Norport · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Κομητεία Norport Ο Έβδομος Λύχνος 1102-02-02',
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
      index: '10',
      venue: 'Vyseheim · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Vyseheim Μοναχικός οδοιπόρος 1083-08-14',
    },
    'wonderland-in-dream-londinium-1083-1109': {
      index: '11',
      venue: 'Londinium · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Londinium Χώρα θαυμάτων στο όνειρο 1083-11-09',
    },
    'frost-deer-and-snow-doe-nuova-volsinii-1084-0125': {
      index: '12',
      venue: 'Nuova Volsinii · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Nuova Volsinii Ελάφι της πάχνης και ελαφίνα του χιονιού 1084-01-25',
    },
    'light-of-heria-zwillingsturme-1084-0608': {
      index: '13',
      venue: 'Zwillingstürme · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Zwillingstürme Το φως της Χέρια 1084-06-08',
    },
    'lone-wander-linqu-1084-0719': {
      index: '14',
      venue: 'Linqu · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Linqu Μοναχικός οδοιπόρος 1084-07-19',
    },
    'wonderland-in-dream-qingsui-1084-1116': {
      index: '15',
      venue: 'Qingsui · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Qingsui Χώρα θαυμάτων στο όνειρο 1084-11-16',
    },
    'frost-deer-and-snow-doe-jiangdu-1085-0122': {
      index: '16',
      venue: 'Jiangdu · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Jiangdu Ελάφι της πάχνης και ελαφίνα του χιονιού 1085-01-22',
    },
    'light-of-heria-trimount-1085-0530': {
      index: '17',
      venue: 'Trimounts · Περιοδεύον θέατρο · Κεντρική σκηνή',
      searchKeywords: 'Trimounts Το φως της Χέρια 1085-05-30',
    },
  },
  ticketZones: { C: 'Ζώνη C', B: 'Ζώνη B', A: 'Ζώνη A', S: 'Ζώνη S', BOX: 'Θεωρείο' },
} as const satisfies AuthoringProgramContent;
