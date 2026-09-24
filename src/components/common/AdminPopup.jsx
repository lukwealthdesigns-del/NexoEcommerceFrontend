

// // src/components/common/AdminPopup.jsx
// import { useState, useEffect, useRef } from 'react';
// import { X, MessageCircle, ShoppingBag, Send, Loader2 } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
// import chatService from '../../services/chat';
// import toast from 'react-hot-toast';

// const AdminPopup = () => {
//   const { user, isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();

//   const [isVisible, setIsVisible] = useState(false);
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [message, setMessage] = useState('');
//   const [sending, setSending] = useState(false);

//   const firstTimerRef = useRef(null);
//   const intervalRef = useRef(null);

//   const ADMIN_ID = "3abd0dc1-69b2-4810-b64a-a50f7c690f00";

//   useEffect(() => {
//     const dismissed = localStorage.getItem('admin_popup_dismissed');
//     const dismissedTime = dismissed ? parseInt(dismissed) : null;

//     // Show again 1 minute after dismissal
//     const shouldShow = !dismissedTime || (Date.now() - dismissedTime > 60 * 1000);

//     if (shouldShow) {
//       firstTimerRef.current = setTimeout(() => setIsVisible(true), 5000);
//       intervalRef.current = setInterval(() => setIsVisible(true), 40000);
//     }

//     return () => {
//       if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const handleDismiss = () => {
//     setIsVisible(false);
//     localStorage.setItem('admin_popup_dismissed', Date.now().toString());
//     if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   };

//   const handleChatClick = () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to message admin');
//       navigate('/signin');
//       return;
//     }
//     setIsVisible(false);
//     setShowChatModal(true);
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || sending) return;

//     const text = message.trim();
//     setSending(true);

//     try {
//       // This is what actually sends the message to the admin
//       await chatService.sendMessage(ADMIN_ID, text, 'text');
//       toast.success('Message sent to admin!');
//       setMessage('');
//       setShowChatModal(false);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       toast.error(
//         error?.response?.data?.detail ||
//         error?.message ||
//         'Failed to send message. Please try again.'
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (!isVisible && !showChatModal) return null;

//   return (
//     <>
//       {/* Popup */}
//       {isVisible && (
//         <div className="fixed bottom-24 left-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm relative">
//             <button
//               onClick={handleDismiss}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//             >
//               <X className="h-4 w-4" />
//             </button>

//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <div className="bg-brand-orange/10 p-2 rounded-xl">
//                   <ShoppingBag className="h-6 w-6 text-brand-orange" />
//                 </div>
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
//                   Need help with NexoLeolite?
//                 </h3>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   Chat with our team or browse our catalogue!
//                 </p>

//                 <div className="flex space-x-2 mt-3">
//                   <button
//                     onClick={handleChatClick}
//                     className="flex items-center space-x-1 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs hover:bg-opacity-90 transition"
//                   >
//                     <MessageCircle className="h-3 w-3" />
//                     <span>Chat Admin</span>
//                   </button>

//                   <Link
//                     to="/shop"
//                     onClick={handleDismiss}
//                     className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                   >
//                     <ShoppingBag className="h-3 w-3" />
//                     <span>Browse Products</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Chat Modal */}
//       {showChatModal && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-[95vw] sm:max-w-sm flex flex-col shadow-xl overflow-hidden">
//             <div className="bg-brand-orange p-3 flex justify-between items-center shrink-0">
//               <h3 className="text-white font-semibold text-sm sm:text-base">
//                 💬 Chat with Admin
//               </h3>
//               <button
//                 onClick={() => setShowChatModal(false)}
//                 className="text-white hover:bg-orange-600 rounded-full p-1 transition"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="p-3">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Type your question or message here..."
//                 rows={4}
//                 autoFocus
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none text-sm"
//               />

//               <button
//                 onClick={handleSendMessage}
//                 disabled={sending || !message.trim()}
//                 className="w-full mt-3 bg-brand-orange text-white py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
//               >
//                 {sending ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="h-4 w-4" />
//                     Send Message
//                   </>
//                 )}
//               </button>

//               <p className="text-[10px] text-gray-400 mt-2 text-center">
//                 Press Enter to send · Shift+Enter for new line
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AdminPopup;
// src/components/common/AdminPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, ShoppingBag, Send, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import chatService from '../../services/chat';
import toast from 'react-hot-toast';

const AdminPopup = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const firstTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const ADMIN_ID = "9f0ca557-7100-4866-ab00-1dfdea3db8af";

  useEffect(() => {
    const dismissed = localStorage.getItem('admin_popup_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : null;

    // Show again 1 minute after dismissal
    const shouldShow = !dismissedTime || (Date.now() - dismissedTime > 60 * 1000);

    if (shouldShow) {
      firstTimerRef.current = setTimeout(() => setIsVisible(true), 5000);
      intervalRef.current = setInterval(() => setIsVisible(true), 40000);
    }

    return () => {
      if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('admin_popup_dismissed', Date.now().toString());
    if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to message admin');
      navigate('/signin');
      return;
    }
    setIsVisible(false);
    setShowChatModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    const text = message.trim();
    setSending(true);

    try {
      await chatService.sendMessage(ADMIN_ID, text, 'text');
      toast.success('Message sent to admin!');
      setMessage('');
      setShowChatModal(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to send message. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible && !showChatModal) return null;

  return (
    <>
      {/* Popup */}
      {isVisible && (
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
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-[95vw] sm:max-w-sm flex flex-col shadow-xl overflow-hidden">
            <div className="bg-brand-orange p-3 flex justify-between items-center shrink-0">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                💬 Chat with Admin
              </h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white hover:bg-orange-600 rounded-full p-1 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question or message here..."
                rows={4}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none text-sm"
              />

              <button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="w-full mt-3 bg-brand-orange text-white py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPopup;