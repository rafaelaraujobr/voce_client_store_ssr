import { defineStore } from "pinia";
import type { Shop, Product, ProductQuery, Category } from "~/types/shop.types";

export const useShopStore = defineStore("shop", () => {
  const route = useRoute();
  const shop = ref<Shop | null>(null);
  const slug = ref<string | null>(route.params.slug as string);
  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);
  const productQuery = ref<ProductQuery>({
    search: "",
    take: 24,
    skip: 0,
    orderBy: "created_at",
    order: "desc",
  });
  const categories = ref<Category[]>([]);
  const loading = ref<boolean>(false);
  const loadingProducts = ref<boolean>(false);
  const totalProducts = ref<number>(0);

  function setShop(payload: Shop): void {
    shop.value = payload;
  }

  function setSlug(payload: string): void {
    slug.value = payload;
  }

  function setProducts(payload: Product[]): void {
    products.value = payload;
  }

  function appendProducts(payload: Product[]): void {
    products.value = [...products.value, ...payload];
  }

  function setProduct(payload: Product): void {
    product.value = payload;
  }

  function setProductQuery(payload: ProductQuery): void {
    productQuery.value = payload;
  }

  function setCategories(payload: Category[]): void {
    categories.value = payload;
  }

  function setTotalProducts(payload: number): void {
    totalProducts.value = payload;
  }

  function setLoading(payload: boolean): void {
    loading.value = payload;
  }

  function setLoadingProducts(payload: boolean): void {
    loadingProducts.value = payload;
  }

  return {
    shop,
    slug,
    products,
    product,
    productQuery,
    totalProducts,
    categories,
    loading,
    loadingProducts,
    setLoading,
    setLoadingProducts,
    setShop,
    setProducts,
    appendProducts,
    setProduct,
    setProductQuery,
    setTotalProducts,
    setCategories,
    setSlug,
  };
});
