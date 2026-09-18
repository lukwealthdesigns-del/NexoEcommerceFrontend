
// src/components/common/AdminPopup.jsx
import { useState, useEffect } from 'react';
import { X, MessageCircle, ShoppingBag, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import chatService from '../../services/chat';
import toast from 'react-hot-toast';

const AdminPopup = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const ADMIN_ID = "3abd0dc1-69b2-4810-b64a-a50f7c690f00";

  useEffect(() => {
    // Clear any existing dismissal to test (remove this line after testing)
    // localStorage.removeItem('admin_popup_dismissed');
    
    const dismissed = localStorage.getItem('admin_popup_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : null;
    
    // Check if dismissed more than 24 hours ago OR never dismissed
    const shouldShow = !dismissedTime || (Date.now() - dismissedTime > 24 * 60 * 60 * 1000);
    
    if (shouldShow) {
      // First popup after 5 seconds
      const firstTimer = setTimeout(() => {
        console.log('Showing popup - first time');
        setIsVisible(true);
      }, 5000);
      
      // Then popup every 40 seconds
      const interval = setInterval(() => {
        console.log('Showing popup - interval');
        setIsVisible(true);
      }, 40000);
      
      return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store the current time when dismissed
    localStorage.setItem('admin_popup_dismissed', Date.now().toString());
    console.log('Popup dismissed until tomorrow');
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to message admin');
      window.location.href = '/signin';
      return;
    }
    setIsVisible(false);
    setShowChatModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    const messageText = message.trim();
    setMessage('');

    try {
      await chatService.sendMessage(ADMIN_ID, messageText, 'text');
      toast.success('Message sent to admin!');
      setShowChatModal(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      setMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Original Popup Design */}
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
                Need help with NexoLeolite?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Chat with our team or browse our catalogue!
              </p>
              
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleChatClick}
                  className="flex items-center space-x-1 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs hover:bg-opacity-90 transition"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Chat Admin</span>
                </button>
                <Link
                  to="/shop"
                  onClick={handleDismiss}
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

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-[90vw] sm:max-w-sm max-h-[80vh] flex flex-col shadow-xl overflow-hidden">
            <div className="bg-brand-orange p-3 flex justify-between items-center shrink-0">
              <h3 className="text-white font-semibold text-sm sm:text-base">💬 Chat with Admin</h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white hover:bg-orange-600 rounded-full p-1 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 flex-1 overflow-y-auto">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                    Please login to message our support team.
                  </p>
                  <button
                    onClick={() => {
                      setShowChatModal(false);
                      window.location.href = '/signin';
                    }}
                    className="w-full bg-brand-orange text-white py-2.5 rounded-lg hover:bg-orange-600 text-sm"
                  >
                    Login to Continue
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question or message here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="w-full bg-brand-orange text-white py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPopup;