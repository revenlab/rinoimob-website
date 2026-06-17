# rinoimob-website — Rules & History

## Tech Stack
- **Framework**: Nuxt 3 SSR (TypeScript, strict mode)
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **State**: `ref`/`computed` via Vue 3 Composition API
- **HTTP**: `$fetch` via Nuxt (no axios)
- **Routing**: File-based (`pages/`)
- **Validation**: ignore frontend type-check commands by default; use `npm run build` unless explicitly asked otherwise.

## Key Composables
| Composable | Location | Purpose |
|---|---|---|
| `useTenantConfig()` | `composables/useTenantConfig.ts` | Resolves tenant from subdomain or `?tenant=` query param, fetches `TenantWebsiteConfig` |
| `usePublicApi()` | `composables/usePublicApi.ts` | `listProperties(slug, params)`, `getProperty(slug, id)`, `createLead(slug, data)` |
| `useAuth()` | `composables/useAuth.ts` | Authentication state |
| `useAuthApi()` | `composables/useAuthApi.ts` | Login/logout API calls |
| `useLocalStorageFavorites()` | `composables/useLocalStorageFavorites.ts` | Manage favorite properties in localStorage (add, remove, toggle, check) |
| `useCountryDDI()` | `composables/useCountryDDI.ts` | List 24 countries with DDI codes, Brazil default (+55) |

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
- `TenantWebsiteConfig` — branding/config (`primaryColor`, `secondaryColor`, `heroTitle`, `featuredSectionTitle`, `ctaSectionTitle`, etc.)
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
2. **Imóveis em Destaque** — filter tabs (Comprar/Alugar/Temporada) + 4-col property card grid
3. **Lançamentos Exclusivos** — categoria global `lancamentos`, 4-col grid with nav arrows
4. **Categorias** — 4 gradient cards: Casas, Apartamentos, Comerciais, Terrenos
5. **Serviços Exclusivos** — dark `cfg.primaryColor` bg, services checklist left + lead form right
6. **Stats** — configurable heading/subheading + 4 metrics
7. **Dicas e Conteúdos** — configurable heading/subheading + 3 static blog post cards
8. **CTA Banner** — configurable heading/subheading + two CTA buttons

### `pages/imoveis/index.vue` — Listing page
### `pages/imoveis/[id].vue` — Property detail
### `pages/auth/login.vue` — Login form

---

## Components
| Component | Purpose |
|---|---|
| `components/PropertyCard.vue` | Reusable property card (image bg, price overlay, operation badge, specs row). Props: `property: PublicPropertySummary`. Heart button to add/remove favorites |
| `components/FavoritesModal.vue` | Modal showing all favorited properties with remove button. Props: `isOpen: boolean`. Emits `close` event |
| `components/PropertyNotFoundForm.vue` | "Didn't find what you're looking for?" lead form. Fields: name (required), email, phone, description (required). Props: `propertyId: string` |
| `components/PhoneInput.vue` | Two-part phone input with country DDI selector. Props: `v-model`, `placeholder`, `required`. Default: Brazil (+55) |

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
- Detalhe público do imóvel: seção "Localização" usa Google Maps por iframe sem API key, priorizando `lat`/`lng` quando cadastrados e caindo para endereço formatado quando não houver coordenadas.
- **MVP Pendência 1 / DDI revalidation (issue44)**: `PhoneInput.vue` now mirrors the app behavior for DDI state: detects the country from an existing `+DDI` model value, re-emits the phone when the selected country changes, emits an empty string when cleared, and uses an explicit outside-click listener instead of `@click.outside`.
- **Favorites localStorage (issue39)**: Added `useLocalStorageFavorites()` composable to persist favorites across sessions using localStorage key `rinoimob_favorites`. Heart button on PropertyCard shows filled/unfilled state. Header shows badge counter with favorites count. Created `FavoritesModal.vue` to display all favorited properties with remove functionality.
- **Favorites sync fix**: `useLocalStorageFavorites()` now keeps a shared `useState` cache so header, cards and detail pages stay in sync. `FavoritesModal.vue` loads each favorite through `usePublicApi().getProperty()` using the tenant slug instead of relying on an unsupported bulk `ids` query.
- **Favorites heart spacing fix**: PropertyCard favorite button now uses a larger hit area (`w-11 h-11`) and a 5px icon so the filled heart is not clipped at the card corner.
- **Favorites icons library**: Replaced inline heart SVGs with `@heroicons/vue` (`HeartIcon` solid/outline) in card, header, detail page and favorites modal for consistent rendering.
- **Favorites modal photos fix**: Modal now resolves image with fallback order `coverPhotoUrl -> photos.isCover -> first photo`, so favorited properties display their photos reliably.
- **PropertyNotFoundForm (issue46)**: Created `PropertyNotFoundForm.vue` component for lead capture at bottom of property detail page. Form fields: name (required), email, phone, description (required). Validates and submits to `/api/public/leads` with propertyId. Shows success/error messages and clears form after submission.
- **DDI Phone Selector (issue44)**: Created `useCountryDDI()` composable with 24 countries (Brazil default). Created `PhoneInput.vue` component with dropdown DDI selector and phone field. Replaces phone input in property detail page. Phone field auto-formats with country code, emits formatted number (`+DD + digits`).
- **DDI applied in all website forms**: `PhoneInput` now also powers the homepage services form (`pages/index.vue`) and the "Não encontrou o que procura?" form (`components/PropertyNotFoundForm.vue`), not only the property detail sidebar.
- **DDI countries data fix**: Corrected country label for `VE +58` from "Uruguai" to "Venezuela" in `useCountryDDI.ts`.
- **Property detail page heart button**: Added heart button next to title in property detail page. Uses `useLocalStorageFavorites()` to toggle favorite state with visual feedback (filled red heart when favorited).
- **Homepage visual refactor**: Rewrote `pages/index.vue` to match Figma mockup — split hero, tabbed featured section, launches, categories, services+form, stats, blog, CTA
- **Lançamentos da home**: seção de lançamentos agora consulta `categorySlug=lancamentos` no público; links do header/footer e a listagem pública também entendem `categorySlug`. `SEASONAL` voltou a ser rotulado como `Temporada`.
- **CMS de home**: `TenantWebsiteConfig` agora carrega títulos/subtítulos editáveis para as seções principais e `pages/index.vue` consome esses campos; `useTenantConfig` faz merge completo com defaults.
- **PropertyCard hover effect**: Added sliding action bar at bottom (translate-y-full → translate-y-0 on group-hover). Shows "Ver Detalhes" + chat bubble button. Info panel shifts up (`group-hover:pb-16`) to reveal action bar. Card lifts on hover (`hover:shadow-2xl hover:-translate-y-1`).
- **Carousel — Imóveis em Destaque**: Replaced static 4-col grid with paginated carousel. State: `featuredPage`, `featuredPages` (chunks of 4), `featuredTotalPages`. Nav arrows (prev/next, disabled at bounds) + dot indicators. Page resets on tab change.
- **Carousel — Lançamentos Exclusivos**: Same carousel pattern — `launchesPage`, `launchesPages`, `launchesTotalPages`, prev/next functions, dot indicators. Arrow buttons now wired (previously decorative).
- **PropertyCard component**: Created `components/PropertyCard.vue` (reusable, previously inline)
- **Layout update**: Added Serviços + Blog nav links; footer expanded to 4-column grid with newsletter + social icon buttons
- **Tenant connection**: Removed duplicate `getTenantSlug()` from `imoveis/index.vue` and `imoveis/[id].vue` — all pages now use `useTenantConfig().resolveSlug()` consistently. `imoveis/index.vue` now uses `<PropertyCard>` component. Hardcoded colors (`#2563EB`, `#1e2d4d`) replaced with `cfg.primaryColor` in listing + detail pages.
- **Hero banner image**: `types/tenant.ts` — added `heroImageUrl?: string | null` to `TenantWebsiteConfig`. `pages/index.vue` hero card now renders uploaded image as absolute background with dark overlay (linear-gradient to top), falling back to primary color gradient. Text colors adapt (white over image, slate over gradient).
- **Hero image bugfix**: `composables/useTenantConfig.ts` `mergeTenantConfig()` now maps `heroImageUrl`. Before this, the field was dropped in merge and never reached `pages/index.vue`, so the hero image did not render even when upload/API were correct.
- **Conversão de leads instrumentada**: formulários públicos enviam `source` detalhado no payload (`PORTAL_HOME_FORM` na home e `PORTAL_PROPERTY_FORM` no detalhe do imóvel), permitindo segmentação de origem diretamente no CRM de leads.
- **SEO do website**: `layouts/default.vue` agora injeta defaults globais (lang, theme-color, og site_name, favicon). Home, listagem e detalhe têm canonical, meta OG/Twitter e JSON-LD. Também existem rotas server-side `robots.txt` e `sitemap.xml` por tenant.
- **Blog em produção (API real)**: páginas `pages/blog/index.vue` e `pages/blog/[slug].vue` agora consomem `/api/v1/public/blog-posts` e `/api/v1/public/blog-posts/{slug}` por tenant; home também puxa os 3 posts mais recentes da API e o `sitemap.xml` inclui posts publicados retornados do backend.
- **Lançamentos mais verticais na home**: `components/PropertyCard.vue` agora suporta `cardVariant` (`default` e `vertical`) com controle de proporção (`aspect-[4/3]` e `aspect-[4/5]`). Em `pages/index.vue`, os cards da seção de lançamentos usam `card-variant="vertical"` para aumentar a altura dos boxes.
- **Filtros públicos alinhados com backend (#22)**: `composables/usePublicApi.ts` (`listProperties`) passou a aceitar também `minPrice` e `bedrooms` além de `maxPrice`/`city`/`operation`/`propertyType`/`categorySlug`, serializando esses params para `/api/v1/public/properties`.
- **Busca e filtros expandidos na listagem pública (#22)**:
  - `composables/usePublicApi.ts` agora aceita também `q` (busca textual) além dos filtros numéricos.
  - `pages/imoveis/index.vue` ganhou barra de filtros mais completa com `q`, `city`, `propertyType`, `minPrice`, `maxPrice` e `bedrooms`.
  - Estado/URL dos filtros foi atualizado para preservar `q`, `minPrice` e `bedrooms` no query string e no reset de filtros.
- **Geospatial/caching no catálogo público (#22)**:
  - `usePublicApi.listProperties()` agora também serializa `latitude`, `longitude` e `radiusKm` quando presentes.
  - `pages/imoveis/index.vue` preserva esses parâmetros no estado e na URL para permitir links de busca por localização.
- **Plantas públicas no detalhe (#41)**: `types/property.ts` agora modela `floorPlans` no contrato público; `pages/imoveis/[id].vue` renderiza a seção "Plantas" entre descrição e comodidades, com imagem destacada (`isCover`/`position === 0`) e grade responsiva para fotos adicionais.
