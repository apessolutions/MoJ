export type FCurrencyOptions = Intl.NumberFormatOptions | undefined;
export const fCurrency = (value: number, currency: string, options?: FCurrencyOptions) => {
  const fm = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);

  return fm;
};
