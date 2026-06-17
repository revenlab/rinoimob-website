<template>
  <Teleport to="body">
    <div
      v-if="context.open"
      class="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-lead-gate-title"
    >
      <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" @click="handleClose"></div>

      <div class="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-2xl">
        <div class="px-6 pt-6 pb-5 text-white" :style="{ background: `linear-gradient(135deg, ${cfg.primaryColor} 0%, ${cfg.secondaryColor} 100%)` }">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">WhatsApp</p>
              <h2 id="whatsapp-lead-gate-title" class="mt-2 text-2xl font-bold leading-tight">
                Informe seus dados e continue a conversa
              </h2>
              <p class="mt-2 text-sm text-white/80">
                Capturamos seu contato antes de redirecionar para o atendimento.
              </p>
            </div>

            <button
              type="button"
              class="shrink-0 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
              aria-label="Fechar"
              @click="handleClose"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form class="space-y-4 px-6 py-6" @submit.prevent="submit">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="whatsapp-lead-name">Nome</label>
            <input
              id="whatsapp-lead-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Seu nome"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Telefone</label>
            <PhoneInput v-model="form.phone" placeholder="WhatsApp com DDD" required />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="whatsapp-lead-email">E-mail</label>
            <input
              id="whatsapp-lead-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="seuemail@exemplo.com"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div v-if="errorMessage" class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {{ errorMessage }}
          </div>

          <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              @click="handleClose"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              :style="{ backgroundColor: cfg.primaryColor }"
            >
              {{ submitting ? 'Redirecionando...' : 'Continuar no WhatsApp' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

const { context, closeLeadGate } = useWhatsappLeadGate()
const { createLead } = usePublicApi()
const { resolveTenantIdentifier, useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

const form = ref({
  name: '',
  phone: '',
  email: '',
})
const submitting = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  form.value = { name: '', phone: '', email: '' }
  submitting.value = false
  errorMessage.value = ''
}

const handleClose = () => {
  resetForm()
  closeLeadGate()
}

watch(() => context.value.open, (isOpen) => {
  if (isOpen) {
    errorMessage.value = ''
    return
  }

  resetForm()
})

const submit = async () => {
  if (submitting.value) return

  const name = form.value.name.trim()
  const phone = form.value.phone.trim()
  const email = form.value.email.trim()

  if (!name || !phone) {
    errorMessage.value = 'Preencha nome e telefone para continuar.'
    return
  }

  if (!context.value.targetUrl) {
    errorMessage.value = 'Nao foi possivel montar o redirecionamento para o WhatsApp.'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    await createLead(resolveTenantIdentifier(), {
      name,
      phone,
      email: email || undefined,
      propertyId: context.value.propertyId,
      source: context.value.source,
    })

    const targetUrl = context.value.targetUrl
    handleClose()
    await navigateTo(targetUrl, { external: true })
  } catch {
    errorMessage.value = 'Nao foi possivel registrar seu contato. Tente novamente.'
    submitting.value = false
  }
}
</script>
