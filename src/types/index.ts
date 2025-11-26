// src/types/index.ts

// --- Utilitários de Resposta da API ---
export interface MetaPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: MetaPagination;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: MetaPagination;
}

// --- Entidades Base ---

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // Agora sabemos quem é quem
}

// Baseado em api_categories.json
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  filename: string;
}

export type ProductStatus = 'active' | 'inactive';

// Baseado em api_products.json
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // Decimal como string
  stock: number;
  status: ProductStatus;
  images?: ProductImage[]; // Ajustado para o objeto de imagem real
  category_ids?: string[];
  seller_id?: string;
  created_at: string;
}

// Baseado em api_addresses.json
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  address_type: 'shipping' | 'billing';
}

// Baseado em api_cart.json
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  subtotal: string; // O backend já calcula pra nós!
  product?: Product; 
}

export interface Cart {
  id: string;
  total: string;
  total_items: number;
  cart_items: CartItem[];
  updated_at: string;
}

// Baseado em api_orders.json
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: string; // Importante: preço na hora da compra
  product_name: string; // Snapshot do nome
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  total: string;
  created_at: string;
  items: OrderItem[];
  payment_method?: string;
  address?: Address; // Endereço snapshot ou ID
}