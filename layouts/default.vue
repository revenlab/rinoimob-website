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
          <NuxtLink to="/imoveis?categorySlug=lancamentos" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Lançamentos</NuxtLink>
          <NuxtLink to="/sobre" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sobre</NuxtLink>
          <NuxtLink to="/blog" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Blog</NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm font-medium" :style="{ color: cfg.primaryColor }">Entrar</NuxtLink>
          <button
            @click="showFavoritesModal = true"
            class="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <HeartSolidIcon v-if="favoritesCount > 0" class="block w-4 h-4 text-red-500" />
            <HeartOutlineIcon v-else class="w-5 h-5 text-slate-500" />
            <span v-if="favoritesCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ favoritesCount }}
            </span>
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

    <FavoritesModal :isOpen="showFavoritesModal" @close="showFavoritesModal = false" />

    <footer class="text-white" :style="{ backgroundColor: cfg.primaryColor }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          <!-- Brand -->
          <div>
            <img v-if="cfg.logoUrl" :src="cfg.logoUrl" :alt="cfg.companyName || 'Logo'" class="h-10 object-contain mb-3" />
            <span v-else class="text-xl font-bold text-white block mb-3">{{ cfg.companyName }}</span>
            <p class="text-white/60 text-sm leading-relaxed mb-4">{{ cfg.description }}</p>
            <div class="flex items-center gap-3">
              <a
                v-if="cfg.instagramUrl"
                :href="cfg.instagramUrl"
                target="_blank"
                rel="noopener"
                class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                v-if="cfg.facebookUrl"
                :href="cfg.facebookUrl"
                target="_blank"
                rel="noopener"
                class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                v-if="cfg.whatsappNumber"
                :href="`https://wa.me/${cfg.whatsappNumber}`"
                target="_blank"
                rel="noopener"
                class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.943l6.26-1.444A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.493-5.191-1.357l-.372-.221-3.863.891.945-3.762-.242-.388A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Empresa -->
          <div>
            <h3 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Empresa</h3>
            <ul class="space-y-2.5 text-sm text-white/60">
              <li><NuxtLink to="/sobre" class="hover:text-white transition-colors">Sobre nós</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
              <li><a href="#" class="hover:text-white transition-colors">Carreiras</a></li>
              <li><a :href="`${publicConfig.appUrl}`" class="hover:text-white transition-colors">Área do Corretor</a></li>
            </ul>
          </div>

          <!-- Serviços -->
          <div>
            <h3 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Serviços</h3>
            <ul class="space-y-2.5 text-sm text-white/60">
              <li><NuxtLink to="/imoveis" class="hover:text-white transition-colors">Comprar imóvel</NuxtLink></li>
              <li><NuxtLink to="/imoveis?operation=RENT" class="hover:text-white transition-colors">Alugar imóvel</NuxtLink></li>
              <li><NuxtLink to="/imoveis?categorySlug=lancamentos" class="hover:text-white transition-colors">Lançamentos</NuxtLink></li>
              <li><NuxtLink to="/imoveis" class="hover:text-white transition-colors">Anunciar imóvel</NuxtLink></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h3 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p class="text-white/60 text-sm mb-3">Receba as melhores oportunidades no seu e-mail.</p>
            <div class="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                class="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                class="w-full px-4 py-2.5 rounded-xl bg-white text-sm font-semibold transition-opacity hover:opacity-90"
                :style="{ color: cfg.primaryColor }"
              >
                Inscrever-se
              </button>
            </div>
            <div class="mt-4 space-y-1 text-xs text-white/50">
              <p v-if="cfg.email">{{ cfg.email }}</p>
              <p v-if="cfg.phone">{{ cfg.phone }}</p>
              <p v-if="cfg.address">{{ cfg.address }}</p>
            </div>
          </div>

        </div>
        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {{ new Date().getFullYear() }} {{ cfg.companyName }}. Todos os direitos reservados.</p>
          <p>Plataforma de gestão imobiliária</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

const { useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const route = useRoute()
const requestUrl = useRequestURL()
const { public: publicConfig } = useRuntimeConfig()

const { favorites } = useLocalStorageFavorites()
const showFavoritesModal = ref(false)

const favoritesCount = computed(() => favorites.value.length)

useHead({
  htmlAttrs: { lang: 'pt-BR' },
  titleTemplate: (title) => title ? `${title} | ${cfg.value.companyName}` : cfg.value.companyName || 'Rinoimob',
  link: computed(() => cfg.value.faviconUrl ? [{ rel: 'icon', href: cfg.value.faviconUrl }] : []),
  meta: computed(() => [
    { name: 'theme-color', content: cfg.value.primaryColor || '#1e2d4d' },
    { property: 'og:site_name', content: cfg.value.companyName || 'Rinoimob' },
    { property: 'og:url', content: new URL(route.fullPath, requestUrl.origin).toString() },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]),
})
</script>
