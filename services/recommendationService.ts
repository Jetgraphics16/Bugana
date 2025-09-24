import type { Product } from '../types';
import { Language } from '../types';

// A simple set of common English and Tagalog stop words to ignore.
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but',
  'ang', 'mga', 'sa', 'ng', 'na', 'at', 'ay', 'ay'
]);

/**
 * Extracts and cleans keywords from a string.
 * @param text The text to process.
 * @returns A set of unique keywords.
 */
const getKeywords = (text: string | undefined): Set<string> => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/) // split by whitespace
      .filter(word => word.length > 2 && !STOP_WORDS.has(word))
  );
};

/**
 * Calculates a similarity score between two products based on content.
 * @param currentProduct The product to find recommendations for.
 * @param otherProduct The product to compare against.
 * @returns A numerical similarity score.
 */
const calculateSimilarityScore = (currentProduct: Product, otherProduct: Product): number => {
  let score = 0;

  // 1. Category matching (highest weight)
  if (currentProduct.category === otherProduct.category) {
    score += 10;
  }

  // 2. Keyword matching in name and description
  const currentKeywords = new Set([
      ...getKeywords(currentProduct.name),
      ...getKeywords(currentProduct.descriptions[Language.EN]),
  ]);
  
  const otherKeywords = new Set([
      ...getKeywords(otherProduct.name),
      ...getKeywords(otherProduct.descriptions[Language.EN]),
  ]);

  let commonKeywords = 0;
  for (const keyword of currentKeywords) {
    if (otherKeywords.has(keyword)) {
      commonKeywords++;
    }
  }
  score += commonKeywords * 2; // Weight common keywords

  // 3. Price proximity (lower weight)
  const priceDifference = Math.abs(currentProduct.price - otherProduct.price) / currentProduct.price;
  if (priceDifference < 0.25) { // within 25% price range
    score += 3;
  } else if (priceDifference < 0.5) { // within 50% price range
    score += 1;
  }

  return score;
};

/**
 * Gets content-based product recommendations.
 * @param currentProduct The product being viewed.
 * @param allProducts The list of all available products.
 * @param count The number of recommendations to return.
 * @returns An array of recommended products.
 */
export const getRecommendedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  count: number = 4
): Product[] => {
  const scoredProducts = allProducts
    .filter(p => p.id !== currentProduct.id) // Exclude the product itself
    .map(otherProduct => ({
      product: otherProduct,
      score: calculateSimilarityScore(currentProduct, otherProduct),
    }))
    .filter(item => item.score > 0); // Only include products with some similarity

  // Sort by score in descending order
  scoredProducts.sort((a, b) => b.score - a.score);

  // Return the top 'count' products
  return scoredProducts.slice(0, count).map(item => item.product);
};
