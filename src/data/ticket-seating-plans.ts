import type { TicketZone } from './performances.ts';

export type SeatingPlanId =
  'trimount-grand-fan' | 'wiesheim-mirror-horseshoe' | 'norport-temporary-stand';

export interface SeatingPlanRegion {
  regionId: string;
  zone: TicketZone;
  path: string;
  labelX: number;
  labelY: number;
}

export interface SeatingPlanLevel {
  levelId: string;
  stage?: { x: number; y: number; width: number; height: number };
  regions: readonly SeatingPlanRegion[];
}

export interface SeatingPlanDefinition {
  seatingPlanId: SeatingPlanId;
  levels: readonly SeatingPlanLevel[];
}

export const ticketSeatingPlans = {
  'trimount-grand-fan': {
    seatingPlanId: 'trimount-grand-fan',
    levels: [
      {
        levelId: 'orchestra',
        stage: { x: 220, y: 18, width: 200, height: 32 },
        regions: [
          {
            regionId: 'orchestra-center-front',
            zone: 'S',
            path: 'M250 64 H390 L430 124 Q320 150 210 124 Z',
            labelX: 320,
            labelY: 98,
          },
          {
            regionId: 'orchestra-left-front',
            zone: 'A',
            path: 'M145 72 L245 62 L210 126 L120 145 Z',
            labelX: 174,
            labelY: 104,
          },
          {
            regionId: 'orchestra-right-front',
            zone: 'A',
            path: 'M495 72 L395 62 L430 126 L520 145 Z',
            labelX: 466,
            labelY: 104,
          },
          {
            regionId: 'orchestra-middle',
            zone: 'B',
            path: 'M132 150 Q320 205 508 150 L526 181 Q320 232 114 181 Z',
            labelX: 320,
            labelY: 155,
          },
          {
            regionId: 'orchestra-rear',
            zone: 'C',
            path: 'M105 188 Q320 238 535 188 L574 228 H66 Z',
            labelX: 320,
            labelY: 220,
          },
        ],
      },
      {
        levelId: 'first-gallery',
        regions: [
          {
            regionId: 'first-gallery-center',
            zone: 'A',
            path: 'M208 95 Q320 150 432 95 L452 136 Q320 202 188 136 Z',
            labelX: 320,
            labelY: 145,
          },
          {
            regionId: 'first-gallery-left-arm',
            zone: 'B',
            path: 'M58 58 Q112 112 188 136 L166 181 Q76 148 30 82 Z',
            labelX: 48,
            labelY: 122,
          },
          {
            regionId: 'first-gallery-right-arm',
            zone: 'B',
            path: 'M582 58 Q528 112 452 136 L474 181 Q564 148 610 82 Z',
            labelX: 592,
            labelY: 122,
          },
          {
            regionId: 'first-gallery-box-left',
            zone: 'BOX',
            path: 'M112 30 H174 L168 78 H104 Z M181 42 H231 L223 91 H174 Z',
            labelX: 190,
            labelY: 58,
          },
          {
            regionId: 'first-gallery-box-right',
            zone: 'BOX',
            path: 'M409 42 H459 L466 91 H417 Z M466 30 H528 L536 78 H472 Z',
            labelX: 450,
            labelY: 58,
          },
        ],
      },
      {
        levelId: 'upper-gallery',
        regions: [
          {
            regionId: 'upper-gallery-center',
            zone: 'C',
            path: 'M176 104 Q320 184 464 104 L488 153 Q320 236 152 153 Z',
            labelX: 320,
            labelY: 162,
          },
          {
            regionId: 'upper-gallery-left-arm',
            zone: 'C',
            path: 'M42 48 Q86 102 152 153 L126 197 Q48 158 14 80 Z',
            labelX: 82,
            labelY: 126,
          },
          {
            regionId: 'upper-gallery-right-arm',
            zone: 'C',
            path: 'M598 48 Q554 102 488 153 L514 197 Q592 158 626 80 Z',
            labelX: 558,
            labelY: 126,
          },
        ],
      },
    ],
  },
  'wiesheim-mirror-horseshoe': {
    seatingPlanId: 'wiesheim-mirror-horseshoe',
    levels: [
      {
        levelId: 'orchestra',
        stage: { x: 230, y: 16, width: 180, height: 30 },
        regions: [
          {
            regionId: 'orchestra-center-front',
            zone: 'S',
            path: 'M270 58 H370 L386 96 H254 Z',
            labelX: 320,
            labelY: 77,
          },
          {
            regionId: 'orchestra-center',
            zone: 'A',
            path: 'M246 102 H394 L420 188 H220 Z',
            labelX: 320,
            labelY: 145,
          },
          {
            regionId: 'orchestra-left-side',
            zone: 'B',
            path: 'M170 58 H242 L214 190 H140 Z',
            labelX: 190,
            labelY: 126,
          },
          {
            regionId: 'orchestra-right-side',
            zone: 'B',
            path: 'M470 58 H398 L426 190 H500 Z',
            labelX: 450,
            labelY: 126,
          },
          {
            regionId: 'orchestra-rear',
            zone: 'C',
            path: 'M196 196 H444 L474 228 H166 Z',
            labelX: 320,
            labelY: 212,
          },
        ],
      },
      {
        levelId: 'first-gallery',
        regions: [
          {
            regionId: 'first-gallery-center',
            zone: 'A',
            path: 'M214 98 Q320 154 426 98 L444 138 Q320 204 196 138 Z',
            labelX: 320,
            labelY: 148,
          },
          {
            regionId: 'first-gallery-left-enclosure',
            zone: 'B',
            path: 'M72 50 Q118 112 196 138 L172 184 Q82 150 40 78 Z',
            labelX: 56,
            labelY: 122,
          },
          {
            regionId: 'first-gallery-right-enclosure',
            zone: 'B',
            path: 'M568 50 Q522 112 444 138 L468 184 Q558 150 600 78 Z',
            labelX: 584,
            labelY: 122,
          },
          {
            regionId: 'first-gallery-box-left',
            zone: 'BOX',
            path: 'M142 35 H206 L196 84 H134 Z',
            labelX: 190,
            labelY: 59,
          },
          {
            regionId: 'first-gallery-box-right',
            zone: 'BOX',
            path: 'M434 35 H498 L506 84 H444 Z',
            labelX: 450,
            labelY: 59,
          },
        ],
      },
      {
        levelId: 'upper-gallery',
        regions: [
          {
            regionId: 'upper-gallery-center',
            zone: 'C',
            path: 'M180 108 Q320 188 460 108 L484 154 Q320 242 156 154 Z',
            labelX: 320,
            labelY: 164,
          },
          {
            regionId: 'upper-gallery-left',
            zone: 'C',
            path: 'M48 48 Q90 108 156 154 L132 198 Q54 160 18 78 Z',
            labelX: 48,
            labelY: 128,
          },
          {
            regionId: 'upper-gallery-right',
            zone: 'C',
            path: 'M592 48 Q550 108 484 154 L508 198 Q586 160 622 78 Z',
            labelX: 592,
            labelY: 128,
          },
          {
            regionId: 'upper-gallery-box-left',
            zone: 'BOX',
            path: 'M118 28 H178 L172 76 H110 Z',
            labelX: 190,
            labelY: 51,
          },
          {
            regionId: 'upper-gallery-box-right',
            zone: 'BOX',
            path: 'M462 28 H522 L530 76 H468 Z',
            labelX: 450,
            labelY: 51,
          },
        ],
      },
    ],
  },
  'norport-temporary-stand': {
    seatingPlanId: 'norport-temporary-stand',
    levels: [
      {
        levelId: 'platform',
        stage: { x: 185, y: 18, width: 270, height: 32 },
        regions: [
          {
            regionId: 'platform-center-front',
            zone: 'A',
            path: 'M244 66 H396 L422 126 H218 Z',
            labelX: 320,
            labelY: 96,
          },
          {
            regionId: 'platform-left-front',
            zone: 'B',
            path: 'M116 76 L238 64 L214 130 L96 150 Z',
            labelX: 164,
            labelY: 108,
          },
          {
            regionId: 'platform-right-front',
            zone: 'B',
            path: 'M524 76 L402 64 L426 130 L544 150 Z',
            labelX: 476,
            labelY: 108,
          },
          {
            regionId: 'platform-middle',
            zone: 'B',
            path: 'M210 135 Q320 162 430 135 L452 174 Q320 208 188 174 Z',
            labelX: 320,
            labelY: 145,
          },
          {
            regionId: 'platform-rear',
            zone: 'C',
            path: 'M92 174 Q320 224 548 174 L582 228 H58 Z',
            labelX: 320,
            labelY: 220,
          },
        ],
      },
    ],
  },
} as const satisfies Record<SeatingPlanId, SeatingPlanDefinition>;

export function getRegisteredTicketSeatingPlan(
  seatingPlanId: SeatingPlanId,
): SeatingPlanDefinition {
  return ticketSeatingPlans[seatingPlanId];
}
