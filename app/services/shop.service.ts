export const useShopService = () => {
  const { $api } = useNuxtApp();

  async function getShopBySlugService(slug: string = "flashapp"): Promise<any> {
    return $api<any>(`/stores/${slug}`);
  }

  async function getProductsService(shopSlug: string): Promise<any[]> {
    return $api<any[]>(`/products/store/${shopSlug}/showcase`);
  }

  return {
    getShopBySlugService,
    getProductsService,
  };
};
