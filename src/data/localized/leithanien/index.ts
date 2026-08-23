import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { leithanienArchiveProjection } from './archive-projection.ts';
import { leithanienMessages } from './messages.ts';
import { leithanienPrograms } from './programs.ts';
import { leithanienProductions } from './productions/index.ts';
import { leithanienSite } from './site.ts';

export const leithanienLocalizationPackage = {
  site: leithanienSite,
  programs: { ...leithanienPrograms, productions: leithanienProductions },
  messages: leithanienMessages,
  archiveProjection: leithanienArchiveProjection,
} satisfies WebsiteLocalizationPackage;
