import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const leithanienFolioProductions = {
  'der-ring': createFolioProductionContent('leithanien', 'der-ring', {
    kind: 'Fantasy-Stück · Drei Akte',
    duration: 'Ungefähr 110 Minuten, mit einer Pause',
    durationShort: 'Ungefähr 110 Min',
    language: 'Aufgeführt in leithanischer Sprache · Kolumbianische laufende Reihenfolge verfügbar',
    heading: 'Ein Fantasy-Spiel über Reflexionen, Gelübde und herrenlose Schätze.',
    guidance:
      'Schwaches Licht, reflektierte Wassereffekte, theatralischer Dunst und durchgehendes Flüstern.',
    creatives: [
      ['Anpassung', 'Old Troupe Bücherzimmer'],
      ['Lake Machinery', 'Der namenlose Spiegelmacher'],
      ['Musik', 'Twin-Tower-Strings'],
      ['Kostüm', 'Crimson Gaze Workshop'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent(
    'leithanien',
    'one-hundred-and-one-days',
    {
      kind: 'Chronicle Play · Fünf Kapitel',
      duration: 'Ungefähr 135 Minuten, mit zwei Intervallen',
      durationShort: 'Ungefähr 135 Min',
      language:
        'Aufgeführt im viktorianischen Stil · Kolumbianische laufende Reihenfolge verfügbar',
      heading:
        'Eine lange Chronik, zusammengestellt aus hundert Briefen, die nie verschickt wurden.',
      guidance:
        'Beinhaltet Glocken, simuliertes brennendes Papier und längere Stille. Späte Sitzplätze warten auf das nächste Kapitel.',
      creatives: [
        ['Text', 'Ein namenloser Angestellter'],
        ['Richtung', 'Old Troupe Bücherzimmer'],
        ['Bühnentechnik', 'Galerie-Workshop'],
        ['Rezitation', 'Tournee-Chor'],
      ],
    },
  ),
  'the-carnival': createFolioProductionContent('leithanien', 'the-carnival', {
    kind: 'Festivalstück · Sieben Szenen',
    duration: 'Ungefähr 95 Minuten, ohne Pause',
    durationShort: 'Ungefähr 95 Min',
    language: 'Mehrsprachige Darbietung · Keine Untertitel',
    heading:
      'Trommeln, Luftschlangen und eine Prozession, die nicht für beendet erklärt werden kann.',
    guidance:
      'Darsteller betreten die Gänge des Publikums; beinhaltet plötzliche Trommeln, Konfetti, schwaches Licht und enge Interaktion.',
    creatives: [
      ['Festivalleitung', 'Old Troupe Bücherzimmer'],
      ['Schlagzeug', 'Der namenlose Schlagzeuger'],
      ['Masken', 'Crimson Gaze Workshop'],
      ['Prozession', 'Die Nachtparade'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('leithanien', 'ode-au-triomphe', {
    kind: 'Chordrama · Vierteilig',
    duration: 'Ungefähr 120 Minuten, mit einer Pause',
    durationShort: 'Ungefähr 120 Min',
    language:
      'Gesungen auf Siracusanisch und Leithanisch · Kolumbianische laufende Reihenfolge verfügbar',
    heading: 'Ein Chordrama, das auf einen Triumph ohne Sieger vorbereitet ist.',
    guidance: 'Enthält lauten Refrain, simulierte Salutschüsse, Weihrauch und kurzes helles Licht.',
    creatives: [
      ['Musik', 'Stringless Chamber Society'],
      ['Richtung', 'Old Troupe Bücherzimmer'],
      ['Refrain', 'Tournee-Chor'],
      ['Zeremonielles Kostüm', 'Goldfaden-Schneider'],
    ],
  }),
  'lone-wander': createFolioProductionContent('leithanien', 'lone-wander', {
    kind: 'Fabelstück · drei Szenen',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Ein Wanderer sucht auf leerer Straße nach dem letzten Gasthaus.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('leithanien', 'wonderland-in-dream', {
    kind: 'Traumstück · vier Akte',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Ein umgekehrter Garten, Papiertüren und ein schlafender Führer bilden den Zug.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('leithanien', 'frost-deer-and-snow-doe', {
    kind: 'Winteroper · drei Akte',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading: 'Eine Winteroper über Jagd, Wache und zwei weiße Hirsche.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('leithanien', 'light-of-heria', {
    kind: 'Ikonenspiel · fünf Kapitel',
    duration: 'Ca. 105 Minuten, mit einer Pause',
    durationShort: 'Ca. 105 Min.',
    language: 'Tourneerepertoire · Programmblatt erhältlich',
    heading:
      'Goldene Ikonen, eine lange Treppe und nacheinander erlöschende Lampen bilden den Ritus.',
    guidance: 'Gedämpftes Licht, Bühnennebel und naher Klang; folgen Sie der Platzanweisung.',
    creatives: [
      ['Regie', 'Spielraum der alten Truppe'],
      ['Bühne', 'Werkstatt der langen Galerie'],
    ],
  }),
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
