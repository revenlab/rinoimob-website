<template>
  <div>
    <!-- Hero -->
    <section style="background-color: #1e2d4d" class="relative overflow-hidden">
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Encontre seu imóvel ideal
        </h1>
        <p class="text-slate-300 text-lg mb-10">
          Compre, alugue ou anuncie com facilidade. Milhares de imóveis esperando por você.
        </p>

        <!-- Tabs -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            :class="activeTab === tab.value ? 'bg-[#2563EB] text-white' : 'bg-white/15 text-white hover:bg-white/25'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search bar -->
        <div class="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl max-w-2xl mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cidade, bairro ou endereço"
            class="flex-1 px-4 py-3 text-slate-700 placeholder-slate-400 text-sm focus:outline-none"
          />
          <select
            v-model="searchType"
            class="px-4 py-3 text-slate-700 text-sm focus:outline-none bg-white border-l border-slate-100"
          >
            <option value="">Tipo de imóvel</option>
            <option value="HOUSE">Casa</option>
            <option value="APARTMENT">Apartamento</option>
            <option value="LAND">Terreno</option>
            <option value="COMMERCIAL">Comercial</option>
            <option value="RURAL">Rural</option>
          </select>
          <button
            @click="doSearch"
            class="px-8 py-3 text-white font-semibold rounded-xl transition-colors bg-[#2563EB] hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-[#1e2d4d]">Imóveis em Destaque</h2>
          <p class="text-slate-500 text-sm mt-1">Selecionados para você</p>
        </div>
        <NuxtLink to="/imoveis" class="text-sm font-semibold text-[#2563EB] hover:opacity-80 transition-opacity">
          Ver todos →
        </NuxtLink>
      </div>

      <div v-if="pending" class="flex justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <div v-else-if="featuredProperties.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="property in featuredProperties"
          :key="property.id"
          :to="`/imoveis/${property.id}`"
          class="group relative rounded-3xl overflow-hidden block"
          style="aspect-ratio: 4/3;"
        >
          <img
            v-if="property.coverPhotoUrl"
            :src="property.coverPhotoUrl"
            :alt="property.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="absolute inset-0 bg-slate-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-slate-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <span
            class="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white"
            :class="operationBg(property.operation)"
          >
            {{ operationLabel(property.operation) }}
          </span>

          <button class="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors" @click.prevent>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <div class="absolute bottom-0 left-0 right-0 p-4">
            <p v-if="property.price" class="text-white font-bold text-base">
              {{ formatPrice(property.price, property.currency) }}
              <span v-if="property.operation === 'RENT'" class="text-xs font-normal text-slate-300">/mês</span>
            </p>
            <p class="text-slate-200 text-sm line-clamp-1 mt-0.5">{{ property.title }}</p>
            <p v-if="property.addressCity" class="text-slate-400 text-xs">
              {{ property.addressCity }}{{ property.addressState ? `, ${property.addressState}` : '' }}
            </p>
          </div>

          <div class="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span class="bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              Ver Detalhes
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12 text-slate-400">
        <p>Nenhum imóvel disponível no momento.</p>
      </div>
    </section>

    <!-- Features -->
    <section id="sobre" style="background-color: #1e2d4d" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl font-bold text-white text-center mb-12">Por que escolher a Rinoimob?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-2">Busca Inteligente</h3>
            <p class="text-slate-300 text-sm">Encontre o imóvel certo com filtros avançados de localização, tipo e preço.</p>
          </div>
          <div>
            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-2">Corretores Verificados</h3>
            <p class="text-slate-300 text-sm">Todos os anunciantes são verificados para garantir sua segurança.</p>
          </div>
          <div>
            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-2">Negociação Fácil</h3>
            <p class="text-slate-300 text-sm">Entre em contato direto com o corretor e feche negócio sem complicações.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'

definePageMeta({ layout: 'default' })

const router = useRouter()
const route = useRoute()

const activeTab = ref('SALE')
const searchQuery = ref('')
const searchType = ref('')

const tabs = [
  { label: 'Comprar', value: 'SALE' },
  { label: 'Alugar', value: 'RENT' },
  { label: 'Lançamentos', value: 'SEASONAL' },
]

const doSearch = () => {
  router.push({
    path: '/imoveis',
    query: {
      ...(searchQuery.value ? { city: searchQuery.value } : {}),
      ...(searchType.value ? { propertyType: searchType.value } : {}),
      operation: activeTab.value,
    },
  })
}

const getTenantSlug = () => {
  if (route.query.tenant) return String(route.query.tenant)
  if (typeof window !== 'undefined') {
    const parts = window.location.hostname.split('.')
    if (parts.length >= 3) return parts[0]
  }
  return 'demo'
}

const { listProperties } = usePublicApi()
const featuredProperties = ref<PublicPropertySummary[]>([])
const pending = ref(true)

const operationLabel = (op: string) => ({ SALE: 'Venda', RENT: 'Aluguel', SEASONAL: 'Temporada' }[op] ?? op)
const operationBg = (op: string) => ({
  SALE: 'bg-[#2563EB]',
  RENT: 'bg-emerald-600',
  SEASONAL: 'bg-amber-500',
}[op] ?? 'bg-slate-600')

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL', maximumFractionDigits: 0 }).format(price)

onMounted(async () => {
  try {
    const slug = getTenantSlug()
    const data = await listProperties(slug, { page: 0, size: 8 })
    featuredProperties.value = data.content
  } catch {
    featuredProperties.value = []
  } finally {
    pending.value = false
  }
})
</script>
