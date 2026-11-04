

// // src/pages/admin/AdminMessages.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Send, MessageCircle, User, Search, Loader2, Mail, ArrowLeft, Check, CheckCheck } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import chatService from '../../services/chat';
// import { useAuthStore } from '../../store/authStore';
// import toast from 'react-hot-toast';

// const AdminMessages = () => {
//   const { user } = useAuthStore();
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sending, setSending] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSidebar, setShowSidebar] = useState(true);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     loadConversations();
//   }, []);

//   useEffect(() => {
//     if (selectedConversation) {
//       loadMessages(selectedConversation.other_user_id);
//     }
//   }, [selectedConversation]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const loadConversations = async () => {
//     setLoading(true);
//     try {
//       const data = await chatService.getConversations();
//       setConversations(data || []);
//       if (data && data.length > 0 && !selectedConversation) {
//         setSelectedConversation(data[0]);
//       }
//     } catch (error) {
//       console.error('Failed to load conversations:', error);
//       toast.error('Failed to load conversations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMessages = async (userId) => {
//     try {
//       const data = await chatService.getMessages(userId);
//       setMessages(data || []);
//       await chatService.markAsRead(userId);
//     } catch (error) {
//       console.error('Failed to load messages:', error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!selectedConversation || !newMessage.trim() || sending) return;

//     setSending(true);
//     const messageText = newMessage.trim();
//     setNewMessage('');

//     try {
//       const message = await chatService.sendMessage(
//         selectedConversation.other_user_id,
//         messageText,
//         'text'
//       );
//       setMessages([...messages, message]);
      
//       setConversations(prev => 
//         prev.map(conv => 
//           conv.other_user_id === selectedConversation.other_user_id
//             ? { ...conv, last_message: messageText, last_message_time: message.created_at }
//             : conv
//         )
//       );
      
//       setTimeout(scrollToBottom, 100);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       toast.error('Failed to send message');
//       setNewMessage(messageText);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatMessageTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now - date;
    
//     if (diff < 24 * 60 * 60 * 1000) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
//     return date.toLocaleDateString();
//   };

//   const getInitials = (name) => {
//     if (!name) return 'U';
//     return name.charAt(0).toUpperCase();
//   };

//   const filteredConversations = conversations.filter(conv => 
//     conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden h-[85vh]">
//           <div className="flex h-full">
//             {/* Conversations Sidebar */}
//             <div className={`${showSidebar ? 'w-full md:w-80' : 'hidden md:block md:w-80'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-semibold text-white text-lg">User Messages</h2>
//                   <Mail className="h-5 w-5 text-white" />
//                 </div>
//                 <p className="text-xs text-orange-100 mt-1">Conversations with users</p>
//               </div>
              
//               <div className="p-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex-1 overflow-y-auto">
//                 {filteredConversations.length === 0 ? (
//                   <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                     <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                     <p>No conversations yet</p>
//                     <p className="text-sm mt-1">Users will appear here when they message you</p>
//                   </div>
//                 ) : (
//                   filteredConversations.map((conv) => (
//                     <button
//                       key={conv.id}
//                       onClick={() => {
//                         setSelectedConversation(conv);
//                         setShowSidebar(false);
//                       }}
//                       className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 ${
//                         selectedConversation?.id === conv.id ? 'bg-gray-50 dark:bg-gray-700' : ''
//                       }`}
//                     >
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center text-white font-semibold text-lg">
//                           {getInitials(conv.other_user_name)}
//                         </div>
//                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                       </div>
//                       <div className="flex-1 text-left">
//                         <div className="flex justify-between items-baseline">
//                           <p className="font-semibold text-gray-900 dark:text-white">{conv.other_user_name}</p>
//                           {conv.last_message_time && (
//                             <span className="text-xs text-gray-400">{formatMessageTime(conv.last_message_time)}</span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
//                           {conv.last_message || 'Tap to start chatting'}
//                         </p>
//                       </div>
//                       {conv.unread_count > 0 && (
//                         <span className="w-5 h-5 bg-brand-orange rounded-full text-xs text-white flex items-center justify-center">
//                           {conv.unread_count}
//                         </span>
//                       )}
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Chat Area */}
//             {selectedConversation ? (
//               <div className="flex-1 flex flex-col">
//                 {/* Chat Header */}
//                 <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
//                   <div className="flex items-center space-x-3">
//                     <button
//                       onClick={() => setShowSidebar(true)}
//                       className="md:hidden p-2 hover:bg-orange-600 rounded-lg text-white"
//                     >
//                       <ArrowLeft className="h-5 w-5" />
//                     </button>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg">
//                         {getInitials(selectedConversation.other_user_name)}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-white">
//                           {selectedConversation.other_user_name}
//                         </h3>
//                         <p className="text-xs text-orange-100">Customer</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Messages Area */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
//                   {messages.length === 0 ? (
//                     <div className="text-center text-gray-500 dark:text-gray-400 py-8">
//                       <MessageCircle className="h-16 w-16 mx-auto mb-3 opacity-50" />
//                       <p>No messages yet</p>
//                       <p className="text-sm mt-1">Send a message to start the conversation!</p>
//                     </div>
//                   ) : (
//                     messages.map((msg, index) => {
//                       const isOwn = msg.sender_id === user?.id;
//                       return (
//                         <div
//                           key={index}
//                           className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
//                         >
//                           <div
//                             className={`max-w-[70%] p-3 rounded-2xl ${
//                               isOwn
//                                 ? 'bg-brand-orange text-white rounded-br-sm'
//                                 : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
//                             }`}
//                           >
//                             <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
//                             <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-400'}`}>
//                               <span className="text-xs">
//                                 {formatMessageTime(msg.created_at)}
//                               </span>
//                               {isOwn && (
//                                 msg.read_at ? (
//                                   <CheckCheck className="h-3 w-3" />
//                                 ) : (
//                                   <Check className="h-3 w-3" />
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Message Input */}
//                 <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type a message... (Enter to send)"
//                       className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                       disabled={sending}
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={!newMessage.trim() || sending}
//                       className="p-2 bg-brand-orange hover:bg-orange-600 rounded-full transition disabled:opacity-50"
//                     >
//                       {sending ? (
//                         <Loader2 className="h-5 w-5 text-white animate-spin" />
//                       ) : (
//                         <Send className="h-5 w-5 text-white" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//                 <div className="text-center">
//                   <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Messages</h3>
//                   <p className="text-gray-500 dark:text-gray-400 mt-1">Select a conversation to start replying</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMessages;

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageCircle,
  Search,
  Loader2,
  Mail,
  ArrowLeft,
  Check,
  CheckCheck,
  RefreshCw,
  X,
} from 'lucide-react';

import { adminService } from '../../services/admin';
import chatService from '../../services/chat';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const { user } = useAuthStore();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const selectedUserRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation?.other_user_id) {
      selectedUserRef.current = selectedConversation.other_user_id;
      loadMessages(selectedConversation.other_user_id);
    } else {
      selectedUserRef.current = null;
      setMessages([]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  const loadConversations = async () => {
    setLoading(true);

    try {
      const data = await chatService.getConversations();
      const list = Array.isArray(data) ? data : [];

      setConversations(list);

      if (list.length > 0 && !selectedConversation) {
        setSelectedConversation(list[0]);
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    setMessagesLoading(true);

    try {
      const data = await chatService.getMessages(userId);

      // Prevent an older request from replacing the selected chat.
      if (selectedUserRef.current !== userId) return;

      setMessages(Array.isArray(data) ? data : []);

      await chatService.markAsRead(userId);

      setConversations(prev =>
        prev.map(conv =>
          conv.other_user_id === userId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      if (selectedUserRef.current === userId) {
        setMessagesLoading(false);
      }
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowSidebar(false);
    setMessages([]);
  };

  const handleBackToConversations = () => {
    setShowSidebar(true);
  };

  const handleSendMessage = async () => {
    if (
      !selectedConversation ||
      !newMessage.trim() ||
      sending
    ) {
      return;
    }

    const messageText = newMessage.trim();
    const recipientId = selectedConversation.other_user_id;

    setSending(true);
    setNewMessage('');

    try {
      const message = await chatService.sendMessage(
        recipientId,
        messageText,
        'text'
      );

      if (selectedUserRef.current === recipientId) {
        setMessages(prev => [...prev, message]);
      }

      setConversations(prev =>
        prev.map(conv =>
          conv.other_user_id === recipientId
            ? {
                ...conv,
                last_message: messageText,
                last_message_time: message.created_at,
              }
            : conv
        )
      );

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageText);
    } finally {
      setSending(false);
      messageInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOwnMessage = (msg) =>
    String(msg.sender_id) === String(user?.id);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-brand-orange" />
        <p className="text-sm text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 bg-gray-50 dark:bg-gray-900">

      <div className="
        w-full max-w-7xl mx-auto
        px-0 sm:px-4 lg:px-8
        py-0 sm:py-4 lg:py-6
      ">

        <div className="
          bg-white dark:bg-gray-800
          sm:rounded-2xl sm:shadow-sm
          overflow-hidden
          flex
          h-[calc(100dvh-64px)]
          min-h-[450px]
          sm:h-[85vh]
          sm:min-h-[550px]
        ">

          {/* CONVERSATIONS SIDEBAR */}

          <div className={`
            ${showSidebar ? 'flex' : 'hidden'}
            md:flex
            w-full md:w-80 lg:w-96
            shrink-0
            border-r border-gray-200 dark:border-gray-700
            flex-col
            min-h-0
            bg-white dark:bg-gray-800
          `}>

            {/* Sidebar Header */}

            <div className="
              p-4 sm:p-5
              bg-brand-orange
              shrink-0
            ">
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-bold text-white text-lg sm:text-xl">
                    User Messages
                  </h2>

                  <p className="text-xs text-orange-100 mt-1">
                    Conversations with users
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>

              </div>
            </div>

            {/* Search */}

            <div className="p-3 sm:p-4 shrink-0">

              <div className="relative">

                <Search className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  h-4 w-4 text-gray-400
                " />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-10 pr-10 py-3
                    text-sm
                    border border-gray-200 dark:border-gray-600
                    rounded-xl
                    focus:ring-2 focus:ring-brand-orange
                    focus:border-brand-orange
                    outline-none
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-white
                    placeholder-gray-400
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      text-gray-400
                      p-1
                    "
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>
            </div>

            {/* Conversation List */}

            <div className="
              flex-1 min-h-0
              overflow-y-auto
              overscroll-contain
            ">

              {filteredConversations.length === 0 ? (

                <div className="
                  flex flex-col items-center
                  justify-center
                  text-center
                  p-8
                  min-h-[250px]
                  text-gray-500 dark:text-gray-400
                ">

                  <MessageCircle className="h-14 w-14 mb-3 opacity-40" />

                  <p className="font-semibold">
                    {searchTerm
                      ? 'No users found'
                      : 'No conversations yet'}
                  </p>

                  <p className="text-sm mt-2 max-w-xs">
                    {searchTerm
                      ? 'Try searching with another name.'
                      : 'Users will appear here when they message you.'}
                  </p>

                  <button
                    onClick={loadConversations}
                    className="
                      mt-4 flex items-center gap-2
                      text-sm font-medium
                      text-brand-orange
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>

                </div>

              ) : (

                filteredConversations.map((conv) => (

                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectConversation(conv)}
                    className={`
                      w-full
                      p-3 sm:p-4
                      flex items-center gap-3
                      text-left
                      border-b border-gray-100 dark:border-gray-700
                      transition-colors
                      active:bg-orange-50 dark:active:bg-gray-700
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${
                        selectedConversation?.id === conv.id
                          ? 'bg-orange-50 dark:bg-gray-700'
                          : ''
                      }
                    `}
                  >

                    {/* Avatar */}

                    <div className="relative shrink-0">

                      <div className="
                        w-12 h-12 sm:w-14 sm:h-14
                        rounded-full
                        bg-gradient-to-br from-brand-orange to-orange-500
                        flex items-center justify-center
                        text-white font-bold text-lg
                      ">
                        {getInitials(conv.other_user_name)}
                      </div>

                      <div className="
                        absolute bottom-0 right-0
                        w-3.5 h-3.5
                        bg-green-500
                        rounded-full
                        border-2 border-white
                      " />

                    </div>

                    {/* Conversation Details */}

                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between items-center gap-2">

                        <p className="
                          font-semibold
                          text-sm sm:text-base
                          text-gray-900 dark:text-white
                          truncate
                        ">
                          {conv.other_user_name || 'Unknown user'}
                        </p>

                        {conv.last_message_time && (
                          <span className="
                            text-[10px] sm:text-xs
                            text-gray-400
                            shrink-0
                          ">
                            {formatMessageTime(conv.last_message_time)}
                          </span>
                        )}

                      </div>

                      <p className="
                        text-sm
                        text-gray-500 dark:text-gray-400
                        truncate mt-1
                      ">
                        {conv.last_message || 'Tap to start chatting'}
                      </p>

                    </div>

                    {/* Unread Badge */}

                    {conv.unread_count > 0 && (
                      <span className="
                        min-w-5 h-5 px-1
                        bg-brand-orange
                        rounded-full
                        text-xs text-white
                        flex items-center justify-center
                        shrink-0
                      ">
                        {conv.unread_count > 99
                          ? '99+'
                          : conv.unread_count}
                      </span>
                    )}

                  </button>
                ))
              )}

            </div>

          </div>

          {/* CHAT AREA */}

          <div className={`
            ${showSidebar ? 'hidden' : 'flex'}
            md:flex
            flex-1
            min-w-0
            min-h-0
            flex-col
            bg-gray-50 dark:bg-gray-900
          `}>

            {selectedConversation ? (

              <>

                {/* Chat Header */}

                <div className="
                  shrink-0
                  p-3 sm:p-4
                  bg-brand-orange
                  flex items-center gap-3
                  shadow-sm
                ">

                  <button
                    type="button"
                    onClick={handleBackToConversations}
                    className="
                      md:hidden
                      w-10 h-10
                      flex items-center justify-center
                      rounded-full
                      text-white
                      hover:bg-orange-600
                      active:bg-orange-700
                    "
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>

                  <div className="
                    w-11 h-11
                    rounded-full
                    bg-white/20
                    flex items-center justify-center
                    text-white font-bold
                    shrink-0
                  ">
                    {getInitials(selectedConversation.other_user_name)}
                  </div>

                  <div className="flex-1 min-w-0">

                    <h3 className="
                      font-bold text-white
                      text-sm sm:text-base
                      truncate
                    ">
                      {selectedConversation.other_user_name}
                    </h3>

                    <p className="text-xs text-orange-100">
                      Customer
                    </p>

                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-orange-100 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-300" />
                    Conversation
                  </div>

                </div>

                {/* Messages */}

                <div className="
                  flex-1 min-h-0
                  overflow-y-auto
                  overscroll-contain
                  p-3 sm:p-5
                  space-y-3
                  bg-gray-50 dark:bg-gray-900
                ">

                  {messagesLoading ? (

                    <div className="
                      h-full flex flex-col
                      justify-center items-center
                      gap-3
                    ">
                      <Loader2 className="h-7 w-7 animate-spin text-brand-orange" />

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading messages...
                      </p>
                    </div>

                  ) : messages.length === 0 ? (

                    <div className="
                      h-full
                      flex flex-col
                      justify-center items-center
                      text-center
                      text-gray-500 dark:text-gray-400
                      p-5
                    ">

                      <div className="
                        w-20 h-20
                        rounded-full
                        bg-orange-100 dark:bg-gray-800
                        flex items-center justify-center
                        mb-4
                      ">
                        <MessageCircle className="h-10 w-10 text-brand-orange" />
                      </div>

                      <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                        Start a conversation
                      </h3>

                      <p className="text-sm mt-2">
                        Send a message to {selectedConversation.other_user_name}.
                      </p>

                    </div>

                  ) : (

                    messages.map((msg, index) => {

                      const isOwn = isOwnMessage(msg);

                      return (
                        <div
                          key={msg.id || `${msg.created_at}-${index}`}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >

                          <div className={`
                            max-w-[88%] sm:max-w-[75%] lg:max-w-[70%]
                            px-3.5 py-2.5
                            sm:px-4 sm:py-3
                            rounded-2xl
                            shadow-sm
                            break-words
                            ${
                              isOwn
                                ? 'bg-brand-orange text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                            }
                          `}>

                            <p className="
                              text-sm sm:text-[15px]
                              whitespace-pre-wrap
                              break-words
                            ">
                              {msg.content}
                            </p>

                            <div className={`
                              flex items-center justify-end
                              gap-1 mt-1.5
                              ${
                                isOwn
                                  ? 'text-orange-100'
                                  : 'text-gray-400'
                              }
                            `}>

                              <span className="text-[10px] sm:text-xs">
                                {formatMessageTime(msg.created_at)}
                              </span>

                              {isOwn && (
                                msg.read_at ? (
                                  <CheckCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />

                </div>

                {/* Message Composer */}

                <div className="
                  shrink-0
                  p-3 sm:p-4
                  bg-white dark:bg-gray-800
                  border-t border-gray-200 dark:border-gray-700
                ">

                  <div className="
                    flex items-end gap-2
                    max-w-5xl mx-auto
                  ">

                    <textarea
                      ref={messageInputRef}
                      rows={1}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);

                        e.target.style.height = 'auto';
                        e.target.style.height =
                          `${Math.min(e.target.scrollHeight, 112)}px`;
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="
                        flex-1
                        min-w-0
                        min-h-[46px]
                        max-h-28
                        resize-none
                        overflow-y-auto
                        px-4 py-3
                        rounded-2xl
                        text-sm
                        bg-gray-100 dark:bg-gray-700
                        text-gray-900 dark:text-white
                        placeholder-gray-500
                        outline-none
                        border border-transparent
                        focus:border-brand-orange
                        focus:ring-2 focus:ring-brand-orange/20
                        transition
                      "
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="
                        w-12 h-12
                        shrink-0
                        flex items-center justify-center
                        rounded-full
                        bg-brand-orange
                        hover:bg-orange-600
                        active:scale-95
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        shadow-sm
                      "
                      aria-label="Send message"
                    >

                      {sending ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}

                    </button>

                  </div>

                  <p className="
                    hidden sm:block
                    text-[11px]
                    text-gray-400
                    mt-2 ml-1
                    max-w-5xl mx-auto
                  ">
                    Press Enter to send · Shift + Enter for a new line
                  </p>

                </div>

              </>

            ) : (

              <div className="
                flex-1
                flex flex-col
                items-center justify-center
                text-center
                p-6
                bg-gray-50 dark:bg-gray-900
              ">

                <div className="
                  w-24 h-24
                  rounded-full
                  bg-orange-100 dark:bg-gray-800
                  flex items-center justify-center
                  mb-5
                ">
                  <MessageCircle className="h-12 w-12 text-brand-orange" />
                </div>

                <h3 className="
                  text-xl font-bold
                  text-gray-800 dark:text-white
                ">
                  User Messages
                </h3>

                <p className="
                  text-sm mt-2
                  text-gray-500 dark:text-gray-400
                  max-w-xs
                ">
                  Select a conversation from the sidebar to start replying.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminMessages;
