// Interfaces de Shop/Store
export interface Shop {
  id: string;
  name: string;
  description: string;
  logotipo: string;
  slug: string;
  created_at: string;
  updated_at: string;
  channels?: Channel[];
  campaigns?: Campaign[];
}

export interface Channel {
  id: string;
  type: string;
  link: string;
}

export interface Campaign {
  id: string;
  name: string;
  logotipo: string;
}

// Interfaces de Produto
export interface ProductInstallment {
  installment: number;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  price_discount?: number;
  installments?: ProductInstallment;
  category_id?: string;
  shop_id: string;
  company?: {
    id: string;
    name: string;
    logotipo: string;
  };
  created_at: string;
  updated_at: string;
}

// Interface para query de produtos
export interface ProductQuery {
  search: string;
  take: number;
  skip: number;
  orderBy: string;
  order: "asc" | "desc";
}

// Interface para resposta de listagem de produtos
export interface ProductListResponse {
  records: Product[];
  count: number;
}

// Interface para categoria
export interface Category {
  id: string;
  name: string;
  description?: string;
  shop_id: string;
  created_at: string;
  updated_at: string;
}

