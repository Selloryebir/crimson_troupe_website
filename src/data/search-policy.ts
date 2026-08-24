import type { BuildEditionId } from './editions.ts';

const minimumQueryGraphemes = {
  yan: 2,
  victoria: 3,
  ursus: 3,
  siracusa: 3,
  minos: 3,
  leithanien: 3,
  kazimierz: 3,
  higashi: 2,
  columbia: 3,
} as const satisfies Record<BuildEditionId, number>;

export function getMinimumSearchGraphemes(editionId: BuildEditionId): number {
  return minimumQueryGraphemes[editionId];
}
