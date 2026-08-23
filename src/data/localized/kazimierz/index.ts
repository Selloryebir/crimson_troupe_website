import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { kazimierzArchiveProjection } from './archive-projection.ts';
import { kazimierzMessages } from './messages.ts';
import { kazimierzPrograms } from './programs.ts';
import { kazimierzProductions } from './productions/index.ts';
import { kazimierzSite } from './site.ts';

export const kazimierzLocalizationPackage = {
  site: kazimierzSite,
  programs: { ...kazimierzPrograms, productions: kazimierzProductions },
  messages: kazimierzMessages,
  archiveProjection: kazimierzArchiveProjection,
} satisfies WebsiteLocalizationPackage;
