import type { TerraDateTime } from '../performances.ts';

export function formatMessage(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replaceAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (token, key: string) => {
    const value = values[key];
    return value === undefined ? token : String(value);
  });
}

function formatTerraInteger(value: number, locale: string, minimumIntegerDigits = 1): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumIntegerDigits,
  }).format(value);
}

function formatDateParts(
  formatter: Intl.DateTimeFormat,
  referenceDate: Date,
  replacements: Readonly<Partial<Record<Intl.DateTimeFormatPartTypes, string>>>,
): string {
  return formatter
    .formatToParts(referenceDate)
    .map((part) => replacements[part.type] ?? part.value)
    .join('')
    .replaceAll('\u202f', ' ');
}

function safeReferenceDate(value: TerraDateTime, hour = 0, minute = 0): Date {
  return new Date(Date.UTC(2000, value.month - 1, 1, hour, minute));
}

export function formatTerraDate(value: TerraDateTime, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return formatDateParts(formatter, safeReferenceDate(value), {
    year: formatTerraInteger(value.year, locale),
    day: formatTerraInteger(value.day, locale),
  });
}

export function formatTerraDateTime(value: TerraDateTime, locale: string): string {
  const [hour, minute] = value.time.split(':').map(Number);
  const referenceDate = safeReferenceDate(value, hour, minute);
  const monthDayFormatter = new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  });
  const monthDay = formatDateParts(monthDayFormatter, referenceDate, {
    day: formatTerraInteger(value.day, locale, 2),
  });
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(referenceDate);
  return `${value.year} · ${monthDay} · ${time}`;
}

export function formatTicketTerraDateTime(value: TerraDateTime, locale: string): string {
  const [hour, minute] = value.time.split(':').map(Number);
  const referenceDate = safeReferenceDate(value, hour, minute);
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  });
  return formatDateParts(formatter, referenceDate, {
    year: formatTerraInteger(value.year, locale),
    day: formatTerraInteger(value.day, locale),
  });
}
