export default defineEventHandler((event) => {
  console.log("tenent");
  const { host } = getRequestURL(event)
  console.log("host", host);
  const base = process.env.BASE_DOMAIN || 'dominio.com.br'
  const isSub = host.endsWith(base) && host !== base && !host.startsWith('www.')
  if (isSub) event.context.tenantSlug = host.replace(`.${base}`, '')
})
