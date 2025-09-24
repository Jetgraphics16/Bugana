import type { Product } from '../types';
import { Language } from '../types';

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Piña Barong Tagalog',
    price: 4500.00,
    image: 'https://picsum.photos/seed/pina/400/400',
    category: 'Apparel',
    inStock: true,
    descriptions: {
      [Language.EN]: 'An elegant, hand-woven formal shirt made from pineapple leaf fibers. A staple of Filipino formal wear.',
    },
  },
  {
    id: 2,
    name: 'Abaca Tote Bag',
    price: 850.50,
    image: 'https://picsum.photos/seed/abaca/400/400',
    category: 'Accessories',
    inStock: true,
    descriptions: {
      [Language.EN]: 'A durable and stylish tote bag handcrafted from natural abaca fibers, perfect for everyday use.',
    },
  },
  {
    id: 3,
    name: 'Bariw Sleeping Mat (Banig)',
    price: 1200.00,
    image: 'https://picsum.photos/seed/bariw/400/400',
    category: 'Home Goods',
    inStock: false,
    descriptions: {
      [Language.EN]: 'A traditional handwoven mat made from dried bariw leaves. Cool, comfortable, and beautifully intricate.',
    },
  },
  {
    id: 4,
    name: 'Aklanon Tinuom na Manok',
    price: 250.00,
    image: 'https://picsum.photos/seed/tinuom/400/400',
    category: 'Food',
    inStock: true,
    descriptions: {
      [Language.EN]: 'A savory Aklanon delicacy of native chicken seasoned with spices, wrapped in banana leaves, and steamed to perfection.',
    },
  },
  {
    id: 5,
    name: 'Sweet Ampaw Pops',
    price: 75.00,
    image: 'https://picsum.photos/seed/ampaw/400/400',
    category: 'Snacks',
    inStock: true,
    descriptions: {
      [Language.EN]: 'Crispy puffed rice treats sweetened with syrup. A classic Filipino snack that is light and delightful.',
    },
  },
  {
    id: 6,
    name: 'Nito Vine Basket',
    price: 600.00,
    image: 'https://picsum.photos/seed/nito/400/400',
    category: 'Home Goods',
    inStock: true,
    descriptions: {
      [Language.EN]: 'A sturdy and decorative basket woven from nito vines, showcasing indigenous Aklanon craftsmanship.',
    },
  },
  {
    id: 7,
    name: 'Coconut Shell Bowl',
    price: 150.00,
    image: 'https://picsum.photos/seed/coconut/400/400',
    category: 'Home Goods',
    inStock: false,
    descriptions: {
        [Language.EN]: 'An eco-friendly bowl made from polished coconut shells. Ideal for salads, snacks, or as a decorative piece.',
    },
  },
  {
    id: 8,
    name: 'Kalibo Longganisa',
    price: 180.00,
    image: 'https://picsum.photos/seed/longganisa/400/400',
    category: 'Food',
    inStock: true,
    descriptions: {
        [Language.EN]: 'A flavorful local sausage from Kalibo, known for its distinct garlicky and savory taste.',
    },
  }
];
