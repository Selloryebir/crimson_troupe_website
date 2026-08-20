import type { WebsiteLocalizationPackage } from '../yan/index.ts';
import { columbiaMessages } from './messages.ts';
import { columbiaPrograms } from './programs.ts';
import { columbiaSite } from './site.ts';

export const columbiaLocalizationPackage = {
  site: columbiaSite,
  programs: columbiaPrograms,
  messages: columbiaMessages,
} satisfies WebsiteLocalizationPackage;
