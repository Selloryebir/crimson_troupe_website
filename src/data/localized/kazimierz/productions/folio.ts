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
      'Choćby z jego powodu runęły wieże, a ludzie wzajemnie się mordowali, skarb Leithanien nigdy nie pozostanie na palcu Caprinae. Płytkie jezioro w lesie jest przystanią, o której zawsze marzył.',
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
      'Pewnego razu prosty człowiek opowiedział kupcowi niezwykłą historię. Przekazywana z ust do ust, po stu jeden dniach dotarła do uszu chagana. Zaintrygowany, wyruszył incognito, by odnaleźć jej źródło, lecz odkrył, że sam zdążył już skazać tego człowieka na śmierć.',
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
    synopsis: 'Świętuj, przyjacielu! Takie szczęście nie zdarza się codziennie.',
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
      'Zaśpiewajmy wspólnie pieśń pochwalną i uczcijmy triumf Cesarza! Niech żyje Cesarz! Niech żyje Galia!',
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
      'W szczelinach ziemi, pod cieniami miast, samotny dziwak obserwuje wszystko. W szpetnej masce z żelaznego wiadra kryją się spisek i szaleństwo.',
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
      'Nawet jeśli nie możesz dotrzeć do odległego zamku, przynajmniej wciąż masz towarzysza, a ja wciąż mam ciebie.',
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
      'Jako spokrewnieni strażnicy Śnieżnego Kapłana pragniemy zginąć od zimnego żelaza.\n\nJako bliźnięta tej samej krwi pragniemy żyć i umrzeć razem.\n\nMacie zbyt wiele życzeń. Spełnić można tylko jedno, a ja wybiorę które.',
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
      'W chwili największego zagrożenia bohaterowie zstąpili ze słońca, przeszli przez szczyt góry Heria i stanęli u boku Minos.',
    guidance: 'Niskie światło, dym sceniczny i bliski dźwięk; prosimy podążać za bileterem.',
    creatives: [
      ['Reżyseria', 'Scena starej trupy'],
      ['Scena', 'Warsztat długiej galerii'],
    ],
  },
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
