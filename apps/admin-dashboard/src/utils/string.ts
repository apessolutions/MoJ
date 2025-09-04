export const getInitials = (input: string): string =>
  input
    .split(' ')
    .map((n) => n?.[0] ?? '')
    .join('');

export const capitalize = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1);

export const capitalizeAll = (input: string): string => input.split(' ').map(capitalize).join(' ');