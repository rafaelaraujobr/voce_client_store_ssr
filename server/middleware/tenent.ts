export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const host = url.host; // ex: "flashapp.dominio.com.br"
  const pathname = url.pathname || "/";

  const baseDomain = process.env.BASE_DOMAIN || "dominio.com.br";
  const isSub =
    host.endsWith(baseDomain) &&
    host !== baseDomain &&
    !host.startsWith("www.");

  if (!isSub) return;

  const sub = host.replace(`.${baseDomain}`, ""); // "flashapp"
  event.context.tenantSlug = sub;

  // Evita reescrever rotas internas/estáticas e quando já estiver em /in/
  const skipPrefixes = [
    "/in/",
    "/api/",
    "/_nuxt/",
    "/_vercel/",
    "/__nuxt",
    "/__nitro",
    "/_ipx/",
    "/favicon",
    "/robots.txt",
    "/sitemap",
    "/assets/",
    "/public/",
  ];

  const shouldSkip = skipPrefixes.some((p) => pathname.startsWith(p));
  if (shouldSkip) return;

  // Reescreve internamente para que as páginas Nuxt em /in/[slug] sejam servidas
  const newPath = `/in/${sub}${pathname === "/" ? "" : pathname}`;
  const newUrl = `${newPath}${url.search || ""}`;
  event.node.req.url = newUrl;
});
