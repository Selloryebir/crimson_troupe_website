import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const leithanienFolioProductions = {
  'der-ring': {
    title: 'Der Ring',
    kind: 'Fantasy-Stück · Drei Akte',
    tagline:
      'Der See erinnert sich an alle, die seinen Schatz beansprucht haben – und an jeden Namen, den sie hinterlassen haben.',
    duration: 'Ungefähr 110 Minuten, mit einer Pause',
    durationShort: 'Ungefähr 110 Min',
    language: 'Aufgeführt in leithanischer Sprache · Kolumbianische laufende Reihenfolge verfügbar',
    heading: 'Ein Fantasy-Spiel über Reflexionen, Gelübde und herrenlose Schätze.',
    synopsis:
      'Ein Seewärter vertraut einem Besucher einen Ring an, doch niemand kann ihn wegtragen. Nach drei Monduntergängen bleibt der Ring bestehen, während die Spiegelbilder der Wächter nacheinander unter Wasser sinken.',
    guidance:
      'Schwaches Licht, reflektierte Wassereffekte, theatralischer Dunst und durchgehendes Flüstern.',
    creatives: [
      ['Anpassung', 'Old Troupe Bücherzimmer'],
      ['Lake Machinery', 'Der namenlose Spiegelmacher'],
      ['Musik', 'Twin-Tower-Strings'],
      ['Kostüm', 'Crimson Gaze Workshop'],
    ],
  },
  'one-hundred-and-one-days': {
    title: 'Einhundertein Tage',
    kind: 'Chronicle Play · Fünf Kapitel',
    tagline: 'Der hundertste Tag ist für die Lebenden. Letzteres gehört denen ohne Wiederkehr.',
    duration: 'Ungefähr 135 Minuten, mit zwei Intervallen',
    durationShort: 'Ungefähr 135 Min',
    language: 'Aufgeführt im viktorianischen Stil · Kolumbianische laufende Reihenfolge verfügbar',
    heading: 'Eine lange Chronik, zusammengestellt aus hundert Briefen, die nie verschickt wurden.',
    synopsis:
      'Ein Sachbearbeiter kopiert jeden Tag denselben Brief für einen entfernten Empfänger. Wenn das hundertste Exemplar fertig ist, erscheint ein zweiter Schreibtisch, und niemand wird sagen, wer am hundertsten Tag unterschreiben muss.',
    guidance:
      'Beinhaltet Glocken, simuliertes brennendes Papier und längere Stille. Späte Sitzplätze warten auf das nächste Kapitel.',
    creatives: [
      ['Text', 'Ein namenloser Angestellter'],
      ['Richtung', 'Old Troupe Bücherzimmer'],
      ['Bühnentechnik', 'Galerie-Workshop'],
      ['Rezitation', 'Tournee-Chor'],
    ],
  },
  'the-carnival': {
    title: 'Der Karneval',
    kind: 'Festivalstück · Sieben Szenen',
    tagline:
      'Bei einer Feier mangelt es nie an Gästen. Es fehlen nur manchmal diejenigen, die gehen.',
    duration: 'Ungefähr 95 Minuten, ohne Pause',
    durationShort: 'Ungefähr 95 Min',
    language: 'Mehrsprachige Darbietung · Keine Untertitel',
    heading:
      'Trommeln, Luftschlangen und eine Prozession, die nicht für beendet erklärt werden kann.',
    synopsis:
      'Der Herold kündigt das Fest sieben Mal an, während sich die Grenze zwischen Spielern und Publikum mit jedem Trommelschlag auflöst. Wenn das letzte Banner gehisst wird, werden alle, die noch sitzen, eingeladen, den Vorhang zu schließen.',
    guidance:
      'Darsteller betreten die Gänge des Publikums; beinhaltet plötzliche Trommeln, Konfetti, schwaches Licht und enge Interaktion.',
    creatives: [
      ['Festivalleitung', 'Old Troupe Bücherzimmer'],
      ['Schlagzeug', 'Der namenlose Schlagzeuger'],
      ['Masken', 'Crimson Gaze Workshop'],
      ['Prozession', 'Die Nachtparade'],
    ],
  },
  'ode-au-triomphe': {
    title: 'Ode au Triomphe',
    kind: 'Chordrama · Vierteilig',
    tagline: 'Der Sieger ist nicht zurückgekehrt. Die Ode erinnert bereits an seine Stimme.',
    duration: 'Ungefähr 120 Minuten, mit einer Pause',
    durationShort: 'Ungefähr 120 Min',
    language:
      'Gesungen auf Siracusanisch und Leithanisch · Kolumbianische laufende Reihenfolge verfügbar',
    heading: 'Ein Chordrama, das auf einen Triumph ohne Sieger vorbereitet ist.',
    synopsis:
      'Das Stadttor öffnet sich für eine Gruppe, die nie abgereist ist, während der Chor jeden Rückkehrer aus einem leeren Register lobt. Vor dem Schlussläuten muss das Publikum entscheiden, ob es für seinen eigenen Namen aufsteht.',
    guidance: 'Enthält lauten Refrain, simulierte Salutschüsse, Weihrauch und kurzes helles Licht.',
    creatives: [
      ['Musik', 'Stringless Chamber Society'],
      ['Richtung', 'Old Troupe Bücherzimmer'],
      ['Refrain', 'Tournee-Chor'],
      ['Zeremonielles Kostüm', 'Goldfaden-Schneider'],
    ],
  },
  'lone-wander': {
    title: 'Der Einzelwanderer',
    kind: 'Fabelstück · drei Szenen',
    tagline: 'Der einsame Weg bewahrt stets eine zweite Spur.',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Ein Wanderer sucht auf leerer Straße nach dem letzten Gasthaus.',
    synopsis:
      'Nachts wird ein Gast verzeichnet, morgens stehen zwei Namen im Buch. Am Ziel muss der Wanderer seine Spur wählen.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  },
  'wonderland-in-dream': {
    title: 'Wunderland im Traum',
    kind: 'Traumstück · vier Akte',
    tagline: 'Jeder Traum bietet einen Eingang, aber keine Richtung zum Erwachen.',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Ein umgekehrter Garten, Papiertüren und ein schlafender Führer bilden den Zug.',
    synopsis:
      'Ein Mädchen durchquert vier Gärten; nach jedem Erwachen fehlt im Saal eine weitere Reihe.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  },
  'frost-deer-and-snow-doe': {
    title: 'Frosthirsch und Schneehindin',
    kind: 'Winteroper · drei Akte',
    tagline: 'Zwei Spuren treffen sich am Schnee; nur eine führt in den Frühling.',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Eine Winteroper über Jagd, Wache und zwei weiße Hirsche.',
    synopsis:
      'Der Jäger folgt gekreuzten Spuren, bis Hirsch und Hindin von gegenüberliegenden Seiten denselben Abschied sprechen.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  },
  'light-of-heria': {
    title: 'Licht von Heria',
    kind: 'Ikonenspiel · fünf Kapitel',
    tagline: 'Das Licht zeigt das Tor und führt alle Schatten an denselben Ort.',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading:
      'Goldene Ikonen, eine lange Treppe und nacheinander erlöschende Lampen bilden den Ritus.',
    synopsis:
      'Herias Lampenwart steigt den Turm hinauf, während jeder Glockenschlag eine Straße nimmt; das letzte Licht wartet auf Zuspätkommende.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  },
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
