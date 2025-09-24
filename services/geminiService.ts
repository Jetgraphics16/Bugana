import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

// IMPORTANT: In a real application, the API key should be stored in an environment variable.
// For this example, it's assumed to be available as process.env.API_KEY.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. Gemini services will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// For Product Translations
export const translateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  if (!API_KEY) {
    return `(Translation disabled) ${text}`;
  }
  if (!text) {
    return "";
  }
  
  const targetLangName = targetLanguage === Language.TL ? 'Tagalog' : 'English';
  
  try {
    const prompt = `Translate the following product description to ${targetLangName}. Keep the translation natural and appealing for an e-commerce site. Do not add any extra text or labels, just the translation itself:\n\n"${text}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 }
        }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error('Error translating text:', error);
    return `(Translation failed) ${text}`;
  }
};

// For AI Description Generation
export const generateProductDescription = async (
  productName: string,
  category: string
): Promise<string> => {
  if (!API_KEY) {
    return `(AI Description disabled) A wonderful ${productName} in the ${category} category.`;
  }
  if (!productName || !category) {
    return "";
  }

  try {
    const prompt = `You are a creative copywriter for "Bugana", an e-commerce store specializing in authentic Filipino products from the Aklan region. 
    
    Write a short, appealing, and natural-sounding product description (around 25-40 words) for an e-commerce site. 
    
    Do not use markdown or headings. Just return the paragraph of text for the description.
    
    Product Name: "${productName}"
    Category: "${category}"
    
    Highlight its craftsmanship, authenticity, or unique qualities.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error generating product description:', error);
    return `Failed to generate description. Please try again or write one manually.`;
  }
};


// For Chatbot
const chatSystemInstruction = `You are "Bugana Bot," a friendly and helpful customer service assistant for Bugana, an e-commerce store specializing in authentic Filipino products, particularly from the Aklan region. Your goal is to provide excellent support in either English or Tagalog.

- Be conversational and polite.
- You can answer questions about products, shipping, returns, and store policies.
- For product questions, refer to the general types of items available (e.g., "We have beautiful hand-woven apparel like the Piña Barong Tagalog, stylish accessories, and delicious local delicacies."). You don't have real-time stock information.
- For shipping/return questions, provide general, helpful e-commerce advice (e.g., "Shipping usually takes 3-5 business days," or "You can typically return items within 30 days of purchase. Please check our returns policy page for full details.").
- If you don't know an answer, politely say so and suggest contacting human support at support@bugana.ph.
- Respond in the language of the user's query (English or Tagalog).`;

let chat: Chat | null = null;

const initializeChat = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: chatSystemInstruction,
            }
        });
    }
};

export const getChatbotResponse = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, my connection is currently offline. Please try again later.";
  }
  try {
    initializeChat();
    const response: GenerateContentResponse = await chat!.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return "I seem to be having some trouble right now. Please try again in a moment.";
  }
};