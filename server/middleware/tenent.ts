export default defineEventHandler((event) => {
  const { host } = getRequestURL(event); // ex: "flashapp.dominio.com.br"
  const baseDomain = process.env.BASE_DOMAIN || "dominio.com.br";
  const isSub =
    host.endsWith(baseDomain) &&
    host !== baseDomain &&
    !host.startsWith("www.");
  if (isSub) {
    const sub = host.replace(`.${baseDomain}`, ""); // "flashapp"
    event.context.tenantSlug = sub;
  }
});
