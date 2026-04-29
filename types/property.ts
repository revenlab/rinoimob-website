export type PropertyOperation = 'SALE' | 'RENT' | 'SEASONAL'
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'RURAL'
export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'ARCHIVED'

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
}
