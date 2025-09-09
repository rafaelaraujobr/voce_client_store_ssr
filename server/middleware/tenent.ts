export default defineEventHandler((event) => {
  const { host } = getRequestURL(event)
  const base = process.env.BASE_DOMAIN || 'dominio.com.br'
  const isSub = host.endsWith(base) && host !== base && !host.startsWith('www.')
  if (isSub) event.context.tenantSlug = host.replace(`.${base}`, '')
})
