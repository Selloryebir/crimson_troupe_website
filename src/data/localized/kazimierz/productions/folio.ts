import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const kazimierzFolioProductions = {
  'der-ring': createFolioProductionContent('kazimierz', 'der-ring', {
    kind: 'Zabawa fantasy · Trzy akty',
    duration: 'Około 110 minut, z jedną przerwą',
    durationShort: 'Około 110 min',
    language: 'Wykonywane w języku leitańskim · Dostępny porządek kolumbijski',
    heading: 'Fantastyczna gra refleksji, przysięg i skarbów bez właściciela.',
    guidance: 'Słabe oświetlenie, efekty odbitej wody, teatralna mgła i bliskie szepty.',
    creatives: [
      ['Adaptacja', 'Pokój Księgarni Starej Trupy'],
      ['Maszyny do jeziora', 'Bezimienny Lustro'],
      ['Muzyka', 'Struny dwuwieżowe'],
      ['Kostium', 'Warsztat Karmazynowej Gazy'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent(
    'kazimierz',
    'one-hundred-and-one-days',
    {
      kind: 'Odtwarzanie kroniki · Pięć rozdziałów',
      duration: 'Około 135 minut, z dwiema przerwami',
      durationShort: 'Około 135 min',
      language: 'Wykonywane w wiktoriańskim · kolumbijskim porządku wykonawczym',
      heading: 'Długa kronika złożona ze stu listów, które nigdy nie zostały wysłane.',
      guidance:
        'Zawiera dzwonki, symulowany płonący papier i przedłużoną ciszę. Spóźnione siedzenia czekają na następny rozdział.',
      creatives: [
        ['Tekst', 'Nienazwany urzędnik'],
        ['Kierunek', 'Pokój Księgarni Starej Trupy'],
        ['Maszyny sceniczne', 'Warsztaty w Galerii'],
        ['Recytacja', 'Chór koncertowy'],
      ],
    },
  ),
  'the-carnival': createFolioProductionContent('kazimierz', 'the-carnival', {
    kind: 'Spektakl festiwalowy · Siedem scen',
    duration: 'Około 95 minut, bez przerwy',
    durationShort: 'Około 95 min',
    language: 'Wydajność w wielu językach · Brak napisów',
    heading: 'Bębny, papierowe serpentyny i procesja, której zakończenia nie można ogłosić.',
    guidance:
      'Wykonawcy wchodzą do alejek z widownią; obejmuje nagłe bębny, konfetti, słabe oświetlenie i bliską interakcję.',
    creatives: [
      ['Kierownictwo festiwalu', 'Pokój Księgarni Starej Trupy'],
      ['Bębny', 'Bezimienny perkusista'],
      ['Maski', 'Warsztat Karmazynowej Gazy'],
      ['Procesja', 'Nocna parada'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('kazimierz', 'ode-au-triomphe', {
    kind: 'Dramat chóralny · Cztery części',
    duration: 'Około 120 minut, z jedną przerwą',
    durationShort: 'Około 120 min',
    language:
      'Śpiewane w języku syracuskim i leitańskim · Dostępna kolumbijska kolejność wykonywania',
    heading: 'Dramat chóralny przygotowany na triumf bez zwycięzcy.',
    guidance: 'Zawiera głośny refren, symulowane saluty, kadzidło i krótkie jasne światło.',
    creatives: [
      ['Muzyka', 'Towarzystwo Izb Bez Strun'],
      ['Kierunek', 'Pokój Księgarni Starej Trupy'],
      ['Refren', 'Chór koncertowy'],
      ['Kostium ceremonialny', 'Krawcy ze złotą nicią'],
    ],
  }),
  'lone-wander': createFolioProductionContent('kazimierz', 'lone-wander', {
    kind: 'Przypowieść sceniczna · trzy obrazy',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Wędrowiec szuka ostatniej gospody przy pustej drodze.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('kazimierz', 'wonderland-in-dream', {
    kind: 'Sztuka senna · cztery akty',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Odwrócony ogród, papierowe drzwi i śpiący przewodnik tworzą pochód.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('kazimierz', 'frost-deer-and-snow-doe', {
    kind: 'Opera zimowa · trzy akty',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Zimowa opera o pościgu, czuwaniu i dwóch białych jeleniach.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('kazimierz', 'light-of-heria', {
    kind: 'Sztuka ikony · pięć rozdziałów',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Złote ikony, długie schody i kolejno gasnące lampy tworzą obrzęd.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  }),
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
