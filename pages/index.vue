<template>
  <div class="bg-white">

    <!-- ============================================
         HERO
    ============================================= -->
    <section
      ref="heroRef"
      class="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 overflow-x-hidden"
      @mousemove="onHeroMouseMove"
      @mouseleave="resetMouse"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- Left: Text + Search -->
          <div class="order-2 lg:order-1">
            <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {{ cfg.companyName || 'Líder em tecnologia imobiliária' }}
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] mb-5">
              {{ cfg.heroTitle || 'Encontre o lugar onde sua história começa.' }}
            </h1>

            <p class="text-slate-500 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              {{ cfg.heroSubtitle || cfg.description || 'A plataforma mais completa para quem busca comprar, alugar ou investir em imóveis com segurança e transparência.' }}
            </p>

            <!-- Search bar -->
            <div class="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 flex flex-col sm:flex-row gap-0 max-w-lg">
              <div class="flex-1 flex items-center gap-2 px-3">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cidade, bairro ou endereço"
                  class="flex-1 py-3 text-slate-700 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <div class="h-px sm:h-auto sm:w-px bg-slate-100 mx-0 sm:mx-0"></div>
              <select
                v-model="searchType"
                class="sm:w-36 px-3 py-3 text-slate-500 text-sm focus:outline-none bg-transparent border-t border-slate-100 sm:border-t-0"
              >
                <option value="">Tipo</option>
                <option v-for="type in propertyTypes" :key="type.code" :value="type.code">{{ type.label }}</option>
              </select>
              <button
                @click="doSearch"
                class="px-6 py-3 text-white font-semibold rounded-xl text-sm transition-opacity hover:opacity-90 flex-shrink-0 m-1"
                :style="{ backgroundColor: cfg.primaryColor }"
              >
                Buscar
              </button>
            </div>
          </div>

          <!-- Right: Illustration card -->
          <div class="order-1 lg:order-2 relative" style="perspective: 1200px;">
            <div
              class="rounded-3xl overflow-hidden shadow-2xl relative"
              :style="[{ 'aspect-ratio': '4/3' }, heroCardStyle]"
            >
              <!-- Hero background image (when configured) -->
              <img
               v-if="cfg.heroImageUrl"
               :src="cfg.heroImageUrl"
               alt="Banner"
               class="absolute inset-0 w-full h-full object-cover"
              >
              <!-- Background gradient: solid when no image, overlay when image exists -->
              <div
               class="absolute inset-0"
               :style="cfg.heroImageUrl
                 ? { background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)' }
                 : { background: `linear-gradient(135deg, ${cfg.primaryColor}22 0%, ${cfg.primaryColor}44 100%)` }"
              ></div>
              <!-- Content overlay -->
              <div class="relative w-full h-full flex flex-col items-center justify-center">
               <div class="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-lg" :style="{ backgroundColor: cfg.heroImageUrl ? 'rgba(255,255,255,0.15)' : cfg.primaryColor }">
                 <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                 </svg>
               </div>
               <p class="font-bold text-xl" :class="cfg.heroImageUrl ? 'text-white' : 'text-slate-700'">{{ cfg.companyName }}</p>
               <p class="text-sm mt-1" :class="cfg.heroImageUrl ? 'text-white/80' : 'text-slate-500'">Seu próximo imóvel está aqui</p>
              </div>
            </div>

            <!-- Floating stats badge -->
            <div
              class="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
              :style="badge1Style"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :style="{ backgroundColor: cfg.primaryColor + '18' }">
                ⭐
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm leading-tight">4.9 / 5.0</p>
                <p class="text-slate-400 text-xs">10k+ Atendidos</p>
              </div>
            </div>

            <!-- Second floating badge -->
            <div
              class="absolute top-6 right-6 bg-white rounded-2xl px-4 py-3 shadow-xl"
              :style="badge2Style"
            >
              <p class="font-bold text-slate-900 text-sm">2.500+</p>
              <p class="text-slate-400 text-xs">Imóveis listados</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================
         IMÓVEIS EM DESTAQUE
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
        <h2 class="text-2xl font-bold text-slate-900">{{ cfg.featuredSectionTitle || 'Imóveis em Destaque' }}</h2>
        <p class="text-slate-500 text-sm mt-1">{{ cfg.featuredSectionSubtitle || 'As melhores oportunidades selecionadas por nossa equipe especializada para você.' }}</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- Nav arrows -->
          <div class="flex items-center gap-1">
            <button
              @click="prevFeatured"
              :disabled="featuredPage === 0"
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              aria-label="Anterior"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              @click="nextFeatured"
              :disabled="featuredPage >= featuredTotalPages - 1"
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              aria-label="Próximo"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          <!-- Tabs -->
          <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
            <button
              v-for="tab in featuredTabs"
              :key="tab.value"
              @click="activeFeaturedTab = tab.value; loadFeatured()"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              :class="activeFeaturedTab === tab.value ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              :style="activeFeaturedTab === tab.value ? { backgroundColor: cfg.primaryColor } : undefined"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="featuredPending" class="flex justify-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: cfg.primaryColor + '40', borderTopColor: 'transparent' }"></div>
      </div>

      <template v-else-if="featuredProperties.length">
        <!-- Carousel track -->
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${featuredPage * 100}%)` }"
          >
            <div
              v-for="(page, pageIdx) in featuredPages"
              :key="pageIdx"
              class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full flex-shrink-0"
            >
              <PropertyCard
                v-for="p in page"
                :key="p.id"
                :property="p"
                :whatsapp-number="cfg.whatsappNumber"
              />
            </div>
          </div>
        </div>

        <!-- Dots pagination -->
        <div class="flex justify-center items-center gap-2 mt-6">
          <button
            v-for="(_, i) in featuredTotalPages"
            :key="i"
            @click="featuredPage = i"
            class="h-2 rounded-full transition-all duration-300"
            :class="i === featuredPage ? 'w-6' : 'w-2 bg-slate-200 hover:bg-slate-300'"
            :style="i === featuredPage ? { backgroundColor: cfg.primaryColor, width: '1.5rem' } : undefined"
            :aria-label="`Página ${i + 1}`"
          ></button>
        </div>
      </template>

      <div v-else class="text-center py-16 text-slate-400">
        <p>Nenhum imóvel disponível no momento.</p>
      </div>

      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/imoveis"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all hover:shadow-md"
          :style="{ borderColor: cfg.primaryColor, color: cfg.primaryColor }"
        >
          Ver todos os imóveis
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- ============================================
         LANÇAMENTOS EXCLUSIVOS
    ============================================= -->
    <section class="bg-slate-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">{{ cfg.launchesSectionTitle || 'Lançamentos Exclusivos' }}</h2>
            <p class="text-slate-500 text-sm mt-1">{{ cfg.launchesSectionSubtitle || 'Projetos arquitetônicos que definem o futuro de morar bem.' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="prevLaunches"
              :disabled="launchesPage === 0"
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              aria-label="Anterior"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              @click="nextLaunches"
              :disabled="launchesPage >= launchesTotalPages - 1"
              class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              aria-label="Próximo"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="launchesPending" class="flex justify-center py-16">
          <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: cfg.primaryColor + '40', borderTopColor: 'transparent' }"></div>
        </div>

        <template v-else-if="launches.length">
          <!-- Carousel track -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${launchesPage * 100}%)` }"
            >
              <div
                v-for="(page, pageIdx) in launchesPages"
                :key="pageIdx"
                class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full flex-shrink-0"
              >
                <PropertyCard
                  v-for="p in page"
                  :key="p.id"
                  :property="p"
                  :whatsapp-number="cfg.whatsappNumber"
                  card-variant="vertical"
                  price-prefix="A partir de"
                />
              </div>
            </div>
          </div>

          <!-- Dots pagination -->
          <div class="flex justify-center items-center gap-2 mt-6">
            <button
              v-for="(_, i) in launchesTotalPages"
              :key="i"
              @click="launchesPage = i"
              class="h-2 rounded-full transition-all duration-300"
              :class="i === launchesPage ? 'w-6' : 'w-2 bg-slate-200 hover:bg-slate-300'"
              :style="i === launchesPage ? { backgroundColor: cfg.primaryColor, width: '1.5rem' } : undefined"
              :aria-label="`Página ${i + 1}`"
            ></button>
          </div>
        </template>

        <div v-else class="text-center py-12 text-slate-400">
          <p>Nenhum lançamento disponível no momento.</p>
        </div>
      </div>
    </section>

    <!-- ============================================
         CATEGORIAS
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">{{ cfg.categoriesSectionTitle || 'Categorias' }}</h2>
          <p class="text-slate-500 text-sm mt-1">{{ cfg.categoriesSectionSubtitle || 'Explore imóveis por estilo e necessidade.' }}</p>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <button
            type="button"
            class="w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-colors"
            aria-label="Ver categorias anteriores"
            @click="scrollCategories(-1)"
          >
            ←
          </button>
          <button
            type="button"
            class="w-10 h-10 rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-colors"
            aria-label="Ver próximas categorias"
            @click="scrollCategories(1)"
          >
            →
          </button>
        </div>
      </div>
      <div ref="categoriesCarousel" class="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.type"
          :to="`/imoveis?propertyType=${cat.type}`"
          class="group relative shrink-0 w-[78vw] sm:w-[290px] lg:w-[calc((100%-2rem)/3)] rounded-2xl overflow-hidden block cursor-pointer snap-start"
          style="aspect-ratio: 4/3;"
        >
          <div
            class="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
            :style="categoryCardStyle(cat)"
          ></div>
          <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
          <div class="absolute inset-0 flex flex-col justify-end p-4">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="cat.iconPath" />
              </svg>
            </div>
            <p class="text-white font-semibold text-base leading-tight">{{ cat.label }}</p>
            <p class="text-white/70 text-xs mt-0.5">{{ cat.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ============================================
         SERVIÇOS EXCLUSIVOS
    ============================================= -->
    <section class="py-16" :style="{ backgroundColor: cfg.primaryColor }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Services list -->
          <div>
            <h2 class="text-3xl font-bold text-white mb-2">{{ cfg.servicesSectionTitle || 'Serviços Exclusivos para Proprietários' }}</h2>
            <p class="text-white/60 text-sm mb-8">
              {{ cfg.servicesSectionSubtitle || 'Oferecemos suporte completo para você tomar as melhores decisões com tranquilidade.' }}
            </p>
            <ul class="space-y-5">
              <li v-for="srv in services" :key="srv.title" class="flex items-start gap-4">
                <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">{{ srv.title }}</p>
                  <p class="text-white/60 text-xs mt-0.5">{{ srv.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Contact form card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 class="text-white font-bold text-base mb-1">{{ cfg.servicesFormTitle || 'Informações de Contato' }}</h3>
            <p class="text-white/60 text-xs mb-5">{{ cfg.servicesFormSubtitle || 'Preencha abaixo e um especialista entrará em contato.' }}</p>
            <form @submit.prevent="submitLead" class="space-y-3">
              <input
                v-model="leadForm.name"
                type="text"
                placeholder="Nome completo"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                v-model="leadForm.email"
                type="email"
                placeholder="Seu e-mail"
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <div class="[&>div>button]:bg-white/10 [&>div>button]:border-white/20 [&>div>button]:text-white [&>div>button]:hover:bg-white/20 [&>div>button_span.text-slate-500]:text-white/70 [&>div>input]:bg-white/10 [&>div>input]:border-white/20 [&>div>input]:text-white [&>div>input]:placeholder-white/40 [&>div>input]:focus:border-white/50">
                <PhoneInput v-model="leadForm.phone" placeholder="WhatsApp com DDD" />
              </div>
              <button
                type="submit"
                :disabled="leadSubmitting || leadSent"
                class="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-70 mt-1"
                :style="{ backgroundColor: cfg.secondaryColor || '#FF6B35', color: '#fff' }"
              >
                {{ leadSent ? '✓ Enviado com sucesso!' : leadSubmitting ? 'Enviando...' : 'Próxima Etapa' }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================
         STATS
    ============================================= -->
    <section class="bg-white border-b border-slate-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold text-slate-900">{{ cfg.statsSectionTitle || 'Nossa presença no mercado' }}</h2>
          <p class="text-slate-500 text-sm mt-1">{{ cfg.statsSectionSubtitle || 'Indicadores que mostram a força da nossa operação.' }}</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div
              class="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              :style="{ backgroundColor: cfg.primaryColor + '15' }"
            >
              <svg class="w-6 h-6" :style="{ color: cfg.primaryColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="stat.iconPath" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="text-slate-500 text-sm mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         DICAS E CONTEÚDOS
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">{{ cfg.blogSectionTitle || 'Dicas e Conteúdos' }}</h2>
          <p class="text-slate-500 text-sm mt-1">{{ cfg.blogSectionSubtitle || 'Fique por dentro das tendências do mercado imobiliário.' }}</p>
        </div>
        <NuxtLink
          to="/blog"
          class="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
          :style="{ color: cfg.primaryColor }"
        >
          Ver Blog
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <NuxtLink v-for="post in blogPosts" :key="post.slug" :to="`/blog/${post.slug}`" class="group cursor-pointer block">
          <div class="rounded-2xl overflow-hidden mb-4" style="aspect-ratio: 16/9;">
            <img
              v-if="post.coverImageUrl"
              :src="post.coverImageUrl"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            >
            <div
              v-else
              class="w-full h-full transition-transform duration-300 group-hover:scale-105 bg-gradient-to-br from-blue-500 to-indigo-600"
            ></div>
          </div>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full"
            :style="{ backgroundColor: cfg.primaryColor + '15', color: cfg.primaryColor }"
          >
            Blog
          </span>
          <h3 class="font-semibold text-slate-900 mt-2 text-sm leading-snug group-hover:opacity-70 transition-opacity">
            {{ post.title }}
          </h3>
          <p class="text-slate-400 text-xs mt-2 flex items-center gap-1">
            Ler mais
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- ============================================
         CTA BANNER
    ============================================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <div
        class="rounded-3xl py-16 px-8 text-center"
        :style="{ backgroundColor: cfg.primaryColor }"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          {{ cfg.ctaSectionTitle || 'Pronto para encontrar seu novo lar?' }}
        </h2>
        <p class="text-white/70 text-base mb-8 max-w-md mx-auto">
          {{ cfg.ctaSectionSubtitle || 'Nossos corretores estão prontos para te guiar em cada passo dessa jornada.' }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            class="px-8 py-3.5 rounded-full text-sm font-bold bg-white transition-all hover:shadow-lg inline-block"
            :style="{ color: cfg.primaryColor }"
            :disabled="!cfg.whatsappNumber"
            @click="openHomepageWhatsappGate"
          >
            Falar com Especialista
          </button>
          <NuxtLink
            to="/imoveis"
            class="px-8 py-3.5 rounded-full text-sm font-bold border-2 border-white/50 text-white transition-colors hover:bg-white/10 inline-block"
          >
            Ver Catálogo Completo
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { PublicPropertySummary, PublicPropertyType } from '~/types/property'
import type { PublicLeadRequest } from '~/types/property'
import type { PublicBlogPostSummary } from '~/types/blog'
import { DEFAULT_PROPERTY_TYPES } from '~/types/property'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

definePageMeta({ layout: 'default' })

// ── Hero parallax ──────────────────────────────────────────────────────────
const heroRef = ref<HTMLElement | null>(null)
const categoriesCarousel = ref<HTMLElement | null>(null)
const mouseX = ref(0) // -1 to 1
const mouseY = ref(0) // -1 to 1

const onHeroMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

const loadBlogPosts = async () => {
  try {
    const data = await listBlogPosts(resolveTenantIdentifier(), { page: 0, size: 3 })
    blogPosts.value = data.content
  } catch {
    blogPosts.value = []
  }
}
const resetMouse = () => {
  mouseX.value = 0
  mouseY.value = 0
}

// Layer 0 — main card: subtle 3D tilt following cursor
const heroCardStyle = computed(() => ({
  transform: `perspective(800px) rotateX(${-mouseY.value * 5}deg) rotateY(${mouseX.value * 7}deg) translateZ(0)`,
  transition: 'transform 0.18s ease-out',
  willChange: 'transform',
}))

// Layer 1 — badge bottom-left: drifts opposite to cursor (pushes away)
const badge1Style = computed(() => ({
  transform: `translate(${mouseX.value * -16}px, ${mouseY.value * -10}px)`,
  transition: 'transform 0.25s ease-out',
  willChange: 'transform',
}))

// Layer 2 — badge top-right: drifts with cursor, different axis speed
const badge2Style = computed(() => ({
  transform: `translate(${mouseX.value * 20}px, ${mouseY.value * -14}px)`,
  transition: 'transform 0.3s ease-out',
  willChange: 'transform',
}))
// ──────────────────────────────────────────────────────────────────────────

const router = useRouter()
const searchQuery = ref('')
const searchType = ref('')
const activeFeaturedTab = ref<'SALE' | 'RENT' | 'SEASONAL'>('SALE')
const featuredProperties = ref<PublicPropertySummary[]>([])
const propertyTypes = ref<PublicPropertyType[]>(DEFAULT_PROPERTY_TYPES)
const featuredPending = ref(true)
const featuredPage = ref(0)
const featuredItemsPerPage = 4
const featuredPages = computed(() => {
  const result: PublicPropertySummary[][] = []
  for (let i = 0; i < featuredProperties.value.length; i += featuredItemsPerPage) {
    result.push(featuredProperties.value.slice(i, i + featuredItemsPerPage))
  }
  return result
})
const featuredTotalPages = computed(() => Math.max(1, Math.ceil(featuredProperties.value.length / featuredItemsPerPage)))
const prevFeatured = () => { if (featuredPage.value > 0) featuredPage.value-- }
const nextFeatured = () => { if (featuredPage.value < featuredTotalPages.value - 1) featuredPage.value++ }

const launches = ref<PublicPropertySummary[]>([])
const launchesPending = ref(true)
const launchesPage = ref(0)
const launchesItemsPerPage = 4
const launchesPages = computed(() => {
  const result: PublicPropertySummary[][] = []
  for (let i = 0; i < launches.value.length; i += launchesItemsPerPage) {
    result.push(launches.value.slice(i, i + launchesItemsPerPage))
  }
  return result
})
const launchesTotalPages = computed(() => Math.max(1, Math.ceil(launches.value.length / launchesItemsPerPage)))
const prevLaunches = () => { if (launchesPage.value > 0) launchesPage.value-- }
const nextLaunches = () => { if (launchesPage.value < launchesTotalPages.value - 1) launchesPage.value++ }

const leadForm = ref<{ name: string; email: string; phone: string }>({ name: '', email: '', phone: '' })
const leadSubmitting = ref(false)
const leadSent = ref(false)
const blogPosts = ref<PublicBlogPostSummary[]>([])

const { useTenantConfigData, resolveTenantIdentifier } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const { openLeadGate } = useWhatsappLeadGate()
const requestUrl = useRequestURL()
const homepageCanonical = computed(() => new URL('/', requestUrl.origin).toString())

const homepageDescription = computed(() =>
  cfg.value.description || 'Encontre imóveis, publique seu interesse e fale direto com a imobiliária.'
)

useHead(computed(() => ({
  title: 'Imóveis para comprar, alugar e investir',
  meta: [
    { name: 'description', content: homepageDescription.value },
    { property: 'og:title', content: cfg.value.companyName || 'Rinoimob' },
    { property: 'og:description', content: homepageDescription.value },
    { property: 'og:image', content: cfg.value.heroImageUrl || cfg.value.logoUrl || '' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: cfg.value.companyName || 'Rinoimob' },
    { name: 'twitter:description', content: homepageDescription.value },
  ],
  link: [
    { rel: 'canonical', href: homepageCanonical.value },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: cfg.value.companyName || 'Rinoimob',
          url: homepageCanonical.value,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${requestUrl.origin}/imoveis?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: cfg.value.companyName || 'Rinoimob',
          url: homepageCanonical.value,
          logo: cfg.value.logoUrl || undefined,
          sameAs: [cfg.value.instagramUrl, cfg.value.facebookUrl].filter(Boolean),
        },
      ]),
    },
  ],
})))

const featuredTabs = [
  { label: 'Comprar', value: 'SALE' as const },
  { label: 'Alugar', value: 'RENT' as const },
  { label: 'Temporada', value: 'SEASONAL' as const },
]

const doSearch = () => {
  router.push({
    path: '/imoveis',
    query: {
      ...(searchQuery.value ? { q: searchQuery.value } : {}),
      ...(searchType.value ? { propertyType: searchType.value } : {}),
    },
  })
}

const scrollCategories = (direction: -1 | 1) => {
  categoriesCarousel.value?.scrollBy({
    left: direction * Math.max(categoriesCarousel.value.clientWidth * 0.8, 280),
    behavior: 'smooth',
  })
}

const { listProperties, listPropertyTypes, createLead, listBlogPosts } = usePublicApi()

const normalizeWhatsappNumber = (value?: string | null) => value?.replace(/\D/g, '') ?? ''

const openHomepageWhatsappGate = () => {
  const phone = normalizeWhatsappNumber(cfg.value.whatsappNumber)
  if (!phone) return

  openLeadGate({
    targetUrl: `https://wa.me/${phone}`,
    source: 'PORTAL_WHATSAPP_HOME',
    title: 'Falar com Especialista',
  })
}

const loadPropertyTypes = async () => {
  try {
    propertyTypes.value = await listPropertyTypes(resolveTenantIdentifier())
  } catch {
    propertyTypes.value = DEFAULT_PROPERTY_TYPES
  }
}

const loadFeatured = async () => {
  featuredPending.value = true
  featuredPage.value = 0
  try {
    const data = await listProperties(resolveTenantIdentifier(), {
      page: 0,
      size: 8,
      operation: activeFeaturedTab.value,
      featured: true,
    })
    featuredProperties.value = data.content
  } catch {
    featuredProperties.value = []
  } finally {
    featuredPending.value = false
  }
}

const loadLaunches = async () => {
  launchesPending.value = true
  try {
    const data = await listProperties(resolveTenantIdentifier(), { page: 0, size: 4, categorySlug: 'lancamentos' })
    launches.value = data.content
  } catch {
    launches.value = []
  } finally {
    launchesPending.value = false
  }
}

const submitLead = async () => {
  if (leadSubmitting.value || leadSent.value) return
  leadSubmitting.value = true
  try {
    const payload: PublicLeadRequest = {
      name: leadForm.value.name,
      email: leadForm.value.email || undefined,
      phone: leadForm.value.phone || undefined,
      message: 'Interesse em serviços exclusivos para proprietários',
      source: 'PORTAL_HOME_FORM',
    }
    await createLead(resolveTenantIdentifier(), payload)
    leadSent.value = true
    leadForm.value = { name: '', email: '', phone: '' }
  } catch {
    // silent fail — form stays open so user can retry
  } finally {
    leadSubmitting.value = false
  }
}

onMounted(() => {
  loadPropertyTypes()
  loadFeatured()
  loadLaunches()
  loadBlogPosts()
})

const categoryFallbacks = [
  {
    type: 'HOUSE',
    label: 'Casas',
    description: 'Conforto e espaço para sua família',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    type: 'APARTMENT',
    label: 'Apartamentos',
    description: 'Praticidade no coração da cidade',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
    iconPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  },
  {
    type: 'COMMERCIAL',
    label: 'Comerciais',
    description: 'Espaços para o seu negócio crescer',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)',
    iconPath: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
  },
  {
    type: 'LAND',
    label: 'Terrenos',
    description: 'Construa o imóvel dos seus sonhos',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
  },
]

const categories = computed(() => propertyTypes.value.map((type) => {
  const fallback = categoryFallbacks.find((item) => item.type === type.code) ?? categoryFallbacks[0]
  return {
    ...fallback,
    type: type.code,
    label: type.label,
    cardColor: type.cardColor,
    coverImageUrl: type.coverImageUrl,
  }
}))

function categoryCardStyle(cat: { coverImageUrl?: string | null; cardColor?: string | null; gradient: string }) {
  if (cat.coverImageUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.72) 100%), url(${cat.coverImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  if (cat.cardColor) {
    return {
      background: `linear-gradient(135deg, ${cat.cardColor} 0%, ${withOpacity(cat.cardColor, 0.7)} 100%)`,
    }
  }

  return { background: cat.gradient }
}

function withOpacity(hex: string, opacity: number) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return hex
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0')
  return `#${clean}${alpha}`.toUpperCase()
}

const services = [
  {
    title: 'Assessoria jurídica completa',
    description: 'Análise contratual e suporte legal do início ao fim da negociação.',
  },
  {
    title: 'Fotografia profissional e tour virtual',
    description: 'Imagens de alta qualidade e visita 360° para atrair mais compradores.',
  },
  {
    title: 'Avaliação gratuita do imóvel',
    description: 'Descubra o preço justo de mercado com nossa análise especializada.',
  },
  {
    title: 'Consultoria para financiamento',
    description: 'Te ajudamos a encontrar as melhores condições de crédito imobiliário.',
  },
]

const stats = [
  {
    value: '2.500+',
    label: 'Imóveis Vendidos',
    iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75',
  },
  {
    value: '10k+',
    label: 'Clientes Felizes',
    iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  },
  {
    value: '15+',
    label: 'Anos de Mercado',
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    value: '12',
    label: 'Prêmios Design',
    iconPath: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
  },
]

</script>
