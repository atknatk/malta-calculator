
// utils/formatCurrency.js
/**
 * Para formatlama işlevi
 * @param {number} amount - Formatlanacak miktar
 * @param {string} locale - Dil/ülke kodu (varsayılan: 'tr-TR')
 * @returns {string} - Formatlanmış para değeri (para birimi olmadan)
 */
export function formatMoney(amount: number, locale = 'mt-MT') {
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}