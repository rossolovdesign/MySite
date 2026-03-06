// Type definitions for the portfolio
export interface SanityAsset {
  _id: string
  url: string
}

export interface SanityImage {
  asset: SanityAsset
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanitySlug {
  current: string
}

