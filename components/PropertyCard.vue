<template>
  <NuxtLink
    :to="`/imoveis/${property.id}`"
    class="group relative rounded-2xl overflow-hidden block bg-slate-100 flex-shrink-0"
    style="aspect-ratio: 4/3;"
  >
    <img
      v-if="property.coverPhotoUrl"
      :src="property.coverPhotoUrl"
      :alt="property.title"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div v-else class="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14 text-slate-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>

    <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

    <span
      class="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full text-white"
      :style="{ backgroundColor: operationColor }"
    >
      {{ operationLabel }}
    </span>

    <button
      class="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors"
      @click.prevent
      aria-label="Favoritar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>

    <div class="absolute bottom-0 left-0 right-0 p-4">
      <p v-if="property.price" class="text-white font-bold text-base leading-tight">
        {{ formattedPrice }}
        <span v-if="property.operation === 'RENT'" class="text-xs font-normal text-slate-300">/mês</span>
      </p>
      <p class="text-slate-200 text-sm line-clamp-1 mt-0.5">{{ property.title }}</p>
      <div class="flex items-center gap-3 mt-1.5">
        <span v-if="property.bedrooms" class="flex items-center gap-1 text-slate-300 text-xs">
          <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          {{ property.bedrooms }} qtos
        </span>
        <span v-if="property.areaTotal" class="flex items-center gap-1 text-slate-300 text-xs">
          <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ property.areaTotal }}m²
        </span>
        <span v-if="property.addressCity" class="text-slate-400 text-xs truncate">
          {{ property.addressCity }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'

const props = defineProps<{
  property: PublicPropertySummary
}>()

const operationLabel = computed(() => ({
  SALE: 'Venda',
  RENT: 'Aluguel',
  SEASONAL: 'Lançamento',
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
