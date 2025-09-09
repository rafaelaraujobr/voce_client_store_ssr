export default defineEventHandler((event) => {
  const { host } = getRequestURL(event)
  const base = process.env.BASE_DOMAIN || 'vocelab.com.br'
  const isSub = host.endsWith(base) && host !== base && !host.startsWith('www.')
  if (isSub) {
    const slug = host.replace(`.${base}`, '')
    // Lista de subdomínios reservados
    const reserved = ['www', 'app', 'api', 'static', 'assets']
    if (!reserved.includes(slug)) {
      event.context.tenantSlug = slug
    }
  }
})
