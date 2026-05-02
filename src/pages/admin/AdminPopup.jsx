import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('admin_popup_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : null;
    
    if (!dismissedTime || Date.now() - dismissedTime > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('admin_popup_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="bg-brand-orange/10 p-2 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-brand-orange" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Need help with NexoElite?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Chat with our team or browse our catalogue!
            </p>
            
            <div className="flex space-x-2 mt-3">
              <Link
                to="/contact"
                className="flex items-center space-x-1 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs hover:bg-opacity-90 transition"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Chat Admin</span>
              </Link>
              <Link
                to="/shop"
                className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <ShoppingBag className="h-3 w-3" />
                <span>Browse Products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPopup;