<template>
  <div class="bg-[#F1F5F9] min-h-screen">
    <!-- Search bar at top -->
    <div class="bg-white border-b border-slate-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            v-model="searchText"
            type="text"
            placeholder="Cidade, bairro ou endereço"
            class="flex-1 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select v-model="filters.operation" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Todas as operações</option>
            <option value="SALE">Venda</option>
            <option value="RENT">Locação</option>
            <option value="SEASONAL">Temporada</option>
          </select>
          <select v-model="filters.propertyType" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Todos os tipos</option>
            <option value="HOUSE">Casa</option>
            <option value="APARTMENT">Apartamento</option>
            <option value="LAND">Terreno</option>
            <option value="COMMERCIAL">Comercial</option>
            <option value="RURAL">Rural</option>
          </select>
          <button @click="applyFilters"
            class="px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#2563EB] hover:bg-blue-700 transition-colors">
            Buscar
          </button>
          <button @click="clearFilters"
            class="px-3 py-2.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Limpar
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#1e2d4d]">Imóveis disponíveis</h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ pending ? 'Carregando...' : `${totalElements} imóvel${totalElements !== 1 ? 'is' : ''} encontrado${totalElements !== 1 ? 's' : ''}` }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <!-- No results -->
      <div v-else-if="!properties.length" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-3 opacity-30">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
        </svg>
        <p class="font-medium">Nenhum imóvel encontrado</p>
        <button @click="clearFilters" class="mt-3 text-sm text-[#2563EB] hover:underline">Limpar filtros</button>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="property in properties"
          :key="property.id"
          :to="`/imoveis/${property.id}`"
          class="group relative rounded-2xl overflow-hidden block"
          style="aspect-ratio: 4/3;"
        >
          <!-- Photo -->
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

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <!-- Operation badge top-left -->
          <span
            class="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white"
            :class="operationBg(property.operation)"
          >
            {{ operationLabel(property.operation) }}
          </span>

          <!-- Heart button top-right -->
          <button class="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors" @click.prevent>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <!-- Text at bottom-left -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <p v-if="property.price" class="text-white font-bold text-base">
              {{ formatPrice(property.price, property.currency) }}
              <span v-if="property.operation === 'RENT'" class="text-xs font-normal text-slate-300">/mês</span>
            </p>
            <p v-else class="text-slate-300 text-sm">Consulte o preço</p>
            <p class="text-slate-200 text-sm line-clamp-1 mt-0.5">{{ property.title }}</p>
            <p v-if="property.addressCity" class="text-slate-400 text-xs">
              {{ property.addressCity }}{{ property.addressState ? `, ${property.addressState}` : '' }}
            </p>
          </div>

          <!-- Ver Detalhes hover -->
          <div class="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span class="bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              Ver Detalhes
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-10">
        <button :disabled="currentPage === 0" @click="currentPage--; loadProperties()"
          class="px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          ← Anterior
        </button>
        <span class="text-sm text-slate-500">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button :disabled="currentPage + 1 >= totalPages" @click="currentPage++; loadProperties()"
          class="px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          Próxima →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'

definePageMeta({ layout: 'default' })

const { listProperties } = usePublicApi()
const route = useRoute()

const getTenantSlug = () => {
  if (route.query.tenant) return String(route.query.tenant)
  if (typeof window !== 'undefined') {
    const parts = window.location.hostname.split('.')
    if (parts.length >= 3) return parts[0]
  }
  return 'demo'
}

const searchText = ref('')
const filters = ref({
  operation: (route.query.operation as string) || '',
  propertyType: (route.query.propertyType as string) || '',
})
const currentPage = ref(0)
const totalPages = ref(1)
const totalElements = ref(0)
const properties = ref<PublicPropertySummary[]>([])
const pending = ref(true)

const operationLabel = (op: string) => ({ SALE: 'Venda', RENT: 'Aluguel', SEASONAL: 'Temporada' }[op] ?? op)
const operationBg = (op: string) => ({
  SALE: 'bg-[#2563EB]',
  RENT: 'bg-emerald-600',
  SEASONAL: 'bg-amber-500',
}[op] ?? 'bg-slate-600')

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL', maximumFractionDigits: 0 }).format(price)

const loadProperties = async () => {
  pending.value = true
  try {
    const slug = getTenantSlug()
    const data = await listProperties(slug, {
      page: currentPage.value,
      size: 12,
      operation: filters.value.operation || undefined,
      propertyType: filters.value.propertyType || undefined,
    })
    properties.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch {
    properties.value = []
  } finally {
    pending.value = false
  }
}

const applyFilters = () => { currentPage.value = 0; loadProperties() }
const clearFilters = () => { filters.value = { operation: '', propertyType: '' }; searchText.value = ''; applyFilters() }

onMounted(loadProperties)
</script>
