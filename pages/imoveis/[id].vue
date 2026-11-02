<template>
  <div class="bg-[#F1F5F9] min-h-screen">
    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
      <svg class="animate-spin h-10 w-10 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="property">
      <!-- Photo Gallery -->
      <div class="bg-[#F1F5F9]">
        <div class="max-w-7xl mx-auto px-0 sm:px-6">
          <div class="h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden">
            <img
              v-if="activePhoto"
              :src="activePhoto.url"
              :alt="activePhoto.altText || property.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-slate-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-slate-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="property.photos && property.photos.length > 1" class="flex gap-2 overflow-x-auto py-2 px-4 sm:px-0 bg-[#F1F5F9]">
            <button
              v-for="photo in property.photos"
              :key="photo.id"
              @click="activePhoto = photo"
              class="shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-all"
              :class="activePhoto?.id === photo.id ? 'border-slate-800' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="photo.url" :alt="photo.altText || ''" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left: Property Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Badges + Title -->
            <div>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-3 py-1 text-xs font-bold rounded-full text-white" :class="operationBg(property.operation)">
                  {{ operationLabel(property.operation) }}
                </span>
                <span class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                  {{ typeLabel(property.propertyType) }}
                </span>
              </div>
              <div class="flex items-start justify-between gap-4">
                <h1 class="text-2xl font-bold text-[#1e2d4d]">{{ property.title }}</h1>
                <button
                  @click="handleFavoriteClick"
                  class="flex-shrink-0 p-2 hover:bg-slate-100 rounded-full transition-colors"
                  :title="isPropertyFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                >
                  <HeartSolidIcon v-if="isPropertyFavorited" class="block w-5 h-5 text-red-500" />
                  <HeartOutlineIcon v-else class="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <p v-if="hasAddress" class="text-slate-500 text-sm mt-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{{ fullAddress }}</span>
              </p>
            </div>

            <!-- Price -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <p v-if="displayPrice" class="text-3xl font-bold" :style="{ color: cfg.primaryColor }">
                {{ priceDisplayLabel }}{{ formatPrice(displayPrice, property.currency) }}
                <span v-if="property.operation === 'RENT'" class="text-base font-normal text-slate-400">/mês</span>
              </p>
              <p v-else class="text-xl font-semibold text-slate-400">Consulte o preço</p>
            </div>

            <!-- Specs Grid -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <h2 class="font-semibold text-[#1e2d4d] mb-4">Características</h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-if="property.areaTotal" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.areaTotal }}m²</p>
                  <p class="text-xs text-slate-500">Área total</p>
                </div>
                <div v-if="property.bedrooms" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.bedrooms }}</p>
                  <p class="text-xs text-slate-500">Quartos</p>
                </div>
                <div v-if="property.bathrooms" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.bathrooms }}</p>
                  <p class="text-xs text-slate-500">Banheiros</p>
                </div>
                <div v-if="property.parking" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.parking }}</p>
                  <p class="text-xs text-slate-500">Vagas</p>
                </div>
                <div v-if="property.suites" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.suites }}</p>
                  <p class="text-xs text-slate-500">Suítes</p>
                </div>
                <div v-if="property.areaUseful" class="bg-slate-50 rounded-xl p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-auto mb-1 text-[#2563EB]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <p class="font-bold text-slate-800">{{ property.areaUseful }}m²</p>
                  <p class="text-xs text-slate-500">Área útil</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="property.description" class="bg-white rounded-2xl p-5 shadow-sm">
              <h2 class="font-semibold text-[#1e2d4d] mb-3">Sobre o Imóvel</h2>
              <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{{ property.description }}</p>
            </div>

            <!-- Videos -->
            <div v-if="videosToDisplay.length" class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between gap-3 mb-5">
                <h2 class="font-semibold text-[#1e2d4d]">Vídeos</h2>
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                  {{ videosToDisplay.length }} {{ videosToDisplay.length === 1 ? 'vídeo' : 'vídeos' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <article
                  v-for="video in videosToDisplay"
                  :key="video.id"
                  class="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                >
                  <div class="aspect-video bg-black">
                    <iframe
                      v-if="video.source === 'YOUTUBE'"
                      :src="video.url"
                      :title="video.title || 'Vídeo do imóvel'"
                      class="w-full h-full border-0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                    ></iframe>
                    <video
                      v-else
                      :src="video.url"
                      class="w-full h-full object-contain"
                      controls
                      preload="metadata"
                    ></video>
                  </div>
                  <div v-if="video.title" class="p-3">
                    <p class="text-sm font-semibold text-slate-700">{{ video.title }}</p>
                  </div>
                </article>
              </div>
            </div>

            <!-- Location -->
            <div v-if="hasLocation" class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h2 class="font-semibold text-[#1e2d4d]">Localização</h2>
                  <p v-if="fullAddress" class="text-sm text-slate-500 mt-1">{{ fullAddress }}</p>
                </div>
                <a
                  :href="googleMapsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl border transition-colors hover:bg-slate-50"
                  :style="{ color: cfg.primaryColor, borderColor: `${cfg.primaryColor}33` }"
                >
                  Abrir no Google Maps
                </a>
              </div>
              <div class="aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                <iframe
                  :src="googleMapsEmbedUrl"
                  title="Mapa de localização do imóvel"
                  class="w-full h-full border-0"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <!-- Floor Plans -->
            <div v-if="floorPlansToDisplay.length" class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between gap-3 mb-5">
                <h2 class="font-semibold text-[#1e2d4d]">Plantas</h2>
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                  {{ floorPlansToDisplay.length }} {{ floorPlansToDisplay.length === 1 ? 'planta' : 'plantas' }}
                </span>
              </div>

              <div class="space-y-6">
                <article
                  v-for="plan in floorPlansToDisplay"
                  :key="plan.id"
                  class="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div class="flex flex-wrap items-center gap-2 mb-4">
                    <h3 class="font-semibold text-slate-800">{{ plan.name }}</h3>
                    <span
                      v-if="plan.area"
                      class="text-xs font-semibold px-2.5 py-1 rounded-full"
                      :style="{ color: brandPrimaryColor, backgroundColor: `${brandPrimaryColor}12` }"
                    >
                      {{ formatArea(plan.area) }}m²
                    </span>
                    <span v-if="plan.priceFrom" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      A partir de {{ formatPrice(plan.priceFrom, property.currency) }}
                    </span>
                    <span v-if="plan.priceTo" class="text-xs font-medium text-slate-500">
                      até {{ formatPrice(plan.priceTo, property.currency) }}
                    </span>
                  </div>

                  <div v-if="plan.bedrooms || plan.suites || plan.bathrooms || plan.parking" class="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-sm text-slate-500">
                    <span v-if="plan.bedrooms">{{ plan.bedrooms }} {{ plan.bedrooms === 1 ? 'quarto' : 'quartos' }}</span>
                    <span v-if="plan.suites">{{ plan.suites }} {{ plan.suites === 1 ? 'suíte' : 'suítes' }}</span>
                    <span v-if="plan.bathrooms">{{ plan.bathrooms }} {{ plan.bathrooms === 1 ? 'banheiro' : 'banheiros' }}</span>
                    <span v-if="plan.parking">{{ plan.parking }} {{ plan.parking === 1 ? 'vaga' : 'vagas' }}</span>
                  </div>

                  <div v-if="plan.coverPhoto" class="space-y-3">
                    <div class="overflow-hidden rounded-xl bg-white border border-slate-100">
                      <img
                        :src="plan.coverPhoto.url"
                        :alt="plan.name"
                        class="w-full max-h-[520px] object-contain bg-white"
                        loading="lazy"
                      />
                    </div>

                    <div v-if="plan.additionalPhotos.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div
                        v-for="photo in plan.additionalPhotos"
                        :key="photo.id"
                        class="aspect-[4/3] overflow-hidden rounded-xl bg-white border border-slate-100"
                      >
                        <img
                          :src="photo.url"
                          :alt="plan.name"
                          class="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <!-- Amenities -->
            <div v-if="property.amenities && property.amenities.length" class="bg-white rounded-2xl p-5 shadow-sm">
              <h2 class="font-semibold text-[#1e2d4d] mb-4">Comodidades</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="amenity in property.amenities"
                  :key="amenity.id"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {{ amenity.name }}
                </span>
              </div>
            </div>

            <!-- Categories -->
            <div v-if="property.categories && property.categories.length" class="bg-white rounded-2xl p-5 shadow-sm">
              <h2 class="font-semibold text-[#1e2d4d] mb-4">Categorias</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="cat in property.categories"
                  :key="cat.id"
                  class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm"
                >
                  {{ cat.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div>
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 class="font-semibold text-[#1e2d4d] text-lg mb-4">Falar com corretor</h2>

              <!-- Lead Form -->
              <form @submit.prevent="submitLead" class="space-y-3">
                <div>
                  <input
                    v-model="leadForm.name"
                    type="text"
                    required
                    placeholder="Seu nome *"
                    class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div>
                  <input
                    v-model="leadForm.email"
                    type="email"
                    placeholder="Seu e-mail"
                    class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div>
                  <PhoneInput v-model="leadForm.phone" placeholder="(XX) 99999-9999" />
                </div>
                <div>
                  <textarea
                    v-model="leadForm.message"
                    rows="3"
                    placeholder="Sua mensagem"
                    class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400 resize-none"
                  ></textarea>
                </div>

                <!-- Feedback -->
                <div v-if="leadSuccess" class="p-3 bg-green-50 text-green-700 rounded-xl text-sm text-center">
                  ✓ Mensagem enviada com sucesso!
                </div>
                <div v-if="leadError" class="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                  Erro ao enviar. Tente novamente.
                </div>

                <button
                  type="submit"
                  :disabled="leadSubmitting"
                  class="w-full py-3 text-sm font-semibold text-white rounded-xl transition-opacity disabled:opacity-60"
                  :style="{ backgroundColor: cfg.primaryColor }"
                >
                  {{ leadSubmitting ? 'Enviando...' : 'Enviar mensagem' }}
                </button>
              </form>

              <div class="mt-3 border-t border-slate-100 pt-3 space-y-2">
                <button
                  v-if="cfg.whatsappNumber"
                  type="button"
                  class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white rounded-xl bg-green-500 hover:bg-green-600 transition-colors"
                  @click="openPropertyWhatsappGate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </button>
                <!-- <button
                  class="w-full py-3 text-sm font-semibold rounded-xl border transition-colors hover:bg-blue-50"
                  :style="{ color: cfg.primaryColor, borderColor: cfg.primaryColor }"
                >
                  Simular Pagamento
                </button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Not Found Form Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div class="lg:col-span-2">
            <PropertyNotFoundForm :propertyId="property.id" />
          </div>
        </div>

        <section v-if="similarPending || similarProperties.length" class="mt-12">
          <div class="flex items-end justify-between gap-4 mb-5">
            <div>
              <p class="text-xs font-bold tracking-[0.16em] uppercase" :style="{ color: cfg.secondaryColor }">Você também pode gostar</p>
              <h2 class="text-2xl font-bold text-slate-900 mt-1">Imóveis semelhantes</h2>
            </div>
            <NuxtLink to="/imoveis" class="text-sm font-semibold hover:underline" :style="{ color: cfg.primaryColor }">
              Ver todos
            </NuxtLink>
          </div>

          <div v-if="similarPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="index in 4" :key="index" class="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse"></div>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PropertyCard
              v-for="similarProperty in similarProperties"
              :key="similarProperty.id"
              :property="similarProperty"
              :whatsapp-number="cfg.whatsappNumber"
            />
          </div>
        </section>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
      <p class="text-lg font-medium mb-4">Imóvel não encontrado</p>
      <NuxtLink to="/imoveis" class="text-sm text-[#2563EB] hover:underline">← Voltar para lista</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicFloorPlanPhoto, PublicPropertyDetail, PublicPhoto, PublicPropertySummary, PublicPropertyType } from '~/types/property'
import { DEFAULT_PROPERTY_TYPES, propertyTypeLabel } from '~/types/property'
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'

type FloorPlanDisplay = {
  id: string
  name: string
  area: number | null
  priceFrom: number | null
  priceTo: number | null
  bedrooms: number | null
  suites: number | null
  bathrooms: number | null
  parking: number | null
  coverPhoto: PublicFloorPlanPhoto | null
  additionalPhotos: PublicFloorPlanPhoto[]
}

definePageMeta({ layout: 'default' })

const route = useRoute()
const { getProperty, listProperties, listPropertyTypes, createLead } = usePublicApi()
const { resolveTenantIdentifier, useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const { openLeadGate } = useWhatsappLeadGate()
const brandPrimaryColor = computed(() => cfg.value.primaryColor ?? '#1e2d4d')
const requestUrl = useRequestURL()

const property = ref<PublicPropertyDetail | null>(null)
const propertyTypes = ref<PublicPropertyType[]>(DEFAULT_PROPERTY_TYPES)
const activePhoto = ref<PublicPhoto | null>(null)
const pending = ref(true)
const similarProperties = ref<PublicPropertySummary[]>([])
const similarPending = ref(false)

const { toggleFavorite, isFavorited } = useLocalStorageFavorites()
const isPropertyFavorited = computed(() => property.value ? isFavorited(property.value.id) : false)

const operationLabel = (op: string) => ({ SALE: 'Venda', RENT: 'Aluguel', SEASONAL: 'Temporada' }[op] ?? op)
const operationBg = (op: string) => ({
  SALE: 'bg-[#2563EB]',
  RENT: 'bg-emerald-600',
  SEASONAL: 'bg-amber-500',
}[op] ?? 'bg-slate-600')
const typeLabel = (t: string) => propertyTypeLabel(t, propertyTypes.value)

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL', maximumFractionDigits: 0 }).format(price)

const formatArea = (area: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(area)

const buildPropertyDescription = (item: PublicPropertyDetail | null) => {
  if (!item) return 'Veja os detalhes do imóvel disponível.'

  const addressParts = [item.addressNeighborhood, item.addressCity, item.addressState].filter(Boolean).join(', ')
  const pricePart = item.price ? ` por ${formatPrice(item.price, item.currency)}` : ''
  const summary = item.description?.trim() || `Imóvel ${operationLabel(item.operation).toLowerCase()}${pricePart}${addressParts ? ` em ${addressParts}` : ''}`
  return summary.slice(0, 160)
}

const currentCanonical = computed(() => new URL(`/imoveis/${route.params.id}`, requestUrl.origin).toString())

useHead(computed(() => ({
  title: property.value ? property.value.title : 'Imóvel',
  meta: [
    { name: 'description', content: buildPropertyDescription(property.value) },
    { name: 'robots', content: property.value ? 'index,follow' : 'noindex,follow' },
    { property: 'og:title', content: property.value?.title ?? 'Imóvel' },
    { property: 'og:description', content: buildPropertyDescription(property.value) },
    { property: 'og:image', content: activePhoto.value?.url ?? property.value?.coverPhotoUrl ?? cfg.value.logoUrl ?? '' },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: currentCanonical.value },
  ],
  script: property.value ? [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.value.title,
        url: currentCanonical.value,
        description: buildPropertyDescription(property.value),
        image: (property.value.photos?.map(photo => photo.url) ?? []).concat(property.value.coverPhotoUrl ? [property.value.coverPhotoUrl] : []).filter(Boolean),
        offers: property.value.price ? {
          '@type': 'Offer',
          price: property.value.price,
          priceCurrency: property.value.currency || 'BRL',
        } : undefined,
      }),
    },
  ] : [],
})))

const hasAddress = computed(() =>
  property.value && (property.value.addressStreet || property.value.addressNeighborhood || property.value.addressCity)
)

const fullAddress = computed(() => {
  if (!property.value) return ''
  const parts = [
    property.value.addressStreet,
    property.value.addressNumber,
    property.value.addressNeighborhood,
    property.value.addressCity,
    property.value.addressState,
  ].filter(Boolean)
  return parts.join(', ')
})

const hasCoordinates = computed(() =>
  Number.isFinite(property.value?.lat) && Number.isFinite(property.value?.lng)
)

const mapQuery = computed(() => {
  if (!property.value) return ''
  if (hasCoordinates.value) {
    return `${property.value.lat},${property.value.lng}`
  }
  return fullAddress.value
})

const hasLocation = computed(() => mapQuery.value.length > 0)

const googleMapsEmbedUrl = computed(() =>
  `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`
)

const googleMapsUrl = computed(() =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.value)}`
)

const sortFloorPlanPhotos = (photos: PublicFloorPlanPhoto[]) =>
  [...photos].sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER))

const floorPlansToDisplay = computed<FloorPlanDisplay[]>(() =>
  property.value?.floorPlans
    ?.map((plan) => {
      const photos = sortFloorPlanPhotos(plan.photos ?? [])
      const coverPhoto = photos.find((photo) => photo.isCover || photo.position === 0) ?? photos[0] ?? null
      const additionalPhotos = coverPhoto ? photos.filter((photo) => photo.id !== coverPhoto.id) : []

      return {
        id: plan.id,
        name: plan.name,
        area: plan.area,
        priceFrom: plan.priceFrom,
        priceTo: plan.priceTo,
        bedrooms: plan.bedrooms,
        suites: plan.suites,
        bathrooms: plan.bathrooms,
        parking: plan.parking,
        coverPhoto,
        additionalPhotos,
      }
    }) ?? []
)

const lowestFloorPlanPrice = computed(() => {
  const prices = (property.value?.floorPlans ?? [])
    .map(plan => plan.priceFrom)
    .filter((price): price is number => price != null && price > 0)
  return prices.length ? Math.min(...prices) : null
})

const displayPrice = computed(() => lowestFloorPlanPrice.value ?? property.value?.price ?? null)
const priceDisplayLabel = computed(() => lowestFloorPlanPrice.value != null ? 'A partir de ' : '')

const videosToDisplay = computed(() =>
  [...(property.value?.videos ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
)

const normalizeWhatsappNumber = (value?: string | null) => value?.replace(/\D/g, '') ?? ''
const brokerSlug = computed(() => typeof route.query.corretor === 'string' ? route.query.corretor : undefined)

const openPropertyWhatsappGate = () => {
  if (!property.value) return

  const phone = normalizeWhatsappNumber(cfg.value.whatsappNumber)
  if (!phone) return

  const message = encodeURIComponent(`Olá, tenho interesse no imóvel: ${property.value.title}`)
  openLeadGate({
    targetUrl: `https://wa.me/${phone}?text=${message}`,
    source: 'PORTAL_WHATSAPP_PROPERTY',
    propertyId: property.value.id,
    brokerSlug: brokerSlug.value,
    title: property.value.title,
  })
}

const handleFavoriteClick = () => {
  if (property.value) {
    toggleFavorite(property.value.id)
  }
}

const leadForm = ref({ name: '', email: '', phone: '', message: '' })
const leadSubmitting = ref(false)
const leadSuccess = ref(false)
const leadError = ref(false)

const submitLead = async () => {
  if (!property.value) return
  leadSubmitting.value = true
  leadSuccess.value = false
  leadError.value = false
  try {
    await createLead(resolveTenantIdentifier(), {
      name: leadForm.value.name,
      email: leadForm.value.email || undefined,
      phone: leadForm.value.phone || undefined,
      message: leadForm.value.message || undefined,
      propertyId: property.value.id,
      source: 'PORTAL_PROPERTY_FORM',
      brokerSlug: brokerSlug.value,
    })
    leadSuccess.value = true
    leadForm.value = { name: '', email: '', phone: '', message: '' }
  } catch {
    leadError.value = true
  } finally {
    leadSubmitting.value = false
  }
}

const loadSimilarProperties = async (currentProperty: PublicPropertyDetail) => {
  similarPending.value = true
  try {
    const data = await listProperties(resolveTenantIdentifier(), {
      page: 0,
      size: 5,
      operation: currentProperty.operation,
      propertyType: currentProperty.propertyType,
      city: currentProperty.addressCity || undefined,
    })
    similarProperties.value = data.content
      .filter((candidate) => candidate.id !== currentProperty.id)
      .slice(0, 4)
  } catch {
    similarProperties.value = []
  } finally {
    similarPending.value = false
  }
}

const loadProperty = async () => {
  try {
    const id = route.params.id as string
    const [data, types] = await Promise.all([
      getProperty(resolveTenantIdentifier(), id),
      listPropertyTypes(resolveTenantIdentifier()).catch(() => DEFAULT_PROPERTY_TYPES),
    ])
    propertyTypes.value = types
    property.value = data
    await loadSimilarProperties(data)
    if (data.photos && data.photos.length > 0) {
      const coverPhoto = data.photos.find((p) => p.isCover) ?? data.photos[0]
      activePhoto.value = coverPhoto
    } else if (data.coverPhotoUrl) {
      activePhoto.value = { id: 'cover', url: data.coverPhotoUrl, position: 0, isCover: true, altText: null }
    }
  } catch {
    property.value = null
  } finally {
    pending.value = false
  }
}

await loadProperty()

onMounted(async () => {
  if (!property.value) {
    await loadProperty()
  }
})
</script>
