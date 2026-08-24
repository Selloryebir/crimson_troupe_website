import type { TicketZone } from './performances.ts';

export type SeatingPlanId =
  | 'trimount-grand-fan'
  | 'wiesheim-mirror-horseshoe'
  | 'norport-temporary-stand'
  | 'montelupe-banquet-horseshoe'
  | 'linqu-courtyard-fan'
  | 'londinium-grand-tiers'
  | 'qingsui-opera-courtyard';

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
  'montelupe-banquet-horseshoe': {
    seatingPlanId: 'montelupe-banquet-horseshoe',
    levels: [
      {
        levelId: 'orchestra',
        stage: { x: 232, y: 16, width: 176, height: 30 },
        regions: [
          {
            regionId: 'banquet-orchestra-center-front',
            zone: 'S',
            path: 'M270 58 H370 L390 106 Q320 126 250 106 Z',
            labelX: 320,
            labelY: 88,
          },
          {
            regionId: 'banquet-orchestra-center-rear',
            zone: 'A',
            path: 'M244 112 Q320 138 396 112 L426 178 Q320 208 214 178 Z',
            labelX: 320,
            labelY: 158,
          },
          {
            regionId: 'banquet-orchestra-left',
            zone: 'B',
            path: 'M142 70 L246 56 L214 180 L112 198 Z',
            labelX: 174,
            labelY: 128,
          },
          {
            regionId: 'banquet-orchestra-right',
            zone: 'B',
            path: 'M498 70 L394 56 L426 180 L528 198 Z',
            labelX: 466,
            labelY: 128,
          },
          {
            regionId: 'banquet-orchestra-rear',
            zone: 'C',
            path: 'M126 204 Q320 244 514 204 L554 230 H86 Z',
            labelX: 320,
            labelY: 222,
          },
        ],
      },
      {
        levelId: 'first-gallery',
        regions: [
          {
            regionId: 'banquet-gallery-center',
            zone: 'A',
            path: 'M208 100 Q320 164 432 100 L454 142 Q320 216 186 142 Z',
            labelX: 320,
            labelY: 154,
          },
          {
            regionId: 'banquet-gallery-left-arm',
            zone: 'C',
            path: 'M58 54 Q112 116 186 142 L162 188 Q76 156 28 82 Z',
            labelX: 68,
            labelY: 128,
          },
          {
            regionId: 'banquet-gallery-right-arm',
            zone: 'C',
            path: 'M582 54 Q528 116 454 142 L478 188 Q564 156 612 82 Z',
            labelX: 572,
            labelY: 128,
          },
          {
            regionId: 'banquet-gallery-box-left',
            zone: 'BOX',
            path: 'M118 28 H174 L168 76 H108 Z M180 38 H226 L218 86 H170 Z',
            labelX: 186,
            labelY: 55,
          },
          {
            regionId: 'banquet-gallery-box-right',
            zone: 'BOX',
            path: 'M414 38 H460 L470 86 H422 Z M466 28 H522 L532 76 H472 Z',
            labelX: 454,
            labelY: 55,
          },
        ],
      },
    ],
  },
  'linqu-courtyard-fan': {
    seatingPlanId: 'linqu-courtyard-fan',
    levels: [
      {
        levelId: 'platform',
        stage: { x: 224, y: 18, width: 192, height: 32 },
        regions: [
          {
            regionId: 'courtyard-center-front',
            zone: 'S',
            path: 'M270 64 H370 L396 112 Q320 132 244 112 Z',
            labelX: 320,
            labelY: 92,
          },
          {
            regionId: 'courtyard-left-front',
            zone: 'A',
            path: 'M148 76 L264 62 L240 116 L122 142 Z',
            labelX: 180,
            labelY: 102,
          },
          {
            regionId: 'courtyard-right-front',
            zone: 'A',
            path: 'M492 76 L376 62 L400 116 L518 142 Z',
            labelX: 460,
            labelY: 102,
          },
          {
            regionId: 'courtyard-middle-fan',
            zone: 'B',
            path: 'M118 148 Q320 212 522 148 L548 188 Q320 254 92 188 Z',
            labelX: 320,
            labelY: 178,
          },
          {
            regionId: 'courtyard-rear-left',
            zone: 'C',
            path: 'M72 194 Q180 226 310 232 L304 264 Q160 260 40 222 Z',
            labelX: 150,
            labelY: 228,
          },
          {
            regionId: 'courtyard-rear-right',
            zone: 'C',
            path: 'M568 194 Q460 226 330 232 L336 264 Q480 260 600 222 Z',
            labelX: 490,
            labelY: 228,
          },
        ],
      },
    ],
  },
  'londinium-grand-tiers': {
    seatingPlanId: 'londinium-grand-tiers',
    levels: [
      {
        levelId: 'orchestra',
        stage: { x: 210, y: 16, width: 220, height: 32 },
        regions: [
          {
            regionId: 'grand-orchestra-center-front',
            zone: 'S',
            path: 'M250 62 H390 L424 126 Q320 154 216 126 Z',
            labelX: 320,
            labelY: 100,
          },
          {
            regionId: 'grand-orchestra-left-front',
            zone: 'A',
            path: 'M130 72 L244 60 L212 130 L100 154 Z',
            labelX: 164,
            labelY: 106,
          },
          {
            regionId: 'grand-orchestra-right-front',
            zone: 'A',
            path: 'M510 72 L396 60 L428 130 L540 154 Z',
            labelX: 476,
            labelY: 106,
          },
          {
            regionId: 'grand-orchestra-middle',
            zone: 'B',
            path: 'M94 160 Q320 226 546 160 L566 194 Q320 266 74 194 Z',
            labelX: 320,
            labelY: 184,
          },
          {
            regionId: 'grand-orchestra-rear',
            zone: 'C',
            path: 'M66 202 Q320 274 574 202 L620 238 H20 Z',
            labelX: 320,
            labelY: 232,
          },
        ],
      },
      {
        levelId: 'first-gallery',
        regions: [
          {
            regionId: 'grand-first-gallery-center',
            zone: 'A',
            path: 'M198 100 Q320 174 442 100 L464 144 Q320 226 176 144 Z',
            labelX: 320,
            labelY: 158,
          },
          {
            regionId: 'grand-first-gallery-left-arm',
            zone: 'B',
            path: 'M48 46 Q96 112 176 144 L150 192 Q60 156 18 78 Z',
            labelX: 54,
            labelY: 128,
          },
          {
            regionId: 'grand-first-gallery-right-arm',
            zone: 'B',
            path: 'M592 46 Q544 112 464 144 L490 192 Q580 156 622 78 Z',
            labelX: 586,
            labelY: 128,
          },
          {
            regionId: 'grand-first-gallery-box-left',
            zone: 'BOX',
            path: 'M104 24 H168 L160 76 H94 Z M174 36 H228 L220 88 H166 Z',
            labelX: 174,
            labelY: 54,
          },
          {
            regionId: 'grand-first-gallery-box-right',
            zone: 'BOX',
            path: 'M412 36 H466 L474 88 H420 Z M472 24 H536 L546 76 H480 Z',
            labelX: 466,
            labelY: 54,
          },
        ],
      },
      {
        levelId: 'upper-gallery',
        regions: [
          {
            regionId: 'grand-upper-gallery-center',
            zone: 'C',
            path: 'M162 110 Q320 204 478 110 L504 158 Q320 260 136 158 Z',
            labelX: 320,
            labelY: 176,
          },
          {
            regionId: 'grand-upper-gallery-left-arm',
            zone: 'C',
            path: 'M34 44 Q74 108 136 158 L110 202 Q38 162 8 76 Z',
            labelX: 46,
            labelY: 128,
          },
          {
            regionId: 'grand-upper-gallery-right-arm',
            zone: 'C',
            path: 'M606 44 Q566 108 504 158 L530 202 Q602 162 632 76 Z',
            labelX: 594,
            labelY: 128,
          },
          {
            regionId: 'grand-upper-gallery-box-left',
            zone: 'BOX',
            path: 'M92 22 H152 L146 70 H84 Z',
            labelX: 118,
            labelY: 48,
          },
          {
            regionId: 'grand-upper-gallery-box-right',
            zone: 'BOX',
            path: 'M488 22 H548 L556 70 H494 Z',
            labelX: 522,
            labelY: 48,
          },
        ],
      },
    ],
  },
  'qingsui-opera-courtyard': {
    seatingPlanId: 'qingsui-opera-courtyard',
    levels: [
      {
        levelId: 'orchestra',
        stage: { x: 238, y: 16, width: 164, height: 30 },
        regions: [
          {
            regionId: 'opera-orchestra-center-front',
            zone: 'S',
            path: 'M278 58 H362 L380 116 H260 Z',
            labelX: 320,
            labelY: 86,
          },
          {
            regionId: 'opera-orchestra-center-rear',
            zone: 'A',
            path: 'M248 122 H392 L420 216 H220 Z',
            labelX: 320,
            labelY: 170,
          },
          {
            regionId: 'opera-orchestra-left-aisle',
            zone: 'B',
            path: 'M154 64 H242 L214 218 H126 Z',
            labelX: 178,
            labelY: 146,
          },
          {
            regionId: 'opera-orchestra-right-aisle',
            zone: 'B',
            path: 'M486 64 H398 L426 218 H514 Z',
            labelX: 462,
            labelY: 146,
          },
        ],
      },
      {
        levelId: 'first-gallery',
        regions: [
          {
            regionId: 'opera-first-gallery-center',
            zone: 'A',
            path: 'M220 96 Q320 146 420 96 L438 138 Q320 198 202 138 Z',
            labelX: 320,
            labelY: 144,
          },
          {
            regionId: 'opera-first-gallery-left-corridor',
            zone: 'B',
            path: 'M86 54 Q130 112 202 138 L178 184 Q96 150 56 82 Z',
            labelX: 92,
            labelY: 126,
          },
          {
            regionId: 'opera-first-gallery-right-corridor',
            zone: 'B',
            path: 'M554 54 Q510 112 438 138 L462 184 Q544 150 584 82 Z',
            labelX: 548,
            labelY: 126,
          },
        ],
      },
      {
        levelId: 'upper-gallery',
        regions: [
          {
            regionId: 'opera-upper-gallery-center',
            zone: 'C',
            path: 'M176 110 Q320 190 464 110 L488 158 Q320 242 152 158 Z',
            labelX: 320,
            labelY: 170,
          },
          {
            regionId: 'opera-upper-gallery-left',
            zone: 'C',
            path: 'M58 62 Q96 116 152 158 L130 198 Q64 166 32 88 Z',
            labelX: 70,
            labelY: 132,
          },
          {
            regionId: 'opera-upper-gallery-right',
            zone: 'C',
            path: 'M582 62 Q544 116 488 158 L510 198 Q576 166 608 88 Z',
            labelX: 570,
            labelY: 132,
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
