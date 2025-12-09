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

  const { getCalculateFreightService } = useShopService();

  async function getFreight(payload: any): Promise<any> {
    setLoadingFreight(true);
    try {
      const { records } = await getCalculateFreightService({
        ...payload,
      });
      setFreight(records);
      return records;
    } catch (error: any) {
      console.error("Erro ao buscar frete:", error);
      throw error;
    } finally {
      setLoadingFreight(false);
    }
  }

  function removeProductCart(product: any): void {
    Notify.create({
      message: "Produto removido do carrinho",
      color: "positive",
      icon: "mdi-check",
    });
    if (productsInCart.value.length === 1) {
      clearCart();
      navigateTo("/");
    } else removeProductFromCart(product);
  }
  return {
    productsInCart,
    loadingFreight,
    freight,
    setProductsInCart,
    addProductToCart,
    removeProductCart,
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
