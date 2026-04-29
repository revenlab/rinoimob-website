import type { PublicPropertySummary, PublicPropertyDetail, PageResponse, PublicLeadRequest } from '~/types/property'

export const usePublicApi = () => {
  const config = useRuntimeConfig()
  const API_BASE = `${config.public.apiUrl.replace(/\/$/, '')}/api/v1/public`

  const getHeaders = (tenantSlug: string) => ({
    'X-Tenant-Slug': tenantSlug,
  })

  const listProperties = async (
    tenantSlug: string,
    params: { page?: number; size?: number; operation?: string; propertyType?: string; maxPrice?: string | number; city?: string } = {}
  ): Promise<PageResponse<PublicPropertySummary>> => {
    const query = new URLSearchParams()
    if (params.page != null) query.set('page', String(params.page))
    if (params.size != null) query.set('size', String(params.size))
    if (params.operation) query.set('operation', params.operation)
    if (params.propertyType) query.set('propertyType', params.propertyType)
    if (params.maxPrice) query.set('maxPrice', String(params.maxPrice))
    if (params.city) query.set('city', params.city)
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

  const createLead = async (tenantSlug: string, data: PublicLeadRequest): Promise<void> => {
    return $fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(tenantSlug),
      body: data,
    })
  }

  return { listProperties, getProperty, createLead }
}
