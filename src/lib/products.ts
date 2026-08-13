/**
 * Centralized plan and product configuration for Dodo Payments.
 *
 * Replace the placeholder product IDs with your real Dodo Payments product IDs
 * from the dashboard: https://app.dodopayments.com
 */

export const PLANS = {
  free: {
    name: "Free",
    voiceQuotaSeconds: 300, // 5 minutes
  },
  pro: {
    name: "Pro",
    voiceQuotaSeconds: 108_000, // 30 hours
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/**
 * Map of Dodo Payments product IDs to app plan names.
 * Update these with your real product IDs from the Dodo Payments dashboard.
 */
export const PRODUCTS = {
  pro_monthly: {
    productId: "pdt_pro_monthly", // TODO: Replace with real product ID
    plan: "pro" as const,
    label: "Pro Monthly",
  },
  pro_yearly: {
    productId: "pdt_pro_yearly", // TODO: Replace with real product ID
    plan: "pro" as const,
    label: "Pro Yearly",
  },
} as const;

/**
 * Reverse lookup: given a Dodo product ID, return the plan key.
 */
export function getPlanFromProductId(productId: string): PlanKey {
  for (const product of Object.values(PRODUCTS)) {
    if (product.productId === productId) {
      return product.plan;
    }
  }
  return "free";
}
