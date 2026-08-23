import type { OriginalProductionId } from '../../../productions/original.ts';
import type { ProductionContent } from '../../schema.ts';

export const kazimierzOriginalProductions = {
  uncrowned: {
    title: 'Niekoronowana noc',
    kind: 'Tragedia współczesna · Trzy akty',
    tagline: 'Kiedy korona spadnie na podłogę, kto może udowodnić, że kiedykolwiek istniał król?',
    duration: '125 minut, w tym jedna przerwa',
    durationShort: '125 min',
    language: 'Wykonanie z napisami wyświetlanymi w stylu wiktoriańskim · kolumbijskim',
    heading: 'Współczesna tragedia władzy, pamięci i ostatniego świadka.',
    synopsis:
      'Mobilne miasto budzi się po festiwalu, a nikt nie pamięta koronacji króla poprzedniej nocy. Samotny herold, który kontynuuje ceremonię, zaczyna poszukiwać w snach publiczności korony, która nigdy nie istniała.',
    guidance:
      'Zalecane dla osób w wieku 12 lat i starszych. Obejmuje krótkie jasne światło, teatralną mgiełkę i symulowane dzwonki.',
    creatives: [
      ['Dyrektor', 'Lawrence Gray'],
      ['Tekst', 'Ada Zima'],
      ['Scenografia', 'Mira Sane'],
      ['Muzyka', 'Zespół kameralny trupy'],
    ],
  },
  'caged-fire': {
    title: 'Pożar w klatce',
    kind: 'Opera Kameralna · Dwa akty',
    tagline: 'Płomień nie może opuścić swojej klatki. Piosenka może.',
    duration: '90 minut, bez przerwy',
    durationShort: '90 min',
    language: 'Śpiewane z napisami w języku leitańskim · kolumbijskim i wiktoriańskim',
    heading: 'Opera kameralna napisana dla cichej wieży.',
    synopsis:
      'Strażnik musi opiekować się płomieniem, który nigdy nie zgaśnie i nie opuści wieży. W ciągu siedmiu lat uczy się jego języka i słyszy, jak śpiewa jego imię w dniu, w którym pozwolono mu odejść.',
    guidance:
      'Zalecane dla osób w wieku 10 lat i starszych. Obejmuje symulowany otwarty płomień, dźwięk o niskiej częstotliwości i około 40 sekund ciemności.',
    creatives: [
      ['Kompozytor', 'Eliasa Kleina'],
      ['Dyrektor', 'Sabina Wolf'],
      ['Scenografia', 'Otto Hertz'],
      ['Główny sopran', 'Cecilia Lane'],
    ],
  },
  'second-snow': {
    title: 'Drugi śnieg',
    kind: 'Eksperymentalny Teatr Tańca · Jedna część',
    tagline: 'Na drodze zalega pierwszy śnieg. Drugi dotyczy pamięci.',
    duration: '70 minut, bez przerwy',
    durationShort: '70 min',
    language: 'Brak dialogu · Dostępny jest pisemny przewodnik',
    heading: 'Ciała, biały szum i wspólna pamięć o zamarzniętym mieście.',
    synopsis:
      'Sześciu tancerzy odbywa niekończącą się podróż do domu wzdłuż opuszczonych torów. Z każdym opadem śniegu zapominają nazwę innego miejsca i zyskują kolejnego towarzysza podróży.',
    guidance:
      'Zalecane dla osób w wieku 12 lat i starszych. W obiekcie panuje chłód, światło stroboskopowe, biały szum i symulowany śnieg; zapytaj o randki inne niż stroboskopowe.',
    creatives: [
      ['Choreografia', 'Noaha Fincha'],
      ['Muzyka', 'Białe gładkie trio'],
      ['Oświetlenie', 'Lucy Bach'],
      ['Instalacja', 'Warsztaty Norport'],
    ],
  },
  'red-banquet': {
    title: 'Karmazynowa Uczta',
    kind: 'Uroczyste przedstawienie · Cztery części',
    tagline: 'Zostaw swoje imię i nazwisko na zewnątrz. Bankiet zna tylko tych, którzy przybywają.',
    duration: 'Około 140 minut, z dwiema przerwami',
    durationShort: 'Około 140 min',
    language: 'Wykonywane w języku Yanese · Dostępny ręcznie kopiowany program',
    heading:
      'Uroczyste przedstawienie z okazji długiej nocy, pustego miejsca i spóźnionego gościa honorowego.',
    synopsis:
      'Dwunastu uczestników przygotowuje ucztę na podstawie niepodpisanej księgi miejsc. Każdy dzwonek dodaje kolejne nakrycie; zanim zgaśnie ostatnia lampa, muszą zdecydować, kto może zająć główne miejsce.',
    guidance:
      'Obejmuje kadzidło, sceny przy słabym oświetleniu i bliskie procesje. Spóźnieni czekają do zakończenia drugiej części.',
    creatives: [
      ['Główny Steward', 'Romeo'],
      ['Porządek rytualny', 'Pani Biały Wiąz'],
      ['Muzyka', 'Towarzystwo Izb Bez Strun'],
      ['Kostium i maski', 'Warsztat Karmazynowej Gazy'],
    ],
  },
  'seventh-lantern': {
    title: 'Siódma latarnia',
    kind: 'Zabawa z latarnią cienia · Siedem scen',
    tagline: 'Sześć świateł ukazuje drogę do domu. Siódmy odkrywa tylko ciebie.',
    duration: 'Około 75 minut, bez przerwy',
    durationShort: 'Około 75 min',
    language: 'Wykonywane w języku yanese · Brak napisów',
    heading: 'Zabawa z latarnią cienia wykonywana dopiero po zachodzie słońca.',
    synopsis:
      'Niosący latarnię odzyskuje sześciu zagubionych podróżników wzdłuż starej drogi, ale zawsze podąża za nimi siódmy cień. Zanim świt zamknie bramę, prosi widzów o podanie nazwiska tego, który nigdy nie rozpoczął podróży.',
    guidance:
      'W całym pomieszczeniu słabe oświetlenie, poruszające się płomienie i krótka cisza. Zalecane dla osób w wieku ośmiu lat i starszych.',
    creatives: [
      ['Dyrektor Cieni', 'Huiming'],
      ['Werset', 'Zhezhi'],
      ['Liczby', 'Warsztat Stu Oczu'],
      ['Perkusja', 'Krucze Trio'],
    ],
  },
  'procession-of-masks': {
    title: 'Cicha procesja',
    kind: 'Zamaskowany mim · Pięć scen',
    tagline: 'Po przejściu procesji nie licz pozostawionych twarzy.',
    duration: 'Około 60 minut, bez przerwy',
    durationShort: 'Około 60 min',
    language: 'Brak dialogu · Kolejność jazdy podawana przy wejściu',
    heading: 'Mim masek, bębnów i ulicy, która wiecznie się odwraca.',
    synopsis:
      'Procesja bez przywódcy przeszukuje miasto w poszukiwaniu placu festiwalowego. Za każdym razem, gdy przekracza tę samą bramę, gracze noszą maski bardziej przypominające publiczność, dopóki perkusista nie będzie w stanie odróżnić maszerujących od obserwatorów.',
    guidance:
      'Wykonawcy wchodzą do alejek z widownią; zawiera nagłe bębny i papierowe konfetti. Goście z pierwszego rzędu mogą zostać poproszeni o podniesienie sztandaru procesji.',
    creatives: [
      ['Dyrektor procesji', 'Arturo'],
      ['Projekt maski', 'Warsztat Karmazynowej Gazy'],
      ['Bębny', 'Hermo i Bezimienny Dobosz'],
      ['Rozkaz wykonania', 'Pokój Księgarni Starej Trupy'],
    ],
  },
} as const satisfies Record<OriginalProductionId, ProductionContent>;
