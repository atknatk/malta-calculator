
// utils/formatCurrency.js

/**
 * Para formatlama işlevi
 * @param {number} amount - Formatlanacak miktar
 * @param {string} locale - Dil/ülke kodu (varsayılan: 'tr-TR')
 * @param {string} currency - Para birimi (varsayılan: 'TRY')
 * @returns {string} - Formatlanmış para değeri
 */
export function FormatCurrency(amount: number, locale = 'mt-MT', currency = 'EUR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}
