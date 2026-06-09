<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Meus Favoritos</h2>
          <p class="text-sm text-slate-500 mt-1">{{ favorites.length }} imóvel{{ favorites.length !== 1 ? 'is' : '' }}</p>
        </div>
        <button
          @click="close"
          class="p-2 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="favorites.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-slate-300 mb-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p class="text-slate-500 text-lg">Nenhum imóvel favoritado ainda</p>
          <p class="text-slate-400 text-sm mt-2">Clique no ❤️ para adicionar imóveis aos seus favoritos</p>
          <NuxtLink
            to="/imoveis"
            class="mt-6 inline-block px-6 py-2.5 rounded-xl font-semibold text-white transition-colors"
            :style="{ backgroundColor: cfg.primaryColor }"
          >
            Ver imóveis
          </NuxtLink>
        </div>

        <div v-else-if="loading" class="flex justify-center py-12">
          <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: cfg.primaryColor + '40', borderTopColor: 'transparent' }"></div>
        </div>

        <div v-else-if="properties.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="property in properties" :key="property.id" class="rounded-xl overflow-hidden bg-slate-50 hover:shadow-lg transition-shadow">
            <NuxtLink
              :to="`/imoveis/${property.id}`"
              class="block aspect-[4/3] overflow-hidden bg-slate-100 relative group"
            >
              <img
                v-if="getPropertyImageUrl(property)"
                :src="getPropertyImageUrl(property)!"
                :alt="property.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </NuxtLink>

            <div class="p-3">
              <NuxtLink :to="`/imoveis/${property.id}`" class="block">
                <h3 class="font-semibold text-slate-900 line-clamp-2 hover:text-slate-700">{{ property.title }}</h3>
                <p class="text-sm text-slate-500 mt-1">{{ property.addressCity }}{{ property.addressState ? `, ${property.addressState}` : '' }}</p>
              </NuxtLink>

              <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <p v-if="property.price" class="font-bold text-slate-900">
                  {{ formattedPrice(property.price, property.currency) }}
                  <span v-if="property.operation === 'RENT'" class="text-xs font-normal text-slate-500">/mês</span>
                </p>
                <button
                  @click.prevent="handleRemoveFavorite(property.id)"
                  class="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <HeartSolidIcon class="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-slate-500 text-lg">Não foi possível carregar seus favoritos</p>
          <p class="text-slate-400 text-sm mt-2">Tente abrir o modal novamente.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'
import type { PublicPropertyDetail } from '~/types/property'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { useTenantConfigData } = useTenantConfig()
const { resolveSlug } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const { getProperty } = usePublicApi()

const { favorites, removeFavorite } = useLocalStorageFavorites()
const properties = ref<PublicPropertyDetail[]>([])
const loading = ref(false)

const fetchProperties = async () => {
  if (favorites.value.length === 0) {
    properties.value = []
    return
  }

  loading.value = true
  try {
    const tenantSlug = resolveSlug()
    const results = await Promise.all(
      favorites.value.map(async (propertyId) => {
        try {
          return await getProperty(tenantSlug, propertyId)
        } catch {
          return null
        }
      })
    )

    properties.value = results.filter((property): property is PublicPropertyDetail => property !== null)
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    properties.value = []
  } finally {
    loading.value = false
  }
}

const handleRemoveFavorite = (propertyId: string) => {
  removeFavorite(propertyId)
  properties.value = properties.value.filter(p => p.id !== propertyId)
}

watch(
  () => [props.isOpen, favorites.value.join(',')],
  async ([isOpen]) => {
    if (isOpen) {
      await fetchProperties()
    } else {
      properties.value = []
    }
  }
)

const formattedPrice = (price: number, currency?: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
}

const getPropertyImageUrl = (property: PublicPropertyDetail): string | null => {
  if (property.coverPhotoUrl) {
    return property.coverPhotoUrl
  }

  const coverFromPhotos = property.photos?.find(photo => photo.isCover)?.url
  if (coverFromPhotos) {
    return coverFromPhotos
  }

  return property.photos?.[0]?.url ?? null
}

const close = () => {
  emit('close')
}
</script>
