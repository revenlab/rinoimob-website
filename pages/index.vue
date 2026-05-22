<template>
  <div class="bg-white">

    <!-- ============================================
         HERO
    ============================================= -->
    <section class="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- Left: Text + Search -->
          <div class="order-2 lg:order-1">
            <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Líder em tecnologia imobiliária
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] mb-5">
              Encontre o lugar<br />
              onde sua
              <span class="relative" :style="{ color: cfg.primaryColor }">
                história
                <span class="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full opacity-30" :style="{ backgroundColor: cfg.primaryColor }"></span>
              </span><br />
              começa.
            </h1>

            <p class="text-slate-500 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              {{ cfg.heroSubtitle || 'A plataforma mais completa para quem busca comprar, alugar ou investir em imóveis com segurança e transparência.' }}
            </p>

            <!-- Search bar -->
            <div class="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 flex flex-col sm:flex-row gap-0 max-w-lg">
              <div class="flex-1 flex items-center gap-2 px-3">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cidade, bairro ou endereço"
                  class="flex-1 py-3 text-slate-700 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <div class="h-px sm:h-auto sm:w-px bg-slate-100 mx-0 sm:mx-0"></div>
              <select
                v-model="searchType"
                class="sm:w-36 px-3 py-3 text-slate-500 text-sm focus:outline-none bg-transparent border-t border-slate-100 sm:border-t-0"
              >
                <option value="">Tipo</option>
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Apartamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Comercial</option>
              </select>
              <button
                @click="doSearch"
                class="px-6 py-3 text-white font-semibold rounded-xl text-sm transition-opacity hover:opacity-90 flex-shrink-0 m-1"
                :style="{ backgroundColor: cfg.primaryColor }"
              >
                Buscar
              </button>
            </div>
          </div>

          <!-- Right: Illustration card -->
          <div class="order-1 lg:order-2 relative">
            <div class="rounded-3xl overflow-hidden shadow-2xl relative" style="aspect-ratio: 4/3;">
              <div
                class="w-full h-full flex flex-col items-center justify-center"
                :style="{ background: `linear-gradient(135deg, ${cfg.primaryColor}22 0%, ${cfg.primaryColor}44 100%)` }"
              >
                <div class="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-lg" :style="{ backgroundColor: cfg.primaryColor }">
                  <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <p class="font-bold text-slate-700 text-xl">{{ cfg.companyName }}</p>
                <p class="text-slate-500 text-sm mt-1">Seu próximo imóvel está aqui</p>
              </div>
            </div>

            <!-- Floating stats badge -->
            <div class="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: cfg.primaryColor + '18' }">
                ⭐
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm leading-tight">4.9 / 5.0</p>
                <p class="text-slate-400 text-xs">10k+ Atendidos</p>
              </div>
            </div>

            <!-- Second floating badge -->
            <div class="absolute top-6 right-6 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <p class="font-bold text-slate-900 text-sm">2.500+</p>
              <p class="text-slate-400 text-xs">Imóveis listados</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================
         IMÓVEIS EM DESTAQUE
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Imóveis em Destaque</h2>
          <p class="text-slate-500 text-sm mt-1">As melhores oportunidades selecionadas por nossa equipe especializada para você.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 bg-slate-100 p-1 rounded-full">
          <button
            v-for="tab in featuredTabs"
            :key="tab.value"
            @click="activeFeaturedTab = tab.value; loadFeatured()"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="activeFeaturedTab === tab.value ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            :style="activeFeaturedTab === tab.value ? { backgroundColor: cfg.primaryColor } : undefined"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="featuredPending" class="flex justify-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: cfg.primaryColor + '40', borderTopColor: 'transparent' }"></div>
      </div>

      <div v-else-if="featuredProperties.length" class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <PropertyCard
          v-for="p in featuredProperties"
          :key="p.id"
          :property="p"
        />
      </div>

      <div v-else class="text-center py-16 text-slate-400">
        <p>Nenhum imóvel disponível no momento.</p>
      </div>

      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/imoveis"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all hover:shadow-md"
          :style="{ borderColor: cfg.primaryColor, color: cfg.primaryColor }"
        >
          Ver todos os imóveis
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- ============================================
         LANÇAMENTOS EXCLUSIVOS
    ============================================= -->
    <section class="bg-slate-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Lançamentos Exclusivos</h2>
            <p class="text-slate-500 text-sm mt-1">Projetos arquitetônicos que definem o futuro de morar bem.</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
              aria-label="Anterior"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
              aria-label="Próximo"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="launchesPending" class="flex justify-center py-16">
          <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: cfg.primaryColor + '40', borderTopColor: 'transparent' }"></div>
        </div>

        <div v-else-if="launches.length" class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <PropertyCard
            v-for="p in launches"
            :key="p.id"
            :property="p"
          />
        </div>

        <div v-else class="text-center py-12 text-slate-400">
          <p>Nenhum lançamento disponível no momento.</p>
        </div>
      </div>
    </section>

    <!-- ============================================
         CATEGORIAS
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Categorias</h2>
        <p class="text-slate-500 text-sm mt-1">Explore imóveis por estilo e necessidade.</p>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.type"
          :to="`/imoveis?propertyType=${cat.type}`"
          class="group relative rounded-2xl overflow-hidden block cursor-pointer"
          style="aspect-ratio: 4/3;"
        >
          <div
            class="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
            :style="{ background: cat.gradient }"
          ></div>
          <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          <div class="absolute inset-0 flex flex-col justify-end p-4">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="cat.iconPath" />
              </svg>
            </div>
            <p class="text-white font-semibold text-base leading-tight">{{ cat.label }}</p>
            <p class="text-white/70 text-xs mt-0.5">{{ cat.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ============================================
         SERVIÇOS EXCLUSIVOS
    ============================================= -->
    <section class="py-16" :style="{ backgroundColor: cfg.primaryColor }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Services list -->
          <div>
            <h2 class="text-3xl font-bold text-white mb-2">
              Serviços Exclusivos para<br />Proprietários
            </h2>
            <p class="text-white/60 text-sm mb-8">
              Oferecemos suporte completo para você tomar as melhores decisões com tranquilidade.
            </p>
            <ul class="space-y-5">
              <li v-for="srv in services" :key="srv.title" class="flex items-start gap-4">
                <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">{{ srv.title }}</p>
                  <p class="text-white/60 text-xs mt-0.5">{{ srv.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Contact form card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 class="text-white font-bold text-base mb-1">Informações de Contato</h3>
            <p class="text-white/60 text-xs mb-5">Preencha abaixo e um especialista entrará em contato.</p>
            <form @submit.prevent="submitLead" class="space-y-3">
              <input
                v-model="leadForm.name"
                type="text"
                placeholder="Nome completo"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                v-model="leadForm.email"
                type="email"
                placeholder="Seu e-mail"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                v-model="leadForm.phone"
                type="tel"
                placeholder="WhatsApp com DDD"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                :disabled="leadSubmitting || leadSent"
                class="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-70 mt-1"
                :style="{ backgroundColor: cfg.secondaryColor || '#FF6B35', color: '#fff' }"
              >
                {{ leadSent ? '✓ Enviado com sucesso!' : leadSubmitting ? 'Enviando...' : 'Próxima Etapa' }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================
         STATS
    ============================================= -->
    <section class="bg-white border-b border-slate-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div
              class="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              :style="{ backgroundColor: cfg.primaryColor + '15' }"
            >
              <svg class="w-6 h-6" :style="{ color: cfg.primaryColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="stat.iconPath" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="text-slate-500 text-sm mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         DICAS E CONTEÚDOS
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Dicas e Conteúdos</h2>
          <p class="text-slate-500 text-sm mt-1">Fique por dentro das tendências do mercado imobiliário.</p>
        </div>
        <a
          href="#"
          class="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
          :style="{ color: cfg.primaryColor }"
        >
          Ver Blog
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="post in blogPosts" :key="post.title" class="group cursor-pointer">
          <div class="rounded-2xl overflow-hidden mb-4" style="aspect-ratio: 16/9;">
            <div
              class="w-full h-full transition-transform duration-300 group-hover:scale-105"
              :style="{ background: post.gradient }"
            ></div>
          </div>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full"
            :style="{ backgroundColor: cfg.primaryColor + '15', color: cfg.primaryColor }"
          >
            {{ post.tag }}
          </span>
          <h3 class="font-semibold text-slate-900 mt-2 text-sm leading-snug group-hover:opacity-70 transition-opacity">
            {{ post.title }}
          </h3>
          <p class="text-slate-400 text-xs mt-2 flex items-center gap-1">
            Ler mais
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================
         CTA BANNER
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <div
        class="rounded-3xl py-16 px-8 text-center"
        :style="{ backgroundColor: cfg.primaryColor }"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Pronto para encontrar<br />seu novo lar?
        </h2>
        <p class="text-white/70 text-base mb-8 max-w-md mx-auto">
          Nossos corretores estão prontos para te guiar em cada passo dessa jornada.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            :href="cfg.whatsappNumber ? `https://wa.me/${cfg.whatsappNumber}` : '#'"
            class="px-8 py-3.5 rounded-full text-sm font-bold bg-white transition-all hover:shadow-lg inline-block"
            :style="{ color: cfg.primaryColor }"
          >
            Falar com Especialista
          </a>
          <NuxtLink
            to="/imoveis"
            class="px-8 py-3.5 rounded-full text-sm font-bold border-2 border-white/50 text-white transition-colors hover:bg-white/10 inline-block"
          >
            Ver Catálogo Completo
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'
import type { PublicLeadRequest } from '~/types/property'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

const router = useRouter()
const searchQuery = ref('')
const searchType = ref('')
const activeFeaturedTab = ref<'SALE' | 'RENT' | 'SEASONAL'>('SALE')
const featuredProperties = ref<PublicPropertySummary[]>([])
const featuredPending = ref(true)
const launches = ref<PublicPropertySummary[]>([])
const launchesPending = ref(true)

const leadForm = ref<{ name: string; email: string; phone: string }>({ name: '', email: '', phone: '' })
const leadSubmitting = ref(false)
const leadSent = ref(false)

const { useTenantConfigData, resolveSlug } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

const featuredTabs = [
  { label: 'Comprar', value: 'SALE' as const },
  { label: 'Alugar', value: 'RENT' as const },
  { label: 'Na Planta', value: 'SEASONAL' as const },
]

const doSearch = () => {
  router.push({
    path: '/imoveis',
    query: {
      ...(searchQuery.value ? { city: searchQuery.value } : {}),
      ...(searchType.value ? { propertyType: searchType.value } : {}),
    },
  })
}

const { listProperties, createLead } = usePublicApi()

const loadFeatured = async () => {
  featuredPending.value = true
  try {
    const data = await listProperties(resolveSlug(), {
      page: 0,
      size: 8,
      operation: activeFeaturedTab.value,
    })
    featuredProperties.value = data.content
  } catch {
    featuredProperties.value = []
  } finally {
    featuredPending.value = false
  }
}

const loadLaunches = async () => {
  launchesPending.value = true
  try {
    const data = await listProperties(resolveSlug(), { page: 0, size: 4, operation: 'SEASONAL' })
    launches.value = data.content
  } catch {
    launches.value = []
  } finally {
    launchesPending.value = false
  }
}

const submitLead = async () => {
  if (leadSubmitting.value || leadSent.value) return
  leadSubmitting.value = true
  try {
    const payload: PublicLeadRequest = {
      name: leadForm.value.name,
      email: leadForm.value.email || undefined,
      phone: leadForm.value.phone || undefined,
      message: 'Interesse em serviços exclusivos para proprietários',
    }
    await createLead(resolveSlug(), payload)
    leadSent.value = true
    leadForm.value = { name: '', email: '', phone: '' }
  } catch {
    // silent fail — form stays open so user can retry
  } finally {
    leadSubmitting.value = false
  }
}

onMounted(() => {
  loadFeatured()
  loadLaunches()
})

const categories = [
  {
    type: 'HOUSE',
    label: 'Casas',
    description: 'Conforto e espaço para sua família',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    type: 'APARTMENT',
    label: 'Apartamentos',
    description: 'Praticidade no coração da cidade',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
    iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  },
  {
    type: 'COMMERCIAL',
    label: 'Comerciais',
    description: 'Espaços para o seu negócio crescer',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)',
    iconPath: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
  },
  {
    type: 'LAND',
    label: 'Terrenos',
    description: 'Construa o imóvel dos seus sonhos',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
  },
]

const services = [
  {
    title: 'Assessoria jurídica completa',
    description: 'Análise contratual e suporte legal do início ao fim da negociação.',
  },
  {
    title: 'Fotografia profissional e tour virtual',
    description: 'Imagens de alta qualidade e visita 360° para atrair mais compradores.',
  },
  {
    title: 'Avaliação gratuita do imóvel',
    description: 'Descubra o preço justo de mercado com nossa análise especializada.',
  },
  {
    title: 'Consultoria para financiamento',
    description: 'Te ajudamos a encontrar as melhores condições de crédito imobiliário.',
  },
]

const stats = [
  {
    value: '2.500+',
    label: 'Imóveis Vendidos',
    iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75',
  },
  {
    value: '10k+',
    label: 'Clientes Felizes',
    iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  },
  {
    value: '15+',
    label: 'Anos de Mercado',
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    value: '12',
    label: 'Prêmios Design',
    iconPath: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
  },
]

const blogPosts = [
  {
    tag: 'DICAS',
    title: '10 dicas para comprar seu primeiro imóvel sem erros',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  },
  {
    tag: 'DECOR',
    title: 'Como valorizar seu imóvel antes de colocar à venda',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  {
    tag: 'MERCADO',
    title: 'Tendências do mercado imobiliário para 2025',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
]
</script>
