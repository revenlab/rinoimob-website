import type { TenantWebsiteConfig } from '~/types/tenant'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

const mergeTenantConfig = (config?: Partial<TenantWebsiteConfig> | null): TenantWebsiteConfig => ({
  companyName: config?.companyName ?? DEFAULT_TENANT_CONFIG.companyName,
  logoUrl: config?.logoUrl ?? DEFAULT_TENANT_CONFIG.logoUrl,
  faviconUrl: config?.faviconUrl ?? DEFAULT_TENANT_CONFIG.faviconUrl,
  primaryColor: config?.primaryColor ?? DEFAULT_TENANT_CONFIG.primaryColor,
  secondaryColor: config?.secondaryColor ?? DEFAULT_TENANT_CONFIG.secondaryColor,
  description: config?.description ?? DEFAULT_TENANT_CONFIG.description,
  heroTitle: config?.heroTitle ?? DEFAULT_TENANT_CONFIG.heroTitle,
  heroSubtitle: config?.heroSubtitle ?? DEFAULT_TENANT_CONFIG.heroSubtitle,
  phone: config?.phone ?? DEFAULT_TENANT_CONFIG.phone,
  email: config?.email ?? DEFAULT_TENANT_CONFIG.email,
  address: config?.address ?? DEFAULT_TENANT_CONFIG.address,
  instagramUrl: config?.instagramUrl ?? DEFAULT_TENANT_CONFIG.instagramUrl,
  whatsappNumber: config?.whatsappNumber ?? DEFAULT_TENANT_CONFIG.whatsappNumber,
  facebookUrl: config?.facebookUrl ?? DEFAULT_TENANT_CONFIG.facebookUrl,
})

export const useTenantConfig = () => {
  const config = useRuntimeConfig()
  const API_BASE = `${config.public.apiUrl.replace(/\/$/, '')}/api/v1/public`

  const resolveSlug = (): string => {
    if (process.server) {
      const host = useRequestHeaders()['host'] || ''
      const subdomain = host.split('.')[0]

      if (!host.includes('.') || subdomain === 'localhost') {
        return (useRoute().query.tenant as string) || 'demo'
      }

      return subdomain
    }

    const host = window.location.hostname

    if (!host.includes('.') || host === 'localhost') {
      return (useRoute().query.tenant as string) || 'demo'
    }

    return host.split('.')[0]
  }

  const fetchConfig = async (): Promise<TenantWebsiteConfig> => {
    const slug = resolveSlug()

    try {
      const response = await $fetch<TenantWebsiteConfig>(`${API_BASE}/config`, {
        headers: { 'X-Tenant-Slug': slug },
      })

      return mergeTenantConfig(response)
    } catch {
      return { ...DEFAULT_TENANT_CONFIG }
    }
  }

  const useTenantConfigData = () => {
    const slug = resolveSlug()

    return useAsyncData<TenantWebsiteConfig>(
      `tenant-config-${slug}`,
      () => fetchConfig(),
      { default: () => ({ ...DEFAULT_TENANT_CONFIG }) }
    )
  }

  return { fetchConfig, useTenantConfigData, resolveSlug }
}
