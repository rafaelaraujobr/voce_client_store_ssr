import { useCartStore } from "~/stores/cart";
import { useShopService } from "~/services/shop.service";

export const useCart = () => {
  const cartStore = useCartStore();
  const { productsInCart, loadingFreight, freight } = storeToRefs(cartStore);

  const { getFreightService } = useShopService();

  const {
    setProductsInCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart,
    getTotalPrice,
    getTotalQuantity,
    incrementProductQuantity,
    decrementProductQuantity,
    setLoadingFreight,
    setFreight,
  } = cartStore;

  async function getFreight(payload: any): Promise<any> {
    try {
      setLoadingFreight(true);
      const response = await getFreightService({
        ...payload,
      });
      setFreight(response);
    } catch (error) {
      console.error("Erro ao buscar frete:", error);
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
  };
};
