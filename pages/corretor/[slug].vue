<template>
  <main class="min-h-screen bg-slate-50 py-12">
    <div class="mx-auto max-w-5xl px-4 sm:px-6">
      <div v-if="pending" class="rounded-3xl bg-white p-8 text-slate-500 shadow-sm">Carregando perfil...</div>
      <div v-else-if="!broker" class="rounded-3xl bg-white p-8 text-slate-600 shadow-sm">{{ profileUnavailable ? 'Não foi possível carregar o perfil. Tente novamente em instantes.' : 'Corretor não encontrado.' }}</div>
      <template v-else>
        <section class="rounded-3xl p-8 text-white shadow-xl" :style="{ backgroundColor: cfg.primaryColor }">
          <div class="flex items-center gap-5">
            <img v-if="broker.photoUrl" :src="broker.photoUrl" :alt="broker.name" class="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-white/30" />
            <div v-else class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">{{ initials }}</div>
            <div>
              <p class="text-sm text-white/70">Consultor imobiliário</p>
              <h1 class="text-3xl font-bold">{{ broker.name }}</h1>
              <p v-if="broker.bio" class="mt-2 max-w-2xl text-sm text-white/80">{{ broker.bio }}</p>
              <div class="mt-4 flex flex-wrap gap-3">
                <a v-if="broker.phone" :href="`https://wa.me/${broker.phone.replace(/\D/g, '')}`" class="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold" :style="{ color: cfg.primaryColor }">Falar no WhatsApp</a>
                <a v-if="broker.instagramUrl" :href="broker.instagramUrl" target="_blank" rel="noopener noreferrer" class="inline-flex rounded-xl border border-white/40 px-4 py-2 text-sm font-semibold text-white">Instagram</a>
                <span v-if="broker.creci" class="inline-flex items-center rounded-xl bg-white/15 px-4 py-2 text-sm font-medium">CRECI {{ broker.creci }}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="mt-10">
          <h2 class="text-2xl font-bold text-slate-900">Imóveis selecionados por {{ broker.name }}</h2>
          <div v-if="catalogError" class="mt-4 rounded-2xl bg-white p-5 text-slate-600 shadow-sm" role="alert">
            <p>Não foi possível carregar os imóveis. Tente novamente.</p>
            <button type="button" :disabled="loadingMore" class="mt-3 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" @click="loadMore">Tentar novamente</button>
          </div>
          <p v-else-if="!properties.length" class="mt-2 text-slate-500">Nenhum imóvel disponível no momento.</p>
          <div v-if="properties.length" class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><PropertyCard v-for="property in properties" :key="property.id" :property="property" :whatsapp-number="broker.phone" :broker-slug="broker.slug" /></div>
          <button v-if="hasMore && !catalogError" type="button" :disabled="loadingMore" class="mt-6 rounded-xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm disabled:opacity-50" :style="{ color: cfg.primaryColor }" @click="loadMore">{{ loadingMore ? 'Carregando...' : 'Carregar mais' }}</button>
        </section>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PublicPropertySummary } from '~/types/property'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'
import PropertyCard from '~/components/PropertyCard.vue'

const route = useRoute()
definePageMeta({ key: route => route.path })
const { useTenantConfigData, resolveTenantIdentifier } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const api = usePublicApi()
const tenant = resolveTenantIdentifier()
const slug = String(route.params.slug)
const { data: broker, error: profileError, pending } = await useAsyncData(
  `broker-profile-${tenant}-${slug}`, () => api.getBrokerProfile(tenant, slug),
)
const profileUnavailable = computed(() => !!profileError.value && profileError.value.statusCode !== 404)
if (!broker.value) setResponseStatus(profileUnavailable.value ? 503 : 404)
const { data: catalog, error: initialCatalogError } = await useAsyncData(
  `broker-catalog-${tenant}-${slug}`,
  () => broker.value ? api.listBrokerProperties(tenant, slug) : Promise.resolve(null),
)
const properties = ref<PublicPropertySummary[]>([])
properties.value = catalog.value?.content ?? []
const catalogError = ref(!!initialCatalogError.value)
const nextPage = ref(catalog.value ? 1 : 0)
const hasMore = ref(catalog.value ? catalog.value.totalPages > 1 : false)
const loadingMore = ref(false)
const initials = computed(() => broker.value?.name.trim().split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'C')

useSeoMeta({ title: () => broker.value ? `${broker.value.name} | ${cfg.value.companyName}` : 'Corretor não encontrado' })

async function loadMore() {
  if (loadingMore.value || !broker.value) return
  loadingMore.value = true
  try {
    const page = await api.listBrokerProperties(tenant, slug, nextPage.value)
    properties.value = [...properties.value, ...page.content]
    nextPage.value++
    hasMore.value = nextPage.value < page.totalPages
    catalogError.value = false
  } catch {
    catalogError.value = true
  } finally {
    loadingMore.value = false
  }
}
</script>
