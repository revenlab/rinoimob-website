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
  heroImageUrl: config?.heroImageUrl ?? DEFAULT_TENANT_CONFIG.heroImageUrl,
  featuredSectionTitle: config?.featuredSectionTitle ?? DEFAULT_TENANT_CONFIG.featuredSectionTitle,
  featuredSectionSubtitle: config?.featuredSectionSubtitle ?? DEFAULT_TENANT_CONFIG.featuredSectionSubtitle,
  launchesSectionTitle: config?.launchesSectionTitle ?? DEFAULT_TENANT_CONFIG.launchesSectionTitle,
  launchesSectionSubtitle: config?.launchesSectionSubtitle ?? DEFAULT_TENANT_CONFIG.launchesSectionSubtitle,
  categoriesSectionTitle: config?.categoriesSectionTitle ?? DEFAULT_TENANT_CONFIG.categoriesSectionTitle,
  categoriesSectionSubtitle: config?.categoriesSectionSubtitle ?? DEFAULT_TENANT_CONFIG.categoriesSectionSubtitle,
  servicesSectionTitle: config?.servicesSectionTitle ?? DEFAULT_TENANT_CONFIG.servicesSectionTitle,
  servicesSectionSubtitle: config?.servicesSectionSubtitle ?? DEFAULT_TENANT_CONFIG.servicesSectionSubtitle,
  servicesFormTitle: config?.servicesFormTitle ?? DEFAULT_TENANT_CONFIG.servicesFormTitle,
  servicesFormSubtitle: config?.servicesFormSubtitle ?? DEFAULT_TENANT_CONFIG.servicesFormSubtitle,
  statsSectionTitle: config?.statsSectionTitle ?? DEFAULT_TENANT_CONFIG.statsSectionTitle,
  statsSectionSubtitle: config?.statsSectionSubtitle ?? DEFAULT_TENANT_CONFIG.statsSectionSubtitle,
  blogSectionTitle: config?.blogSectionTitle ?? DEFAULT_TENANT_CONFIG.blogSectionTitle,
  blogSectionSubtitle: config?.blogSectionSubtitle ?? DEFAULT_TENANT_CONFIG.blogSectionSubtitle,
  ctaSectionTitle: config?.ctaSectionTitle ?? DEFAULT_TENANT_CONFIG.ctaSectionTitle,
  ctaSectionSubtitle: config?.ctaSectionSubtitle ?? DEFAULT_TENANT_CONFIG.ctaSectionSubtitle,
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
