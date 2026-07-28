<template>
  <section class="bg-slate-50 py-16 sm:py-24">
    <div class="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div class="pt-3">
        <p class="text-sm font-semibold uppercase tracking-[0.2em]" :style="{ color: cfg.secondaryColor }">
          Anuncie seu imóvel
        </p>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Vamos ajudar você a encontrar o melhor caminho para o seu imóvel.
        </h1>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          Conte um pouco sobre o imóvel que deseja anunciar. Nossa equipe entrará em contato para orientar os próximos passos.
        </p>
      </div>

      <form class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8" @submit.prevent="submit">
        <h2 class="text-2xl font-bold text-slate-900">Quero anunciar meu imóvel</h2>
        <p class="mt-2 text-sm text-slate-600">Preencha seus dados e fale sobre seu imóvel.</p>

        <div class="mt-6 space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="announcement-name">Nome</label>
            <input
              id="announcement-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-slate-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Telefone</label>
            <PhoneInput v-model="form.phone" placeholder="WhatsApp com DDD" required />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="announcement-email">E-mail</label>
            <input
              id="announcement-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-slate-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="announcement-message">Sobre o imóvel</label>
            <textarea
              id="announcement-message"
              v-model="form.message"
              rows="4"
              placeholder="Tipo, localização ou qualquer detalhe que queira compartilhar"
              class="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-slate-400"
            ></textarea>
          </div>
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-red-600" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="mt-4 text-sm text-emerald-600" role="status">{{ successMessage }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="mt-6 w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          :style="{ backgroundColor: cfg.primaryColor }"
        >
          {{ submitting ? 'Enviando...' : 'Quero anunciar meu imóvel' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

const { resolveTenantIdentifier, useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))
const { createLead } = usePublicApi()

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
})
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submit = async () => {
  if (submitting.value) return

  const name = form.value.name.trim()
  const phone = form.value.phone.trim()
  if (!name || !phone) {
    errorMessage.value = 'Preencha nome e telefone para continuar.'
    return
  }

  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await createLead(resolveTenantIdentifier(), {
      name,
      phone,
      email: form.value.email.trim() || undefined,
      message: form.value.message.trim() || 'Tenho interesse em anunciar um imóvel.',
      source: 'PORTAL_PROPERTY_ANNOUNCEMENT',
    })
    form.value = { name: '', phone: '', email: '', message: '' }
    successMessage.value = 'Recebemos seu interesse. Em breve entraremos em contato.'
  } catch {
    errorMessage.value = 'Não foi possível enviar seu contato. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'Anuncie seu imóvel',
  meta: [
    { name: 'description', content: 'Cadastre seu interesse em anunciar um imóvel.' },
  ],
})
</script>
