export const archiveRecords = {
  '01': {
    code: 'RECORD 091–01 / AUDIO TRANSCRIPT',
    text: '我听见掌声从空座位里升起来。不是一双手，是许多双。指挥叫我们继续，可那一晚，台上根本没有指挥。',
  },
  '02': {
    code: 'RECORD 091–17 / PHOTOGRAPH NOTE',
    text: '我们反复清点了底片。快门按下时台上只有十二个人。第十三个人站在最中间，而且看着镜头。',
  },
  '03': {
    code: 'RECORD 091–██ / MANUSCRIPT',
    text: '最后一句台词不是写给演员的。它要由观众念出。请翻到节目单背面——如果那里已经出现了你的名字，就不要出声。',
  },
} as const;

export type ArchiveRecordId = keyof typeof archiveRecords;

export function isArchiveRecordId(value: string | undefined): value is ArchiveRecordId {
  return value !== undefined && Object.hasOwn(archiveRecords, value);
}
