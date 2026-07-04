import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const requestUrl = getRequestURL(event)
  const apiBase = config.apiInternalUrl.replace(/\/$/, '')
  const target = `${apiBase}${requestUrl.pathname}${requestUrl.search}`

  return proxyRequest(event, target)
})
