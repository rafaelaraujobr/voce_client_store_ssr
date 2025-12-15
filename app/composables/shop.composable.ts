import { useShopService } from "~/services/shop.service";
import { cleanQuery } from "~/utils/functions";
import { useShopStore } from "~/stores/shop";
import { storeToRefs } from "pinia";

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
    setProductFilters,
    setSearch,
    setPixPayment
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
    producFilters,
    search,
    pixPayment
  } = storeToRefs(shopStore);

  const {
    getShopBySlugService,
    getProductsService,
    getProductByIdService,
    getRelatedProductsService,
  } = useShopService();

  async function getShopBySlug(slug: string): Promise<void> {
    try {
      Loading.show();
      setLoading(true);
      const response = await getShopBySlugService(slug);
      setShop(response);
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
      throw error;
    } finally {
      Loading.hide();
      setLoading(false);
    }
  }

  async function getProducts(shopSlug: string): Promise<void> {
    try {
      Loading.show();
      setLoadingProducts(true);
      const response = await getProductsService(shopSlug, {
        ...productQuery.value,
        ...cleanQuery(producFilters.value),
      });
      setProducts(response?.records || []);
      setTotalProducts(response?.count || 0);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    } finally {
      Loading.hide();
      setLoadingProducts(false);
    }
  }

  async function getProductById(
    shopSlug: string,
    productId: string
  ): Promise<void> {
    try {
      Loading.show();
      const response = await getProductByIdService(shopSlug, productId);
      setProduct(response);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    } finally {
      Loading.hide();
    }
  }

  async function getRelatedProducts(productId: string): Promise<void> {
    try {
      Loading.show();
      if (!shop.value?.id) return;
      const response = await getRelatedProductsService(
        shop.value?.id,
        productId
      );
      setRelatedProducts(response);
    } catch (error) {
      console.error("Erro ao buscar produtos relacionados:", error);
      throw error;
    } finally {
      Loading.hide();
    }
  }

  async function loadMoreProducts(shopSlug: string): Promise<void> {
    try {
      Loading.show();
      const currentSkip = productQuery.value.skip + productQuery.value.take;
      const newQuery = { ...productQuery.value, skip: currentSkip };
      const response = await getProductsService(shopSlug, newQuery);
      if (response?.records && response.records.length > 0) {
        appendProducts(response.records);
        setProductQuery(newQuery);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      throw error;
    } finally {
      Loading.hide();
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
    producFilters,
    search,
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
    setProductFilters,
    setSearch,
    pixPayment,
    setPixPayment
  };
};
