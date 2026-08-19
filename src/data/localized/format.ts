export function formatMessage(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replaceAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (token, key: string) => {
    const value = values[key];
    return value === undefined ? token : String(value);
  });
}
