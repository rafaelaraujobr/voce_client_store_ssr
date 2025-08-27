import { defineStore } from "pinia";

export const useShopStore = defineStore("shop", () => {
  const shop = ref<any>(null);
  const products = ref<any[]>([]);
  const totalProducts = ref<number>(0);

  function setShop(payload: any) {
    shop.value = payload;
  }

  function setProducts(payload: any[]) {
    products.value = payload;
  }

  function setTotalProducts(payload: number) {
    totalProducts.value = payload;
  }

  return {
    shop,
    products,
    totalProducts,
    setShop,
    setProducts,
    setTotalProducts,
  };
});
