<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <h2 class="font-semibold text-[#1e2d4d] text-lg mb-2">Não encontrou o que procura?</h2>
    <p class="text-slate-500 text-sm mb-4">Envie uma mensagem com suas necessidades. Nossos corretores entrarão em contato.</p>

    <form @submit.prevent="submitForm" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Seu nome"
          class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="seu@email.com"
          class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="(11) 99999-9999"
          class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
        <textarea
          v-model="form.description"
          required
          rows="3"
          placeholder="Descreva o tipo de imóvel que você procura..."
          class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 placeholder-slate-400 resize-none"
        ></textarea>
      </div>

      <div v-if="successMessage" class="p-3 bg-green-50 text-green-700 rounded-xl text-sm text-center">
        ✓ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 text-sm font-semibold text-white rounded-xl transition-opacity disabled:opacity-60"
        :style="{ backgroundColor: cfg.primaryColor }"
      >
        {{ loading ? 'Enviando...' : 'Enviar Mensagem' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_TENANT_CONFIG } from '~/types/tenant'

const props = defineProps<{
  propertyId: string
}>()

const { useTenantConfigData } = useTenantConfig()
const { data: tenantConfig } = await useTenantConfigData()
const cfg = computed(() => ({ ...DEFAULT_TENANT_CONFIG, ...(tenantConfig.value ?? {}) }))

const form = ref({
  name: '',
  email: '',
  phone: '',
  description: '',
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submitForm = async () => {
  if (!form.value.name.trim() || !form.value.description.trim()) {
    errorMessage.value = 'Nome e descrição são obrigatórios'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await $fetch('/api/public/leads', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        message: form.value.description,
        propertyId: props.propertyId,
      },
    })

    successMessage.value = 'Mensagem enviada com sucesso! Logo entraremos em contato.'
    form.value = {
      name: '',
      email: '',
      phone: '',
      description: '',
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Erro ao enviar mensagem. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
