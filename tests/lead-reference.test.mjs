import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

test('WhatsApp gate preserves commercial origin and clears it for subsequent generic contacts', async () => {
    // Exercise the real composable; supply only Nuxt's per-context state boundary.
    const states = new Map()
    globalThis.useState = (key, initialize) => {
        if (!states.has(key)) states.set(key, { value: initialize() })
        return states.get(key)
    }
    try {
        const source = await readFile(new URL('../composables/useWhatsappLeadGate.ts', import.meta.url), 'utf8')
        const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
        const { useWhatsappLeadGate } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
        const card = useWhatsappLeadGate()
        const modal = useWhatsappLeadGate()

        card.openLeadGate({ targetUrl: 'https://wa.me/5511999999999', source: 'PORTAL_WHATSAPP_PROPERTY', propertyId: 'property-a', brokerSlug: 'ana' })
        assert.equal(modal.context.value.brokerSlug, 'ana')
        assert.equal(modal.context.value.propertyId, 'property-a')

        modal.closeLeadGate()
        assert.equal(card.context.value.open, false)
        assert.equal(card.context.value.brokerSlug, undefined)

        card.openLeadGate({ targetUrl: 'https://wa.me/5511888888888', source: 'PORTAL_WHATSAPP_GENERIC' })
        assert.equal(modal.context.value.open, true)
        assert.equal(modal.context.value.brokerSlug, undefined)
        assert.equal(modal.context.value.propertyId, undefined)
    } finally {
        delete globalThis.useState
    }
})
