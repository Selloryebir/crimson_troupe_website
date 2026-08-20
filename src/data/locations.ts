export const locations = {
  trimount: { locationId: 'trimount' },
  wiesheim: { locationId: 'wiesheim' },
  norport: { locationId: 'norport' },
  linqu: { locationId: 'linqu' },
  qingsui: { locationId: 'qingsui' },
  jiangdu: { locationId: 'jiangdu' },
} as const;

export type LocationId = keyof typeof locations;
