import { useShopService } from "~/services/shop.service";

export const useShop = () => {
  const shopStore = useShopStore();
  const {
    setShop,
    setProducts,
    setProduct,
    setTotalProducts,
    setProductQuery,
    setCategories,
    setLoading,
    setLoadingProducts,
  } = shopStore;
  const {
    shop,
    products,
    product,
    totalProducts,
    productQuery,
    categories,
    loading,
    loadingProducts,
  } = storeToRefs(shopStore);
  const { getShopBySlugService, getProductsService, getProductByIdService } =
    useShopService();

  async function getShopBySlug(slug: string): Promise<void> {
    try {
      setLoading(true);
      const response = await getShopBySlugService(slug);
      setShop(response);
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getProducts(shopSlug: string): Promise<void> {
    try {
      setLoadingProducts(true);
      const response = await getProductsService(shopSlug, productQuery.value);
      setProducts(response?.records || []);
      setTotalProducts(response?.count || 0);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    } finally {
      setLoadingProducts(false);
    }
  }

  async function getProductById(
    shopSlug: string,
    productId: string
  ): Promise<void> {
    try {
      const response = await getProductByIdService(shopSlug, productId);
      setProduct(response);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  }

  return {
    shop,
    products,
    product,
    totalProducts,
    productQuery,
    categories,
    loading,
    loadingProducts,
    getShopBySlug,
    getProducts,
    getProductById,
    setProductQuery,
    setCategories,
    setLoading,
    setLoadingProducts,
  };
};
