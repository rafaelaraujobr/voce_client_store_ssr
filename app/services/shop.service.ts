import type {
  Shop,
  ProductQuery,
  ProductListResponse,
} from "~/types/shop.types";

export const useShopService = () => {
  const { $api, $apiGateway } = useNuxtApp();

  async function getShopBySlugService(
    slug: string = "flashapp"
  ): Promise<Shop> {
    return $api<Shop>(`/stores/${slug}`);
  }

  async function getProductsService(
    shopSlug: string,
    productQuery: ProductQuery
  ): Promise<ProductListResponse> {
    return $api<ProductListResponse>(`/products/store/${shopSlug}/showcase`, {
      params: productQuery,
    });
  }

  async function getProductByIdService(
    shopSlug: string,
    productId: string
  ): Promise<any> {
    return $api<any>(`/products/store/${shopSlug}/${productId}`);
  }

  async function getRelatedProductsService(
    shopId: string,
    productId: string
  ): Promise<any[]> {
    return $api<any[]>(`products/related/${shopId}/${productId}`);
  }

  async function getFreightService(payload: any): Promise<any> {
    try {
      return await $apiGateway<any>(`marketplace/products/delivery`, {
        method: "post",
        body: payload,
      });
    } catch (error) {
      console.error("Erro no getFreightService:", error);
      throw error;
    }
  }

  async function getAddressByZipcodeService(zipcode: string): Promise<any> {
    try {
      return await $fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
    } catch (error) {
      console.error("Erro no getAddressByZipcodeService:", error);
      throw error;
    }
  }

  async function getCalculateFreightService(payload: any): Promise<any> {
    try {
      return await $api<any>(`shipping/calculate`, {
        method: "post",
        body: payload,
      });
    } catch (error) {
      console.error("Erro no getCalculateFreightService:", error);
      throw error;
    }
  }



  return {
    getShopBySlugService,
    getProductsService,
    getProductByIdService,
    getRelatedProductsService,
    getFreightService,
    getAddressByZipcodeService,
    getCalculateFreightService,
  };
};
