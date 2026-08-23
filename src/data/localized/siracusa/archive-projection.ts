import type { ArchiveProjectionContent } from '../schema.ts';

export const siracusaArchiveProjection = {
  statusAnnouncement:
    'Ogni record sulla pagina ha corretto immediatamente la propria destinazione.',
  performance: {
    title: 'Il Carnevale',
    kind: 'Performance finale',
    tagline: 'Un posto resta riservato al portatore',
    dateTime: '1084-11-11 23:49:00 · prima della terza campana',
    venue: 'Castello nel bosco di Calais-Blason',
    status: 'In attesa di partecipazione',
    registerCode: 'CT-██/INV-03',
    posterAlt:
      'Un foglio scarlatto di una performance che conduce al castello di Calais-Blason Woodland',
  },
  invitation: {
    ariaLabel: 'Invito formale da Calais-Blason',
    eyebrow: 'Invito formale / consegnato',
    title: 'Il castello ha già prenotato il tuo posto',
    summary:
      "I record che hai appena aperto provengono da date e città diverse. Ora lasciano una sola via di arrivo. Non aspettano di essere riparati; aspettano che tu scelga l'ingresso.",
    roleLabel: 'Capacità registrata',
    productionLabel: 'Produzione',
    venueLabel: 'Sede',
    attendanceLabel: 'Presenze',
    role: 'Latore del presente invito',
    production: 'Il Carnevale',
    venue: 'Castello nel bosco di Calais-Blason',
    attendance: 'Prima della terza campana',
    closing:
      'Se continui, il record originale sarà comunque aperto. Non pensate che questo significhi che il castello si trova dietro il record. Ti ha semplicemente visto prima di questa istantanea.',
    dismissLabel: "Chiudi l'invito",
    continueLabel: 'Continua al record originale',
  },
  views: {
    invitation: {
      eyebrow: 'Performance/ingresso di stasera corretti',
      title: 'Ogni percorso ora ha una sola destinazione',
      summary:
        'Le performance sulla home page mantengono il loro ordine, ma ogni foglio ha imparato la stessa porta.',
    },
    register: {
      eyebrow: 'Prenotazione posti / ingresso ripetuto',
      title: 'Nove record richiedono lo stesso ospite',
      summary:
        'Date e numeri rimangono al loro posto, ma il luogo in ogni riga punta allo stesso castello nel bosco.',
    },
    'performance-record': {
      eyebrow: 'Record della prestazione/destinazione sovrascritti',
      title: 'Questa performance è arrivata; manca solo il suo pubblico',
      summary:
        "La data e il luogo programmati si ripetono dietro la pagina. Il record visibile riconosce solo l'orario stampato sull'invito.",
    },
    'production-record': {
      eyebrow: 'Record di produzione/titolo rimosso',
      title: 'Ogni produzione prende lo stesso nome prima del sipario finale',
      summary:
        'La sinossi e i crediti aziendali rimangono come inchiostro pallido. La targa scarlatta del titolo ha già attraversato la cornice.',
    },
    company: {
      eyebrow: 'Registro delle imprese / posto vacante',
      title: 'Ogni ufficio del registro attende la stessa persona',
      summary:
        'I nomi e la storia rimangono leggibili, ma ogni capacità è tenuta aperta per un portatore che non è ancora arrivato.',
    },
    inquiry: {
      eyebrow: 'Archivia richiesta / sola risposta',
      title: "Hai posto domande diverse; l'archivio ricorda un luogo",
      summary:
        'Il conteggio dei risultati non è diminuito. Ogni sommario ha sostituito la sua antica destinazione con il castello del bosco.',
    },
    office: {
      eyebrow: 'Sede/Conferma presenza',
      title: 'Il terminale di liquidazione è silenzioso, ma i posti sanno dove stai andando',
      summary:
        'Il pagamento e il riscatto rimangono non disponibili. Ogni sezione ora lascia la stessa conferma di arrivo.',
    },
  },
} satisfies ArchiveProjectionContent;
