export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apiGateway = $fetch.create({
    baseURL: config.public.apiGatewayBase,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    onRequest({ options }) {
      if (options.method) options.method = options.method.toUpperCase() as any;
    },
    onRequestError({ error }) {
      console.error("Erro na requisição do API Gateway:", error);
    },
    onResponseError({ response }) {
      console.error(
        "Erro na resposta do API Gateway:",
        response.status,
        response.statusText
      );
    },
  });

  return {
    provide: { apiGateway },
  };
});
