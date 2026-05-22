# rinoimob-website — Rules & History

## Tech Stack
- **Framework**: Nuxt 3 SSR (TypeScript, strict mode)
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **State**: `ref`/`computed` via Vue 3 Composition API
- **HTTP**: `$fetch` via Nuxt (no axios)
- **Routing**: File-based (`pages/`)

## Key Composables
| Composable | Location | Purpose |
|---|---|---|
| `useTenantConfig()` | `composables/useTenantConfig.ts` | Resolves tenant from subdomain or `?tenant=` query param, fetches `TenantWebsiteConfig` |
| `usePublicApi()` | `composables/usePublicApi.ts` | `listProperties(slug, params)`, `getProperty(slug, id)`, `createLead(slug, data)` |
| `useAuth()` | `composables/useAuth.ts` | Authentication state |
| `useAuthApi()` | `composables/useAuthApi.ts` | Login/logout API calls |

## API Endpoints Used
- `GET /api/v1/public/config` — tenant website config (via `X-Tenant-Slug` header)
- `GET /api/v1/public/properties` — paginated property listing with filters
- `GET /api/v1/public/properties/:id` — property detail
- `POST /api/v1/public/leads` — submit contact/lead form

## Tenant Resolution
- **Server-side**: reads `Host` header → splits subdomain
- **Client-side**: reads `window.location.hostname` → splits subdomain
- **Localhost fallback**: uses `?tenant=` query param, defaults to `demo`

## Key Types
- `TenantWebsiteConfig` — branding/config (`primaryColor`, `secondaryColor`, `heroTitle`, etc.)
- `DEFAULT_TENANT_CONFIG` — fallback if API fails (`primaryColor: #1e2d4d`, `secondaryColor: #2563EB`)
- `PublicPropertySummary` — list card data (id, title, price, operation, type, area, bedrooms, etc.)
- `PublicPropertyDetail` — full detail + photos/amenities/categories
- `PublicLeadRequest` — `{ name, email?, phone?, message?, propertyId? }`

## Property Operations & Types
- Operations: `SALE | RENT | SEASONAL`
- Types: `HOUSE | APARTMENT | LAND | COMMERCIAL | RURAL`

---

## Page Structure

### `pages/index.vue` — Homepage (last updated: visual refactor to match Figma mockup)
Sections (top → bottom):
1. **Hero** — split 2-col layout (text+search left, branded card right), floating stats badges
2. **Imóveis em Destaque** — filter tabs (Comprar/Alugar/Na Planta) + 4-col property card grid
3. **Lançamentos Exclusivos** — SEASONAL properties, 4-col grid with nav arrows
4. **Categorias** — 4 gradient cards: Casas, Apartamentos, Comerciais, Terrenos
5. **Serviços Exclusivos** — dark `cfg.primaryColor` bg, services checklist left + lead form right
6. **Stats** — 4 metrics (2.500+ vendidos, 10k+ clientes, 15+ anos, 12 prêmios)
7. **Dicas e Conteúdos** — 3 static blog post cards with gradient placeholders
8. **CTA Banner** — dark rounded rectangle, two CTA buttons

### `pages/imoveis/index.vue` — Listing page
### `pages/imoveis/[id].vue` — Property detail
### `pages/auth/login.vue` — Login form

---

## Components
| Component | Purpose |
|---|---|
| `components/PropertyCard.vue` | Reusable property card (image bg, price overlay, operation badge, specs row). Props: `property: PublicPropertySummary` |

---

## Layout (`layouts/default.vue`)
- **Navbar**: Logo, Imóveis, Lançamentos, Serviços, Blog | Entrar, ♡, Anunciar Imóvel
- **Footer**: 4 columns — Brand+socials, Empresa links, Serviços links, Newsletter signup
- Uses `cfg.primaryColor` for footer bg and brand accents
- Uses `cfg.secondaryColor` for the "Anunciar Imóvel" button

---

## Design Conventions
- All brand colors come from `cfg.primaryColor` / `cfg.secondaryColor` — never hardcode
- Card border radius: `rounded-2xl` (property cards), `rounded-3xl` (hero, CTA banner)
- Glassmorphism for overlaid UI: `bg-white/10 backdrop-blur-sm border border-white/20`
- Section spacing: `py-16` standard, hero `py-16 lg:py-24`
- Grid: `grid-cols-2 lg:grid-cols-4` for property/category grids
- Gradient placeholder backgrounds used for categories and blog cards (no external image CDN dependency)

---

## Patterns to Follow
```vue
<!-- Tenant config in any page -->
const { useTenantConfigData, resolveSlug } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

<!-- API call with tenant slug -->
const { listProperties } = usePublicApi()
onMounted(async () => {
  const data = await listProperties(resolveSlug(), { page: 0, size: 8, operation: 'SALE' })
})

<!-- Lead submission -->
const { createLead } = usePublicApi()
await createLead(resolveSlug(), { name, email, phone, message })
```

---

## Last Changes
- **Homepage visual refactor**: Rewrote `pages/index.vue` to match Figma mockup — split hero, tabbed featured section, launches, categories, services+form, stats, blog, CTA
- **PropertyCard component**: Created `components/PropertyCard.vue` (reusable, previously inline)
- **Layout update**: Added Serviços + Blog nav links; footer expanded to 4-column grid with newsletter + social icon buttons
- **Tenant connection**: Removed duplicate `getTenantSlug()` from `imoveis/index.vue` and `imoveis/[id].vue` — all pages now use `useTenantConfig().resolveSlug()` consistently. `imoveis/index.vue` now uses `<PropertyCard>` component. Hardcoded colors (`#2563EB`, `#1e2d4d`) replaced with `cfg.primaryColor` in listing + detail pages.
