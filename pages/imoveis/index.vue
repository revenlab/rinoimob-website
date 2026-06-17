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
            :style="filters.operation === op.value
              ? { backgroundColor: cfg.primaryColor, borderColor: cfg.primaryColor, color: '#fff' }
              : {}"
            :class="filters.operation === op.value
              ? ''
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'"
          >
            {{ op.label }}
          </button>
        </div>

        <!-- Secondary filters row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 items-stretch">
          <input
            v-model="filters.q"
            type="text"
            placeholder="Buscar por título, bairro ou código"
            @keyup.enter="applyFilters"
            class="px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 lg:col-span-2"
          />
          <input
            v-model="filters.city"
            type="text"
            placeholder="Cidade"
            @keyup.enter="applyFilters"
            class="px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select v-model="filters.propertyType" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Todos os tipos</option>
            <option v-for="type in propertyTypes" :key="type.code" :value="type.code">{{ type.label }}</option>
          </select>
          <select v-model="filters.minPrice" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Preço mín.</option>
            <option value="200000">A partir de R$200k</option>
            <option value="500000">A partir de R$500k</option>
            <option value="1000000">A partir de R$1M</option>
          </select>
          <select v-model="filters.maxPrice" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Sem limite</option>
            <option value="500000">Até R$500k</option>
            <option value="1000000">R$500k – 1M</option>
            <option value="2000000">R$1M – 2M</option>
          </select>
          <select v-model="filters.bedrooms" @change="applyFilters"
            class="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option value="">Quartos</option>
            <option value="1">1+ quarto</option>
            <option value="2">2+ quartos</option>
            <option value="3">3+ quartos</option>
            <option value="4">4+ quartos</option>
          </select>
          <button @click="applyFilters"
            class="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shrink-0"
            :style="{ backgroundColor: cfg.primaryColor }">
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
        <h1 class="text-2xl font-bold" :style="{ color: cfg.primaryColor }">Imóveis disponíveis</h1>
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
        <PropertyCard
          v-for="property in properties"
          :key="property.id"
          :property="property"
        />
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
          :style="p === currentPage + 1 ? { backgroundColor: cfg.primaryColor, borderColor: cfg.primaryColor, color: '#fff' } : {}"
          :class="p === currentPage + 1 ? 'font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
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
import type { PublicPropertySummary, PublicPropertyType } from '~/types/property'
import { DEFAULT_PROPERTY_TYPES, propertyTypeLabel } from '~/types/property'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

const { listProperties, listPropertyTypes } = usePublicApi()
const { resolveSlug, useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const route = useRoute()
const router = useRouter()
const requestUrl = useRequestURL()
const listCanonical = computed(() => new URL('/imoveis', requestUrl.origin).toString())

const listDescription = computed(() => {
  if (hasActiveFilters.value) {
    const parts = [
      filters.value.operation ? `operação ${filters.value.operation.toLowerCase()}` : '',
      filters.value.q ? `busca "${filters.value.q}"` : '',
      filters.value.propertyType ? `tipo ${propertyTypeLabel(filters.value.propertyType, propertyTypes.value).toLowerCase()}` : '',
      filters.value.city ? `em ${filters.value.city}` : '',
    ].filter(Boolean).join(' ')
    return parts
      ? `Resultados de imóveis ${parts.toLowerCase()} disponíveis na ${cfg.value.companyName || 'imobiliária'}.`
      : 'Veja os imóveis disponíveis.'
  }

  return cfg.value.description || 'Encontre o imóvel ideal. Casas, apartamentos, terrenos e mais.'
})

const operationOptions = [
  { label: 'Todos', value: '' },
  { label: 'Comprar', value: 'SALE' },
  { label: 'Alugar', value: 'RENT' },
  { label: 'Temporada', value: 'SEASONAL' },
]

const filters = ref({
  operation: (route.query.operation as string) || '',
  propertyType: (route.query.propertyType as string) || '',
  categorySlug: (route.query.categorySlug as string) || '',
  q: (route.query.q as string) || '',
  city: (route.query.city as string) || '',
  minPrice: (route.query.minPrice as string) || '',
  maxPrice: (route.query.maxPrice as string) || '',
  bedrooms: (route.query.bedrooms as string) || '',
  latitude: (route.query.latitude as string) || '',
  longitude: (route.query.longitude as string) || '',
  radiusKm: (route.query.radiusKm as string) || '',
})
const currentPage = ref(Number(route.query.page) > 1 ? Number(route.query.page) - 1 : 0)
const totalPages = ref(1)
const totalElements = ref(0)
const properties = ref<PublicPropertySummary[]>([])
const propertyTypes = ref<PublicPropertyType[]>(DEFAULT_PROPERTY_TYPES)
const pending = ref(true)

const hasActiveFilters = computed(() =>
  !!(
    filters.value.operation ||
    filters.value.propertyType ||
    filters.value.categorySlug ||
    filters.value.q ||
    filters.value.city ||
    filters.value.minPrice ||
    filters.value.maxPrice ||
    filters.value.bedrooms ||
    filters.value.latitude ||
    filters.value.longitude ||
    filters.value.radiusKm
  )
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

useHead(computed(() => ({
  title: 'Imóveis disponíveis',
  meta: [
    { name: 'description', content: listDescription.value },
    { name: 'robots', content: hasActiveFilters.value ? 'noindex,follow' : 'index,follow' },
    { property: 'og:title', content: `${cfg.value.companyName || 'Rinoimob'} | Imóveis disponíveis` },
    { property: 'og:description', content: listDescription.value },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: listCanonical.value },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Lista de imóveis',
        itemListElement: properties.value.slice(0, 20).map((property, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: new URL(`/imoveis/${property.id}`, requestUrl.origin).toString(),
          name: property.title,
        })),
      }),
    },
  ],
})))


const syncUrl = () => {
  const query: Record<string, string> = {}
  if (filters.value.operation) query.operation = filters.value.operation
  if (filters.value.propertyType) query.propertyType = filters.value.propertyType
  if (filters.value.categorySlug) query.categorySlug = filters.value.categorySlug
  if (filters.value.q) query.q = filters.value.q
  if (filters.value.city) query.city = filters.value.city
  if (filters.value.minPrice) query.minPrice = filters.value.minPrice
  if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice
  if (filters.value.bedrooms) query.bedrooms = filters.value.bedrooms
  if (filters.value.latitude) query.latitude = filters.value.latitude
  if (filters.value.longitude) query.longitude = filters.value.longitude
  if (filters.value.radiusKm) query.radiusKm = filters.value.radiusKm
  if (currentPage.value > 0) query.page = String(currentPage.value + 1)
  router.replace({ query })
}

const loadProperties = async () => {
  pending.value = true
  try {
    const data = await listProperties(resolveSlug(), {
      page: currentPage.value,
      size: 12,
      operation: filters.value.operation || undefined,
      propertyType: filters.value.propertyType || undefined,
      categorySlug: filters.value.categorySlug || undefined,
      q: filters.value.q || undefined,
      city: filters.value.city || undefined,
      minPrice: filters.value.minPrice || undefined,
      maxPrice: filters.value.maxPrice || undefined,
      bedrooms: filters.value.bedrooms || undefined,
      latitude: filters.value.latitude || undefined,
      longitude: filters.value.longitude || undefined,
      radiusKm: filters.value.radiusKm || undefined,
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
  filters.value = {
    operation: '',
    propertyType: '',
    categorySlug: '',
    q: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    latitude: '',
    longitude: '',
    radiusKm: '',
  }
  applyFilters()
}

try {
  propertyTypes.value = await listPropertyTypes(resolveSlug())
} catch {
  propertyTypes.value = DEFAULT_PROPERTY_TYPES
}

await loadProperties()
</script>
