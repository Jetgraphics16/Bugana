import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm Bugana Bot. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
        const botResponse = await getChatbotResponse(userMessage);
        setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const BotMessage: React.FC<{text: string}> = ({text}) => (
      <div className="flex justify-start">
        <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none py-2 px-3 max-w-xs">
          <p className="text-sm">{text}</p>
        </div>
      </div>
  );
  
  const UserMessage: React.FC<{text: string}> = ({text}) => (
      <div className="flex justify-end">
        <div className="bg-emerald-600 text-white rounded-lg rounded-br-none py-2 px-3 max-w-xs">
          <p className="text-sm">{text}</p>
        </div>
      </div>
  );
  
  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="bg-gray-200 text-gray-500 rounded-lg rounded-bl-none py-2 px-3 max-w-xs">
        <div className="flex items-center justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed bottom-0 right-0 m-5 sm:m-8 z-50 transition-all duration-300 ${isOpen ? 'w-full max-w-sm h-4/5' : 'w-16 h-16'}`}>
        {/* Chat Window */}
        <div className={`bg-white rounded-xl shadow-2xl flex flex-col h-full transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <header className="bg-emerald-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-lg">Bugana Bot</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </header>
          <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, index) => 
                msg.sender === 'bot' ? <BotMessage key={index} text={msg.text} /> : <UserMessage key={index} text={msg.text} />
            )}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </main>
          <footer className="p-4 border-t bg-white rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors" disabled={isLoading || !inputValue}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </footer>
        </div>
      </div>
       {/* FAB Button */}
      <button onClick={() => setIsOpen(prev => !prev)} className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all duration-300 z-50 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </>
  );
};

export default Chatbot;
