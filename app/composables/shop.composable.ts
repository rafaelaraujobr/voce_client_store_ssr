import { useShopService } from "~/services/shop.service";

export const useShop = () => {
  const shopStore = useShopStore();
  const { setShop, setProducts, setTotalProducts } = shopStore;
  const { shop, products, totalProducts } = storeToRefs(shopStore);
  const { getShopBySlugService, getProductsService } = useShopService();

  async function getShopBySlug(slug: string): Promise<void> {
    try {
      const response = await getShopBySlugService(slug);
      setShop(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function getProducts(shopSlug: string): Promise<void> {
    try {
      const response = await getProductsService(shopSlug);
      setProducts(response?.records || []);
      setTotalProducts(response?.count || 0);
    } catch (error) {
      console.log(error);
    }
  }
  return { getShopBySlug, getProducts, shop, products, totalProducts };
};
