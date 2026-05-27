<template>
  <div class="bg-[#F1F5F9] min-h-screen">

    <!-- Hero -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              {{ cfg.aboutPageTitle || 'Sobre Nós' }}
            </h1>
            <p class="text-slate-500 text-lg leading-relaxed">
              {{ cfg.aboutPageSubtitle || 'Conheça nossa história, valores e a equipe por trás da ' + (cfg.companyName || 'nossa empresa') + '.' }}
            </p>
          </div>
          <div v-if="cfg.aboutImageUrl" class="rounded-3xl overflow-hidden shadow-xl">
            <img :src="cfg.aboutImageUrl" :alt="cfg.companyName || 'Sobre nós'" class="w-full h-80 object-cover" />
          </div>
          <div v-else class="rounded-3xl overflow-hidden h-80 flex items-center justify-center" :style="{ background: `linear-gradient(135deg, ${cfg.primaryColor || '#1e2d4d'}, ${cfg.secondaryColor || '#2563EB'})` }">
            <svg class="w-24 h-24 text-white/30" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section v-if="cfg.aboutFoundedYear || cfg.aboutTeamCount || cfg.aboutPropertiesCount" class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div v-if="cfg.aboutFoundedYear">
            <p class="text-4xl font-bold" :style="{ color: cfg.primaryColor || '#1e2d4d' }">{{ cfg.aboutFoundedYear }}</p>
            <p class="text-sm text-slate-500 mt-1 font-medium">Fundada em</p>
          </div>
          <div v-if="cfg.aboutTeamCount">
            <p class="text-4xl font-bold" :style="{ color: cfg.primaryColor || '#1e2d4d' }">{{ cfg.aboutTeamCount }}</p>
            <p class="text-sm text-slate-500 mt-1 font-medium">Corretores</p>
          </div>
          <div v-if="cfg.aboutPropertiesCount">
            <p class="text-4xl font-bold" :style="{ color: cfg.primaryColor || '#1e2d4d' }">{{ cfg.aboutPropertiesCount }}</p>
            <p class="text-sm text-slate-500 mt-1 font-medium">Imóveis negociados</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Description -->
    <section v-if="cfg.aboutPageDescription" class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Nossa História</h2>
        <p class="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{{ cfg.aboutPageDescription }}</p>
      </div>
    </section>

    <!-- Mission / Vision / Values -->
    <section v-if="cfg.aboutMission || cfg.aboutVision || cfg.aboutValues" class="max-w-7xl mx-auto px-4 sm:px-6 pb-16" :class="{ 'pt-16': !cfg.aboutPageDescription }">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-if="cfg.aboutMission" class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" :style="{ backgroundColor: `${cfg.primaryColor || '#1e2d4d'}15` }">
            <svg class="w-6 h-6" :style="{ color: cfg.primaryColor || '#1e2d4d' }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Missão</h3>
          <p class="text-slate-600 leading-relaxed">{{ cfg.aboutMission }}</p>
        </div>

        <div v-if="cfg.aboutVision" class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" :style="{ backgroundColor: `${cfg.primaryColor || '#1e2d4d'}15` }">
            <svg class="w-6 h-6" :style="{ color: cfg.primaryColor || '#1e2d4d' }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Visão</h3>
          <p class="text-slate-600 leading-relaxed">{{ cfg.aboutVision }}</p>
        </div>

        <div v-if="cfg.aboutValues" class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" :style="{ backgroundColor: `${cfg.primaryColor || '#1e2d4d'}15` }">
            <svg class="w-6 h-6" :style="{ color: cfg.primaryColor || '#1e2d4d' }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Valores</h3>
          <p class="text-slate-600 leading-relaxed">{{ cfg.aboutValues }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div class="rounded-3xl p-10 md:p-16 text-center text-white" :style="{ background: `linear-gradient(135deg, ${cfg.primaryColor || '#1e2d4d'}, ${cfg.secondaryColor || '#2563EB'})` }">
        <h2 class="text-3xl font-bold mb-3">Fale com nossa equipe</h2>
        <p class="text-white/80 mb-8 max-w-xl mx-auto">Estamos prontos para te ajudar a encontrar o imóvel ideal ou negociar o seu.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a v-if="cfg.whatsappNumber" :href="`https://wa.me/${cfg.whatsappNumber?.replace(/\D/g, '')}`" target="_blank"
            class="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-white/90 transition-colors">
            Falar no WhatsApp
          </a>
          <NuxtLink to="/imoveis"
            class="px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors">
            Ver imóveis
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

const { useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

useSeoMeta({
  title: () => cfg.value.aboutPageTitle || `Sobre - ${cfg.value.companyName || 'Rinoimob'}`,
  description: () => cfg.value.aboutPageSubtitle || cfg.value.description || '',
})
</script>
