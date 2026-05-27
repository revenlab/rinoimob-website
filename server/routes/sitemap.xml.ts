import { defineEventHandler, getRequestHeader, getRequestURL, setHeader, type H3Event } from 'h3'

const getTenantSlug = (event: H3Event): string => {
  const host = getRequestHeader(event, 'host') ?? ''
  if (!host) return 'demo'

  const firstLabel = host.split('.')[0]
  if (!host.includes('.') || firstLabel === 'localhost') {
    return getRequestHeader(event, 'x-tenant-slug') || 'demo'
  }

  return firstLabel
}

export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin
  const tenantSlug = getTenantSlug(event)
  const config = useRuntimeConfig()
  const apiBase = `${config.public.apiUrl.replace(/\/$/, '')}/api/v1/public`

  const properties = await $fetch<{ content: Array<{ id: string }> }>(`${apiBase}/properties?page=0&size=100`, {
    headers: { 'X-Tenant-Slug': tenantSlug },
  }).catch(() => ({ content: [] }))

  const blogPosts = await $fetch<{ content: Array<{ slug: string }> }>(`${apiBase}/blog-posts?page=0&size=100`, {
    headers: { 'X-Tenant-Slug': tenantSlug },
  }).catch(() => ({ content: [] }))

  const urls = [
    `${origin}/`,
    `${origin}/imoveis`,
    `${origin}/blog`,
    ...properties.content.map(property => `${origin}/imoveis/${property.id}`),
    ...blogPosts.content.map(post => `${origin}/blog/${post.slug}`),
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`
})
