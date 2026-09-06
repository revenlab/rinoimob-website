<template>
  <NuxtLink
    :to="brokerSlug ? { path: `/imoveis/${property.id}`, query: { corretor: brokerSlug } } : `/imoveis/${property.id}`"
    class="group relative rounded-2xl overflow-hidden block bg-slate-100 flex-shrink-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    :class="cardAspectRatioClass"
  >
    <img
      v-if="property.coverPhotoUrl"
      :src="property.coverPhotoUrl"
      :alt="property.title"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div v-else class="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14 text-slate-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>

    <!-- Gradient overlay: deeper on hover to contrast action bar -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300"></div>

    <span
      class="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white"
      :style="{ backgroundColor: operationColor }"
    >
      {{ operationLabel }}
    </span>

    <button
      type="button"
      class="absolute top-3 right-3 z-20 w-12 h-12 flex items-center justify-center bg-white/90 rounded-full shadow-lg ring-1 ring-black/5 hover:bg-white transition-colors leading-none"
      @click.prevent.stop="handleFavoriteClick"
      aria-label="Favoritar"
    >
      <HeartSolidIcon v-if="isPropertyFavorited" class="block w-4 h-4 text-red-500" />
      <HeartOutlineIcon v-else class="block w-5 h-5 text-slate-500" />
    </button>

    <!-- Info panel: shifts up slightly on hover -->
    <div class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 group-hover:pb-14">
      <p v-if="property.price" class="text-white font-bold text-base leading-tight">
        <span v-if="pricePrefix" class="text-xs font-medium text-slate-200">{{ pricePrefix }} </span>
        {{ formattedPrice }}
        <span v-if="property.operation === 'RENT'" class="text-xs font-normal text-slate-300">/mês</span>
      </p>
      <p class="text-slate-200 text-sm line-clamp-1 mt-0.5">{{ property.title }}</p>
      <div class="flex items-center gap-3 mt-1.5">
        <span v-if="property.bedrooms" class="flex items-center gap-1 text-slate-300 text-xs">
          <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          {{ property.bedrooms }} Quartos
        </span>
        <span v-if="property.addressCity" class="text-slate-300 text-xs truncate">
          {{ property.addressCity }}{{ property.addressState ? `, ${property.addressState}` : '' }}
        </span>
      </div>
    </div>

    <!-- Action bar: slides up from bottom on hover -->
    <div
      class="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
    >
      <span class="flex-1 text-center text-sm font-semibold text-white border border-white/50 rounded-xl py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
        Ver Detalhes
      </span>
      <button
        type="button"
        @click.prevent.stop="openPropertyWhatsappGate"
        class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors shadow-md"
        aria-label="Entrar em contato"
      >
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

const props = withDefaults(defineProps<{
  property: PublicPropertySummary
  whatsappNumber?: string | null
  brokerSlug?: string | null
  cardVariant?: 'default' | 'vertical'
  pricePrefix?: string
}>(), {
  whatsappNumber: null,
  brokerSlug: null,
  cardVariant: 'default',
  pricePrefix: '',
})

const { toggleFavorite, isFavorited } = useLocalStorageFavorites()
const { openLeadGate } = useWhatsappLeadGate()

const isPropertyFavorited = computed(() => isFavorited(props.property.id))

const handleFavoriteClick = () => {
  toggleFavorite(props.property.id)
}

const openPropertyWhatsappGate = () => {
  const phone = props.whatsappNumber?.replace(/\D/g, '')
  if (!phone) return

  const message = encodeURIComponent(`Olá, tenho interesse no imóvel: ${props.property.title}`)
  openLeadGate({
    targetUrl: `https://wa.me/${phone}?text=${message}`,
    source: 'PORTAL_WHATSAPP_HOME',
    propertyId: props.property.id,
    brokerSlug: props.brokerSlug ?? undefined,
    title: props.property.title,
  })
}

const cardAspectRatioClass = computed(() => (
  props.cardVariant === 'vertical' ? 'aspect-[4/5]' : 'aspect-[4/3]'
))

const operationLabel = computed(() => ({
  SALE: 'Venda',
  RENT: 'Aluguel',
  SEASONAL: 'Temporada',
}[props.property.operation] ?? props.property.operation))

const operationColor = computed(() => ({
  SALE: '#2563eb',
  RENT: '#059669',
  SEASONAL: '#d97706',
}[props.property.operation] ?? '#64748b'))

const formattedPrice = computed(() => {
  if (!props.property.price) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: props.property.currency || 'BRL',
    maximumFractionDigits: 0,
  }).format(props.property.price)
})
</script>
