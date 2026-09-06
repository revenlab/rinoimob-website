import type { PublicBrokerProfile, PublicPropertySummary, PublicPropertyDetail, PublicPropertyType, PageResponse, PublicLeadRequest } from '~/types/property'
import type { PublicBlogPost, PublicBlogPostSummary } from '~/types/blog'

export const usePublicApi = () => {
  const config = useRuntimeConfig()
  const API_BASE = process.server
    ? `${config.apiInternalUrl.replace(/\/$/, '')}/api/v1/public`
    : '/api/v1/public'

  const getHeaders = (tenantSlug: string) => ({
    'X-Tenant-Slug': tenantSlug,
  })

  const listProperties = async (
    tenantSlug: string,
    params: {
      page?: number
      size?: number
      operation?: string
      propertyType?: string
      categorySlug?: string
      featured?: boolean
      q?: string
      minPrice?: string | number
      maxPrice?: string | number
      bedrooms?: string | number
      city?: string
      latitude?: string | number
      longitude?: string | number
      radiusKm?: string | number
    } = {}
  ): Promise<PageResponse<PublicPropertySummary>> => {
    const query = new URLSearchParams()
    if (params.page != null) query.set('page', String(params.page))
    if (params.size != null) query.set('size', String(params.size))
    if (params.operation) query.set('operation', params.operation)
    if (params.propertyType) query.set('propertyType', params.propertyType)
    if (params.categorySlug) query.set('categorySlug', params.categorySlug)
    if (params.featured != null) query.set('featured', String(params.featured))
    if (params.q) query.set('q', params.q)
    if (params.minPrice != null && params.minPrice !== '') query.set('minPrice', String(params.minPrice))
    if (params.maxPrice) query.set('maxPrice', String(params.maxPrice))
    if (params.bedrooms != null && params.bedrooms !== '') query.set('bedrooms', String(params.bedrooms))
    if (params.city) query.set('city', params.city)
    if (params.latitude != null && params.latitude !== '') query.set('latitude', String(params.latitude))
    if (params.longitude != null && params.longitude !== '') query.set('longitude', String(params.longitude))
    if (params.radiusKm != null && params.radiusKm !== '') query.set('radiusKm', String(params.radiusKm))
    const qs = query.toString()
    return $fetch(`${API_BASE}/properties${qs ? `?${qs}` : ''}`, {
      headers: getHeaders(tenantSlug),
    })
  }

  const getProperty = async (tenantSlug: string, id: string): Promise<PublicPropertyDetail> => {
    return $fetch(`${API_BASE}/properties/${id}`, {
      headers: getHeaders(tenantSlug),
    })
  }

  const listPropertyTypes = async (tenantSlug: string): Promise<PublicPropertyType[]> => {
    return $fetch(`${API_BASE}/property-types`, {
      headers: getHeaders(tenantSlug),
    })
  }

  const getBrokerProfile = async (tenantSlug: string, slug: string): Promise<PublicBrokerProfile> => {
    return $fetch(`${API_BASE}/brokers/${encodeURIComponent(slug)}`, { headers: getHeaders(tenantSlug) })
  }

  const listBrokerProperties = async (tenantSlug: string, slug: string): Promise<PageResponse<PublicPropertySummary>> => {
    return $fetch(`${API_BASE}/brokers/${encodeURIComponent(slug)}/properties`, { headers: getHeaders(tenantSlug) })
  }

  const createLead = async (tenantSlug: string, data: PublicLeadRequest): Promise<void> => {
    return $fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(tenantSlug),
      body: data,
    })
  }

  const listBlogPosts = async (
    tenantSlug: string,
    params: { page?: number; size?: number } = {}
  ): Promise<PageResponse<PublicBlogPostSummary>> => {
    const query = new URLSearchParams()
    if (params.page != null) query.set('page', String(params.page))
    if (params.size != null) query.set('size', String(params.size))
    const qs = query.toString()
    return $fetch(`${API_BASE}/blog-posts${qs ? `?${qs}` : ''}`, {
      headers: getHeaders(tenantSlug),
    })
  }

  const getBlogPost = async (tenantSlug: string, slug: string): Promise<PublicBlogPost> => {
    return $fetch(`${API_BASE}/blog-posts/${slug}`, {
      headers: getHeaders(tenantSlug),
    })
  }

  return { listProperties, getProperty, listPropertyTypes, getBrokerProfile, listBrokerProperties, createLead, listBlogPosts, getBlogPost }
}
