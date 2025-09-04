export function firstCharCapitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatShortName(name: string) {
  return name.replace(/\s+/g, '').toUpperCase();
}
export function CharCapitalize(str: string) {
  return str.toUpperCase();
}

export function charSubStr(str: string, end: number) {
  return str.substring(0, end);
}

// ----------------------------------------------------------------------

export function paramCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ----------------------------------------------------------------------

export function snakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ----------------------------------------------------------------------

export function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
