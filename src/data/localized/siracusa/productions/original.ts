import type { OriginalProductionId } from '../../../productions/original.ts';
import type { ProductionContent } from '../../schema.ts';

export const siracusaOriginalProductions = {
  uncrowned: {
    title: 'La notte senza corona',
    kind: 'Tragedia moderna · Tre atti',
    tagline: 'Quando la corona tocca il pavimento, chi può dimostrare che sia mai esistito un re?',
    duration: '125 minuti compreso un intervallo',
    durationShort: '125 minuti',
    language: 'Eseguito in didascalie proiettate vittoriane · colombiane',
    heading: 'Una tragedia moderna di potere, memoria e testimonianza finale.',
    synopsis:
      "Una città mobile si sveglia dopo una festa, ma nessuno ricorda il re incoronato la notte prima. L'araldo solitario che continua la cerimonia inizia a cercare nei sogni del pubblico una corona che non è mai esistita.",
    guidance:
      'Consigliato dai 12 anni in su. Include breve luce brillante, foschia teatrale e campanelli simulati.',
    creatives: [
      ['Direttore', 'Lawrence Gray'],
      ['Testo', 'Ada Inverno'],
      ['Scenografia', 'Mira Sane'],
      ['Musica', 'Ensemble da camera della troupe'],
    ],
  },
  'caged-fire': {
    title: 'Fuoco in una gabbia',
    kind: 'Opera da camera · Due atti',
    tagline: 'La fiamma non può lasciare la sua gabbia. La canzone può.',
    duration: '90 minuti, senza intervallo',
    durationShort: '90 minuti',
    language: 'Cantato in leithaniano · Didascalie colombiane e vittoriane',
    heading: "Un'opera da camera scritta per una torre silenziosa.",
    synopsis:
      'Un custode deve prendersi cura di una fiamma che non può mai spegnersi e non lasciare mai la sua torre. In sette anni ne impara la lingua, solo per sentirlo cantare il suo nome il giorno in cui gli sarà permesso di partire.',
    guidance:
      'Consigliato a partire dai 10 anni. Include fiamma libera simulata, suono a bassa frequenza e circa 40 secondi di oscurità.',
    creatives: [
      ['Compositore', 'Elias Klein'],
      ['Direttore', 'Sabina Lupo'],
      ['Scenografia', 'Otto Hertz'],
      ['Soprano solista', 'Cecilia Lane'],
    ],
  },
  'second-snow': {
    title: 'La seconda neve',
    kind: 'Teatro Danza Sperimentale · Una Parte',
    tagline: 'La prima neve ricopre la strada. Il secondo riguarda la memoria.',
    duration: '70 minuti, senza intervallo',
    durationShort: '70 minuti',
    language: 'Nessun dialogo · Guida scritta disponibile',
    heading: 'Corpi, rumore bianco e la memoria condivisa di una città gelata.',
    synopsis:
      'Sei ballerini ripercorrono un infinito viaggio di ritorno verso casa lungo rotaie abbandonate. Ad ogni nevicata dimenticano il nome di un altro luogo e guadagnano un altro compagno di viaggio.',
    guidance:
      'Consigliato dai 12 anni in su. Il luogo è mantenuto fresco e comprende luci stroboscopiche, rumore bianco e neve simulata; chiedi informazioni su date non stroboscopiche.',
    creatives: [
      ['Coreografia', 'Noah Finch'],
      ['Musica', 'Trio tinta unita bianco'],
      ['Illuminazione', 'Lucia Bach'],
      ['Installazione', 'Laboratorio di Norport'],
    ],
  },
  'red-banquet': {
    title: 'Il banchetto cremisi',
    kind: 'Gioco cerimoniale · Quattro parti',
    tagline: 'Lascia il tuo nome fuori. Il banchetto conosce solo chi arriva.',
    duration: 'Circa 140 minuti, con due intervalli',
    durationShort: 'Circa 140 min',
    language: 'Eseguito in Yanese · Disponibile programma copiato a mano',
    heading:
      "Uno spettacolo cerimoniale per una lunga notte, un posto vuoto e un ospite d'onore in ritardo.",
    synopsis:
      "Dodici partecipanti preparano un banchetto da un libro di posti a sedere non firmato. Ogni campana aggiunge un altro posto; prima che l'ultima lampada si spenga, devono decidere chi può occupare il posto principale.",
    guidance:
      'Include incenso, scene in condizioni di scarsa illuminazione e processioni ravvicinate. I ritardatari aspettano fino alla fine della seconda parte.',
    creatives: [
      ['Capo steward', 'Romeo'],
      ['Ordine rituale', 'Signora Olmo Bianco'],
      ['Musica', 'Società da Camera senza corde'],
      ['Costumi e Maschere', 'Workshop sulla garza cremisi'],
    ],
  },
  'seventh-lantern': {
    title: 'La settima lanterna',
    kind: "Gioco della Lanterna d'Ombra · Sette scene",
    tagline: 'Sei luci rivelano la strada di casa. Il settimo rivela solo te.',
    duration: 'Circa 75 minuti, senza intervallo',
    durationShort: 'Circa 75 minuti',
    language: 'Eseguita in Yanese · Nessuna didascalia',
    heading: 'Uno spettacolo di lanterne-ombra eseguito solo dopo il tramonto.',
    synopsis:
      "Un portatore di lanterna recupera sei viaggiatori perduti lungo la vecchia strada, ma una settima ombra lo segue sempre. Prima che l'alba chiuda il cancello, chiede al pubblico di nominare colui che non ha mai iniziato il viaggio.",
    guidance:
      'Luce scarsa ovunque, con fiamme in movimento e breve silenzio. Consigliato dagli otto anni in su.',
    creatives: [
      ['Direttore ombra', 'Huim'],
      ['Versetto', 'Zhezhi'],
      ['Cifre', 'Workshop dai cento occhi'],
      ['Percussioni', 'Trio dei Corvi'],
    ],
  },
  'procession-of-masks': {
    title: 'La processione silenziosa',
    kind: 'Mimo mascherato · Cinque scene',
    tagline: 'Dopo il passaggio del corteo, non contare i volti rimasti indietro.',
    duration: 'Circa 60 minuti, senza intervallo',
    durationShort: 'Circa 60 minuti',
    language: "Nessun dialogo · Ordine di marcia fornito all'ammissione",
    heading: 'Un mimo di maschere, tamburi e una strada che torna indietro per sempre.',
    synopsis:
      'Un corteo senza leader perlustra la città alla ricerca della piazza del festival. Ogni volta che si attraversa lo stesso cancello, i suonatori indossano maschere più simili a quelle del pubblico, finché il tamburino non riesce a distinguere i manifestanti dagli spettatori.',
    guidance:
      'Gli artisti entrano nelle corsie del pubblico; include tamburi improvvisi e coriandoli di carta. Gli ospiti in prima fila possono essere invitati ad alzare uno stendardo del corteo.',
    creatives: [
      ['Direttore del Corteo', 'Arturo'],
      ['Progettazione della maschera', 'Workshop sulla garza cremisi'],
      ['Batteria', 'Hermo e il batterista senza nome'],
      ['Ordine di esecuzione', 'Stanza del libro della vecchia troupe'],
    ],
  },
} as const satisfies Record<OriginalProductionId, ProductionContent>;
