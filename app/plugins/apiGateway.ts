export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apiGateway = $fetch.create({
    baseURL: config.public.apiGatewayBase,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    },
    onRequest({ options }) {
      if (options.method) options.method = options.method.toUpperCase() as any;
    },
    onRequestError({ error }) {
      console.error("Erro na requisição do API Gateway:", error);
    },
    onResponseError({ response }) {
      console.error("Erro na resposta do API Gateway:", {
        status: response.status,
        statusText: response.statusText,
        data: response._data
      });
      throw response;
    },
  });

  return {
    provide: { apiGateway },
  };
});
