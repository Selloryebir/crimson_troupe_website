import type { ArchiveProjectionContent } from '../schema.ts';

export const yanArchiveProjection = {
  statusAnnouncement: '档案显示已收束为一份未结邀请记录。',
  ariaLabel: '克莱布拉松未结档案',
  roleLabel: '登记身份',
  productionLabel: '演出',
  venueLabel: '地点',
  attendanceLabel: '到场',
  role: '来宾／当地人／剧中角色',
  production: '欢欣鼓舞',
  venue: '克莱布拉松林地城堡',
  attendance: '泰拉历 1091 年，第三次钟声以前',
  closing:
    '网站先前列出的日期、地点与席次无需逐项撤销；抵达城堡时，它们将作为同一场演出的不同记录一并归档。离席说明将在终幕后补发。',
  views: {
    invitation: {
      eyebrow: '克莱布拉松地区档案补录',
      title: '未结记录合并通知',
      summary:
        '子爵府宴会名册、地区征召缺额、维多利亚接收清册与猩红剧团新舞台席次簿，均保留着同一处未结空位。前三份记录已经归档，最后一份仍等待来宾到场；四项空位现由本柬持有人一并承接。',
    },
    register: {
      eyebrow: '席次簿／合并校对',
      title: '九项记录，共用一处未结空位',
      summary:
        '当前与历史演出的日期、场馆和编号仍是有效档案。它们同时被标记为同一场演出的分册记录，供来宾抵达林地城堡时一并交回。',
    },
    'performance-record': {
      eyebrow: '场次记录／待归并',
      title: '此场次尚未撤销，只是尚未抵达',
      summary:
        '本页的时间、场馆与席次保留原登记。档案将它们解释为抵达克莱布拉松前的预录项目，并把本页访客记入最后一份等待到场的名单。',
    },
    'production-record': {
      eyebrow: '剧目记录／异名对照',
      title: '目录中的标题被登记为排演用名',
      summary:
        '本页剧目仍保留原题、梗概和创作记录；合并档案只在其后追加一项对照，称这些不同题名均被新舞台席次簿收录于同一场《欢欣鼓舞》。',
    },
    company: {
      eyebrow: '剧团名册／职责补录',
      title: '来宾、当地人与剧中角色使用同一登记栏',
      summary:
        '剧团沿革和人员记录没有被删除。新舞台席次簿只是取消三种身份之间的界线，并将本柬持有人填入仍然空缺的职责。',
    },
    inquiry: {
      eyebrow: '档案检索／交叉索引',
      title: '检索结果分别存在，归档去向保持一致',
      summary:
        '查询所得页面、剧目和场次仍指向原有记录。档案在每条结果之后附上同一个未结编号，等待它们在林地城堡被认作同一场演出的不同证据。',
    },
    office: {
      eyebrow: '席位事务／未结分配',
      title: '历史快照不售票，但空位已经转交',
      summary:
        '本页仍不提供购买、付款或兑换。合并通知把宴席、征召、接收与剧场中的四项空位视为一次无须交易的席位分配，由本柬持有人承接。',
    },
  },
} satisfies ArchiveProjectionContent;
