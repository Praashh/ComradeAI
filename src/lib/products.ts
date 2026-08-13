
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


export const PRODUCTS = {
  pro_monthly: {
    productId: "pdt_0NlJUgiO0mRJgX60OpFnT",
    plan: "pro" as const,
    label: "Pro Monthly",
  },
  pro_yearly: {
    productId: "pdt_0NlJpC60RGKtw5EfKq0ou",
    plan: "pro" as const,
    label: "Pro Yearly",
  },
} as const;


export function getPlanFromProductId(productId: string): PlanKey {
  for (const product of Object.values(PRODUCTS)) {
    if (product.productId === productId) {
      return product.plan;
    }
  }
  return "free";
}
