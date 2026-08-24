import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';
import type { yanTicketingPlatforms } from '../yan/messages';

export const leithanienTicketingPlatforms = {
  'rice-network': { displayName: 'Reisnetz', logoAlt: 'Vorläufiges Zeichen des Reisnetzes' },
  'drop-tower': { displayName: 'Fallturm', logoAlt: 'Vorläufiges Zeichen des Fallturms' },
} as const satisfies LocalizedShape<typeof yanTicketingPlatforms>;

export const leithanienMessages = {
  filters: {
    city: 'Stadt',
    allCities: 'Alle Städte',
    month: 'Monat',
    allMonths: 'Alle Monate',
    monthOption: 'Monat {month}',
    reset: 'Filter zurücksetzen',
    count: '{count} Leistungen',
    empty:
      'Keine Leistungen entsprechen diesen Filtern. Versuchen Sie es mit einer anderen Stadt oder einem anderen Monat.',
  },
  search: {
    label: 'Diese Website durchsuchen',
    submit: 'Suche',
    scope: 'Suchbereich: {scope}',
    unavailable:
      'Der Suchindex ist vorübergehend nicht verfügbar. Fahren Sie mit der Hauptnavigation fort.',
    prompt:
      'Geben Sie einen Begriff ein, um Aufführungen, Produktionen und Website-Seiten zu finden.',
    minimumQuery: 'Geben Sie mindestens {count} Zeichen ein.',
    resultCount: '{count} Ergebnisse gefunden.',
    noResults: 'Es wurde kein passender Inhalt gefunden.',
    noscriptTitle: 'Für die Suche ist JavaScript erforderlich',
    noscriptCopy:
      'Diese Seite sendet keine Anfrage und lädt keinen Remote-Dienst. Über die Hauptnavigation können Sie weiterhin nach Leistungen und Unternehmensinformationen suchen.',
  },
  ticketing: {
    partnerPageEyebrow: 'OFFIZIELLER KARTENPARTNER',
    partnerPageTitle: 'Sitzplatzdienst {platform}',
    partnerPageIntroduction:
      'Die Website der Truppe hat den Warenkorb an den Ticketpartner übergeben. Schließen Sie hier die Platzanfrage ab oder kehren Sie vor der Bestätigung zurück.',
    partnerUnavailableTitle: 'Verbindung noch nicht verfügbar',
    partnerUnavailableCopy:
      'Das Reisnetz nimmt derzeit keine neuen Platzanfragen an. Ihr Warenkorb bleibt auf der Website der Truppe erhalten.',
    returnToBasket: 'Zum offiziellen Warenkorb',
    selectedCount: '{count} Auftritte ausgewählt',
    emptyBasket: 'Keine Auftritte ausgewählt',
    selectionReady: 'Die Aufführungs- und Sitzbereich befinden sich in diesem Korb.',
    selectionRequired: 'Wählen Sie mindestens eine Aufführung aus, um fortzufahren.',
    zonePreview: 'Anzeigen: {zone} · {price} LMD. Noch nicht im Warenkorb.',
    zoneInBasket: 'Im Warenkorb: {zone} · {price} LMD.',
    seatingPlanSummary: 'Bühnen- und Zonendiagramm anzeigen',
    seatingPlanAria: 'Bühnen- und Sitzbereiche für {title}',
    stageDirection: 'BÜHNE',
    seatingLevelLabel: 'Ebene {level}',
    seatingPlanNotice:
      'Nur Zonendiagramm, keine individuelle Sitzplatzauswahl. Das Diagramm und der Selektor verwenden dieselben Preise.',
    selectSeatingZone: 'Wählen Sie {zone}, Basispreis {price} LMD',
    receiptEyebrow: 'SITZPLATZZUTEILUNG',
    receiptTitle: 'Sitzplatzregistrierungsbeleg',
    receiptCopy:
      'Diese Anfrage wurde bestätigt. Prüfen Sie die zugeteilten Plätze und den fälligen Betrag.',
    baseTotal: 'Zwischensumme der Tickets',
    adjustmentNone: 'Keine',
    settledTotal: 'Fälliger Gesamtbetrag',
    disclaimer: 'Nur Spielinhalte. Mit dieser Quittung entsteht keine Rücknahmepflicht.',
    ticketNumber: 'Ticketnummer {number}',
    downloadSvg: 'SVG herunterladen',
    printTicket: 'Drucken Sie dieses Ticket aus',
    standardChannel: 'STANDARDKANAL',
    priorityChannel: 'PRIORITÄTSKANAL',
    standardAttemptTitle: 'Der Ticketverkaufsverkehr ist derzeit stark',
    standardAttemptCopy:
      'Das System fordert Sie auf, jede Leistung in Ihrem Warenkorb zu bestätigen. Die Verfügbarkeit kann sich nach der Einreichung ändern.',
    premiumAttemptTitle: 'Der Prioritätskanal wird erneut gesucht',
    premiumAttemptCopy:
      'Der Kanal behauptet, Ihre Warteschlangenposition zu verbessern und fügt bei Erfolg eine Serviceanpassung hinzu. Es kann trotzdem sein, dass es scheitert.',
    submitRequest: 'Bestätigen und absenden',
    backToBasket: 'Zum offiziellen Warenkorb zurückkehren',
    networkTitle: 'Das Netzwerk reagierte vor der Bestätigung nicht mehr',
    networkCopy:
      'Es wurden keine Plätze zugeteilt und Ihr Warenkorb bleibt erhalten. Senden Sie die Anfrage erneut über das Reisnetz.',
    retryBasket: 'Erneut über das Reisnetz senden',
    premiumFailureTitle: 'Der Prioritätskanal hat immer noch keine Plätze gefunden',
    premiumFailureCopy:
      'Der Kanal hat keine Plätze gefunden, aber einen Annahmebeleg für die Platzsuche erstellt. Warenkorb und Ticketpreise bleiben unverändert.',
    premiumOfferTitle: 'Der Joint Seat Return Channel bietet eine weitere Suche',
    premiumOfferCopy:
      'Der Kanal wird Ihre Anfragebestellung vermerken und bei Erfolg eine Serviceanpassung in Höhe von 50 % der Warenkorb-Basissumme hinzufügen. Es kann kein Sitzplatz garantiert werden.',
    retentionOfferTitle: 'Ein letztes Zitat, bevor Sie gehen',
    retentionOfferCopy:
      'Die Serviceanpassung wurde von 50 % auf 48 % verschoben. Dies ist das einzige Retention-Angebot in dieser Runde, und die Annahme dieses Angebots kann noch keinen Sitzplatz garantieren.',
    standardFailureTitle: 'Starker Verkehr: Ticketanfrage fehlgeschlagen',
    standardFailureCopy:
      'Behalten Sie den Warenkorb und senden Sie ihn erneut, oder versuchen Sie es mit der Prioritätsroute, bei der bei Erfolg eine Gebühr erhoben wird.',
    retryStandard: 'Zum Originalpreis über das Reisnetz erneut versuchen',
    tryPremium: 'Aufschlagplan des Fallturms anzeigen',
    acceptPremium: 'Akzeptieren Sie ein 150 %-Angebot und suchen Sie erneut',
    declinePremium: 'Dieses Angebot ablehnen',
    acceptRetention: 'Akzeptieren Sie das 148 % Retention-Angebot',
    declineRetention: 'Lehnen Sie weiterhin ab und kehren Sie zum Warenkorb zurück',
    retryPremium: 'Aktuellen Fallturm-Plan erneut versuchen',
    returnStandard: 'Aufschlag ablehnen und zum Reisnetz zurückkehren',
    offerBaseTotal: 'Zwischensumme der Tickets',
    offerAdjustment: 'Priorisierte Sitzplatzzuteilung',
    offerFinalTotal: 'Fälliger Angebotsbetrag',
    failureRecordTitle: 'Annahmebeleg für die Platzsuche',
    allocatedSeats: 'Sitzplätze zugewiesen',
    failureServiceFee: 'Annahmegebühr für die Platzsuche',
    failureRecordDisclaimer:
      'Es ist keine tatsächliche Belastung erfolgt. Durch diese Aufzeichnung entsteht keine Quittung, kein Erinnerungsticket und keine Rücknahmepflicht.',
    startRequired: 'Wählen Sie zunächst mindestens eine Aufführung aus.',
    submitted: 'Warenkorb übermittelt. Das Reisnetz prüft die verfügbaren Plätze.',
    success: 'Die Ticketausstellung war erfolgreich. Ihre Erinnerungskarten sind fertig.',
    stateUpdated: 'Der Status der Platzanfrage wurde aktualisiert.',
    downloadStarted: 'Der Download für {title} hat begonnen.',
    newRound: 'Die vorherige Platzanfrage ist beendet. Sie können erneut auswählen.',
    adjustments: {
      'priority-service': 'Priorisierte Sitzplatzzuteilung',
      'retention-service': 'Nachlass für sofortige Bestätigung',
    },
    artifact: {
      title: '{title} Gedenkticket',
      description: '{dateTime}, {place}, {zone}, {price} LMD, Ticketnummer {number}',
      header: 'CRIMSON TROUPE · GEDENKEINTRITT',
      dateTime: 'TERRA DATUM UND UHRZEIT',
      zone: 'ZONE',
      faceValue: 'BASISNennwert',
      ticketNumber: 'TICKETNUMMER',
      alt: '{title} Gedenkticket: {dateTime}, {place}, {zone}, {price} LMD, Ticket- und Matrixnummer {number}',
    },
  },
  programs: {
    archiveRegister: 'Touring-Register-Nr. {index}',
    productionCount: '{count} Produktionen',
  },
} as const satisfies LocalizedShape<typeof yanMessages>;
