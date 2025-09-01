import type {
  Shop,
  ProductQuery,
  ProductListResponse,
} from "~/types/shop.types";

export const useShopService = () => {
  const { $api } = useNuxtApp();

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

  return {
    getShopBySlugService,
    getProductsService,
    getProductByIdService,
  };
};
