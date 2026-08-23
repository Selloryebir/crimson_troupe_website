import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const kazimierzFolioProductions = {
  'der-ring': {
    title: 'Pierścień',
    kind: 'Zabawa fantasy · Trzy akty',
    tagline:
      'Jezioro pamięta wszystkich, którzy zdobyli jego skarb – i każde imię, które po sobie pozostawili.',
    duration: 'Około 110 minut, z jedną przerwą',
    durationShort: 'Około 110 min',
    language: 'Wykonywane w języku leitańskim · Dostępny porządek kolumbijski',
    heading: 'Fantastyczna gra refleksji, przysięg i skarbów bez właściciela.',
    synopsis:
      'Opiekun jeziora powierza gościowi pierścień, choć nikt nie może go zabrać. Po trzech zachodach księżyca pierścień pozostaje, a odbicia strażników schodzą jedno po drugim pod wodę.',
    guidance: 'Słabe oświetlenie, efekty odbitej wody, teatralna mgła i bliskie szepty.',
    creatives: [
      ['Adaptacja', 'Pokój Księgarni Starej Trupy'],
      ['Maszyny do jeziora', 'Bezimienny Lustro'],
      ['Muzyka', 'Struny dwuwieżowe'],
      ['Kostium', 'Warsztat Karmazynowej Gazy'],
    ],
  },
  'one-hundred-and-one-days': {
    title: 'Sto jeden dni',
    kind: 'Odtwarzanie kroniki · Pięć rozdziałów',
    tagline: 'Dzień setny jest dla żywych. Ostatni należy do tych, którzy nie mają powrotu.',
    duration: 'Około 135 minut, z dwiema przerwami',
    durationShort: 'Około 135 min',
    language: 'Wykonywane w wiktoriańskim · kolumbijskim porządku wykonawczym',
    heading: 'Długa kronika złożona ze stu listów, które nigdy nie zostały wysłane.',
    synopsis:
      'Urzędnik codziennie kopiuje ten sam list dla odległego odbiorcy. Kiedy setny egzemplarz zostanie ukończony, pojawia się drugie biurko i nikt nie będzie mówił, kto ma podpisać sto pierwszy dzień.',
    guidance:
      'Zawiera dzwonki, symulowany płonący papier i przedłużoną ciszę. Spóźnione siedzenia czekają na następny rozdział.',
    creatives: [
      ['Tekst', 'Nienazwany urzędnik'],
      ['Kierunek', 'Pokój Księgarni Starej Trupy'],
      ['Maszyny sceniczne', 'Warsztaty w Galerii'],
      ['Recytacja', 'Chór koncertowy'],
    ],
  },
  'the-carnival': {
    title: 'Karnawał',
    kind: 'Spektakl festiwalowy · Siedem scen',
    tagline: 'Na przyjęciu nigdy nie brakuje gości. Czasem tylko brakuje tych, którzy odchodzą.',
    duration: 'Około 95 minut, bez przerwy',
    durationShort: 'Około 95 min',
    language: 'Wydajność w wielu językach · Brak napisów',
    heading: 'Bębny, papierowe serpentyny i procesja, której zakończenia nie można ogłosić.',
    synopsis:
      'Herold ogłasza festiwal siedem razy, a granica między graczami a publicznością zanika z każdym uderzeniem bębna. Kiedy wzniesie się ostatni sztandar, osoby, które nadal siedzą, proszone są o dokończenie wywołania kurtyny.',
    guidance:
      'Wykonawcy wchodzą do alejek z widownią; obejmuje nagłe bębny, konfetti, słabe oświetlenie i bliską interakcję.',
    creatives: [
      ['Kierownictwo festiwalu', 'Pokój Księgarni Starej Trupy'],
      ['Bębny', 'Bezimienny perkusista'],
      ['Maski', 'Warsztat Karmazynowej Gazy'],
      ['Procesja', 'Nocna parada'],
    ],
  },
  'ode-au-triomphe': {
    title: 'Oda Triumfalna',
    kind: 'Dramat chóralny · Cztery części',
    tagline: 'Zwycięzca nie wrócił. Oda pamięta już jego głos.',
    duration: 'Około 120 minut, z jedną przerwą',
    durationShort: 'Około 120 min',
    language:
      'Śpiewane w języku syracuskim i leitańskim · Dostępna kolumbijska kolejność wykonywania',
    heading: 'Dramat chóralny przygotowany na triumf bez zwycięzcy.',
    synopsis:
      'Brama miasta otwiera się dla kompanii, która nigdy nie wyjechała, a chór chwali każdego powracającego z pustego rejestru. Przed ostatnim dzwonkiem publiczność musi zdecydować, czy wstać, by wyrazić swoje imię.',
    guidance: 'Zawiera głośny refren, symulowane saluty, kadzidło i krótkie jasne światło.',
    creatives: [
      ['Muzyka', 'Towarzystwo Izb Bez Strun'],
      ['Kierunek', 'Pokój Księgarni Starej Trupy'],
      ['Refren', 'Chór koncertowy'],
      ['Kostium ceremonialny', 'Krawcy ze złotą nicią'],
    ],
  },
  'lone-wander': {
    title: 'Samotny wędrowiec',
    kind: 'Przypowieść sceniczna · trzy obrazy',
    tagline: 'Samotna droga zawsze zachowuje drugi ślad.',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Wędrowiec szuka ostatniej gospody przy pustej drodze.',
    synopsis:
      'Każdej nocy wpisuje się jednego gościa, lecz rano księga ma dwa nazwiska. U celu wędrowiec wybiera własne ślady.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  },
  'wonderland-in-dream': {
    title: 'Kraina cudów we śnie',
    kind: 'Sztuka senna · cztery akty',
    tagline: 'Każdy sen daje wejście, lecz nie wskazuje drogi przebudzenia.',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Odwrócony ogród, papierowe drzwi i śpiący przewodnik tworzą pochód.',
    synopsis:
      'Dziewczyna przechodzi cztery ogrody; po każdym przebudzeniu widowni brakuje kolejnego rzędu.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  },
  'frost-deer-and-snow-doe': {
    title: 'Jeleń szronu i łania śniegu',
    kind: 'Opera zimowa · trzy akty',
    tagline: 'Dwa tropy spotykają się na śniegu; tylko jeden prowadzi ku wiośnie.',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Zimowa opera o pościgu, czuwaniu i dwóch białych jeleniach.',
    synopsis:
      'Łowca idzie za skrzyżowanymi tropami, aż jeleń i łania wypowiadają to samo pożegnanie z przeciwnych stron.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  },
  'light-of-heria': {
    title: 'Światło Herii',
    kind: 'Sztuka ikony · pięć rozdziałów',
    tagline: 'Światło odsłania bramę i prowadzi wszystkie cienie w jedno miejsce.',
    duration: 'Około 105 minut, z jedną przerwą',
    durationShort: 'Około 105 min',
    language: 'Repertuar objazdowy · dostępny program',
    heading: 'Złote ikony, długie schody i kolejno gasnące lampy tworzą obrzęd.',
    synopsis:
      'Latarnik Herii wspina się na wieżę, a każdy dzwon odbiera jedną ulicę; ostatnie światło czeka na spóźnionych.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  },
} as const satisfies Record<FolioProductionId, ProductionContent>;
