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
  
  async function forgotPasswordService(data: any): Promise<any> {
    return await $apiGateway<any>('forgot-password', {
      method: "post",
      body: data,
    });
  }

  async function updatePasswordService(data: any): Promise<any> {
    return await $apiGateway<any>('reset-password', {
      method: "patch",
      body: data,
    });
  }

  async function refreshTokenService(refreshToken: string): Promise<any> {
    return await $apiGateway<any>('refresh-token', {
      method: "patch",
      headers: {
        ['X-Auto-Refresh-Token']: refreshToken
      }
    });
  }

  return {
    loginService,
    logoutService,
    getProfileUserService,
    checkEmailService,
    createAccountService,
    forgotPasswordService,
    updatePasswordService,
    refreshTokenService
  };
};
