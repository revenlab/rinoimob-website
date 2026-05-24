export interface TenantWebsiteConfig {
  companyName: string | null
  logoUrl: string | null
  faviconUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  description: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  phone: string | null
  email: string | null
  address: string | null
  instagramUrl: string | null
  whatsappNumber: string | null
  facebookUrl: string | null
  heroImageUrl?: string | null
}

export const DEFAULT_TENANT_CONFIG: TenantWebsiteConfig = {
  companyName: 'Rinoimob',
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#1e2d4d',
  secondaryColor: '#2563EB',
  description: 'Seu imóvel ideal está aqui. Compre, alugue ou anuncie com facilidade.',
  heroTitle: 'Encontre o imóvel dos seus sonhos',
  heroSubtitle: 'Venda, aluguel e temporada',
  phone: '(11) 9 9999-9999',
  email: 'contato@rinoimob.com.br',
  address: 'São Paulo, SP',
  instagramUrl: null,
  whatsappNumber: null,
  facebookUrl: null,
  heroImageUrl: null,
}
