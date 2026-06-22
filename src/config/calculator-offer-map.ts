/**
 * Hangi hesaplayıcı → hangi affiliate offer(lar).
 *
 * Contextual eşleştirme: her hesaplayıcının doğal "bir sonraki adımı".
 * <AffiliateCard> bu listedeki ilk AKTİF offer'ı gösterir (offer'lar
 * affiliate-offers.ts içinde `active:false` olduğu sürece hiçbir şey çıkmaz).
 *
 * Yerleşim kuralı (docs/MONETIZATION_PLAN.md): sayfa başına tek offer,
 * sonuç bloğunun altında, asla hesaplama akışının ortasında değil.
 */

export const CALCULATOR_OFFERS: Record<string, string[]> = {
  // Salary / expat / döviz → Wise
  salary: ["wise"],
  "expatriate-tax": ["wise"],
  "family-reunification": ["wise"],
  "bonus-tax": ["wise"],

  // Yatırım / birikim / emeklilik → broker
  "savings-interest": ["etoro", "xtb"],
  pension: ["etoro", "xtb"],
  "retirement-age": ["etoro", "xtb"],

  // Günlük bankacılık / kredi → Revolut
  mortgage: ["revolut"],
  "personal-loan": ["revolut"],
  "vehicle-finance": ["revolut"],

  // Banka faizi → broker (mevduat alternatifi)
  "bank-interest-tax": ["etoro", "xtb"],

  // Banka oran kıyaslama sayfaları
  "malta-savings-rates": ["etoro", "xtb"],
  "malta-mortgage-rates": ["revolut"],
};
