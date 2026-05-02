// // src/pages/admin/AdminMessages.jsx
// import React, { useState, useEffect } from 'react';
// import { Send, MessageCircle, User, Search, Loader2, Mail } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import toast from 'react-hot-toast';

// const AdminMessages = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');
//   const [sending, setSending] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await adminService.getAllUsers();
//       setUsers(data.users || []);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(user => 
//     (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//     (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//     (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//     (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
//   );

//   const handleSendMessage = async () => {
//     if (!selectedUser) {
//       toast.error('Please select a user');
//       return;
//     }
//     if (!message.trim()) {
//       toast.error('Please enter a message');
//       return;
//     }

//     setSending(true);
//     try {
//       await adminService.sendMessageToUser(
//         selectedUser.id, 
//         subject, 
//         message.trim()
//       );
      
//       toast.success('Message sent successfully!');
//       setSubject('');
//       setMessage('');
//       setSelectedUser(null);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       toast.error(error.response?.data?.detail || 'Failed to send message');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//       handleSendMessage();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Message to Users</h1>
//         <p className="text-gray-500 dark:text-gray-400 mt-1">Send direct messages to any user on the platform</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Users List */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//             <h2 className="font-semibold text-gray-900 dark:text-white">Select User</h2>
//             <p className="text-xs text-gray-500 mt-1">Choose a user to send a message</p>
//           </div>
          
//           <div className="p-3">
//             <div className="relative mb-3">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700"
//               />
//             </div>
            
//             <div className="space-y-1 max-h-96 overflow-y-auto">
//               {filteredUsers.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">No users found</p>
//                 </div>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <button
//                     key={user.id}
//                     onClick={() => setSelectedUser(user)}
//                     className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
//                       selectedUser?.id === user.id
//                         ? 'bg-brand-orange text-white shadow-md'
//                         : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                         selectedUser?.id === user.id 
//                           ? 'bg-white/20' 
//                           : 'bg-gray-200 dark:bg-gray-600'
//                       }`}>
//                         <User className={`h-5 w-5 ${
//                           selectedUser?.id === user.id 
//                             ? 'text-white' 
//                             : 'text-gray-500 dark:text-gray-400'
//                         }`} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className={`font-medium truncate text-sm ${
//                           selectedUser?.id === user.id ? 'text-white' : 'text-gray-900 dark:text-white'
//                         }`}>
//                           {user.first_name} {user.last_name || user.username}
//                         </p>
//                         <p className={`text-xs truncate ${
//                           selectedUser?.id === user.id ? 'text-white/80' : 'text-gray-500'
//                         }`}>
//                           {user.email}
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Message Form */}
//         <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//           {selectedUser ? (
//             <>
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="font-semibold text-gray-900 dark:text-white">New Message</h2>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Sending to: <span className="font-medium text-brand-orange">{selectedUser.first_name} {selectedUser.last_name}</span>
//                     </p>
//                   </div>
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//               </div>
              
//               <div className="p-5 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Subject <span className="text-gray-400 text-xs">(Optional)</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     placeholder="What is this about?"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Message <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     rows="8"
//                     className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
//                     placeholder="Type your message here... (Ctrl+Enter to send)"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-2">
//                   <button
//                     onClick={() => {
//                       setSelectedUser(null);
//                       setSubject('');
//                       setMessage('');
//                     }}
//                     className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={sending || !message.trim()}
//                     className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {sending ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Send className="h-4 w-4" />
//                     )}
//                     <span>{sending ? 'Sending...' : 'Send Message'}</span>
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//                 <MessageCircle className="h-10 w-10 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No User Selected</h3>
//               <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
//                 Select a user from the left panel to start composing a message
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMessages;

// src/pages/admin/AdminMessages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Search, Loader2, Mail, ArrowLeft, Check, CheckCheck } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.other_user_id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const data = await chatService.getMessages(userId);
      setMessages(data || []);
      await chatService.markAsRead(userId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const message = await chatService.sendMessage(
        selectedConversation.other_user_id,
        messageText,
        'text'
      );
      setMessages([...messages, message]);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.other_user_id === selectedConversation.other_user_id
            ? { ...conv, last_message: messageText, last_message_time: message.created_at }
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
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const filteredConversations = conversations.filter(conv => 
    conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden h-[85vh]">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className={`${showSidebar ? 'w-full md:w-80' : 'hidden md:block md:w-80'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white text-lg">User Messages</h2>
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs text-orange-100 mt-1">Conversations with users</p>
              </div>
              
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Users will appear here when they message you</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setShowSidebar(false);
                      }}
                      className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 ${
                        selectedConversation?.id === conv.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center text-white font-semibold text-lg">
                          {getInitials(conv.other_user_name)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-baseline">
                          <p className="font-semibold text-gray-900 dark:text-white">{conv.other_user_name}</p>
                          {conv.last_message_time && (
                            <span className="text-xs text-gray-400">{formatMessageTime(conv.last_message_time)}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {conv.last_message || 'Tap to start chatting'}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 bg-brand-orange rounded-full text-xs text-white flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="md:hidden p-2 hover:bg-orange-600 rounded-lg text-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg">
                        {getInitials(selectedConversation.other_user_name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {selectedConversation.other_user_name}
                        </h3>
                        <p className="text-xs text-orange-100">Customer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageCircle className="h-16 w-16 mx-auto mb-3 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Send a message to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div
                          key={index}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-2xl ${
                              isOwn
                                ? 'bg-brand-orange text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-400'}`}>
                              <span className="text-xs">
                                {formatMessageTime(msg.created_at)}
                              </span>
                              {isOwn && (
                                msg.read_at ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
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

                {/* Message Input */}
                <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message... (Enter to send)"
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="p-2 bg-brand-orange hover:bg-orange-600 rounded-full transition disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Messages</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Select a conversation to start replying</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;