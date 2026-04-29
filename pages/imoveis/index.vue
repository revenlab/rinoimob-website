<template>
  <div class="bg-[#F1F5F9] min-h-screen">
    <!-- Filter bar -->
    <div class="bg-white border-b border-slate-200 py-4 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
        <!-- Operation pills -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="op in operationOptions"
            :key="op.value"
            @click="setOperation(op.value)"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all border"
            :class="filters.operation === op.value
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'"
          >
            {{ op.label }}
          </button>
        </div>

        <!-- Secondary filters row -->
        <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            v-model="filters.city"
            type="text"
            placeholder="Cidade"
            @keyup.enter="applyFilters"
            class="flex-1 min-w-0 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select v-model="filters.propertyType" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Todos os tipos</option>
            <option value="HOUSE">Casa</option>
            <option value="APARTMENT">Apartamento</option>
            <option value="LAND">Terreno</option>
            <option value="COMMERCIAL">Comercial</option>
            <option value="RURAL">Rural</option>
          </select>
          <select v-model="filters.maxPrice" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Sem limite</option>
            <option value="500000">Até R$500k</option>
            <option value="1000000">R$500k – 1M</option>
            <option value="2000000">R$1M – 2M</option>
          </select>
          <button @click="applyFilters"
            class="px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#2563EB] hover:bg-blue-700 transition-colors shrink-0">
            Buscar
          </button>
          <button v-if="hasActiveFilters" @click="clearFilters"
            class="px-3 py-2.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0">
            Limpar filtros
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
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10 flex-wrap">
        <button :disabled="currentPage === 0" @click="goToPage(currentPage)"
          class="px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          ← Anterior
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="goToPage(p)"
          class="w-9 h-9 text-sm rounded-xl border transition-colors"
          :class="p === currentPage + 1
            ? 'bg-[#2563EB] text-white border-[#2563EB] font-semibold'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          {{ p }}
        </button>
        <button :disabled="currentPage + 1 >= totalPages" @click="goToPage(currentPage + 2)"
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

useHead({
  title: 'Imóveis | Rinoimob',
  meta: [
    { name: 'description', content: 'Encontre o imóvel ideal. Casas, apartamentos, terrenos e mais.' },
  ],
})

const { listProperties } = usePublicApi()
const route = useRoute()
const router = useRouter()

const getTenantSlug = () => {
  if (route.query.tenant) return String(route.query.tenant)
  if (typeof window !== 'undefined') {
    const parts = window.location.hostname.split('.')
    if (parts.length >= 3) return parts[0]
  }
  return 'demo'
}

const operationOptions = [
  { label: 'Todos', value: '' },
  { label: 'Comprar', value: 'SALE' },
  { label: 'Alugar', value: 'RENT' },
  { label: 'Temporada', value: 'SEASONAL' },
]

const filters = ref({
  operation: (route.query.operation as string) || '',
  propertyType: (route.query.propertyType as string) || '',
  city: (route.query.city as string) || '',
  maxPrice: (route.query.maxPrice as string) || '',
})
const currentPage = ref(Number(route.query.page) > 1 ? Number(route.query.page) - 1 : 0)
const totalPages = ref(1)
const totalElements = ref(0)
const properties = ref<PublicPropertySummary[]>([])
const pending = ref(true)

const hasActiveFilters = computed(() =>
  !!(filters.value.operation || filters.value.propertyType || filters.value.city || filters.value.maxPrice)
)

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value + 1
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const operationLabel = (op: string) => ({ SALE: 'Venda', RENT: 'Aluguel', SEASONAL: 'Temporada' }[op] ?? op)
const operationBg = (op: string) => ({
  SALE: 'bg-[#2563EB]',
  RENT: 'bg-emerald-600',
  SEASONAL: 'bg-amber-500',
}[op] ?? 'bg-slate-600')

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL', maximumFractionDigits: 0 }).format(price)

const syncUrl = () => {
  const query: Record<string, string> = {}
  if (filters.value.operation) query.operation = filters.value.operation
  if (filters.value.propertyType) query.propertyType = filters.value.propertyType
  if (filters.value.city) query.city = filters.value.city
  if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice
  if (currentPage.value > 0) query.page = String(currentPage.value + 1)
  router.replace({ query })
}

const loadProperties = async () => {
  pending.value = true
  try {
    const slug = getTenantSlug()
    const data = await listProperties(slug, {
      page: currentPage.value,
      size: 12,
      operation: filters.value.operation || undefined,
      propertyType: filters.value.propertyType || undefined,
      city: filters.value.city || undefined,
      maxPrice: filters.value.maxPrice || undefined,
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

const setOperation = (value: string) => {
  filters.value.operation = value
  applyFilters()
}

const applyFilters = () => {
  currentPage.value = 0
  syncUrl()
  loadProperties()
}

const goToPage = (page: number) => {
  currentPage.value = page - 1
  syncUrl()
  loadProperties()
}

const clearFilters = () => {
  filters.value = { operation: '', propertyType: '', city: '', maxPrice: '' }
  applyFilters()
}

onMounted(loadProperties)
</script>
