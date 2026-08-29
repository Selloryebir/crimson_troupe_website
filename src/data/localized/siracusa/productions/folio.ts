import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const siracusaFolioProductions = {
  'der-ring': createFolioProductionContent('siracusa', 'der-ring', {
    kind: 'Gioco fantasy · Tre atti',
    duration: 'Circa 110 minuti, con un intervallo',
    durationShort: 'Circa 110 min',
    language: 'Eseguita in Leithaniano · Disponibile ordine di marcia colombiano',
    heading: 'Un gioco fantasy di riflessioni, promesse e tesori senza proprietario.',
    guidance:
      "Luce scarsa, effetti dell'acqua riflessa, foschia teatrale e sussurri ravvicinati ovunque.",
    creatives: [
      ['Adattamento', 'Stanza del libro della vecchia troupe'],
      ['Macchinari del lago', 'Il Fabbricante di specchi senza nome'],
      ['Musica', 'Stringhe a torre doppia'],
      ['Costume', 'Workshop sulla garza cremisi'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent('siracusa', 'one-hundred-and-one-days', {
    kind: 'Cronaca · Cinque capitoli',
    duration: 'Circa 135 minuti, con due intervalli',
    durationShort: 'Circa 135 min',
    language: 'Eseguita in ordine di marcia vittoriano · colombiano disponibile',
    heading: 'Una lunga cronaca raccolta da cento lettere mai spedite.',
    guidance:
      'Include campanelli, carta che brucia simulata e silenzio prolungato. I posti a sedere in ritardo attendono il prossimo capitolo.',
    creatives: [
      ['Testo', 'Un impiegato senza nome'],
      ['Direzione', 'Stanza del libro della vecchia troupe'],
      ['Macchinari scenici', 'Laboratorio della Galleria'],
      ['Recitazione', 'Coro in tournée'],
    ],
  }),
  'the-carnival': createFolioProductionContent('siracusa', 'the-carnival', {
    kind: 'Festival Play · Sette scene',
    duration: 'Circa 95 minuti, senza intervallo',
    durationShort: 'Circa 95 minuti',
    language: 'Performance multilingue · Nessuna didascalia',
    heading: 'Tamburi, stelle filanti e un corteo che non può essere dichiarato concluso.',
    guidance:
      'Gli artisti entrano nelle corsie del pubblico; include tamburi improvvisi, coriandoli, scarsa illuminazione e interazione ravvicinata.',
    creatives: [
      ['Direzione del Festival', 'Stanza del libro della vecchia troupe'],
      ['Batteria', 'Il batterista senza nome'],
      ['Maschere', 'Workshop sulla garza cremisi'],
      ['Processione', 'La sfilata notturna'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('siracusa', 'ode-au-triomphe', {
    kind: 'Dramma corale · Quattro parti',
    duration: 'Circa 120 minuti, con un intervallo',
    durationShort: 'Circa 120 min',
    language: 'Cantato in siracusano e leithaniano · Disponibile ordine di marcia colombiano',
    heading: 'Un dramma corale preparato per un trionfo senza vincitori.',
    guidance: 'Include coro ad alto volume, saluti simulati, incenso e una breve luce intensa.',
    creatives: [
      ['Musica', 'Società da Camera senza corde'],
      ['Direzione', 'Stanza del libro della vecchia troupe'],
      ['Coro', 'Coro in tournée'],
      ['Costume da Cerimonia', "Sarti del filo d'oro"],
    ],
  }),
  'lone-wander': createFolioProductionContent('siracusa', 'lone-wander', {
    kind: 'Favola teatrale · tre scene',
    duration: 'Circa 105 minuti, con un intervallo',
    durationShort: 'Circa 105 min',
    language: 'Repertorio itinerante · programma disponibile',
    heading: 'Un viandante cerca l’ultima locanda lungo una strada vuota.',
    guidance:
      'Luci basse, fumo scenico e suoni ravvicinati; seguire le indicazioni dell’accompagnatore.',
    creatives: [
      ['Regia', 'Sala scenica della vecchia compagnia'],
      ['Scena', 'Officina della lunga galleria'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('siracusa', 'wonderland-in-dream', {
    kind: 'Dramma onirico · quattro atti',
    duration: 'Circa 105 minuti, con un intervallo',
    durationShort: 'Circa 105 min',
    language: 'Repertorio itinerante · programma disponibile',
    heading: 'Un giardino capovolto, porte di carta e una guida addormentata compongono il corteo.',
    guidance:
      'Luci basse, fumo scenico e suoni ravvicinati; seguire le indicazioni dell’accompagnatore.',
    creatives: [
      ['Regia', 'Sala scenica della vecchia compagnia'],
      ['Scena', 'Officina della lunga galleria'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('siracusa', 'frost-deer-and-snow-doe', {
    kind: 'Opera d’inverno · tre atti',
    duration: 'Circa 105 minuti, con un intervallo',
    durationShort: 'Circa 105 min',
    language: 'Repertorio itinerante · programma disponibile',
    heading: 'Un’opera invernale di caccia, veglia e due cervi bianchi.',
    guidance:
      'Luci basse, fumo scenico e suoni ravvicinati; seguire le indicazioni dell’accompagnatore.',
    creatives: [
      ['Regia', 'Sala scenica della vecchia compagnia'],
      ['Scena', 'Officina della lunga galleria'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('siracusa', 'light-of-heria', {
    kind: 'Dramma d’icona · cinque capitoli',
    duration: 'Circa 105 minuti, con un intervallo',
    durationShort: 'Circa 105 min',
    language: 'Repertorio itinerante · programma disponibile',
    heading: 'Icone d’oro, una lunga scala e lampade spente in sequenza formano il rito.',
    guidance:
      'Luci basse, fumo scenico e suoni ravvicinati; seguire le indicazioni dell’accompagnatore.',
    creatives: [
      ['Regia', 'Sala scenica della vecchia compagnia'],
      ['Scena', 'Officina della lunga galleria'],
    ],
  }),
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
