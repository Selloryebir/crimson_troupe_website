import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';

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
    receiptEyebrow: 'SIMULIERTER EMPFANG',
    receiptTitle: 'Sitzplatzregistrierungsbeleg',
    receiptCopy:
      'Diese Anfrage wird bestätigt. Die unten angegebenen Beträge und Sitzplätze gelten nur für dieses simulierte Erlebnis.',
    baseTotal: 'Basissumme',
    adjustmentNone: 'Keine',
    settledTotal: 'Simulierte Abrechnungssumme',
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
    backToBasket: 'Zurück zum Warenkorb',
    networkTitle: 'Das Netzwerk reagierte vor der Bestätigung nicht mehr',
    networkCopy:
      'Es wurde keine Abrechnung erstellt und Ihr Warenkorb bleibt intakt. Versuchen Sie es erneut auf derselben Route.',
    retryBasket: 'Warenkorb behalten und erneut versuchen',
    premiumFailureTitle: 'Der Prioritätskanal hat immer noch keine Plätze gefunden',
    premiumFailureCopy:
      'Der Sender hat keine Sitzplätze gefunden, aber einen simulierten Suchdiensteintrag ausgegeben. Ihr Warenkorb und die Grundpreise bleiben unverändert.',
    premiumOfferTitle: 'Der Joint Seat Return Channel bietet eine weitere Suche',
    premiumOfferCopy:
      'Der Kanal wird Ihre Anfragebestellung vermerken und bei Erfolg eine Serviceanpassung in Höhe von 50 % der Warenkorb-Basissumme hinzufügen. Es kann kein Sitzplatz garantiert werden.',
    retentionOfferTitle: 'Ein letztes Zitat, bevor Sie gehen',
    retentionOfferCopy:
      'Die Serviceanpassung wurde von 50 % auf 48 % verschoben. Dies ist das einzige Retention-Angebot in dieser Runde, und die Annahme dieses Angebots kann noch keinen Sitzplatz garantieren.',
    standardFailureTitle: 'Starker Verkehr: Ticketanfrage fehlgeschlagen',
    standardFailureCopy:
      'Behalten Sie den Warenkorb und senden Sie ihn erneut, oder versuchen Sie es mit der Prioritätsroute, bei der bei Erfolg eine Gebühr erhoben wird.',
    retryStandard: 'Standardroute erneut versuchen',
    tryPremium: 'Überprüfen Sie das Angebot für die Sitzplatzrückgabe',
    acceptPremium: 'Akzeptieren Sie ein 150 %-Angebot und suchen Sie erneut',
    declinePremium: 'Dieses Angebot ablehnen',
    acceptRetention: 'Akzeptieren Sie das 148 % Retention-Angebot',
    declineRetention: 'Lehnen Sie weiterhin ab und kehren Sie zum Warenkorb zurück',
    retryPremium: 'Prioritätsroute erneut versuchen',
    returnStandard: 'Markup abbrechen und zum Standard zurückkehren',
    offerBaseTotal: 'Warenkorb-Basissumme',
    offerAdjustment: 'Simulierte Serviceanpassung',
    offerFinalTotal: 'Aktuelles simuliertes Angebot',
    failureRecordTitle: 'Fehlerhafter Servicedatensatz',
    allocatedSeats: 'Sitzplätze zugewiesen',
    failureServiceFee: 'Gebühr für simulierte Suchdienste',
    failureRecordDisclaimer:
      'Es ist keine tatsächliche Belastung erfolgt. Durch diese Aufzeichnung entsteht keine Quittung, kein Erinnerungsticket und keine Rücknahmepflicht.',
    startRequired: 'Wählen Sie zunächst mindestens eine Aufführung aus.',
    submitted: 'Warenkorb eingereicht. Eintritt in den simulierten Ticketing-Ablauf.',
    success: 'Die Ticketausstellung war erfolgreich. Ihre Erinnerungskarten sind fertig.',
    stateUpdated: 'Der Ticketstatus wurde aktualisiert.',
    downloadStarted: 'Der Download für {title} hat begonnen.',
    newRound: 'Die vorherige Runde ist beendet. Sie können Auftritte erneut auswählen.',
    adjustments: {
      'priority-service': 'Anpassung des Prioritätsroutendienstes',
      'retention-service': 'Anpassung des Retention Quote Service',
    },
    stamps: {
      'admission-confirmed': 'ZULASSUNG BESTÄTIGT',
      'standard-route': 'STANDARDROUTE',
      'priority-route': 'PRIORITÄTSROUTE',
      'network-recovered': 'NETZWERK WIEDERHERGESTELLT',
      'returned-seat': 'SITZ ZURÜCKGEGEBEN',
      'retention-offer': 'RETENTIONSANGEBOT',
      'manual-review': 'HANDBUCHÜBERPRÜFUNG',
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
