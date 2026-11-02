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
  servicesItems: config?.servicesItems ?? DEFAULT_TENANT_CONFIG.servicesItems,
  servicesFormTitle: config?.servicesFormTitle ?? DEFAULT_TENANT_CONFIG.servicesFormTitle,
  servicesFormSubtitle: config?.servicesFormSubtitle ?? DEFAULT_TENANT_CONFIG.servicesFormSubtitle,
  statsSectionTitle: config?.statsSectionTitle ?? DEFAULT_TENANT_CONFIG.statsSectionTitle,
  statsSectionSubtitle: config?.statsSectionSubtitle ?? DEFAULT_TENANT_CONFIG.statsSectionSubtitle,
  blogSectionTitle: config?.blogSectionTitle ?? DEFAULT_TENANT_CONFIG.blogSectionTitle,
  blogSectionSubtitle: config?.blogSectionSubtitle ?? DEFAULT_TENANT_CONFIG.blogSectionSubtitle,
  ctaSectionTitle: config?.ctaSectionTitle ?? DEFAULT_TENANT_CONFIG.ctaSectionTitle,
  ctaSectionSubtitle: config?.ctaSectionSubtitle ?? DEFAULT_TENANT_CONFIG.ctaSectionSubtitle,
  aboutPageTitle: config?.aboutPageTitle ?? DEFAULT_TENANT_CONFIG.aboutPageTitle,
  aboutPageSubtitle: config?.aboutPageSubtitle ?? DEFAULT_TENANT_CONFIG.aboutPageSubtitle,
  aboutPageDescription: config?.aboutPageDescription ?? DEFAULT_TENANT_CONFIG.aboutPageDescription,
  aboutImageUrl: config?.aboutImageUrl ?? DEFAULT_TENANT_CONFIG.aboutImageUrl,
  aboutMission: config?.aboutMission ?? DEFAULT_TENANT_CONFIG.aboutMission,
  aboutVision: config?.aboutVision ?? DEFAULT_TENANT_CONFIG.aboutVision,
  aboutValues: config?.aboutValues ?? DEFAULT_TENANT_CONFIG.aboutValues,
  aboutFoundedYear: config?.aboutFoundedYear ?? DEFAULT_TENANT_CONFIG.aboutFoundedYear,
  aboutTeamCount: config?.aboutTeamCount ?? DEFAULT_TENANT_CONFIG.aboutTeamCount,
  aboutPropertiesCount: config?.aboutPropertiesCount ?? DEFAULT_TENANT_CONFIG.aboutPropertiesCount,
})

export const useTenantConfig = () => {
  const config = useRuntimeConfig()
  const API_BASE = process.server
    ? `${config.apiInternalUrl.replace(/\/$/, '')}/api/v1/public`
    : '/api/v1/public'

  const resolveTenantIdentifier = (): string => {
    if (process.server) {
      const host = useRequestHeaders()['host'] || ''
      const hostname = host.split(':')[0]

      if (hostname === 'localhost' || !hostname.includes('.')) {
        return (useRoute().query.tenant as string) || 'demo'
      }

      if (hostname.endsWith('.localhost')) {
        return hostname.split('.')[0]
      }

      return hostname
    }

    const host = window.location.hostname

    if (host === 'localhost' || !host.includes('.')) {
      return (useRoute().query.tenant as string) || 'demo'
    }

    if (host.endsWith('.localhost')) {
      return host.split('.')[0]
    }

    return host
  }

  const fetchConfig = async (): Promise<TenantWebsiteConfig> => {
    const tenantIdentifier = resolveTenantIdentifier()

    try {
      const response = await $fetch<TenantWebsiteConfig>(`${API_BASE}/config`, {
        headers: { 'X-Tenant-Slug': tenantIdentifier },
      })

      return mergeTenantConfig(response)
    } catch {
      return { ...DEFAULT_TENANT_CONFIG }
    }
  }

  const useTenantConfigData = () => {
    const slug = resolveTenantIdentifier()

    return useAsyncData<TenantWebsiteConfig>(
      `tenant-config-${slug}`,
      () => fetchConfig(),
      { default: () => ({ ...DEFAULT_TENANT_CONFIG }) }
    )
  }

  return { fetchConfig, useTenantConfigData, resolveTenantIdentifier, resolveSlug: resolveTenantIdentifier }
}
