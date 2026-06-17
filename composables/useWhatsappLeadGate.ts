type WhatsappLeadSource = 'PORTAL_WHATSAPP_HOME' | 'PORTAL_WHATSAPP_PROPERTY' | 'PORTAL_WHATSAPP_GENERIC'

type WhatsappLeadContext = {
  open: boolean
  targetUrl: string
  source: WhatsappLeadSource
  propertyId?: string
  title?: string
}

const WHATSAPP_LEAD_CONTEXT_KEY = 'rinoimob_whatsapp_lead_context'

const defaultContext = (): WhatsappLeadContext => ({
  open: false,
  targetUrl: '',
  source: 'PORTAL_WHATSAPP_GENERIC',
})

export const useWhatsappLeadGate = () => {
  const context = useState<WhatsappLeadContext>(WHATSAPP_LEAD_CONTEXT_KEY, defaultContext)

  const openLeadGate = (next: Omit<WhatsappLeadContext, 'open'>) => {
    context.value = {
      ...next,
      open: true,
    }
  }

  const closeLeadGate = () => {
    context.value = defaultContext()
  }

  return {
    context,
    openLeadGate,
    closeLeadGate,
  }
}
