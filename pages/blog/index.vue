<template>
  <div class="bg-[#F1F5F9] min-h-screen">
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900">{{ cfg.blogSectionTitle || 'Blog imobiliário' }}</h1>
        <p class="text-slate-500 mt-2">{{ cfg.blogSectionSubtitle || 'Conteúdos para comprar, vender e investir com mais segurança.' }}</p>
      </div>

      <div v-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <NuxtLink
          v-for="post in posts"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl transition-all"
        >
          <template v-if="post.coverImageUrl">
            <img :src="post.coverImageUrl" :alt="post.title" class="h-44 w-full object-cover" />
          </template>
          <div v-else class="h-44 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="{ backgroundColor: `${cfg.primaryColor}15`, color: cfg.primaryColor }">
                Blog
              </span>
              <span class="text-xs text-slate-400">{{ post.publishedAt ? formatDate(post.publishedAt) : '' }}</span>
            </div>
            <h2 class="text-lg font-semibold text-slate-900 group-hover:opacity-80 transition-opacity">{{ post.title }}</h2>
            <p class="text-sm text-slate-500 mt-2">{{ post.excerpt || 'Sem resumo disponível.' }}</p>
            <span class="inline-flex items-center gap-1 mt-4 text-sm font-semibold" :style="{ color: cfg.primaryColor }">
              Ler artigo
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Nenhum artigo publicado até o momento.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

const { useTenantConfigData, resolveTenantIdentifier } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

const { listBlogPosts } = usePublicApi()
const slug = resolveTenantIdentifier()
const postsResponse = await listBlogPosts(slug, { page: 0, size: 24 }).catch(() => ({ content: [] }))
const posts = computed(() => postsResponse.content)

const requestUrl = useRequestURL()
const canonical = computed(() => new URL('/blog', requestUrl.origin).toString())
const description = computed(() => cfg.value.blogSectionSubtitle || 'Conteúdos sobre compra, venda, locação e investimento imobiliário.')

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

useHead(computed(() => ({
  title: 'Blog',
  meta: [
    { name: 'description', content: description.value },
    { property: 'og:title', content: `${cfg.value.companyName || 'Rinoimob'} | Blog` },
    { property: 'og:description', content: description.value },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${cfg.value.companyName || 'Rinoimob'} Blog`,
        url: canonical.value,
        blogPost: posts.value.slice(0, 20).map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.publishedAt,
          url: new URL(`/blog/${post.slug}`, requestUrl.origin).toString(),
        })),
      }),
    },
  ],
})))
</script>
