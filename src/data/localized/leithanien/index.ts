import type { WebsiteLocalizationAuthoringPackage } from '../yan/index.ts';
import { leithanienArchiveProjection } from './archive-projection.ts';
import { leithanienMessages, leithanienTicketingPlatforms } from './messages.ts';
import { leithanienPrograms } from './programs.ts';
import { leithanienProductions } from './productions/index.ts';
import { leithanienSite } from './site.ts';

export const leithanienLocalizationPackage = {
  site: leithanienSite,
  programs: { ...leithanienPrograms, productions: leithanienProductions },
  messages: leithanienMessages,
  platforms: leithanienTicketingPlatforms,
  archiveProjection: leithanienArchiveProjection,
} satisfies WebsiteLocalizationAuthoringPackage;
