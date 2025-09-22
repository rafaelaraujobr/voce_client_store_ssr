import { useShopService } from "~/services/shop.service";

export const useShop = () => {
  const shopStore = useShopStore();
  const {
    setShop,
    setProducts,
    appendProducts,
    setProduct,
    setTotalProducts,
    setProductQuery,
    setCategories,
    setLoading,
    setLoadingProducts,
    setSlug,
    setRelatedProducts,
  } = shopStore;
  const {
    shop,
    slug,
    relatedProducts,
    products,
    product,
    totalProducts,
    productQuery,
    categories,
    loading,
    loadingProducts,
  } = storeToRefs(shopStore);
  const {
    getShopBySlugService,
    getProductsService,
    getProductByIdService,
    getRelatedProductsService,
  } = useShopService();

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

  async function getRelatedProducts(productId: string): Promise<void> {
    try {
      if (!shop.value?.id) return;
      const response = await getRelatedProductsService(shop.value?.id, productId);
      setRelatedProducts(response);
    } catch (error) {
      console.error("Erro ao buscar produtos relacionados:", error);
      throw error;
    }
  }

  async function loadMoreProducts(shopSlug: string): Promise<void> {
    try {
      const currentSkip = productQuery.value.skip + productQuery.value.take;
      const newQuery = { ...productQuery.value, skip: currentSkip };
      const response = await getProductsService(shopSlug, newQuery);
      if (response?.records && response.records.length > 0) {
        appendProducts(response.records);
        setProductQuery(newQuery);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar mais produtos:", error);
      throw error;
    }
  }

  return {
    shop,
    slug,
    products,
    product,
    totalProducts,
    productQuery,
    categories,
    loading,
    loadingProducts,
    relatedProducts,
    getShopBySlug,
    getProducts,
    getProductById,
    loadMoreProducts,
    setProductQuery,
    setCategories,
    setLoading,
    setLoadingProducts,
    setSlug,
    getRelatedProducts,
  };
};
