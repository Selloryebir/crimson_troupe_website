import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { minosArchiveProjection } from './archive-projection.ts';
import { minosMessages } from './messages.ts';
import { minosPrograms } from './programs.ts';
import { minosProductions } from './productions/index.ts';
import { minosSite } from './site.ts';

export const minosLocalizationPackage = {
  site: minosSite,
  programs: { ...minosPrograms, productions: minosProductions },
  messages: minosMessages,
  archiveProjection: minosArchiveProjection,
} satisfies WebsiteLocalizationPackage;
