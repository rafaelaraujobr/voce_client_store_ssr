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

  async function checkEmailService(
    email: string,
    storeId: string
  ): Promise<any> {
    return await $apiGateway<any>(
      `marketplace/${storeId}/check-email/${email}`
    );
  }

  async function createAccountService(data: any): Promise<any> {
    return await $apiGateway<any>('marketplace/register', {
      method: "post",
      body: data,
    });
  }
  

  return {
    loginService,
    logoutService,
    getProfileUserService,
    checkEmailService,
    createAccountService,
  };
};
