import type {
  LocalizationAuthoringPackage,
  LocalizationPackage,
  LocalizedShape,
} from '../schema.ts';
import { yanArchiveProjection } from './archive-projection.ts';
import { yanMessages, yanTicketingPlatforms } from './messages.ts';
import { yanPrograms } from './programs.ts';
import { yanProductions } from './productions/index.ts';
import { yanSite } from './site.ts';

export type WebsiteLocalizationPackage = LocalizationPackage<
  LocalizedShape<typeof yanSite>,
  LocalizedShape<typeof yanMessages>
>;
export type WebsiteLocalizationAuthoringPackage = LocalizationAuthoringPackage<
  WebsiteLocalizationPackage['site'],
  WebsiteLocalizationPackage['messages']
>;

export const yanLocalizationPackage = {
  site: yanSite,
  programs: { ...yanPrograms, productions: yanProductions },
  messages: yanMessages,
  platforms: yanTicketingPlatforms,
  archiveProjection: yanArchiveProjection,
} satisfies WebsiteLocalizationPackage;
