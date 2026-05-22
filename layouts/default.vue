<template>
  <div class="flex flex-col min-h-screen bg-[#F1F5F9]">
    <header class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <img v-if="cfg.logoUrl" :src="cfg.logoUrl" :alt="cfg.companyName || 'Logo'" class="h-8 object-contain" />
          <span v-else class="text-xl font-bold tracking-tight" :style="{ color: cfg.primaryColor }">
            {{ cfg.companyName }}
          </span>
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/imoveis" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Imóveis</NuxtLink>
          <NuxtLink to="/imoveis?operation=SEASONAL" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Lançamentos</NuxtLink>
          <a href="#sobre" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sobre</a>
        </nav>
        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm font-medium" :style="{ color: cfg.primaryColor }">Entrar</NuxtLink>
          <button class="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-slate-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <NuxtLink to="/imoveis" class="text-sm font-semibold text-white px-4 py-2 rounded-full" :style="{ backgroundColor: cfg.secondaryColor }">
            Anunciar Imóvel
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="text-white" :style="{ backgroundColor: cfg.primaryColor }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img v-if="cfg.logoUrl" :src="cfg.logoUrl" :alt="cfg.companyName || 'Logo'" class="h-10 object-contain mb-2" />
            <span v-else class="text-2xl font-bold text-white">{{ cfg.companyName }}</span>
            <p class="mt-2 text-slate-300 text-sm">{{ cfg.description }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-3">Links rápidos</h3>
            <ul class="space-y-2 text-sm text-slate-300">
              <li><NuxtLink to="/imoveis" class="hover:text-white transition-colors">Imóveis à venda</NuxtLink></li>
              <li><NuxtLink to="/imoveis?operation=RENT" class="hover:text-white transition-colors">Imóveis para alugar</NuxtLink></li>
              <li><NuxtLink to="/imoveis?operation=SEASONAL" class="hover:text-white transition-colors">Temporada</NuxtLink></li>
              <li><NuxtLink to="/auth/login" class="hover:text-white transition-colors">Área do corretor</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-3">Contato</h3>
            <ul class="space-y-2 text-sm text-slate-300">
              <li v-if="cfg.email">{{ cfg.email }}</li>
              <li v-if="cfg.phone">{{ cfg.phone }}</li>
              <li v-if="cfg.address">{{ cfg.address }}</li>
            </ul>
            <div v-if="cfg.instagramUrl || cfg.whatsappNumber || cfg.facebookUrl" class="flex gap-4 mt-3">
              <a
                v-if="cfg.instagramUrl"
                :href="cfg.instagramUrl"
                target="_blank"
                rel="noopener"
                class="text-slate-300 hover:text-white transition-colors text-sm"
              >Instagram</a>
              <a
                v-if="cfg.whatsappNumber"
                :href="`https://wa.me/${cfg.whatsappNumber}`"
                target="_blank"
                rel="noopener"
                class="text-slate-300 hover:text-white transition-colors text-sm"
              >WhatsApp</a>
              <a
                v-if="cfg.facebookUrl"
                :href="cfg.facebookUrl"
                target="_blank"
                rel="noopener"
                class="text-slate-300 hover:text-white transition-colors text-sm"
              >Facebook</a>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <p>© {{ new Date().getFullYear() }} {{ cfg.companyName }}. Todos os direitos reservados.</p>
          <p>Plataforma de gestão imobiliária</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

const { useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

useHead({
  titleTemplate: (title) => title ? `${title} | ${cfg.value.companyName}` : cfg.value.companyName || 'Rinoimob',
  link: computed(() => cfg.value.faviconUrl ? [{ rel: 'icon', href: cfg.value.faviconUrl }] : []),
})
</script>
