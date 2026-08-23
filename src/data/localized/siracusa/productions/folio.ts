import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const siracusaFolioProductions = {
  'der-ring': {
    title: "L'anello",
    kind: 'Gioco fantasy · Tre atti',
    tagline:
      'Il lago ricorda tutti coloro che hanno rivendicato il suo tesoro e ogni nome che hanno lasciato dietro di sé.',
    duration: 'Circa 110 minuti, con un intervallo',
    durationShort: 'Circa 110 min',
    language: 'Eseguita in Leithaniano · Disponibile ordine di marcia colombiano',
    heading: 'Un gioco fantasy di riflessioni, promesse e tesori senza proprietario.',
    synopsis:
      'Un guardiano del lago affida un anello a un visitatore, anche se nessuno può portarglielo via. Dopo tre tramonti l’anello rimane, mentre i riflessi dei custodi scendono uno ad uno sott’acqua.',
    guidance:
      "Luce scarsa, effetti dell'acqua riflessa, foschia teatrale e sussurri ravvicinati ovunque.",
    creatives: [
      ['Adattamento', 'Stanza del libro della vecchia troupe'],
      ['Macchinari del lago', 'Il Fabbricante di specchi senza nome'],
      ['Musica', 'Stringhe a torre doppia'],
      ['Costume', 'Workshop sulla garza cremisi'],
    ],
  },
  'one-hundred-and-one-days': {
    title: 'Centouno giorni',
    kind: 'Cronaca · Cinque capitoli',
    tagline:
      "Il centesimo giorno è per i vivi. L'ultimo appartiene a coloro che non hanno ritorno.",
    duration: 'Circa 135 minuti, con due intervalli',
    durationShort: 'Circa 135 min',
    language: 'Eseguita in ordine di marcia vittoriano · colombiano disponibile',
    heading: 'Una lunga cronaca raccolta da cento lettere mai spedite.',
    synopsis:
      'Un impiegato copia ogni giorno la stessa lettera per un destinatario lontano. Quando la centesima copia sarà terminata, apparirà una seconda scrivania e nessuno dirà chi dovrà firmare il centunesimo giorno.',
    guidance:
      'Include campanelli, carta che brucia simulata e silenzio prolungato. I posti a sedere in ritardo attendono il prossimo capitolo.',
    creatives: [
      ['Testo', 'Un impiegato senza nome'],
      ['Direzione', 'Stanza del libro della vecchia troupe'],
      ['Macchinari scenici', 'Laboratorio della Galleria'],
      ['Recitazione', 'Coro in tournée'],
    ],
  },
  'the-carnival': {
    title: 'Il Carnevale',
    kind: 'Festival Play · Sette scene',
    tagline: 'A una festa non mancano mai gli ospiti. Solo a volte manca chi se ne va.',
    duration: 'Circa 95 minuti, senza intervallo',
    durationShort: 'Circa 95 minuti',
    language: 'Performance multilingue · Nessuna didascalia',
    heading: 'Tamburi, stelle filanti e un corteo che non può essere dichiarato concluso.',
    synopsis:
      "L'araldo annuncia il festival sette volte mentre il confine tra musicisti e pubblico si dissolve ad ogni colpo di tamburo. Quando si alza l'ultimo striscione, coloro che sono ancora seduti sono invitati a completare il sipario.",
    guidance:
      'Gli artisti entrano nelle corsie del pubblico; include tamburi improvvisi, coriandoli, scarsa illuminazione e interazione ravvicinata.',
    creatives: [
      ['Direzione del Festival', 'Stanza del libro della vecchia troupe'],
      ['Batteria', 'Il batterista senza nome'],
      ['Maschere', 'Workshop sulla garza cremisi'],
      ['Processione', 'La sfilata notturna'],
    ],
  },
  'ode-au-triomphe': {
    title: 'Ode au Triomphe',
    kind: 'Dramma corale · Quattro parti',
    tagline: "Il vincitore non è tornato. L'ode ricorda già la sua voce.",
    duration: 'Circa 120 minuti, con un intervallo',
    durationShort: 'Circa 120 min',
    language: 'Cantato in siracusano e leithaniano · Disponibile ordine di marcia colombiano',
    heading: 'Un dramma corale preparato per un trionfo senza vincitori.',
    synopsis:
      'La porta della città si apre per una compagnia che non se ne è mai andata, mentre il coro elogia ogni ritornato da un registro vuoto. Prima della campana finale, il pubblico deve decidere se alzarsi per il proprio nome.',
    guidance: 'Include coro ad alto volume, saluti simulati, incenso e una breve luce intensa.',
    creatives: [
      ['Musica', 'Società da Camera senza corde'],
      ['Direzione', 'Stanza del libro della vecchia troupe'],
      ['Coro', 'Coro in tournée'],
      ['Costume da Cerimonia', "Sarti del filo d'oro"],
    ],
  },
} as const satisfies Record<FolioProductionId, ProductionContent>;
