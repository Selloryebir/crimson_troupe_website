import type { ArchiveProjectionContent } from '../schema.ts';

export const yanArchiveProjection = {
  statusAnnouncement: '页面上的记录同时更正了去向。',
  performance: {
    title: '欢欣鼓舞',
    kind: '终场演出',
    tagline: '席位仍为持柬者保留',
    dateTime: '1091-11-11 23:49:00 · 第三次钟声以前',
    venue: '克莱布拉松林地城堡',
    status: '恭候到场',
    registerCode: 'CT-██/INV-03',
    posterAlt: '一张通往克莱布拉松林地城堡的猩红演出活页',
  },
  invitation: {
    ariaLabel: '克莱布拉松正式邀请',
    eyebrow: '正式请柬／已送达',
    title: '城堡已经替您保留席位',
    summary:
      '您刚才打开的记录来自不同日期与城市，此刻却留下了同一条抵达路线。它们并未等待修复；它们只在等待您选定入口。',
    roleLabel: '登记身份',
    productionLabel: '演出',
    venueLabel: '地点',
    attendanceLabel: '到场',
    role: '持柬来宾',
    production: '欢欣鼓舞',
    venue: '克莱布拉松林地城堡',
    attendance: '第三次钟声以前',
    closing: '继续后，原记录仍会打开。请不要因此以为城堡位于记录之后；它只是比这份快照更早看见您。',
    dismissLabel: '合上请柬',
    continueLabel: '继续查阅原记录',
  },
  views: {
    invitation: {
      eyebrow: '今夜演出／入口已校正',
      title: '所有道路仅余一个终点',
      summary: '首页上的场次仍保留原有次序，但每一张活页都已经记住同一扇门。',
    },
    register: {
      eyebrow: '席次簿／重复登记',
      title: '九项记录同时呼叫一名来宾',
      summary: '日期与编号仍在原位，地点却从每一行中指向同一座林地城堡。',
    },
    'performance-record': {
      eyebrow: '场次记录／去向重写',
      title: '此场次已经抵达，只缺少观众',
      summary: '原定日期与场馆在页面背后重复；可见的记录只承认请柬上的时间。',
    },
    'production-record': {
      eyebrow: '剧目记录／题名剥落',
      title: '所有剧目都在终幕前改用同一个名字',
      summary: '梗概和人员表仍留有淡墨痕迹，猩红题签已经越过它们的边框。',
    },
    company: {
      eyebrow: '剧团名册／空缺职责',
      title: '名册中的每一个职务都在等待同一人',
      summary: '人名与沿革尚能辨认，职责栏却一再把空位留给尚未到场的持柬者。',
    },
    inquiry: {
      eyebrow: '档案检索／唯一回答',
      title: '您输入了不同问题，档案却只记得一个地点',
      summary: '结果数量并未减少；每条摘要都已经把原来的去向改写为林地城堡。',
    },
    office: {
      eyebrow: '席位事务／到场确认',
      title: '结算端没有回应，席位却已记下您的去向',
      summary: '本页仍无法付款或兑换；所有分区只剩下同一份到场确认。',
    },
  },
} satisfies ArchiveProjectionContent;
