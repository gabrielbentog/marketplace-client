// src/types/index.ts

// --- Utilitários de Resposta da API ---
export interface MetaPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface DataWrapper<T> {
  data: T;
  meta?: MetaPagination;
  message?: string;
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

export interface AuthResponse {
  data?: {
    user: User;
  };
  user?: User;
  message?: string;
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

export interface ProductUser {
  id: string;
  name: string | null;
  email: string;
}

// Baseado em api_products.json
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[];
  categories?: Category[];
  user?: ProductUser;
  seller_id?: string; // Mantemos opcional por compatibilidade caso alguma rota antiga use
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

export interface CartProductSnapshot {
  id: string;
  name: string;
  price: string;
  images: ProductImage[];
}

// Baseado em api_cart.json
export interface CartItem {
  id: string;
  quantity: number;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  product: CartProductSnapshot; // Agora obrigatório pois o JSON mostra que vem
}

export interface Cart {
  id: string;
  total: string;
  totalItems: number; // JSON: "totalItems": 2
  cartItems: CartItem[]; // JSON: "cartItems": [...]
  createdAt: string;
  updatedAt: string;
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

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string; // camelCase
  country?: string;
  addressType: 'shipping' | 'billing'; // camelCase
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: string;
  paymentMethod: string;
  createdAt: string;
  items: any[];
}
