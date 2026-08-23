import type { BuildEditionId } from '../editions.ts';
import { columbiaLocalizationPackage } from './columbia/index.ts';
import { higashiLocalizationPackage } from './higashi/index.ts';
import { kazimierzLocalizationPackage } from './kazimierz/index.ts';
import { leithanienLocalizationPackage } from './leithanien/index.ts';
import { minosLocalizationPackage } from './minos/index.ts';
import type { LocalizationAuthoringPackage } from './schema.ts';
import { siracusaLocalizationPackage } from './siracusa/index.ts';
import { ursusLocalizationPackage } from './ursus/index.ts';
import { victoriaLocalizationPackage } from './victoria/index.ts';
import { yanLocalizationPackage, type WebsiteLocalizationPackage } from './yan/index.ts';

export type PartialLocalizationPackage = LocalizationAuthoringPackage<
  WebsiteLocalizationPackage['site'],
  WebsiteLocalizationPackage['messages']
>;

export const sourceLocalizationPackage = yanLocalizationPackage;

export const localizationPackages: Record<BuildEditionId, PartialLocalizationPackage> = {
  yan: yanLocalizationPackage,
  victoria: victoriaLocalizationPackage,
  ursus: ursusLocalizationPackage,
  siracusa: siracusaLocalizationPackage,
  minos: minosLocalizationPackage,
  leithanien: leithanienLocalizationPackage,
  kazimierz: kazimierzLocalizationPackage,
  higashi: higashiLocalizationPackage,
  columbia: columbiaLocalizationPackage,
};
