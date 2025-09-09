export default defineEventHandler((event) => {
  const slug = event.context?.tenantSlug
  const url = getRequestURL(event)
  const base = process.env.BASE_DOMAIN || 'vocelab.com.br'
  
  // Redirecionamento de compatibilidade: /in/{slug} -> {slug}.vocelab.com.br
  if (url.pathname.startsWith('/in/')) {
    const pathSlug = url.pathname.split('/')[2]
    if (pathSlug) {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const remainingPath = url.pathname.replace(`/in/${pathSlug}`, '') || '/'
      const targetUrl = `${protocol}://${pathSlug}.${base}${remainingPath}${url.search}`
      return sendRedirect(event, targetUrl, 301)
    }
  }
})