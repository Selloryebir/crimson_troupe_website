import type { TerraDateTime } from './performances.ts';

export type ArchiveSnapshotState = 'available' | 'damaged';

interface ArchiveSnapshotBase {
  snapshotId: string;
  state: ArchiveSnapshotState;
  displayCapturedAt: string;
}

export interface AvailableArchiveSnapshot extends ArchiveSnapshotBase {
  state: 'available';
  capturedAt: TerraDateTime;
  routeSegment: string;
}

export interface DamagedArchiveSnapshot extends ArchiveSnapshotBase {
  state: 'damaged';
  capturedAt: null;
  routeSegment: null;
}

export type ArchiveSnapshot = AvailableArchiveSnapshot | DamagedArchiveSnapshot;

export const archiveSnapshots = Object.freeze([
  Object.freeze({
    snapshotId: '1084-07-01T00:00:00',
    state: 'available',
    capturedAt: Object.freeze({
      calendar: 'terra',
      year: 1084,
      month: 7,
      day: 1,
      time: '00:00',
    }),
    displayCapturedAt: '1084-07-01 00:00:00',
    routeSegment: '1084-07-01',
  }),
  Object.freeze({
    snapshotId: '1093-damaged',
    state: 'damaged',
    capturedAt: null,
    displayCapturedAt: '1093-██-██ --:--:--',
    routeSegment: null,
  }),
  Object.freeze({
    snapshotId: '1096-damaged',
    state: 'damaged',
    capturedAt: null,
    displayCapturedAt: '1096-██-██ --:--:--',
    routeSegment: null,
  }),
] as const satisfies readonly ArchiveSnapshot[]);

const availableSnapshots = archiveSnapshots.filter(
  (snapshot): snapshot is (typeof archiveSnapshots)[number] & AvailableArchiveSnapshot =>
    snapshot.state === 'available',
);

if (availableSnapshots.length !== 1) {
  throw new Error('当前构建必须且只能注册一个可访问历史快照。');
}

const snapshotIds = archiveSnapshots.map(({ snapshotId }) => snapshotId);
if (new Set(snapshotIds).size !== snapshotIds.length) {
  throw new Error('历史快照 snapshotId 必须唯一。');
}

export const currentArchiveSnapshot: AvailableArchiveSnapshot = availableSnapshots[0];
