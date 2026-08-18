import { showEntries, type ShowId } from './shows';

export type SearchEntry =
  | {
      category: string;
      title: string;
      detail: string;
      keywords: string;
      action: 'show';
      value: ShowId;
    }
  | {
      category: string;
      title: string;
      detail: string;
      keywords: string;
      action: 'target';
      value: `#${string}`;
    }
  | {
      category: string;
      title: string;
      detail: string;
      keywords: string;
      action: 'archive';
      value: 'archive';
    };

const showSearchEntries = showEntries.map(([value, show]) => ({
  category: '本季演出',
  title: show.title,
  detail: show.searchDetail,
  keywords: show.searchKeywords,
  action: 'show' as const,
  value,
}));

export const searchIndex = [
  ...showSearchEntries,
  {
    category: '观演服务',
    title: '无障碍观演服务',
    detail: '无阶梯席位、辅助听觉与字幕投影',
    keywords: '无障碍 字幕 听觉 轮椅 服务',
    action: 'target',
    value: '#experience',
  },
  {
    category: '剧团',
    title: '新猩红剧团的故事',
    detail: '演员、作曲家与技术人员共同组成的巡演团体',
    keywords: '剧团历史 关于 新剧团 艺术家',
    action: 'target',
    value: '#company',
  },
  {
    category: '手记',
    title: '一座空剧场，如何成为另一座城市',
    detail: '幕后 · 舞台与城市',
    keywords: '手记 幕后 剧场 城市',
    action: 'target',
    value: '#journal',
  },
  {
    category: '馆藏记录',
    title: 'CT–091–██',
    detail: '该记录不在公开馆藏中',
    keywords: '091 旧剧团 失踪 档案 archive',
    action: 'archive',
    value: 'archive',
  },
] satisfies SearchEntry[];
