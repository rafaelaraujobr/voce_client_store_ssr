
  
  
export const useAccountService = () => {
    const { $apiGateway } = useNuxtApp();
  
  async function loginService(data: any): Promise<any> {
    return await $apiGateway<any>("login", {
      method: "post",
      body: data,
    });
  }

  async function logoutService(): Promise<any> {
    return await $apiGateway<any>("logout", {
      method: "delete",
    });
  }

  async function getProfileUserService(): Promise<any> {
    return await $apiGateway<any>(`marketplace/profile`, {
      method: "get",
    });
  }

   return {
      loginService,
      logoutService,
      getProfileUserService,
    };
};