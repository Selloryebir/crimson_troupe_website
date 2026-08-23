import type { ArchiveProjectionContent } from '../schema.ts';

export const kazimierzArchiveProjection = {
  statusAnnouncement: 'Każdy rekord na stronie natychmiast poprawił swoje miejsce docelowe.',
  performance: {
    title: 'Karnawał',
    kind: 'Końcowy występ',
    tagline: 'Miejsce pozostaje zarezerwowane dla okaziciela',
    dateTime: '1084-11-11 23:49:00 · przed trzecim dzwonkiem',
    venue: 'Zamek Calais-Blason Woodland',
    status: 'Oczekiwanie na obecność',
    registerCode: 'CT-██/INV-03',
    posterAlt: 'Szkarłatne folio prowadzące do zamku Calais-Blason Woodland',
  },
  invitation: {
    ariaLabel: 'Oficjalne zaproszenie od Calais-Blason',
    eyebrow: 'Oficjalne zaproszenie / dostarczone',
    title: 'Zamek już zarezerwował Twoje miejsce',
    summary:
      'Rekordy, które właśnie otworzyłeś, pochodzą z różnych dat i miast. Pozostawiają teraz tylko jedną drogę dotarcia. Nie czekają na naprawę; czekają, aż wybierzesz wejście.',
    roleLabel: 'Zarejestrowana pojemność',
    productionLabel: 'Produkcja',
    venueLabel: 'Miejsce',
    attendanceLabel: 'Obecność',
    role: 'Nosiciel tego zaproszenia',
    production: 'Karnawał',
    venue: 'Zamek Calais-Blason Woodland',
    attendance: 'Przed trzecim dzwonkiem',
    closing:
      'Jeśli będziesz kontynuować, oryginalny rekord będzie nadal otwarty. Nie myśl, że to oznacza, że ​​zamek kryje się za rekordami. Po prostu cię zobaczył, zanim zrobiła to migawka.',
    dismissLabel: 'Zamknij zaproszenie',
    continueLabel: 'Kontynuuj do oryginalnego rekordu',
  },
  views: {
    invitation: {
      eyebrow: 'Dzisiejszy występ / wejście poprawione',
      title: 'Każda trasa ma teraz tylko jeden cel',
      summary:
        'Występy na stronie głównej zachowują swoją kolejność, jednak każde folio nauczyło się tych samych drzwi.',
    },
    register: {
      eyebrow: 'Rezerwacja miejsc / wpis wielokrotny',
      title: 'Dziewięć rekordów wzywa tego samego gościa',
      summary:
        'Daty i liczby pozostają niezmienione, ale miejsce w każdym rzędzie wskazuje na ten sam leśny zamek.',
    },
    'performance-record': {
      eyebrow: 'Zapis wydajności/miejsce docelowe nadpisane',
      title: 'Nadszedł ten występ; brakuje tylko publiczności',
      summary:
        'Zaplanowana data i miejsce powtarzają się za stroną. Widoczny zapis rozpoznaje tylko godzinę wydrukowaną na zaproszeniu.',
    },
    'production-record': {
      eyebrow: 'Zapis produkcji / tytuł usunięty',
      title: 'Każda produkcja nosi tę samą nazwę przed końcową kurtyną',
      summary:
        'Streszczenie i napisy końcowe firmy pozostają blady atrament. Szkarłatna tabliczka tytułowa przekroczyła już ich ramę.',
    },
    company: {
      eyebrow: 'Rejestr spółek / wolne stanowiska',
      title: 'Każdy urząd w rejestrze czeka na tę samą osobę',
      summary:
        'Nazwiska i historia pozostają czytelne, ale każda pojemność jest otwarta dla nosiciela, który jeszcze nie przybył.',
    },
    inquiry: {
      eyebrow: 'Archiwizuj zapytanie / jedyną odpowiedź',
      title: 'Zadałeś różne pytania; archiwum pamięta jedno miejsce',
      summary:
        'Liczba wyników nie spadła. Każde zestawienie zastąpiło jego dawne przeznaczenie leśnym zamkiem.',
    },
    office: {
      eyebrow: 'Siedziba biura / potwierdzenie obecności',
      title: 'Terminal rozliczeniowy milczy, ale fotele wiedzą, dokąd jedziesz',
      summary:
        'Płatność i realizacja pozostają niedostępne. Każda sekcja pozostawia teraz to samo potwierdzenie przybycia.',
    },
  },
} satisfies ArchiveProjectionContent;
