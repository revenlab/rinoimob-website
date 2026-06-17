<template>
  <div class="bg-[#F1F5F9] min-h-screen">
    <article class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm font-medium mb-6" :style="{ color: cfg.primaryColor }">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Voltar para o blog
      </NuxtLink>

      <div class="rounded-3xl overflow-hidden border border-slate-200 bg-white">
        <template v-if="post.coverImageUrl">
          <img :src="post.coverImageUrl" :alt="post.title" class="h-64 md:h-80 w-full object-cover" />
        </template>
        <div v-else class="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-indigo-600"></div>

        <div class="p-6 md:p-10">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="{ backgroundColor: `${cfg.primaryColor}15`, color: cfg.primaryColor }">
              Blog
            </span>
            <span class="text-xs text-slate-400">{{ formattedDate }}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{{ post.title }}</h1>
          <p class="text-slate-500 mt-3">{{ post.excerpt }}</p>

          <div class="mt-8 prose prose-slate max-w-none" v-html="post.contentHtml"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { createError } from 'h3'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = String(route.params.slug || '')

const { useTenantConfigData, resolveTenantIdentifier } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

const { getBlogPost } = usePublicApi()
const post = await getBlogPost(resolveTenantIdentifier(), slug).catch(() => null)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Artigo não encontrado' })
}

const requestUrl = useRequestURL()
const canonical = computed(() => new URL(`/blog/${slug}`, requestUrl.origin).toString())
const formattedDate = computed(() =>
  post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''
)

useHead(computed(() => ({
  title: post.title || 'Blog',
  meta: [
    { name: 'description', content: post.excerpt || '' },
    { property: 'og:title', content: post.title || '' },
    { property: 'og:description', content: post.excerpt || '' },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: post.publishedAt || '' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: cfg.value.companyName || 'Rinoimob',
        },
        publisher: {
          '@type': 'Organization',
          name: cfg.value.companyName || 'Rinoimob',
          logo: cfg.value.logoUrl ? { '@type': 'ImageObject', url: cfg.value.logoUrl } : undefined,
        },
        mainEntityOfPage: canonical.value,
      }),
    },
  ],
})))
</script>
