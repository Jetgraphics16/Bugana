export enum Language {
  EN = 'en',
  TL = 'tl',
}

export enum View {
  SHOP = 'shop',
  POS = 'pos',
  SELLER_DASHBOARD = 'seller_dashboard',
  CHECKOUT = 'checkout',
  ORDER_CONFIRMATION = 'order_confirmation',
}

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Note: Only used for mock storage, not in application state.
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  descriptions: {
    [key in Language]?: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: number;
  productId: number;
  username: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO string date
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    date: string; // ISO string
    shippingInfo: {
        name: string;
        address: string;
    };
}