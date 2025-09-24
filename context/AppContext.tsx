import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Language, View, User, UserRole, Review, Order } from '../types';
import { initialProducts } from '../data/products';
import { translateText } from '../services/geminiService';
import { Language as LangEnum, View as ViewEnum, UserRole as UserRoleEnum } from '../types';

export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  view: View;
  setView: (view: View) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  removeProduct: (productId: number) => void;
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isTranslating: boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'username'>) => void;
  latestOrder: Order | null;
  completeOrder: (shippingInfo: { name: string; address: string }) => void;
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(LangEnum.EN);
  const [view, setView] = useState<View>(ViewEnum.SHOP);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bugana_currentUser');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        // Set initial view based on role
        if (user.role === UserRoleEnum.SELLER) {
          setView(ViewEnum.SELLER_DASHBOARD);
        } else {
          setView(ViewEnum.SHOP);
        }
      }

      const storedReviews = localStorage.getItem('bugana_reviews');
      if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
      }

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('bugana_currentUser');
      localStorage.removeItem('bugana_reviews');
    }
  }, []);


  const translateAllProducts = useCallback(async (targetLang: Language) => {
    if (targetLang === LangEnum.EN) {
      return;
    }
    setIsTranslating(true);
    const productsToTranslate = products.filter(p => !p.descriptions[targetLang] && p.descriptions[LangEnum.EN]);
    
    if (productsToTranslate.length === 0) {
      setIsTranslating(false);
      return;
    }

    try {
      const translationPromises = productsToTranslate.map(product => 
        translateText(product.descriptions[LangEnum.EN]!, targetLang).then(translatedText => ({
          id: product.id,
          translatedText
        }))
      );
      const translations = await Promise.all(translationPromises);
      setProducts(prevProducts => 
        prevProducts.map(p => {
          const translation = translations.find(t => t.id === p.id);
          if (translation) {
            return {
              ...p,
              descriptions: { ...p.descriptions, [targetLang]: translation.translatedText }
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Failed to translate all products:", error);
    } finally {
      setIsTranslating(false);
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prevProducts => {
        const newProduct: Product = {
            id: Date.now(), // simple id generation
            ...product
        };
        return [...prevProducts, newProduct];
    });
  };
  
  const updateProduct = (updatedProduct: Product) => {
      setProducts(prevProducts => 
          prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
  };

  const removeProduct = (productId: number) => {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang !== LangEnum.EN) {
      translateAllProducts(lang);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCartItems([]);

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'username'>) => {
    if (!currentUser) return;

    const newReview: Review = {
        id: Date.now(),
        date: new Date().toISOString(),
        username: currentUser.name,
        ...reviewData,
    };

    setReviews(prevReviews => {
        const updatedReviews = [...prevReviews, newReview];
        localStorage.setItem('bugana_reviews', JSON.stringify(updatedReviews));
        return updatedReviews;
    });
  };

  const completeOrder = (shippingInfo: { name: string; address: string }) => {
    if (cartItems.length === 0) return;

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newOrder: Order = {
        id: `order_${Date.now()}`,
        items: [...cartItems],
        total: cartTotal,
        date: new Date().toISOString(),
        shippingInfo,
    };

    setLatestOrder(newOrder);
    clearCart(); // Clear the cart after order is placed
    setView(ViewEnum.ORDER_CONFIRMATION);
  };
  
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // NOTE: This is a mock authentication. In a real app, never store passwords in plaintext.
    const users: User[] = JSON.parse(localStorage.getItem('bugana_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      const { password: _, ...userToStore } = user;
      setCurrentUser(userToStore);
      localStorage.setItem('bugana_currentUser', JSON.stringify(userToStore));
      
      // Set view after login based on role
      if (userToStore.role === UserRoleEnum.SELLER) {
        setView(ViewEnum.SELLER_DASHBOARD);
      } else {
        setView(ViewEnum.SHOP);
      }
      
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
    // NOTE: This is a mock registration. In a real app, hash passwords before storing.
    let users: User[] = JSON.parse(localStorage.getItem('bugana_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = { id: Date.now().toString(), name, email, password, role };
    users.push(newUser);
    localStorage.setItem('bugana_users', JSON.stringify(users));

    const { password: _p, ...userToStore } = newUser;
    setCurrentUser(userToStore);
    localStorage.setItem('bugana_currentUser', JSON.stringify(userToStore));
    
    // Set view after registration based on role
    if (userToStore.role === UserRoleEnum.SELLER) {
      setView(ViewEnum.SELLER_DASHBOARD);
    } else {
      setView(ViewEnum.SHOP);
    }
    
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bugana_currentUser');
    // After logout, always return to the shop view for the next user or guest
    setView(ViewEnum.SHOP);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isAuthenticated = !!currentUser;

  const contextValue: AppContextType = {
    language, setLanguage, view, setView, products, addProduct, removeProduct, updateProduct, cartItems, addToCart,
    removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
    isCartOpen, setIsCartOpen, isTranslating, currentUser, isAuthenticated,
    login, register, logout,
    selectedProduct, setSelectedProduct,
    reviews, addReview,
    latestOrder, completeOrder
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};