import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { once } from 'node:events'

let api
let website
let baseUrl
let output = ''

const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

before(async () => {
    api = createServer((request, response) => {
        const path = new URL(request.url, 'http://localhost').pathname
        const tenant = request.headers['x-tenant-slug']
        let status = 200
        let body = { content: [], totalPages: 0, totalElements: 0, number: 0, size: 20, last: true }
        if (path.endsWith('/config')) {
            body = {
                companyName: 'Imobiliária de teste',
                servicesItems: tenant === 'invalid' ? '{invalid' : tenant === 'empty' ? '[]' : JSON.stringify([
                    { title: 'Serviço Segundo', description: 'Assessoria Dois', icon: '🔑', imageUrl: '' },
                    { title: 'Serviço Primeiro', description: 'Assessoria Um', icon: '', imageUrl: 'https://example.com/service.png' },
                ]),
            }
        } else if (path.endsWith('/property-types')) {
            body = []
        } else if (path.includes('/brokers/missing')) {
            status = 404
            body = { message: 'Broker not found' }
        } else if (path.endsWith('/brokers/catalog-error/properties')) {
            status = 503
            body = { message: 'Temporarily unavailable' }
        } else if (path.match(/\/brokers\/[^/]+\/properties$/)) {
            body = { content: [{
                id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', title: 'Casa do portfólio',
                operation: 'SALE', propertyType: 'HOUSE', price: 250000, currency: 'BRL',
                addressCity: 'São Paulo', bedrooms: 2, areaTotal: 90,
            }], totalElements: 25, totalPages: 2, number: 0, size: 20, last: false }
        } else if (path.match(/\/brokers\/[^/]+$/)) {
            body = { slug: path.split('/').at(-1), name: 'Ana Broker', bio: 'Atendimento comercial', phone: null, photoUrl: null, instagramUrl: null, creci: null }
        }
        response.writeHead(status, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(body))
    })
    await listen(api)
    const placeholder = createServer()
    await listen(placeholder)
    const port = placeholder.address().port
    await new Promise(resolve => placeholder.close(resolve))
    baseUrl = `http://localhost:${port}`
    website = spawn(process.execPath, ['.output/server/index.mjs'], {
        cwd: new URL('../', import.meta.url),
        env: { ...process.env, HOST: '127.0.0.1', PORT: String(port),
            NUXT_API_INTERNAL_URL: `http://127.0.0.1:${api.address().port}` },
        stdio: ['ignore', 'pipe', 'pipe'],
    })
    website.stdout.on('data', chunk => { output += chunk })
    website.stderr.on('data', chunk => { output += chunk })
    for (let attempt = 0; attempt < 100; attempt++) {
        if (website.exitCode !== null) throw new Error(`Website failed to start: ${output}`)
        try { await fetch(`${baseUrl}/robots.txt`); return } catch {}
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error(`Website did not become ready: ${output}`)
})

after(async () => {
    if (website && website.exitCode === null) {
        website.kill('SIGTERM')
        await once(website, 'exit')
    }
    if (api) await new Promise(resolve => api.close(resolve))
})

test('home renders saved service order, icons and images', async () => {
    const response = await fetch(`${baseUrl}/?tenant=custom`)
    assert.equal(response.status, 200)
    const html = await response.text()
    const list = html.split('Serviços Exclusivos')[1].split('</ul>')[0]
    assert.ok(list.includes('Serviço Segundo'))
    assert.ok(list.indexOf('Serviço Segundo') < list.indexOf('Serviço Primeiro'))
    assert.ok(list.includes('🔑'))
    assert.ok(list.includes('https://example.com/service.png'))
})

test('home uses defaults for empty and malformed service data', async () => {
    for (const tenant of ['invalid', 'empty']) {
        const html = await (await fetch(`${baseUrl}/?tenant=${tenant}`)).text()
        assert.ok(html.includes('Assessoria jurídica completa'))
    }
})

test('broker portfolio renders on the server with initials, reference links and pagination', async () => {
    const response = await fetch(`${baseUrl}/corretor/ana?tenant=custom`)
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.ok(html.includes('Ana Broker'))
    assert.match(html, />AB<\/div>/)
    assert.ok(html.includes('Casa do portfólio'))
    assert.ok(html.includes('corretor=ana'))
    assert.ok(html.includes('Carregar mais'))
    assert.ok(!html.includes('wa.me/'))
})

test('unknown broker returns a real 404 with a useful empty state', async () => {
    const response = await fetch(`${baseUrl}/corretor/missing?tenant=custom`)
    assert.equal(response.status, 404)
    assert.ok((await response.text()).includes('Corretor não encontrado'))
})

test('catalog failure is distinguished from an empty portfolio', async () => {
    const response = await fetch(`${baseUrl}/corretor/catalog-error?tenant=custom`)
    const html = await response.text()
    assert.ok(html.includes('Não foi possível carregar os imóveis'))
    assert.ok(!html.includes('Nenhum imóvel disponível no momento'))
})
