import type { EditionId } from './editions.ts';

export interface Location {
  locationId: string;
  countryEditionId: EditionId;
}

export const locations = {
  trimount: { locationId: 'trimount', countryEditionId: 'columbia' },
  wiesheim: { locationId: 'wiesheim', countryEditionId: 'leithanien' },
  norport: { locationId: 'norport', countryEditionId: 'victoria' },
  linqu: { locationId: 'linqu', countryEditionId: 'yan' },
  qingsui: { locationId: 'qingsui', countryEditionId: 'yan' },
  jiangdu: { locationId: 'jiangdu', countryEditionId: 'yan' },
  zwillingsturme: { locationId: 'zwillingsturme', countryEditionId: 'leithanien' },
  londinium: { locationId: 'londinium', countryEditionId: 'victoria' },
  'calais-blason': { locationId: 'calais-blason', countryEditionId: 'victoria' },
  montelupe: { locationId: 'montelupe', countryEditionId: 'siracusa' },
  'nuova-volsinii': { locationId: 'nuova-volsinii', countryEditionId: 'siracusa' },
} as const satisfies Record<string, Location>;

export type LocationId = keyof typeof locations;
