import type { BuildEditionId } from '../editions.ts';
import { folioSourceRecords } from '../productions/folio-source-records.ts';
import type { FolioProductionId } from '../productions/folio.ts';
import type { ProductionContent } from './schema.ts';

export interface FolioSourceText {
  readonly title: string;
  readonly description: string;
}

/**
 * 当前运行时活页剧目的国家版本来源文本。
 *
 * 按 productionId 优先排列，使同一来源的全部国家版本相邻；炎语、英／日来源标题与
 * 官方简体中文描述直接引用来源记录，其余值是独立接受审核的项目预览译文。
 */
export const folioSourceTexts = {
  'der-ring': {
    yan: {
      title: folioSourceRecords['der-ring'].titleForms['zh-CN'],
      description: folioSourceRecords['der-ring'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['der-ring'].titleForms['en'],
      description:
        'Even if towers collapse because of it and people kill one another over it, Leithanien’s treasure will never remain on a Caprinae’s finger. The shallow lake in the forest is the home it has always longed for.',
    },
    ursus: {
      title: 'Сокровище озера',
      description:
        'Даже если из-за него рухнут башни, а люди станут убивать друг друга, сокровище Лейтании всё равно не останется на пальце Каприни. Его желанным пристанищем всегда было мелкое лесное озеро.',
    },
    siracusa: {
      title: "L'anello",
      description:
        'Anche se per esso crollassero torri e gli uomini si massacrassero a vicenda, il tesoro di Leithanien non resterà mai al dito di un Caprinae. Il basso lago nel bosco è il rifugio che ha sempre sognato.',
    },
    minos: {
      title: 'Το Πετράδι της Λίμνης',
      description:
        'Ακόμη κι αν πύργοι καταρρεύσουν εξαιτίας του και οι άνθρωποι αλληλοσφαχτούν, ο θησαυρός του Λεϊτάνιεν δεν θα μείνει ποτέ στο δάχτυλο ενός Καπρίναε. Η ρηχή λίμνη μέσα στο δάσος είναι το καταφύγιο που πάντοτε ονειρευόταν.',
    },
    leithanien: {
      title: 'Der Ring',
      description:
        'Selbst wenn Türme seinetwegen einstürzen und Menschen einander dafür abschlachten, wird Leithaniens Schatz niemals an einem Caprinae-Finger bleiben. Der flache See im Wald ist die Heimat, von der er seit jeher träumt.',
    },
    kazimierz: {
      title: 'Pierścień',
      description:
        'Choćby z jego powodu runęły wieże, a ludzie wzajemnie się mordowali, skarb Leithanien nigdy nie pozostanie na palcu Caprinae. Płytkie jezioro w lesie jest przystanią, o której zawsze marzył.',
    },
    higashi: {
      title: folioSourceRecords['der-ring'].titleForms['ja-JP'],
      description:
        'たとえそのために塔が崩れ、人々が殺し合おうとも、リターニアの至宝がカプリニーの指に留まることはない。森の中の浅い湖こそが、それが夢にまで見た帰るべき場所なのだ。',
    },
    columbia: {
      title: folioSourceRecords['der-ring'].titleForms['en'],
      description:
        'Even if towers collapse because of it and people kill one another over it, Leithanien’s treasure will never remain on a Caprinae’s finger. The shallow lake in the forest is the home it has always longed for.',
    },
  },
  'one-hundred-and-one-days': {
    yan: {
      title: folioSourceRecords['one-hundred-and-one-days'].titleForms['zh-CN'],
      description: folioSourceRecords['one-hundred-and-one-days'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['one-hundred-and-one-days'].titleForms['en'],
      description:
        'Once, a commoner told a merchant a magnificent story. Passed from one person to the next, it reached the Khagan one hundred and one days later. Intrigued, he travelled incognito to seek the story’s source, only to discover that he had already had the commoner executed.',
    },
    ursus: {
      title: 'Сто один день',
      description:
        'Когда-то простолюдин рассказал торговцу поразительную историю. Переходя из уст в уста, через сто один день она дошла до хагана. Заинтересовавшись, он инкогнито отправился искать её источник, но обнаружил, что сам уже казнил этого простолюдина.',
    },
    siracusa: {
      title: 'Centouno giorni',
      description:
        'Un tempo, un popolano raccontò a un mercante una storia straordinaria. Tramandata di bocca in bocca, dopo centouno giorni giunse all’orecchio del Khagan. Incuriosito, questi viaggiò in incognito per cercarne la fonte, solo per scoprire di avere già fatto giustiziare quel popolano.',
    },
    minos: {
      title: 'Εκατόν Μία Ημέρες',
      description:
        'Κάποτε, ένας απλός άνθρωπος διηγήθηκε σε έναν έμπορο μια θαυμάσια ιστορία. Περνώντας από στόμα σε στόμα, έφτασε στα αυτιά του Χαγάνου εκατόν μία ημέρες αργότερα. Γοητευμένος, εκείνος ταξίδεψε μεταμφιεσμένος για να αναζητήσει την πηγή της, μόνο για να ανακαλύψει ότι είχε ήδη διατάξει την εκτέλεση αυτού του ανθρώπου.',
    },
    leithanien: {
      title: 'Einhundertein Tage',
      description:
        'Einst erzählte ein einfacher Bürger einem Händler eine außergewöhnliche Geschichte. Von Mund zu Mund weitergegeben, erreichte sie nach einhunderteinem Tagen den Khagan. Neugierig geworden, reiste er inkognito, um ihren Ursprung zu suchen, und entdeckte schließlich, dass er diesen Bürger bereits hatte hinrichten lassen.',
    },
    kazimierz: {
      title: 'Sto jeden dni',
      description:
        'Pewnego razu prosty człowiek opowiedział kupcowi niezwykłą historię. Przekazywana z ust do ust, po stu jeden dniach dotarła do uszu chagana. Zaintrygowany, wyruszył incognito, by odnaleźć jej źródło, lecz odkrył, że sam zdążył już skazać tego człowieka na śmierć.',
    },
    higashi: {
      title: folioSourceRecords['one-hundred-and-one-days'].titleForms['ja-JP'],
      description:
        'かつて、ある平民が商人に比類なき物語を語った。その物語は人から人へと伝わり、百一日後に王酋の耳へ届いた。興味を抱いた王酋は身分を隠して物語の源を探しに向かったが、ついには、その平民が自分の命令ですでに処刑されていたことを知る。',
    },
    columbia: {
      title: folioSourceRecords['one-hundred-and-one-days'].titleForms['en'],
      description:
        'Once, a commoner told a merchant a magnificent story. Passed from one person to the next, it reached the Khagan one hundred and one days later. Intrigued, he traveled incognito to seek the story’s source, only to discover that he had already had the commoner executed.',
    },
  },
  'the-carnival': {
    yan: {
      title: folioSourceRecords['the-carnival'].titleForms['zh-CN'],
      description: folioSourceRecords['the-carnival'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['the-carnival'].titleForms['en'],
      description: 'Celebrate, my friend! Something this good does not happen every day.',
    },
    ursus: {
      title: 'Ликование',
      description: 'Празднуй, друг! Такое счастье выпадает не каждый день.',
    },
    siracusa: {
      title: 'Il Carnevale',
      description: 'Festeggia, amico! Una fortuna simile non capita tutti i giorni.',
    },
    minos: {
      title: 'Η Γιορτή',
      description: 'Γιόρτασε, φίλε! Τέτοια χαρά δεν έρχεται κάθε μέρα.',
    },
    leithanien: {
      title: 'Der Karneval',
      description: 'Feiere, mein Freund! So etwas Gutes erlebt man nicht jeden Tag.',
    },
    kazimierz: {
      title: 'Karnawał',
      description: 'Świętuj, przyjacielu! Takie szczęście nie zdarza się codziennie.',
    },
    higashi: {
      title: folioSourceRecords['the-carnival'].titleForms['ja-JP'],
      description: '祝おう、友よ！こんな幸運は毎日訪れるものではない。',
    },
    columbia: {
      title: folioSourceRecords['the-carnival'].titleForms['en'],
      description: 'Celebrate, my friend! Something this good does not happen every day.',
    },
  },
  'ode-au-triomphe': {
    yan: {
      title: folioSourceRecords['ode-au-triomphe'].titleForms['zh-CN'],
      description: folioSourceRecords['ode-au-triomphe'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['ode-au-triomphe'].titleForms['en'],
      description:
        'Let us join in song to celebrate the Emperor’s triumph! Long live the Emperor! Long live Gaul!',
    },
    ursus: {
      title: 'Ода триумфу',
      description:
        'Споём же хвалебную песнь и отпразднуем триумф императора! Да здравствует император! Да здравствует Галлия!',
    },
    siracusa: {
      title: 'Ode au Triomphe',
      description:
        'Uniamo le voci in un canto di lode per celebrare il trionfo dell’Imperatore! Viva l’Imperatore! Viva la Gallia!',
    },
    minos: {
      title: 'Ύμνος του Θριάμβου',
      description:
        'Ας ενώσουμε τις φωνές μας σε ύμνο και ας γιορτάσουμε τον θρίαμβο του Αυτοκράτορα! Ζήτω ο Αυτοκράτορας! Ζήτω η Γαλατία!',
    },
    leithanien: {
      title: 'Ode au Triomphe',
      description:
        'Lasst uns gemeinsam einen Lobgesang anstimmen und den Triumph des Kaisers feiern! Lang lebe der Kaiser! Lang lebe Gallien!',
    },
    kazimierz: {
      title: 'Oda Triumfalna',
      description:
        'Zaśpiewajmy wspólnie pieśń pochwalną i uczcijmy triumf Cesarza! Niech żyje Cesarz! Niech żyje Galia!',
    },
    higashi: {
      title: folioSourceRecords['ode-au-triomphe'].titleForms['ja-JP'],
      description: '声を合わせて頌歌を歌い、皇帝の凱旋を祝おう！皇帝万歳！ガリア万歳！',
    },
    columbia: {
      title: folioSourceRecords['ode-au-triomphe'].titleForms['en'],
      description:
        'Let us join in song to celebrate the Emperor’s triumph! Long live the Emperor! Long live Gaul!',
    },
  },
  'lone-wander': {
    yan: {
      title: folioSourceRecords['lone-wander'].titleForms['zh-CN'],
      description: folioSourceRecords['lone-wander'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['lone-wander'].titleForms['en'],
      description:
        'In the cracks of the land, beneath the shadows of the cities, a solitary eccentric watches everything. Within the ugly iron-bucket mask lurk conspiracy and madness.',
    },
    ursus: {
      title: 'Одинокий странник',
      description:
        'В трещинах земли, в тенях городов одинокий чудак наблюдает за всем. Под уродливой маской из железного ведра скрываются заговор и безумие.',
    },
    siracusa: {
      title: 'Viandante solitario',
      description:
        'Nelle crepe della terra, sotto le ombre delle città, uno strano solitario osserva ogni cosa. Dentro la brutta maschera a secchio di ferro si nascondono complotto e follia.',
    },
    minos: {
      title: 'Μοναχικός οδοιπόρος',
      description:
        'Στις ρωγμές της γης, κάτω από τις σκιές των πόλεων, ένας μοναχικός παράξενος παρατηρεί τα πάντα. Μέσα στην άσχημη μάσκα από σιδερένιο κουβά κρύβονται συνωμοσία και τρέλα.',
    },
    leithanien: {
      title: 'Der Einzelwanderer',
      description:
        'In den Rissen der Erde, unter den Schatten der Städte, beobachtet ein einsamer Sonderling alles. Hinter der hässlichen Maske aus einem eisernen Eimer verbergen sich Verschwörung und Wahnsinn.',
    },
    kazimierz: {
      title: 'Samotny wędrowiec',
      description:
        'W szczelinach ziemi, pod cieniami miast, samotny dziwak obserwuje wszystko. W szpetnej masce z żelaznego wiadra kryją się spisek i szaleństwo.',
    },
    higashi: {
      title: folioSourceRecords['lone-wander'].titleForms['ja-JP'],
      description:
        '大地の裂け目で、都市の影の下で、孤独な怪人はすべてを覗き見ている。醜い鉄製の桶の仮面の内には、陰謀と狂気が隠されている。',
    },
    columbia: {
      title: folioSourceRecords['lone-wander'].titleForms['en'],
      description:
        'In the cracks of the land, beneath the shadows of the cities, a solitary eccentric watches everything. Within the ugly iron-bucket mask lurk conspiracy and madness.',
    },
  },
  'wonderland-in-dream': {
    yan: {
      title: folioSourceRecords['wonderland-in-dream'].titleForms['zh-CN'],
      description: folioSourceRecords['wonderland-in-dream'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['wonderland-in-dream'].titleForms['en'],
      description:
        'Even if you cannot reach the distant castle, at least you still have a companion, and I still have you.',
    },
    ursus: {
      title: 'Страна чудес во сне',
      description:
        'Даже если тебе не добраться до далёкого замка, у тебя по крайней мере есть спутник, а у меня — ты.',
    },
    siracusa: {
      title: 'Meraviglia nel sogno',
      description:
        'Anche se non puoi raggiungere il castello lontano, almeno tu hai ancora un compagno, e io ho ancora te.',
    },
    minos: {
      title: 'Χώρα θαυμάτων στο όνειρο',
      description:
        'Ακόμη κι αν δεν μπορείς να φτάσεις στο μακρινό κάστρο, τουλάχιστον έχεις έναν σύντροφο· κι εγώ, τουλάχιστον, έχω εσένα.',
    },
    leithanien: {
      title: 'Wunderland im Traum',
      description:
        'Selbst wenn du das ferne Schloss nicht erreichen kannst, hast du wenigstens noch einen Gefährten, und ich habe wenigstens noch dich.',
    },
    kazimierz: {
      title: 'Kraina cudów we śnie',
      description:
        'Nawet jeśli nie możesz dotrzeć do odległego zamku, przynajmniej wciąż masz towarzysza, a ja wciąż mam ciebie.',
    },
    higashi: {
      title: folioSourceRecords['wonderland-in-dream'].titleForms['ja-JP'],
      description:
        '遠くの城へ辿り着けなくても、君には少なくとも仲間がいる。私には少なくとも君がいる。',
    },
    columbia: {
      title: folioSourceRecords['wonderland-in-dream'].titleForms['en'],
      description:
        'Even if you cannot reach the distant castle, at least you still have a companion, and I still have you.',
    },
  },
  'frost-deer-and-snow-doe': {
    yan: {
      title: folioSourceRecords['frost-deer-and-snow-doe'].titleForms['zh-CN'],
      description: folioSourceRecords['frost-deer-and-snow-doe'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['frost-deer-and-snow-doe'].titleForms['en'],
      description:
        'As the kindred guards of the Snowpriest, our wish is to die by cold iron.\n\nAs twins bound by blood, our wish is to live and die together.\n\nYou have too many wishes. Only one can be granted, and I shall choose which.',
    },
    ursus: {
      title: 'Морозный олень и снежная лань',
      description:
        'Как родственные стражи Снежного Жреца, мы желаем погибнуть от холодного железа.\n\nКак близнецы одной крови, мы желаем жить и умереть вместе.\n\nУ вас слишком много желаний. Исполнить можно только одно — и выберу его я.',
    },
    siracusa: {
      title: 'Cervo di brina e cerva di neve',
      description:
        'Come guardie consanguinee del Sacerdote della Neve, desideriamo morire per il ferro gelido.\n\nCome gemelli legati dallo stesso sangue, desideriamo vivere e morire insieme.\n\nAvete troppi desideri. Soltanto uno può essere esaudito, e sarò io a scegliere quale.',
    },
    minos: {
      title: 'Ελάφι της πάχνης και ελαφίνα του χιονιού',
      description:
        'Ως συγγενείς φρουροί του Ιερέα του Χιονιού, ευχόμαστε να πεθάνουμε από παγωμένο σίδερο.\n\nΩς δίδυμοι δεμένοι με το ίδιο αίμα, ευχόμαστε να ζήσουμε και να πεθάνουμε μαζί.\n\nΈχετε πάρα πολλές ευχές. Μόνο μία μπορεί να πραγματοποιηθεί, και θα επιλέξω εγώ ποια.',
    },
    leithanien: {
      title: 'Frosthirsch und Schneehindin',
      description:
        'Als blutsverwandte Wächter des Schneepriesters wünschen wir uns, durch kaltes Eisen zu sterben.\n\nAls Zwillinge desselben Blutes wünschen wir uns, gemeinsam zu leben und zu sterben.\n\nIhr habt zu viele Wünsche. Nur einer kann erfüllt werden, und ich werde wählen, welcher.',
    },
    kazimierz: {
      title: 'Jeleń szronu i łania śniegu',
      description:
        'Jako spokrewnieni strażnicy Śnieżnego Kapłana pragniemy zginąć od zimnego żelaza.\n\nJako bliźnięta tej samej krwi pragniemy żyć i umrzeć razem.\n\nMacie zbyt wiele życzeń. Spełnić można tylko jedno, a ja wybiorę które.',
    },
    higashi: {
      title: folioSourceRecords['frost-deer-and-snow-doe'].titleForms['ja-JP'],
      description:
        '雪祀の血縁の護衛として、我らの願いは、冷たい鉄に斃れること。\n\n血を分けた双子として、我らの願いは、生も死も共にすること。\n\n願いが多すぎる。叶えられるのは一つだけ。どれにするかは、私が選ぼう。',
    },
    columbia: {
      title: folioSourceRecords['frost-deer-and-snow-doe'].titleForms['en'],
      description:
        'As the kindred guards of the Snowpriest, our wish is to die by cold iron.\n\nAs twins bound by blood, our wish is to live and die together.\n\nYou have too many wishes. Only one can be granted, and I shall choose which.',
    },
  },
  'light-of-heria': {
    yan: {
      title: folioSourceRecords['light-of-heria'].titleForms['zh-CN'],
      description: folioSourceRecords['light-of-heria'].synopsis.text,
    },
    victoria: {
      title: folioSourceRecords['light-of-heria'].titleForms['en'],
      description:
        'At the most perilous moment, heroes descended from the sun, crossed the summit of Mount Heria, and came to stand beside Minos.',
    },
    ursus: {
      title: 'Свет Херии',
      description:
        'В самый опасный час герои спустились с солнца, прошли через вершину горы Херия и пришли на помощь Миносу.',
    },
    siracusa: {
      title: 'Luce di Heria',
      description:
        'Nel momento di massimo pericolo, gli eroi discesero dal sole, attraversarono la vetta del monte Heria e giunsero al fianco di Minos.',
    },
    minos: {
      title: 'Το φως της Χέρια',
      description:
        'Στην πιο κρίσιμη στιγμή, οι ήρωες κατέβηκαν από τον ήλιο, διέσχισαν την κορυφή του όρους Χέρια και ήρθαν στο πλευρό του Μίνως.',
    },
    leithanien: {
      title: 'Licht von Heria',
      description:
        'Im gefährlichsten Augenblick stiegen die Helden von der Sonne herab, überquerten den Gipfel des Berges Heria und kamen Minos zur Seite.',
    },
    kazimierz: {
      title: 'Światło Herii',
      description:
        'W chwili największego zagrożenia bohaterowie zstąpili ze słońca, przeszli przez szczyt góry Heria i stanęli u boku Minos.',
    },
    higashi: {
      title: folioSourceRecords['light-of-heria'].titleForms['ja-JP'],
      description:
        '最も危うい時、英雄たちは太陽から舞い降り、ヘリア山の頂を越え、ミノスのもとへ来た。',
    },
    columbia: {
      title: folioSourceRecords['light-of-heria'].titleForms['en'],
      description:
        'At the most perilous moment, heroes descended from the sun, crossed the summit of Mount Heria, and came to stand beside Minos.',
    },
  },
} as const satisfies Record<FolioProductionId, Record<BuildEditionId, FolioSourceText>>;

type FolioProductionDetails = Omit<ProductionContent, 'title' | 'tagline' | 'synopsis'>;

export function createFolioProductionContent(
  editionId: BuildEditionId,
  productionId: FolioProductionId,
  details: FolioProductionDetails,
): ProductionContent {
  const sourceText = folioSourceTexts[productionId][editionId];
  return {
    title: sourceText.title,
    kind: details.kind,
    tagline: sourceText.description,
    duration: details.duration,
    durationShort: details.durationShort,
    language: details.language,
    heading: details.heading,
    synopsis: sourceText.description,
    guidance: details.guidance,
    creatives: details.creatives,
  };
}
