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
        method: "POST",
        body: payload,
      });
    } catch (error) {
      console.error("Erro no getFreightService:", error);
      throw error;
    }
  }

  return {
    getShopBySlugService,
    getProductsService,
    getProductByIdService,
    getRelatedProductsService,
    getFreightService,
  };
};
