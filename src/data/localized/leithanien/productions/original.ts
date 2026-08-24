import type { OriginalProductionId } from '../../../productions/original.ts';
import type { ProductionContent } from '../../schema.ts';

export const leithanienOriginalProductions = {
  uncrowned: {
    title: 'Die ungekrönte Nacht',
    kind: 'Moderne Tragödie · Drei Akte',
    tagline:
      'Wenn die Krone auf den Boden fällt, wer kann dann beweisen, dass es jemals einen König gab?',
    duration: '125 Minuten, inklusive einer Pause',
    durationShort: '125 Min',
    language: 'Aufgeführt in viktorianischen · kolumbianischen Untertiteln',
    heading: 'Eine moderne Tragödie über Macht, Erinnerung und den letzten Zeugen.',
    synopsis:
      'Eine mobile Stadt erwacht nach einem Fest, doch niemand erinnert sich an den König, der am Abend zuvor gekrönt wurde. Der einsame Herold, der die Zeremonie fortsetzt, beginnt, in den Träumen des Publikums nach einer Krone zu suchen, die nie existiert hat.',
    guidance:
      'Empfohlen für Kinder ab 12 Jahren. Beinhaltet kurzes helles Licht, theatralischen Dunst und simulierte Glocken.',
    creatives: [
      ['Direktor', 'Lawrence Gray'],
      ['Text', 'Ada Winter'],
      ['Bühnenbild', 'Mira Sane'],
      ['Musik', 'Troupe Chamber Ensemble'],
    ],
  },
  'caged-fire': {
    title: 'Feuer in einem Käfig',
    kind: 'Kammeroper · Zwei Akte',
    tagline: 'Die Flamme kann ihren Käfig nicht verlassen. Das Lied kann.',
    duration: '90 Minuten, keine Pause',
    durationShort: '90 Min',
    language: 'Gesungen in Leithanian · Kolumbianische und viktorianische Untertitel',
    heading: 'Eine Kammeroper, geschrieben für einen stillen Turm.',
    synopsis:
      'Ein Hüter muss eine Flamme bewachen, die niemals erlischt und niemals ihren Turm verlässt. Im Laufe von sieben Jahren lernt er die Sprache des Landes, nur um am Tag seiner Abreise zu hören, wie es seinen Namen singt.',
    guidance:
      'Empfohlen für Kinder ab 10 Jahren. Beinhaltet simuliertes offenes Feuer, niederfrequenten Ton und etwa 40 Sekunden Dunkelheit.',
    creatives: [
      ['Komponist', 'Elias Klein'],
      ['Direktor', 'Sabina Wolf'],
      ['Bühnenbild', 'Otto Hertz'],
      ['Leadsopran', 'Cecilia Lane'],
    ],
  },
  'second-snow': {
    title: 'Der zweite Schnee',
    kind: 'Experimentelles Tanztheater · Ein Teil',
    tagline: 'Der erste Schnee bedeckt die Straße. Der zweite befasst sich mit der Erinnerung.',
    duration: '70 Minuten, keine Pause',
    durationShort: '70 Min',
    language: 'Kein Dialog · Schriftlicher Leitfaden verfügbar',
    heading: 'Körper, weißes Rauschen und die gemeinsame Erinnerung an eine eiskalte Stadt.',
    synopsis:
      'Sechs Tänzer zeichnen eine endlose Heimreise entlang verlassener Schienen nach. Mit jedem Schneefall vergessen sie einen anderen Ortsnamen und gewinnen einen weiteren Reisebegleiter.',
    guidance:
      'Empfohlen für Kinder ab 12 Jahren. Der Veranstaltungsort wird kühl gehalten und verfügt über Stroboskoplicht, weißes Rauschen und simulierten Schnee. Fragen Sie nach Nicht-Stroboskop-Terminen.',
    creatives: [
      ['Choreografie', 'Noah Finch'],
      ['Musik', 'White Plain Trio'],
      ['Beleuchtung', 'Lucy Bach'],
      ['Installation', 'Norport Workshop'],
    ],
  },
  'red-banquet': {
    title: 'Das Crimson Bankett',
    kind: 'Zeremonielles Theaterstück · Vierteilig',
    tagline:
      'Hinterlassen Sie Ihren Namen draußen. Das Bankett kennt nur diejenigen, die ankommen.',
    duration: 'Ungefähr 140 Minuten, mit zwei Intervallen',
    durationShort: 'Ungefähr 140 Min',
    language: 'Aufgeführt auf Yanese · Handkopiertes Programm verfügbar',
    heading:
      'Ein zeremonielles Theaterstück für eine lange Nacht, einen freien Platz und einen verspäteten Ehrengast.',
    synopsis:
      'Zwölf Teilnehmer bereiten ein Festmahl anhand eines nicht unterschriebenen Sitzplatzbuchs vor. Jede Glocke fügt ein weiteres Gedeck hinzu; Bevor die letzte Lampe stirbt, müssen sie entscheiden, wer den Hauptsitz einnehmen darf.',
    guidance:
      'Beinhaltet Weihrauch, Szenen bei schlechten Lichtverhältnissen und nahe Prozessionen. Wer zu spät kommt, wartet, bis der zweite Teil zu Ende ist.',
    creatives: [
      ['Oberverwalter', 'Romeo'],
      ['Rituelle Ordnung', 'Frau Weiße Ulme'],
      ['Musik', 'Stringless Chamber Society'],
      ['Kostüme und Masken', 'Crimson Gaze Workshop'],
    ],
  },
  'seventh-lantern': {
    title: 'Die siebte Laterne',
    kind: 'Schattenlaternenspiel · Sieben Szenen',
    tagline: 'Sechs Lichter zeigen den Weg nach Hause. Der siebte offenbart nur Sie.',
    duration: 'Ungefähr 75 Minuten, ohne Pause',
    durationShort: 'Ungefähr 75 Min',
    language: 'Aufgeführt auf Yanesisch · Keine Untertitel',
    heading: 'Ein Schattenlaternenspiel, das nur nach Sonnenuntergang aufgeführt wird.',
    synopsis:
      'Ein Laternenträger holt sechs verlorene Reisende entlang der alten Straße zurück, aber es folgt immer ein siebter Schatten. Bevor die Morgendämmerung das Tor schließt, bittet er das Publikum, den Namen desjenigen zu nennen, der die Reise nie angetreten hat.',
    guidance:
      'Durchgehend wenig Licht, mit bewegten Flammen und kurzer Stille. Empfohlen ab acht Jahren.',
    creatives: [
      ['Schattendirektor', 'Huiming'],
      ['Vers', 'Zhezhi'],
      ['Zahlen', 'Hundred Eyes Workshop'],
      ['Schlagzeug', 'Raben-Trio'],
    ],
  },
  'procession-of-masks': {
    title: 'Die stille Prozession',
    kind: 'Maskierter Pantomime · Fünf Szenen',
    tagline: 'Nachdem die Prozession vorbei ist, zählen Sie nicht die zurückgebliebenen Gesichter.',
    duration: 'Ungefähr 60 Minuten, ohne Pause',
    durationShort: 'Ungefähr 60 Min',
    language: 'Kein Dialog · Reihenfolge beim Einlass angegeben',
    heading: 'Eine Pantomime aus Masken, Trommeln und einer Straße, die für immer umkehrt.',
    synopsis:
      'Eine führerlose Prozession durchsucht die Stadt nach ihrem Festplatz. Jedes Mal, wenn es das gleiche Tor überquert, tragen die Spieler Masken, die eher denen des Publikums ähneln, bis der Trommler die Marschierenden nicht mehr von den Zuschauern unterscheiden kann.',
    guidance:
      'Darsteller betreten die Gänge des Publikums; beinhaltet plötzliche Trommeln und Papierkonfetti. Gäste aus der ersten Reihe können eingeladen werden, ein Prozessionsbanner zu hissen.',
    creatives: [
      ['Prozessionsleiter', 'Arturo'],
      ['Maskendesign', 'Crimson Gaze Workshop'],
      ['Schlagzeug', 'Hermo und der namenlose Schlagzeuger'],
      ['Laufende Reihenfolge', 'Old Troupe Bücherzimmer'],
    ],
  },
} as const satisfies Partial<Record<OriginalProductionId, ProductionContent>>;
