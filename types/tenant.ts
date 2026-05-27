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
  featuredSectionTitle?: string | null
  featuredSectionSubtitle?: string | null
  launchesSectionTitle?: string | null
  launchesSectionSubtitle?: string | null
  categoriesSectionTitle?: string | null
  categoriesSectionSubtitle?: string | null
  servicesSectionTitle?: string | null
  servicesSectionSubtitle?: string | null
  servicesFormTitle?: string | null
  servicesFormSubtitle?: string | null
  statsSectionTitle?: string | null
  statsSectionSubtitle?: string | null
  blogSectionTitle?: string | null
  blogSectionSubtitle?: string | null
  ctaSectionTitle?: string | null
  ctaSectionSubtitle?: string | null
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
  featuredSectionTitle: 'Destaques',
  featuredSectionSubtitle: 'As melhores oportunidades selecionadas para você.',
  launchesSectionTitle: 'Lançamentos',
  launchesSectionSubtitle: 'Novidades que chegaram agora ao catálogo.',
  categoriesSectionTitle: 'Categorias',
  categoriesSectionSubtitle: 'Explore o tipo de imóvel ideal para cada momento.',
  servicesSectionTitle: 'Serviços Exclusivos para Proprietários',
  servicesSectionSubtitle: 'Oferecemos suporte completo para você tomar as melhores decisões com tranquilidade.',
  servicesFormTitle: 'Informações de Contato',
  servicesFormSubtitle: 'Preencha abaixo e um especialista entrará em contato.',
  statsSectionTitle: 'Nossa presença no mercado',
  statsSectionSubtitle: 'Indicadores que mostram a força da nossa operação.',
  blogSectionTitle: 'Dicas e Conteúdos',
  blogSectionSubtitle: 'Fique por dentro das tendências do mercado imobiliário.',
  ctaSectionTitle: 'Pronto para encontrar seu novo lar?',
  ctaSectionSubtitle: 'Nossos corretores estão prontos para te guiar em cada passo dessa jornada.',
}
