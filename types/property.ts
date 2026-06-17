export type PropertyOperation = 'SALE' | 'RENT' | 'SEASONAL'
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'RURAL'
export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'ARCHIVED'
export type PropertyVideoSource = 'UPLOAD' | 'YOUTUBE'

export interface PublicPropertyType {
  id: string
  code: PropertyType
  label: string
  position: number
  active: boolean
  cardColor: string | null
  coverImageUrl: string | null
}

export const DEFAULT_PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: 'Casa',
  APARTMENT: 'Apartamento',
  LAND: 'Terreno',
  COMMERCIAL: 'Comercial',
  RURAL: 'Rural',
}

export const DEFAULT_PROPERTY_TYPES: PublicPropertyType[] = Object.entries(DEFAULT_PROPERTY_TYPE_LABELS).map(([code, label], index) => ({
  id: code,
  code: code as PropertyType,
  label,
  position: (index + 1) * 10,
  active: true,
  cardColor: null,
  coverImageUrl: null,
}))

export function propertyTypeLabel(code: PropertyType | string, types: PublicPropertyType[] = DEFAULT_PROPERTY_TYPES): string {
  return types.find(type => type.code === code)?.label ?? DEFAULT_PROPERTY_TYPE_LABELS[code as PropertyType] ?? code
}

export interface PublicPropertySummary {
  id: string
  title: string
  operation: PropertyOperation
  propertyType: PropertyType
  status: PropertyStatus
  price: number | null
  currency: string
  areaTotal: number | null
  bedrooms: number | null
  bathrooms: number | null
  parking: number | null
  addressCity: string | null
  addressState: string | null
  coverPhotoUrl: string | null
}

export interface PublicPropertyDetail extends PublicPropertySummary {
  description: string | null
  suites: number | null
  areaUseful: number | null
  addressStreet: string | null
  addressNeighborhood: string | null
  addressZip: string | null
  lat: number | null
  lng: number | null
  photos: PublicPhoto[]
  floorPlans: PublicFloorPlan[]
  videos: PublicPropertyVideo[]
  amenities: PublicAmenity[]
  categories: PublicCategory[]
}

export interface PublicPhoto {
  id: string
  url: string
  position: number
  isCover: boolean
  altText: string | null
}

export interface PublicFloorPlanPhoto {
  id: string
  url: string
  position: number | null
  isCover: boolean | null
}

export interface PublicFloorPlan {
  id: string
  name: string
  area: number | null
  photos: PublicFloorPlanPhoto[]
}

export interface PublicPropertyVideo {
  id: string
  source: PropertyVideoSource
  url: string
  youtubeVideoId: string | null
  title: string | null
  position: number | null
}

export interface PublicAmenity {
  id: string
  name: string
}

export interface PublicCategory {
  id: string
  name: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface PublicLeadRequest {
  name: string
  email?: string
  phone?: string
  message?: string
  propertyId?: string
  source?: string
}
