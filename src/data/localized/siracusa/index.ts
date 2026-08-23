import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { siracusaArchiveProjection } from './archive-projection.ts';
import { siracusaMessages } from './messages.ts';
import { siracusaPrograms } from './programs.ts';
import { siracusaProductions } from './productions/index.ts';
import { siracusaSite } from './site.ts';

export const siracusaLocalizationPackage = {
  site: siracusaSite,
  programs: { ...siracusaPrograms, productions: siracusaProductions },
  messages: siracusaMessages,
  archiveProjection: siracusaArchiveProjection,
} satisfies WebsiteLocalizationPackage;
