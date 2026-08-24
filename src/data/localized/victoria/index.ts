import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { victoriaArchiveProjection } from './archive-projection.ts';
import { victoriaMessages } from './messages.ts';
import { victoriaPrograms } from './programs.ts';
import { victoriaProductions } from './productions/index.ts';
import { victoriaSite } from './site.ts';

export const victoriaLocalizationPackage = {
  site: victoriaSite,
  programs: { ...victoriaPrograms, productions: victoriaProductions },
  messages: victoriaMessages,
  archiveProjection: victoriaArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;
