import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", () => {
  const productsInCart = ref<any[]>([]);
  function setProductsInCart(products: any[]): void {
    productsInCart.value = products;
  }
  function addProductToCart(product: any): void {
    if (productsInCart.value.find((p) => p.id === product.id)) {
      productsInCart.value.find((p) => p.id === product.id).quantity += 1;
    } else {
      productsInCart.value.push({ ...product, quantity: 1 });
    }
  }
  function removeProductFromCart(product: any): void {
    productsInCart.value = productsInCart.value.filter(
      (p) => p.id !== product.id
    );
  }
  function updateProductQuantity(product: any, quantity: number): void {
    productsInCart.value.find((p) => p.id === product.id).quantity = quantity;
  }
  function clearCart(): void {
    productsInCart.value = [];
  }
  function getTotalPrice(): number {
    return productsInCart.value.reduce(
      (acc, product) => acc + (product.price_discount || product.price) * product.quantity,
      0
    );
  }
  function getTotalQuantity(): number {
    return productsInCart.value.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
  }

  function incrementProductQuantity(product: any): void {
    productsInCart.value.find((p) => p.id === product.id).quantity += 1;
  }
  function decrementProductQuantity(product: any): void {
    productsInCart.value.find((p) => p.id === product.id).quantity -= 1;
  }

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
});
