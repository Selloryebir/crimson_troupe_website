import type { TicketZone } from './performances.ts';

export type SeatingPlanId =
  'trimount-grand-fan' | 'wiesheim-mirror-horseshoe' | 'norport-platform-linear';

export interface SeatingPlanZoneShape {
  zone: TicketZone;
  paths: readonly string[];
  labelX: number;
  labelY: number;
}

export interface SeatingPlanDefinition {
  seatingPlanId: SeatingPlanId;
  stage: { x: number; y: number; width: number; height: number };
  zones: readonly SeatingPlanZoneShape[];
}

export const ticketSeatingPlans = {
  'trimount-grand-fan': {
    seatingPlanId: 'trimount-grand-fan',
    stage: { x: 220, y: 24, width: 200, height: 50 },
    zones: [
      {
        zone: 'C',
        paths: ['M100 250 Q320 350 540 250 L500 220 Q320 290 140 220 Z'],
        labelX: 320,
        labelY: 275,
      },
      {
        zone: 'B',
        paths: ['M140 220 Q320 290 500 220 L470 185 Q320 235 170 185 Z'],
        labelX: 320,
        labelY: 225,
      },
      {
        zone: 'A',
        paths: ['M170 185 Q320 235 470 185 L450 145 Q320 180 190 145 Z'],
        labelX: 320,
        labelY: 181,
      },
      {
        zone: 'S',
        paths: ['M190 145 Q320 180 450 145 L430 105 Q320 130 210 105 Z'],
        labelX: 320,
        labelY: 133,
      },
      {
        zone: 'BOX',
        paths: ['M62 108 H130 L145 214 H70 Z', 'M510 108 H578 L570 214 H495 Z'],
        labelX: 535,
        labelY: 158,
      },
    ],
  },
  'wiesheim-mirror-horseshoe': {
    seatingPlanId: 'wiesheim-mirror-horseshoe',
    stage: { x: 230, y: 22, width: 180, height: 46 },
    zones: [
      {
        zone: 'C',
        paths: [
          'M90 88 H550 V268 Q550 332 486 332 H154 Q90 332 90 268 Z M145 116 H495 V260 Q495 282 473 282 H167 Q145 282 145 260 Z',
        ],
        labelX: 320,
        labelY: 309,
      },
      {
        zone: 'B',
        paths: [
          'M145 116 H495 V260 Q495 282 473 282 H167 Q145 282 145 260 Z M194 142 H446 V246 Q446 254 438 254 H202 Q194 254 194 246 Z',
        ],
        labelX: 320,
        labelY: 268,
      },
      {
        zone: 'A',
        paths: ['M194 142 H446 V246 Q446 254 438 254 H202 Q194 254 194 246 Z'],
        labelX: 320,
        labelY: 222,
      },
      {
        zone: 'S',
        paths: ['M238 94 H402 V176 H238 Z'],
        labelX: 320,
        labelY: 133,
      },
      {
        zone: 'BOX',
        paths: ['M104 112 H155 V225 H104 Z', 'M485 112 H536 V225 H485 Z'],
        labelX: 510,
        labelY: 164,
      },
    ],
  },
  'norport-platform-linear': {
    seatingPlanId: 'norport-platform-linear',
    stage: { x: 24, y: 66, width: 96, height: 228 },
    zones: [
      { zone: 'S', paths: ['M148 72 H248 V288 H148 Z'], labelX: 198, labelY: 180 },
      { zone: 'A', paths: ['M262 72 H362 V288 H262 Z'], labelX: 312, labelY: 180 },
      { zone: 'B', paths: ['M376 72 H476 V288 H376 Z'], labelX: 426, labelY: 180 },
      { zone: 'C', paths: ['M490 72 H610 V288 H490 Z'], labelX: 550, labelY: 180 },
    ],
  },
} as const satisfies Record<SeatingPlanId, SeatingPlanDefinition>;

export function getRegisteredTicketSeatingPlan(
  seatingPlanId: SeatingPlanId,
): SeatingPlanDefinition {
  return ticketSeatingPlans[seatingPlanId];
}
