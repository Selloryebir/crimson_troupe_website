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

export function formatTerraDateTime(value: TerraDateTime, locale: string): string {
  const [hour, minute] = value.time.split(':').map(Number);
  const referenceDate = new Date(Date.UTC(2000, value.month - 1, value.day, hour, minute));
  const monthDay = new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(referenceDate);
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(referenceDate);
  return `${value.year} · ${monthDay} · ${time}`;
}
