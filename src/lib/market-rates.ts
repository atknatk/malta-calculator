import { MARKET_CONTEXT } from "@/config/bank-products";

/**
 * Canlı ECB MIR (Malta) piyasa-ortalaması — build-time fetch.
 *
 * GÜVENLİK: `cache: "force-cache"` ile build anında bir kez çekilir ve statik
 * sayfaya gömülür (force-static korunur). Herhangi bir hata / erişilemezlik
 * durumunda `MARKET_CONTEXT` içindeki KAYNAKLI STATİK değere düşer — yani
 * build asla kırılmaz, en kötü ihtimalle elle güncellenen sabiti gösterir.
 */

const ECB_BASE = "https://data-api.ecb.europa.eu/service/data/MIR";

async function fetchEcbSeries(
  series: string,
): Promise<{ value: number; period: string } | null> {
  try {
    const res = await fetch(
      `${ECB_BASE}/${series}?lastNObservations=1&format=csvdata`,
      { cache: "force-cache" },
    );
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;
    const header = lines[0].split(",");
    const vIdx = header.indexOf("OBS_VALUE");
    const tIdx = header.indexOf("TIME_PERIOD");
    if (vIdx < 0 || tIdx < 0) return null;
    const cells = lines[lines.length - 1].split(",");
    const value = parseFloat(cells[vIdx]);
    const period = cells[tIdx]?.trim();
    if (!Number.isFinite(value) || !period) return null;
    return { value, period };
  } catch {
    return null;
  }
}

/**
 * Her iki seriyi (konut kredisi maliyeti + hanehalkı mevduat) çeker.
 * Etiket/URL her zaman statik sabitten gelir; sadece value/period canlıysa
 * üzerine yazılır.
 */
export async function getMarketContext() {
  const [mortgage, deposit] = await Promise.all([
    fetchEcbSeries("M.MT.B.A2C.AM.R.A.2250.EUR.N"),
    fetchEcbSeries("M.MT.B.L22.A.R.A.2250.EUR.N"),
  ]);
  return {
    mortgageBorrowingCost: {
      ...MARKET_CONTEXT.mortgageBorrowingCost,
      ...(mortgage ?? {}),
    },
    householdDepositRate: {
      ...MARKET_CONTEXT.householdDepositRate,
      ...(deposit ?? {}),
    },
  };
}
