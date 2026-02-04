import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// Plan configuration
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    employees: 2,
    payslipsPerMonth: 2,
    features: [
      "2 employees",
      "2 payslips/month",
      "Basic payslip template",
      "Malta Calculator branding",
    ],
  },
  basic: {
    name: "Basic",
    price: 4.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || "",
    employees: 10,
    payslipsPerMonth: 10,
    features: [
      "10 employees",
      "10 payslips/month",
      "Custom company logo",
      "No branding",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    employees: 100,
    payslipsPerMonth: 100,
    features: [
      "100 employees",
      "100 payslips/month",
      "Custom company logo",
      "No branding",
      "Priority support",
      "Bulk payslip generation",
      "Employee portal access",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
