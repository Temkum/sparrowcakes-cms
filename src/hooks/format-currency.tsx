import { useCallback } from 'react';

/**
 * Custom hook that returns a function to format currency
 * @returns Function to format currency
 */
export const useFormatCurrency = () => {
  return useCallback((amount: number, currency: string = 'XAF'): string => {
    const localeMap: Record<string, string> = {
      XAF: 'fr-FR', // Franc CFA BEAC
      USD: 'en-US',
      EUR: 'fr-FR',
      GBP: 'en-GB',
      XOF: 'fr-FR', // Franc CFA BCEAO
    };

    try {
      const locale = localeMap[currency] || 'en';

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'symbol',
      }).format(amount);
    } catch (error) {
      console.error('Failed to format currency:', error);
      return `${amount.toFixed(2)} ${currency}`;
    }
  }, []);
};
