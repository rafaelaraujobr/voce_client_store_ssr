import { useCartStore } from "~/stores/cart";
export const useCart = () => {
  const cartStore = useCartStore();
  const { productsInCart } = storeToRefs(cartStore);
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
  } = cartStore;

  return {
    productsInCart,
    setProductsInCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart,
    getTotalPrice,
    getTotalQuantity,
    incrementProductQuantity,
    decrementProductQuantity,
  };
};
