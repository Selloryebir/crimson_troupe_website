import type { LocalizationPackage, LocalizedShape } from '../schema.ts';
import { yanArchiveProjection } from './archive-projection.ts';
import { yanMessages } from './messages.ts';
import { yanPrograms } from './programs.ts';
import { yanProductions } from './productions/index.ts';
import { yanSite } from './site.ts';

export type WebsiteLocalizationPackage = LocalizationPackage<
  LocalizedShape<typeof yanSite>,
  LocalizedShape<typeof yanMessages>
>;

export const yanLocalizationPackage = {
  site: yanSite,
  programs: { ...yanPrograms, productions: yanProductions },
  messages: yanMessages,
  archiveProjection: yanArchiveProjection,
} satisfies WebsiteLocalizationPackage;
