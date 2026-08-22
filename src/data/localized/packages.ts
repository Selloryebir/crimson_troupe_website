import type { BuildEditionId } from '../editions.ts';
import { columbiaLocalizationPackage } from './columbia/index.ts';
import { higashiLocalizationPackage } from './higashi/index.ts';
import type { LocalizationAuthoringPackage } from './schema.ts';
import { yanLocalizationPackage, type WebsiteLocalizationPackage } from './yan/index.ts';

export type PartialLocalizationPackage = LocalizationAuthoringPackage<
  WebsiteLocalizationPackage['site'],
  WebsiteLocalizationPackage['messages']
>;

export const sourceLocalizationPackage = yanLocalizationPackage;

export const localizationPackages: Record<BuildEditionId, PartialLocalizationPackage> = {
  yan: yanLocalizationPackage,
  higashi: higashiLocalizationPackage,
  columbia: columbiaLocalizationPackage,
};
