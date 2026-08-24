import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';
import type { yanTicketingPlatforms } from '../yan/messages';

export const kazimierzTicketingPlatforms = {
  'rice-network': { displayName: 'Sieć Ryżowa', logoAlt: 'Tymczasowy znak Sieci Ryżowej' },
  'drop-tower': { displayName: 'Wieża Spadku', logoAlt: 'Tymczasowy znak Wieży Spadku' },
} as const satisfies LocalizedShape<typeof yanTicketingPlatforms>;

export const kazimierzMessages = {
  filters: {
    city: 'Miasto',
    allCities: 'Wszystkie miasta',
    month: 'Miesiąc',
    allMonths: 'Wszystkie miesiące',
    monthOption: 'Miesiąc {month}',
    reset: 'Zresetuj filtry',
    count: 'Wydajność {count}',
    empty: 'Żadna wydajność nie pasuje do tych filtrów. Spróbuj w innym mieście lub miesiącu.',
  },
  search: {
    label: 'Przeszukaj tę witrynę',
    submit: 'Szukaj',
    scope: 'Zakres wyszukiwania: {scope}',
    unavailable: 'Indeks wyszukiwania jest chwilowo niedostępny. Kontynuuj główną nawigację.',
    prompt: 'Wprowadź termin, aby znaleźć spektakle, produkcje i strony internetowe.',
    minimumQuery: 'Wprowadź co najmniej {count} znaki.',
    resultCount: 'Znaleziono wyniki {count}.',
    noResults: 'Nie znaleziono pasującej treści.',
    noscriptTitle: 'Wyszukiwanie wymaga JavaScript',
    noscriptCopy:
      'Ta strona nie wysyła żadnych zapytań i nie ładuje żadnych usług zdalnych. Nadal możesz przeglądać występy i informacje o firmie za pomocą głównej nawigacji.',
  },
  ticketing: {
    partnerPageEyebrow: 'OFICJALNY PARTNER BILETOWY',
    partnerPageTitle: 'Obsługa miejsc {platform}',
    partnerPageIntroduction:
      'Strona trupy przekazała koszyk platformie partnerskiej. Ten podgląd zapewnia jedynie niezawodną stronę zastępczą.',
    partnerUnavailableTitle: 'Połączenie nie jest jeszcze dostępne',
    partnerUnavailableCopy:
      'Ten podgląd nie łączy się z usługą zewnętrzną i nie tworzy transakcji. Można bezpiecznie wrócić do oficjalnego koszyka.',
    returnToBasket: 'Wróć do oficjalnego koszyka',
    selectedCount: 'Wybrano wydajność {count}',
    emptyBasket: 'Nie wybrano żadnych wykonań',
    selectionReady: 'Strefa wydajności i siedzenia znajdują się w tym koszyku.',
    selectionRequired: 'Wybierz przynajmniej jeden występ, aby kontynuować.',
    zonePreview: 'Przeglądanie: {zone} · {price} LMD. Jeszcze nie w koszyku.',
    zoneInBasket: 'W koszyku: {zone} · {price} LMD.',
    seatingPlanSummary: 'Wyświetl diagram etapu i strefy',
    seatingPlanAria: 'Strefy sceniczne i wypoczynkowe dla {title}',
    stageDirection: 'ETAP',
    seatingLevelLabel: 'Poziom {level}',
    seatingPlanNotice:
      'Tylko schemat stref, a nie indywidualny wybór miejsc. Diagram i selektor korzystają z tych samych cen.',
    selectSeatingZone: 'Wybierz {zone}, cena podstawowa {price} LMD',
    receiptEyebrow: 'SYMULOWANY ODBIÓR',
    receiptTitle: 'Potwierdzenie rejestracji miejsca',
    receiptCopy:
      'To żądanie zostało potwierdzone. Poniższe kwoty i miejsca dotyczą wyłącznie tego symulowanego doświadczenia.',
    baseTotal: 'Suma podstawowa',
    adjustmentNone: 'Brak',
    settledTotal: 'Symulowana suma rozliczenia',
    disclaimer: 'Tylko zawartość gry. Pokwitowanie to nie powoduje obowiązku wykupu.',
    ticketNumber: 'Numer biletu {number}',
    downloadSvg: 'Pobierz plik SVG',
    printTicket: 'Wydrukuj ten bilet',
    standardChannel: 'KANAŁ STANDARDOWY',
    priorityChannel: 'KANAŁ PRIORYTETOWY',
    standardAttemptTitle: 'Ruch związany z biletami jest obecnie duży',
    standardAttemptCopy:
      'System prosi o potwierdzenie każdego występu w koszyku. Dostępność może ulec zmianie po przesłaniu.',
    premiumAttemptTitle: 'Kanał priorytetowy ponownie szuka',
    premiumAttemptCopy:
      'Kanał twierdzi, że poprawia Twoją pozycję w kolejce i dodaje korektę usługi, jeśli się powiedzie. To nadal może się nie udać.',
    submitRequest: 'Potwierdź i prześlij',
    backToBasket: 'Powrót do koszyka',
    networkTitle: 'Sieć przestała odpowiadać przed potwierdzeniem',
    networkCopy:
      'Nie utworzono żadnej osady, a Twój koszyk pozostaje nienaruszony. Spróbuj ponownie na tej samej trasie.',
    retryBasket: 'Zachowaj koszyk i spróbuj ponownie',
    premiumFailureTitle: 'Kanał priorytetowy nadal nie znalazł wolnych miejsc',
    premiumFailureCopy:
      'Kanał nie znalazł żadnych miejsc, ale wystawił symulowany rekord usługi wyszukiwania. Ceny koszyka i ceny bazowe pozostają niezmienione.',
    premiumOfferTitle: 'Wspólny kanał zwrotu miejsc oferuje inne wyszukiwanie',
    premiumOfferCopy:
      'Kanał odnotuje Twoje zamówienie i w przypadku powodzenia doda korektę usługi równą 50% wartości koszyka. Nie może zagwarantować miejsca.',
    retentionOfferTitle: 'Ostatni cytat przed wyjazdem',
    retentionOfferCopy:
      'Korekta usług została przesunięta z 50% na 48%. Jest to jedyna oferta, która utrzyma się w tej rundzie, a jej zaakceptowanie w dalszym ciągu nie gwarantuje miejsca.',
    standardFailureTitle: 'Duży ruch: żądanie biletu nie powiodło się',
    standardFailureCopy:
      'Zachowaj koszyk i prześlij ponownie lub wypróbuj trasę priorytetową, która w przypadku powodzenia dodaje opłatę.',
    retryStandard: 'Ponów próbę trasy standardowej',
    tryPremium: 'Przejrzyj wycenę zwrotu miejsca',
    acceptPremium: 'Zaakceptuj wycenę 150% i wyszukaj ponownie',
    declinePremium: 'Odrzuć tę wycenę',
    acceptRetention: 'Zaakceptuj wycenę utrzymania na poziomie 148%.',
    declineRetention: 'Nadal odrzuć i wróć do koszyka',
    retryPremium: 'Ponów próbę trasy priorytetowej',
    returnStandard: 'Anuluj oznaczanie i wróć do standardu',
    offerBaseTotal: 'Suma podstawowa koszyka',
    offerAdjustment: 'Symulowana regulacja usługi',
    offerFinalTotal: 'Bieżąca symulowana wycena',
    failureRecordTitle: 'Zapis usługi zakończonej niepowodzeniem',
    allocatedSeats: 'Przydzielone miejsca',
    failureServiceFee: 'Symulowana opłata za usługę wyszukiwania',
    failureRecordDisclaimer:
      'Nie nastąpiło żadne rzeczywiste ładowanie. Zapis ten nie powoduje powstania pokwitowania, biletu pamiątkowego ani obowiązku wykupu.',
    startRequired: 'Najpierw wybierz przynajmniej jeden występ.',
    submitted: 'Koszyk przesłany. Wejście do symulowanego przepływu biletów.',
    success: 'Wystawienie biletu powiodło się. Twoje pamiątkowe bilety są gotowe.',
    stateUpdated: 'Stan sprzedaży biletów został zaktualizowany.',
    downloadStarted: 'Rozpoczęło się pobieranie {title}.',
    newRound: 'Poprzednia runda dobiegła końca. Możesz ponownie wybrać występy.',
    adjustments: {
      'priority-service': 'Dostosowanie usługi trasy priorytetowej',
      'retention-service': 'Korekta usługi przechowywania wyceny',
    },
    stamps: {
      'admission-confirmed': 'WSTĘP POTWIERDZONY',
      'standard-route': 'TRASA STANDARDOWA',
      'priority-route': 'TRASA PRIORYTETOWA',
      'network-recovered': 'SIEĆ ODZYSKANA',
      'returned-seat': 'MIEJSCE ZWRÓCONE',
      'retention-offer': 'WYCENA ZATRZYMANIA',
      'manual-review': 'PRZEGLĄD INSTRUKCJI',
    },
    artifact: {
      title: 'Bilet pamiątkowy {title}',
      description: '{dateTime}, {place}, {zone}, {price} LMD, numer biletu {number}',
      header: 'SZMARAŃCZOWA TRUPA · WSTĘP PAMIĘCIOWY',
      dateTime: 'TERRA DATA I CZAS',
      zone: 'STREFA',
      faceValue: 'PODSTAWOWA WARTOŚĆ NOMINALNA',
      ticketNumber: 'NUMER BILETU',
      alt: 'Bilet pamiątkowy {title}: {dateTime}, {place}, {zone}, {price} LMD, numer biletu i matrycy {number}',
    },
  },
  programs: {
    archiveRegister: 'Rejestr objazdowy nr {index}',
    productionCount: 'Produkcje {count}',
  },
} as const satisfies LocalizedShape<typeof yanMessages>;
