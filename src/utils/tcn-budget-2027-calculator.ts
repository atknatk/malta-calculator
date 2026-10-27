/**
 * TCN Budget 2027 Maliyet Hesaplayıcısı
 * Budget 2027 (26 Eki 2026) ile üçüncü ülke vatandaşları (TCN) için 1 Ocak
 * 2027'den itibaren gelen ek ücretler ve kaldırılan ücretsiz hizmetler.
 *
 * - Yeni work permit başvurusu: €600 → €800
 * - Yıllık €400 "infrastructure contribution" (yeni + yenileme, 18 yaş altı muaf)
 * - Yenileme ücreti €150 (Identità, değişiklik açıklanmadı)
 * - Ücretsiz toplu taşıma, atypical hours cheque ve (yeni kayıtlar için)
 *   ücretsiz kreş: yalnızca Maltalı, AB vatandaşı ve long-term resident
 * - Kategori B/B1 ehliyet: aylık €83 idari ücret (EU/EEA, long-term resident
 *   ve eşi, UK/Avustralya/BAE vatandaşı ve şoförlük işi muaf)
 *
 * Bütçe açıklamasıdır; uygulama yönetmelikleri (legal notice) bekleniyor.
 * Kaynak: Budget 2027 speech (finance.gov.mt), CSB Group, MaltaToday, TVM
 */

export const TCN_BUDGET_2027 = {
  PERMIT_APPLICATION_FEE_2026: 600,
  PERMIT_APPLICATION_FEE_2027: 800,
  PERMIT_RENEWAL_FEE: 150,
  INFRASTRUCTURE_CONTRIBUTION: 400, // yıllık, kişi başı
  DRIVING_LICENCE_MONTHLY_FEE: 83,
  ATYPICAL_CHEQUE_YEARLY: 150, // basında bildirilen tutar
  DEFAULT_TRANSPORT_MONTHLY: 33, // basında bildirilen aylık Tallinja tahmini
} as const;

export type ResidenceStatus = "tcn" | "longTermResident" | "euCitizen";
export type PermitAction = "new" | "renewal" | "none";

export interface TcnBudget2027Input {
  status: ResidenceStatus;
  /** 2027'de bu kişi için yapılacak work permit işlemi */
  permitAction: PermitAction;
  /** Hanede aynı işlemi yapacak 18+ yaş TCN sayısı (kendiniz dahil) */
  permitHolders: number;
  /** Toplu taşıma kullanıyor mu */
  usesPublicTransport: boolean;
  /** Ücretsiz olmazsa aylık ulaşım harcaması (EUR) */
  monthlyTransportCost: number;
  /** Maltada B/B1 ehliyetle araç kullanıyor mu */
  drives: boolean;
  /** Şoförlük işi veya UK/Avustralya/BAE vatandaşlığı muafiyeti */
  drivingExempt: boolean;
  /** Ehliyet ücretinin ödeneceği ay sayısı (1-12) */
  drivingMonths: number;
  /** Daha önce atypical hours cheque alıyor muydu */
  receivedAtypicalCheque: boolean;
  /** 2027'de kreşe yeni kaydedilecek çocuk sayısı */
  newChildcareChildren: number;
  /** Çocuk başı aylık özel kreş ücreti (EUR) */
  monthlyChildcareCost: number;
  /** Kreş kullanılacak ay sayısı (1-12) */
  childcareMonths: number;
}

export interface TcnCostItem {
  key:
    | "permit"
    | "renewal"
    | "infrastructure"
    | "transport"
    | "driving"
    | "atypical"
    | "childcare";
  label: string;
  /** 2027'de ödenecek yıllık tutar (EUR) */
  cost: number;
  /** 2026'ya göre yıllık ek maliyet (EUR) */
  extraCost: number;
  /** Çoğunlukla kim öder */
  paidBy: "employer" | "worker" | "household";
  note: string;
}

export interface TcnBudget2027Result {
  affected: boolean;
  reason?: string;
  items: TcnCostItem[];
  /** Listelenen kalemlerin 2027 toplamı (EUR/yıl) */
  totalYearly: number;
  totalMonthly: number;
  /** 2026'ya göre fark (EUR/yıl) */
  totalExtraYearly: number;
  totalExtraMonthly: number;
  /** İşverenin tipik olarak üstlendiği kısım (başvuru ücreti) */
  employerShare: number;
  /** Çalışan/hanenin üstlendiği kısım */
  householdShare: number;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** 2026'da ücretsiz olan kalemler: 2027 tutarının tamamı ek maliyettir */
function sameCost(amount: number): { cost: number; extraCost: number } {
  return { cost: amount, extraCost: amount };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Budget 2027 ile bir TCN hanesinin 2027'deki ek yıllık maliyetini hesaplar
 */
export function calculateTcnBudget2027(
  input: TcnBudget2027Input,
): TcnBudget2027Result {
  const empty = {
    items: [],
    totalYearly: 0,
    totalMonthly: 0,
    totalExtraYearly: 0,
    totalExtraMonthly: 0,
    employerShare: 0,
    householdShare: 0,
  };

  if (input.status === "euCitizen") {
    return {
      ...empty,
      affected: false,
      reason:
        "EU/EEA citizens do not need a work permit and keep free public transport, childcare and the atypical hours cheque.",
    };
  }
  if (input.status === "longTermResident") {
    return {
      ...empty,
      affected: false,
      reason:
        "Long-term residents keep free public transport, childcare and the atypical hours cheque, and are exempt from the €83 driving licence fee.",
    };
  }

  const c = TCN_BUDGET_2027;
  const holders = Math.round(clamp(input.permitHolders, 0, 10));
  const items: TcnCostItem[] = [];

  if (input.permitAction !== "none" && holders > 0) {
    if (input.permitAction === "new") {
      items.push({
        key: "permit",
        label: "Work permit application fee",
        cost: c.PERMIT_APPLICATION_FEE_2027 * holders,
        extraCost:
          (c.PERMIT_APPLICATION_FEE_2027 - c.PERMIT_APPLICATION_FEE_2026) *
          holders,
        paidBy: "employer",
        note: `€${c.PERMIT_APPLICATION_FEE_2027} per new application (was €${c.PERMIT_APPLICATION_FEE_2026})`,
      });
    } else {
      items.push({
        key: "renewal",
        label: "Single permit renewal fee",
        cost: c.PERMIT_RENEWAL_FEE * holders,
        extraCost: 0,
        paidBy: "employer",
        note: `€${c.PERMIT_RENEWAL_FEE} per renewal (unchanged)`,
      });
    }
    items.push({
      key: "infrastructure",
      label: "Annual infrastructure contribution",
      cost: c.INFRASTRUCTURE_CONTRIBUTION * holders,
      extraCost: c.INFRASTRUCTURE_CONTRIBUTION * holders,
      paidBy: "worker",
      note: `€${c.INFRASTRUCTURE_CONTRIBUTION} per person per year, on new applications and renewals (under-18s exempt)`,
    });
  }

  if (input.usesPublicTransport) {
    items.push({
      key: "transport",
      label: "Public transport no longer free",
      ...sameCost(round2(clamp(input.monthlyTransportCost, 0, 500) * 12)),
      paidBy: "worker",
      note: "Free Tallinja travel limited to Maltese, EU citizens and long-term residents",
    });
  }

  if (input.drives && !input.drivingExempt) {
    const months = Math.round(clamp(input.drivingMonths, 0, 12));
    items.push({
      key: "driving",
      label: "Driving licence administrative fee (Cat B/B1)",
      ...sameCost(c.DRIVING_LICENCE_MONTHLY_FEE * months),
      paidBy: "worker",
      note: `€${c.DRIVING_LICENCE_MONTHLY_FEE}/month on licences issued or renewed from 2027`,
    });
  }

  if (input.receivedAtypicalCheque) {
    items.push({
      key: "atypical",
      label: "Atypical working hours cheque lost",
      ...sameCost(c.ATYPICAL_CHEQUE_YEARLY),
      paidBy: "worker",
      note: "Cheque no longer paid to TCNs without long-term residence",
    });
  }

  const children = Math.round(clamp(input.newChildcareChildren, 0, 6));
  if (children > 0) {
    const months = Math.round(clamp(input.childcareMonths, 0, 12));
    items.push({
      key: "childcare",
      label: "Free childcare not available (new registrations)",
      ...sameCost(
        round2(clamp(input.monthlyChildcareCost, 0, 3000) * months * children),
      ),
      paidBy: "household",
      note: "Children already enrolled keep free childcare while they remain eligible",
    });
  }

  const sum = (list: TcnCostItem[], field: "cost" | "extraCost"): number =>
    round2(list.reduce((total, item) => total + item[field], 0));
  const totalYearly = sum(items, "cost");
  const totalExtraYearly = sum(items, "extraCost");
  const employerShare = sum(
    items.filter((i) => i.paidBy === "employer"),
    "cost",
  );

  return {
    affected: true,
    items,
    totalYearly,
    totalMonthly: round2(totalYearly / 12),
    totalExtraYearly,
    totalExtraMonthly: round2(totalExtraYearly / 12),
    employerShare,
    householdShare: round2(totalYearly - employerShare),
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
