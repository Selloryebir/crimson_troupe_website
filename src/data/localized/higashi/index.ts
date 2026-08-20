import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { higashiMessages } from './messages.ts';
import { higashiProductions } from './productions/index.ts';
import { higashiPrograms } from './programs.ts';
import { higashiSite } from './site.ts';

export const higashiLocalizationPackage = {
  site: higashiSite,
  programs: { ...higashiPrograms, productions: higashiProductions },
  messages: higashiMessages,
} satisfies WebsiteLocalizationPackage;
