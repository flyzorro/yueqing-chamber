export const INFO_CATEGORIES = {
  PRODUCT: 'product',
  TECHNOLOGY: 'technology',
  MARKET: 'market',
  FINANCE: 'finance',
  TALENT: 'talent',
  POLICY: 'policy',
  OTHER: 'other',
} as const

export type InfoCategory = typeof INFO_CATEGORIES[keyof typeof INFO_CATEGORIES]

export const VALID_CATEGORIES = Object.values(INFO_CATEGORIES)
