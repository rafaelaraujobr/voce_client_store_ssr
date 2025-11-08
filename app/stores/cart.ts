import { defineStore } from "pinia";
import { useTenant } from "~/composables/tenant.composable";

export const useCartStore = defineStore(
  "cart",
  () => {
    const productsInCart = ref<any[]>([]);
    const freight = ref<any>(null);
    const loadingFreight = ref<boolean>(false);
    function setLoadingFreight(loading: boolean): void {
      loadingFreight.value = loading;
    }
    function setProductsInCart(products: any[]): void {
      productsInCart.value = products;
    }
    function setFreight(freightData: any): void {
      freight.value = freightData;
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
      const total = productsInCart.value.reduce(
        (acc, product) =>
          acc +
          (product.sku?.price_discount || product.sku?.price) *
            product.quantity,
        0
      );
      return total || 0;
    }

    function getTotalDiscount(): number {
      return productsInCart.value.reduce(
        (acc, product) =>
          acc +
          (product.sku?.price - product.sku?.price_discount) * product.quantity,
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
      freight,
      loadingFreight,
      setProductsInCart,
      addProductToCart,
      removeProductFromCart,
      updateProductQuantity,
      clearCart,
      getTotalPrice,
      getTotalQuantity,
      incrementProductQuantity,
      decrementProductQuantity,
      setFreight,
      setLoadingFreight,
      getTotalDiscount,
    };
  },
  {
    persist: {
      pick: ["productsInCart"],
      storage: {
        getItem: (key: string) => {
          if (!import.meta.client) return null;
          const tenant = (useTenant().value || "default").toString();
          return window.localStorage.getItem(`${tenant}:${key}`);
        },
        setItem: (key: string, value: string) => {
          if (!import.meta.client) return;
          const tenant = (useTenant().value || "default").toString();
          window.localStorage.setItem(`${tenant}:${key}`, value);
        },
      },
    },
  }
);
