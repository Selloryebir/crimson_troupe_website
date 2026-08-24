import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';
import type { yanTicketingPlatforms } from '../yan/messages';

export const siracusaTicketingPlatforms = {
  'rice-network': { displayName: 'Rete Riso', logoAlt: 'Marchio provvisorio di Rete Riso' },
  'drop-tower': { displayName: 'Torre a Caduta', logoAlt: 'Marchio provvisorio di Torre a Caduta' },
} as const satisfies LocalizedShape<typeof yanTicketingPlatforms>;

export const siracusaMessages = {
  filters: {
    city: 'Città',
    allCities: 'Tutte le città',
    month: 'Mese',
    allMonths: 'Tutti i mesi',
    monthOption: 'Mese {month}',
    reset: 'Reimposta i filtri',
    count: 'Prestazioni {count}',
    empty: "Nessuna performance corrisponde a questi filtri. Prova un'altra città o mese.",
  },
  search: {
    label: 'Cerca in questo sito web',
    submit: 'Cerca',
    scope: 'Ambito di ricerca: {scope}',
    unavailable:
      "L'indice di ricerca è temporaneamente non disponibile. Proseguire con la navigazione principale.",
    prompt: 'Inserisci un termine per trovare spettacoli, produzioni e pagine del sito web.',
    minimumQuery: 'Inserisci almeno {count} caratteri.',
    resultCount: 'Risultati {count} trovati.',
    noResults: 'Nessun contenuto corrispondente trovato.',
    noscriptTitle: 'La ricerca richiede JavaScript',
    noscriptCopy:
      'Questa pagina non invia query e non carica alcun servizio remoto. Puoi comunque sfogliare le performance e le informazioni sulla compagnia con la navigazione principale.',
  },
  ticketing: {
    partnerPageEyebrow: 'PARTNER UFFICIALE DI BIGLIETTERIA',
    partnerPageTitle: 'Servizio posti {platform}',
    partnerPageIntroduction:
      'Il sito della compagnia ha affidato il carrello al partner di biglietteria. Completa qui la richiesta dei posti o torna al carrello prima della conferma.',
    partnerUnavailableTitle: 'Collegamento non ancora disponibile',
    partnerUnavailableCopy:
      'Rete Riso al momento non accetta nuove richieste di posti. Il carrello resta disponibile sul sito della compagnia.',
    returnToBasket: 'Torna al carrello ufficiale',
    selectedCount: 'Performance {count} selezionate',
    emptyBasket: 'Nessuna performance selezionata',
    selectionReady: 'La zona spettacolo e posti a sedere si trovano in questo carrello.',
    selectionRequired: 'Seleziona almeno una performance per continuare.',
    zonePreview: 'Visualizzazione: {zone} · {price} LMD. Non ancora nel cestino.',
    zoneInBasket: 'Nel carrello: {zone} · {price} LMD.',
    seatingPlanSummary: 'Visualizza il diagramma del palco e della zona',
    seatingPlanAria: 'Palco e zone salotto per {title}',
    stageDirection: 'FASE',
    seatingLevelLabel: 'Livello {level}',
    seatingPlanNotice:
      'Solo diagramma delle zone, non selezione del posto individuale. Il diagramma e il selettore utilizzano gli stessi prezzi.',
    selectSeatingZone: 'Seleziona {zone}, prezzo base {price} LMD',
    receiptEyebrow: 'REGISTRO DI ASSEGNAZIONE POSTI',
    receiptTitle: 'Ricevuta di registrazione del posto',
    receiptCopy: 'La richiesta è confermata. Verifica i posti assegnati e il totale dovuto.',
    receiptAcceptedAt: 'Ora di accettazione',
    receiptChannel: 'Canale di assegnazione',
    receiptStatus: 'Stato di accettazione',
    receiptStatusAllocated: 'Posti assegnati',
    receiptPerformance: 'Posto per lo spettacolo',
    receiptSchedule: 'Data e ora',
    receiptVenue: 'Sede',
    receiptZone: 'Zona posti',
    receiptFaceValue: 'Tariffa del posto',
    ticketSubtotal: 'Subtotale biglietti',
    amountDue: 'Totale dovuto',
    disclaimer: 'Solo contenuto del gioco. Questa ricevuta non crea alcun obbligo di riscatto.',
    ticketNumber: 'Numero biglietto {number}',
    downloadSvg: 'Scarica SVG',
    printTicket: 'Stampa questo biglietto',
    standardChannel: 'CANALE STANDARD',
    priorityChannel: 'CANALE PRIORITARIO',
    standardAttemptTitle: 'Il traffico di ticketing è attualmente intenso',
    standardAttemptCopy:
      "Il sistema ti chiede di confermare ogni prestazione presente nel tuo carrello. La disponibilità può cambiare dopo l'invio.",
    premiumAttemptTitle: 'Il canale prioritario sta nuovamente cercando',
    premiumAttemptCopy:
      'Il canale afferma di migliorare la tua posizione in coda e aggiunge un aggiustamento del servizio in caso di successo. Potrebbe ancora fallire.',
    submitRequest: 'Conferma e invia',
    backToBasket: 'Torna al carrello ufficiale',
    networkTitle: 'La rete ha smesso di rispondere prima della conferma',
    networkCopy:
      'Non sono stati assegnati posti e il carrello rimane intatto. Invia di nuovo la richiesta tramite Rete Riso.',
    retryBasket: 'Invia di nuovo tramite Rete Riso',
    premiumFailureTitle: 'Il canale prioritario non ha ancora trovato posti',
    premiumFailureCopy:
      'Il canale non ha trovato posti ma ha emesso un registro di accettazione della ricerca. Il carrello e i prezzi dei biglietti restano invariati.',
    premiumOfferTitle: "Il canale Joint Seat Return offre un'altra ricerca",
    premiumOfferCopy:
      "Il canale rileverà l'ordine della tua richiesta e aggiungerà un aggiustamento del servizio pari al 50% del totale della base del carrello in caso di successo. Non può garantire un posto.",
    retentionOfferTitle: "Un'ultima citazione prima di partire",
    retentionOfferCopy:
      "L'adeguamento del servizio è passato dal 50% al 48%. Questa è l'unica citazione di mantenimento in questo round e accettarla non può comunque garantire un posto.",
    standardFailureTitle: 'Traffico intenso: richiesta ticket non riuscita',
    standardFailureCopy:
      'Conserva il carrello e invia nuovamente oppure prova il percorso prioritario che aggiunge un addebito in caso di successo.',
    retryStandard: 'Riprova al prezzo originale con Rete Riso',
    tryPremium: 'Vedi il piano con sovrapprezzo di Torre a Caduta',
    acceptPremium: 'Accetta preventivo al 150% ed effettua nuovamente la ricerca',
    declinePremium: 'Rifiuta questo preventivo',
    acceptRetention: 'Accetta il preventivo di ritenzione del 148%.',
    declineRetention: 'Rifiuta ancora e torna al carrello',
    retryPremium: 'Riprova il piano corrente di Torre a Caduta',
    returnStandard: 'Rifiuta il sovrapprezzo e torna a Rete Riso',
    offerBaseTotal: 'Subtotale biglietti',
    offerAdjustment: 'Servizio prioritario di assegnazione posti',
    offerFinalTotal: 'Totale dovuto del preventivo',
    failureRecordTitle: 'Registro di accettazione ricerca posti',
    allocatedSeats: 'Posti assegnati',
    failureServiceFee: 'Tariffa di accettazione ricerca posti',
    failureRecordDisclaimer:
      'Non si è verificato alcun addebito reale. Questo record non crea alcuna ricevuta, biglietto commemorativo o obbligo di riscatto.',
    startRequired: 'Selezionare prima almeno una performance.',
    submitted: 'Carrello inviato. Rete Riso sta verificando i posti.',
    success: 'Ticketing riuscito. I tuoi biglietti commemorativi sono pronti.',
    stateUpdated: 'Lo stato della richiesta posti è stato aggiornato.',
    downloadStarted: 'Il download per {title} è iniziato.',
    newRound: 'La precedente richiesta posti è terminata. Puoi selezionare di nuovo.',
    adjustments: {
      'priority-service': 'Servizio prioritario di assegnazione posti',
      'retention-service': 'Riduzione per conferma immediata',
    },
    artifact: {
      title: 'Biglietto commemorativo {title}',
      description: '{dateTime}, {place}, {zone}, {price} LMD, numero biglietto {number}',
      header: 'CRIMSON TROUPE · INGRESSO COMMEMORATIVO',
      dateTime: 'DATA E ORA',
      zone: 'ZONA',
      faceValue: 'VALORE NOMINALE BASE',
      ticketNumber: 'NUMERO BIGLIETTO',
      alt: 'Biglietto commemorativo {title}: {dateTime}, {place}, {zone}, {price} LMD, numero biglietto {number}',
    },
  },
  programs: {
    archiveRegister: 'Registro del Turismo N. {index}',
    productionCount: 'Produzioni {count}',
  },
} as const satisfies LocalizedShape<typeof yanMessages>;
