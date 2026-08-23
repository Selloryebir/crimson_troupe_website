import type { ArchiveProjectionContent } from '../schema.ts';

export const higashiArchiveProjection = {
  statusAnnouncement: '頁上の記録が同時に行き先を書き換えました。',
  performance: {
    title: '歓喜',
    kind: '終演',
    tagline: '招待状の所持者の席はまだ保留されています',
    dateTime: '1091-11-11 23:49:00 ・ 第三の鐘が鳴る前',
    venue: 'カレー＝ブラゾン林地城',
    status: 'ご到着をお待ちしております',
    registerCode: 'CT-██/INV-03',
    posterAlt: 'カレー＝ブラゾン林地城へ導く緋色の公演フォリオ',
  },
  invitation: {
    ariaLabel: 'カレー＝ブラゾンからの正式招待',
    eyebrow: '正式招待状／配達済み',
    title: '城はすでにあなたの席を取ってあります',
    summary:
      'いま開いた記録は、異なる日付と都市から来たはずでした。それでも、どれも同じ到着経路だけを残しています。修復を待っているのではありません。あなたが入口を選ぶのを待っています。',
    roleLabel: '登録上の役割',
    productionLabel: '演目',
    venueLabel: '会場',
    attendanceLabel: '到着',
    role: '招待状の所持者',
    production: '歓喜',
    venue: 'カレー＝ブラゾン林地城',
    attendance: '第三の鐘が鳴る前',
    closing:
      '続ければ、元の記録は開きます。だからといって、城が記録の後ろにあるとは思わないでください。城はこのスナップショットより先にあなたを見つけただけです。',
    dismissLabel: '招待状を閉じる',
    continueLabel: '元の記録を続けて読む',
  },
  views: {
    invitation: {
      eyebrow: '今夜の公演／入口修正済み',
      title: 'すべての道に残った終点は一つだけ',
      summary: 'ホームの公演は元の順序を保っていますが、どのフォリオも同じ扉を覚えています。',
    },
    register: {
      eyebrow: '座席簿／重複登録',
      title: '九件の記録が同じ来賓を呼んでいます',
      summary: '日付と番号は元の場所にあるのに、会場だけが各行から同じ林地城を指しています。',
    },
    'performance-record': {
      eyebrow: '公演記録／行き先書換',
      title: 'この公演はすでに到着し、観客だけを欠いています',
      summary: '本来の日付と会場は頁の背後で反復され、見える記録は招待状の時刻しか認めません。',
    },
    'production-record': {
      eyebrow: '演目記録／題名剥離',
      title: 'すべての演目が終幕前に同じ名へ書き換えられます',
      summary: '梗概と制作者名には薄い墨跡が残り、緋の題簽はすでに枠を越えています。',
    },
    company: {
      eyebrow: '劇団名簿／空席の役割',
      title: '名簿の全役職が同じ一人を待っています',
      summary: '人名と沿革はまだ読めますが、役割欄は到着していない招待者のために空いています。',
    },
    inquiry: {
      eyebrow: '記録検索／唯一の回答',
      title: '異なる問いに、記録庫は一つの地名だけを返します',
      summary: '結果数は減っていません。どの要約も、元の行き先を林地城へ書き換えました。',
    },
    office: {
      eyebrow: '座席事務／到着確認',
      title: '決済端末は応答しないのに、座席は行き先を記録しました',
      summary: 'この頁では支払いも交換もできません。全分区に残ったのは同じ到着確認だけです。',
    },
  },
} satisfies ArchiveProjectionContent;
