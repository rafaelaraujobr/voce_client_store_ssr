import { useCartStore } from "~/stores/cart";
import { useShopService } from "~/services/shop.service";

export const useCart = () => {
  const cartStore = useCartStore();
  const { productsInCart, loadingFreight, freight } = storeToRefs(cartStore);

  const {
    setProductsInCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart,
    getTotalPrice,
    getTotalQuantity,
    getTotalDiscount,
    incrementProductQuantity,
    decrementProductQuantity,
    setLoadingFreight,
    setFreight,
  } = cartStore;

  const { getFreightService } = useShopService();

  async function getFreight(payload: any): Promise<any> {
    setLoadingFreight(true);
    try {
      const response = await getFreightService({
        ...payload,
      });
      setFreight(response);
      return response;
    } catch (error: any) {
      console.error("Erro ao buscar frete:", error);
      throw error;
    } finally {
      setLoadingFreight(false);
    }
  }
  return {
    productsInCart,
    loadingFreight,
    freight,
    setProductsInCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart,
    getTotalPrice,
    getTotalQuantity,
    incrementProductQuantity,
    decrementProductQuantity,
    getFreight,
    getTotalDiscount,
  };
};
