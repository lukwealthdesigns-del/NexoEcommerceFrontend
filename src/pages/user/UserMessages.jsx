

// import React, { useState, useEffect, useRef } from 'react';
// import { useSearchParams, Link, useNavigate } from 'react-router-dom';
// import { Send, Paperclip, Image, MessageCircle, ArrowLeft, Check, CheckCheck, Plus, ChevronLeft, Mic, Square, Trash2, MoreVertical } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import chatService from '../../services/chat';
// import { usersService } from '../../services/users';
// import toast from 'react-hot-toast';

// const UserMessages = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [searchUsers, setSearchUsers] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [startingConversation, setStartingConversation] = useState(false);
//   const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  
//   // Voice recording states
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);
  
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const userIdFromUrl = searchParams.get('user');

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

//   // Handle URL parameter
//   useEffect(() => {
//     if (userIdFromUrl && user && !startingConversation) {
//       console.log('🔵 URL has user parameter:', userIdFromUrl);
//       const timer = setTimeout(() => {
//         startConversationWithUser(userIdFromUrl);
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [userIdFromUrl, user, conversations.length]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const loadConversations = async () => {
//     try {
//       setLoading(true);
//       console.log('📞 Loading conversations...');
//       const data = await chatService.getConversations();
//       console.log('✅ Conversations loaded:', data);
//       setConversations(Array.isArray(data) ? data : []);
      
//       if (data && data.length > 0 && !selectedConversation && !userIdFromUrl) {
//         setSelectedConversation(data[0]);
//       }
//     } catch (error) {
//       console.error('❌ Failed to load conversations:', error);
//       setConversations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMessages = async (otherUserId) => {
//     try {
//       console.log('📞 Loading messages with user:', otherUserId);
//       const data = await chatService.getMessages(otherUserId);
//       setMessages(Array.isArray(data) ? data : []);
//       await chatService.markAsRead(otherUserId);
//     } catch (error) {
//       console.error('Failed to load messages:', error);
//       setMessages([]);
//     }
//   };

//   const searchUsersToChat = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }
//     setSearching(true);
//     try {
//       const response = await usersService.searchUsers(query);
//       setSearchResults(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Search error:', error);
//       if (query.match(/^[0-9a-f-]+$/i)) {
//         try {
//           const userData = await usersService.getPublicProfile(query);
//           if (userData) setSearchResults([userData]);
//         } catch (e) {}
//       }
//       setSearchResults([]);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const startConversationWithUser = async (otherUserId) => {
//     if (!otherUserId || startingConversation) {
//       console.log('⚠️ Skipping: no userId or already starting');
//       return;
//     }
    
//     if (otherUserId === user?.id) {
//       toast.error("You can't message yourself");
//       navigate('/dashboard/messages', { replace: true });
//       return;
//     }
    
//     setStartingConversation(true);
//     const toastId = toast.loading('Loading conversation...');
    
//     try {
//       setShowNewChat(false);
//       setSearchUsers('');
//       setSearchResults([]);
      
//       const existingConv = conversations.find(
//         conv => conv.other_user_id === otherUserId || 
//                conv.other_user?.id === otherUserId ||
//                conv.user_id === otherUserId
//       );
      
//       if (existingConv) {
//         console.log('✅ Found existing conversation:', existingConv);
//         setSelectedConversation(existingConv);
//         setShowSidebar(false);
//         toast.success('Conversation loaded', { id: toastId });
//         navigate('/dashboard/messages', { replace: true });
//         setStartingConversation(false);
//         return;
//       }
      
//       console.log('🔄 Creating new conversation with:', otherUserId);
//       const newConversation = await chatService.createConversation(otherUserId);
//       console.log('✅ Create conversation response:', newConversation);
      
//       if (newConversation && newConversation.id) {
//         setConversations(prev => [newConversation, ...prev]);
//         setSelectedConversation(newConversation);
//         setShowSidebar(false);
//         toast.success('Conversation started!', { id: toastId });
//         navigate('/dashboard/messages', { replace: true });
//       } else {
//         throw new Error('Invalid conversation response');
//       }
      
//     } catch (error) {
//       console.error('❌ Failed to start conversation:', error);
//       const errorMessage = error.response?.data?.detail || error.message || 'Could not start conversation';
//       toast.error(errorMessage, { id: toastId });
//       navigate('/dashboard/messages', { replace: true });
//     } finally {
//       setStartingConversation(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || sending) return;
//     if (!selectedConversation) {
//       toast.error('No conversation selected');
//       return;
//     }

//     setSending(true);
//     const messageText = newMessage.trim();
//     setNewMessage('');

//     try {
//       const message = await chatService.sendMessage(
//         selectedConversation.other_user_id,
//         messageText,
//         'text'
//       );
//       setMessages(prev => [...prev, message]);
      
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

//   // ========== DELETE HANDLERS ==========
  
//   const handleDeleteConversation = async () => {
//     if (!selectedConversation) return;
    
//     const confirm = window.confirm(
//       `Delete conversation with ${selectedConversation.other_user_name}?\n\nThis will delete ALL messages and cannot be undone.`
//     );
    
//     if (!confirm) return;
    
//     const toastId = toast.loading('Deleting conversation...');
    
//     try {
//       await chatService.deleteConversation(selectedConversation.id);
//       toast.success('Conversation deleted', { id: toastId });
      
//       // Remove from list
//       setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
//       setSelectedConversation(null);
//       setShowSidebar(true);
//       setShowDeleteOptions(false);
      
//     } catch (error) {
//       console.error('Failed to delete:', error);
//       toast.error('Failed to delete conversation', { id: toastId });
//     }
//   };

//   const handleClearMessages = async () => {
//     if (!selectedConversation) return;
    
//     const confirm = window.confirm(
//       `Clear all messages with ${selectedConversation.other_user_name}?\n\nThe conversation will remain but all messages will be deleted.`
//     );
    
//     if (!confirm) return;
    
//     const toastId = toast.loading('Clearing messages...');
    
//     try {
//       await chatService.clearConversationMessages(selectedConversation.id);
//       setMessages([]);
//       toast.success('Messages cleared', { id: toastId });
      
//       // Update conversation list
//       setConversations(prev => prev.map(conv => 
//         conv.id === selectedConversation.id 
//           ? { ...conv, last_message: null, last_message_time: null }
//           : conv
//       ));
      
//       setShowDeleteOptions(false);
      
//     } catch (error) {
//       console.error('Failed to clear:', error);
//       toast.error('Failed to clear messages', { id: toastId });
//     }
//   };

//   const handleDeleteMessage = async (message, index) => {
//     const confirm = window.confirm('Delete this message?');
//     if (!confirm) return;
    
//     const toastId = toast.loading('Deleting message...');
    
//     try {
//       await chatService.deleteMessage(message.id);
//       setMessages(prev => prev.filter((_, i) => i !== index));
//       toast.success('Message deleted', { id: toastId });
//     } catch (error) {
//       console.error('Failed to delete message:', error);
//       toast.error('Failed to delete message', { id: toastId });
//     }
//   };

//   // ========== FILE UPLOAD HANDLERS ==========
  
//   const handleFileUpload = async (e, fileType = 'file') => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error('File too large. Max 10MB');
//       return;
//     }

//     const toastId = toast.loading(`Uploading ${fileType}...`);

//     try {
//       const result = await chatService.sendFileMessage(
//         file, 
//         selectedConversation.other_user_id, 
//         selectedConversation.id
//       );
      
//       if (result.success) {
//         const newMessage = {
//           id: result.message.id,
//           sender_id: user?.id,
//           receiver_id: selectedConversation.other_user_id,
//           content: fileType === 'image' ? '📷 Image' : `📎 ${file.name}`,
//           message_type: result.message.message_type,
//           file_url: result.message.file_url,
//           file_metadata: result.message.file_metadata,
//           created_at: result.message.created_at,
//           read_at: null
//         };
        
//         setMessages(prev => [...prev, newMessage]);
//         toast.success(`${fileType === 'image' ? 'Image' : 'File'} sent!`, { id: toastId });
//         setTimeout(scrollToBottom, 100);
//       } else {
//         throw new Error('Upload failed');
//       }
//     } catch (error) {
//       console.error('Failed to upload file:', error);
//       toast.error('Failed to upload file', { id: toastId });
//     }
    
//     if (fileType === 'image' && imageInputRef.current) {
//       imageInputRef.current.value = '';
//     } else if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // ========== VOICE RECORDING ==========
  
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];
//       setRecordingTime(0);
      
//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
      
//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
//         const toastId = toast.loading('Sending voice note...');
//         try {
//           const result = await chatService.sendVoiceNote(
//             audioBlob, 
//             selectedConversation.other_user_id, 
//             recordingTime,
//             selectedConversation.id
//           );
          
//           if (result.success) {
//             const newMessage = {
//               id: result.message.id,
//               sender_id: user?.id,
//               receiver_id: selectedConversation.other_user_id,
//               content: '🎤 Voice note',
//               message_type: 'audio',
//               file_url: result.message.file_url,
//               file_metadata: { duration: recordingTime },
//               created_at: result.message.created_at,
//               read_at: null
//             };
            
//             setMessages(prev => [...prev, newMessage]);
//             toast.success('Voice note sent!', { id: toastId });
//             setTimeout(scrollToBottom, 100);
//           }
//         } catch (error) {
//           console.error('Failed to send voice:', error);
//           toast.error('Failed to send voice note', { id: toastId });
//         }
        
//         stream.getTracks().forEach(track => track.stop());
//         setIsRecording(false);
//         if (timerRef.current) clearInterval(timerRef.current);
//       };
      
//       mediaRecorder.start();
//       setIsRecording(true);
      
//       // Timer
//       timerRef.current = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
      
//       // Auto-stop after 60 seconds
//       setTimeout(() => {
//         if (mediaRecorder.state === 'recording') {
//           mediaRecorder.stop();
//         }
//       }, 60000);
      
//     } catch (error) {
//       console.error('Microphone error:', error);
//       toast.error('Could not access microphone');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
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

//   const handleNewChat = () => {
//     setShowNewChat(true);
//     setSearchUsers('');
//     setSearchResults([]);
//   };

//   const renderMessageContent = (msg) => {
//     if (msg.message_type === 'image') {
//       const imageUrl = msg.file_url || msg.content;
//       return (
//         <img 
//           src={imageUrl?.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`}
//           alt="Shared" 
//           className="max-w-full rounded-lg cursor-pointer max-h-64 object-cover"
//           onClick={() => window.open(imageUrl?.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`, '_blank')}
//         />
//       );
//     }
    
//     if (msg.message_type === 'audio') {
//       const audioUrl = msg.file_url || msg.content;
//       return (
//         <audio controls className="max-w-[200px]">
//           <source src={audioUrl?.startsWith('http') ? audioUrl : `http://localhost:8080${audioUrl}`} />
//         </audio>
//       );
//     }
    
//     if (msg.message_type === 'file') {
//       const fileUrl = msg.file_url || msg.content;
//       const fileName = msg.file_metadata?.filename || 'Download File';
//       return (
//         <a 
//           href={fileUrl?.startsWith('http') ? fileUrl : `http://localhost:8080${fileUrl}`}
//           target="_blank" 
//           rel="noopener noreferrer" 
//           className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 transition"
//         >
//           <Paperclip className="h-4 w-4" />
//           <span className="text-sm">📎 {fileName}</span>
//         </a>
//       );
//     }
    
//     return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden h-[85vh]">
//           <div className="relative flex h-full overflow-hidden">
            
//             {/* Sidebar */}
//             <div
//               className={`
//                 absolute md:relative z-20 w-full md:w-80 
//                 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
//                 flex flex-col h-full
//                 transition-transform duration-300 ease-in-out
//                 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
//                 md:translate-x-0
//               `}
//             >
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-semibold text-white text-lg">Chats</h2>
//                   <button 
//                     onClick={handleNewChat}
//                     className="p-2 hover:bg-orange-600 rounded-full transition"
//                   >
//                     <Plus className="h-5 w-5 text-white" />
//                   </button>
//                 </div>
//               </div>
              
//               {/* New Chat Modal */}
//               {showNewChat && (
//                 <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//                   <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
//                       <button onClick={() => setShowNewChat(false)} className="p-1">
//                         <ArrowLeft className="h-5 w-5" />
//                       </button>
//                       <h3 className="font-semibold text-lg">New Chat</h3>
//                     </div>
//                     <div className="p-4">
//                       <input
//                         type="text"
//                         value={searchUsers}
//                         onChange={(e) => {
//                           setSearchUsers(e.target.value);
//                           searchUsersToChat(e.target.value);
//                         }}
//                         placeholder="Search users..."
//                         className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                       />
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-2">
//                       {searching && <div className="text-center py-4">Searching...</div>}
//                       {searchResults.length === 0 && !searching && searchUsers && (
//                         <div className="text-center py-4 text-gray-500">No users found</div>
//                       )}
//                       {searchResults.map((result) => (
//                         <button
//                           key={result.id}
//                           onClick={() => startConversationWithUser(result.id)}
//                           disabled={startingConversation}
//                           className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
//                         >
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center text-white font-semibold">
//                             {getInitials(result.first_name || result.username)}
//                           </div>
//                           <div className="text-left">
//                             <p className="font-semibold">{result.first_name} {result.last_name}</p>
//                             <p className="text-sm text-gray-500">@{result.username}</p>
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Conversations List */}
//               <div className="flex-1 overflow-y-auto">
//                 {conversations.length === 0 ? (
//                   <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                     <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                     <p>No conversations yet</p>
//                     <p className="text-sm mt-1">Click the + button to start a new chat</p>
//                     <Link to="/shop" className="inline-block mt-4 text-brand-orange hover:underline">
//                       Browse products
//                     </Link>
//                   </div>
//                 ) : (
//                   conversations.map((conv) => (
//                     <button
//                       key={conv.id}
//                       onClick={() => {
//                         setSelectedConversation(conv);
//                         setShowSidebar(false);
//                         setShowDeleteOptions(false);
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
//               <div className="flex-1 flex flex-col w-full">
//                 {/* Chat Header */}
//                 <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <button
//                         onClick={() => setShowSidebar(true)}
//                         className="md:hidden p-2 hover:bg-orange-600 rounded-lg text-white"
//                       >
//                         <ChevronLeft className="h-5 w-5" />
//                       </button>
//                       <Link 
//                         to={`/profile/${selectedConversation.other_user_id}`}
//                         className="flex items-center space-x-3 group"
//                       >
//                         <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg group-hover:bg-white/30 transition">
//                           {getInitials(selectedConversation.other_user_name)}
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-white group-hover:underline">
//                             {selectedConversation.other_user_name}
//                           </h3>
//                           <p className="text-xs text-orange-100">Online</p>
//                         </div>
//                       </Link>
//                     </div>
                    
//                     {/* Delete Options Menu */}
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowDeleteOptions(!showDeleteOptions)}
//                         className="p-2 hover:bg-orange-600 rounded-lg text-white transition"
//                       >
//                         <MoreVertical className="h-5 w-5" />
//                       </button>
                      
//                       {showDeleteOptions && (
//                         <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[180px]">
//                           <button
//                             onClick={handleClearMessages}
//                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
//                           >
//                             🗑️ Clear All Messages
//                           </button>
//                           <button
//                             onClick={handleDeleteConversation}
//                             className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-700"
//                           >
//                             ⚠️ Delete Conversation
//                           </button>
//                         </div>
//                       )}
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
//                           className={`flex ${isOwn ? 'justify-end' : 'justify-start'} relative group`}
//                         >
//                           <div
//                             className={`max-w-[70%] p-3 rounded-2xl ${
//                               isOwn
//                                 ? 'bg-brand-orange text-white rounded-br-sm'
//                                 : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
//                             }`}
//                           >
//                             {renderMessageContent(msg)}
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
                          
//                           {/* Delete button for own messages */}
//                           {isOwn && (
//                             <button
//                               onClick={() => handleDeleteMessage(msg, index)}
//                               className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </button>
//                           )}
//                         </div>
//                       );
//                     })
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Message Input */}
//                 <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center space-x-2">
//                     {/* Image Button */}
//                     <button
//                       onClick={() => imageInputRef.current?.click()}
//                       className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
//                       disabled={sending || isRecording}
//                     >
//                       <Image className="h-5 w-5 text-gray-500" />
//                     </button>
                    
//                     {/* File Button */}
//                     <button
//                       onClick={() => fileInputRef.current?.click()}
//                       className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
//                       disabled={sending || isRecording}
//                     >
//                       <Paperclip className="h-5 w-5 text-gray-500" />
//                     </button>
                    
//                     {/* Voice Recording Button */}
//                     <button
//                       onClick={isRecording ? stopRecording : startRecording}
//                       className={`p-2 rounded-full transition ${
//                         isRecording 
//                           ? 'bg-red-500 animate-pulse' 
//                           : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                       }`}
//                       disabled={sending}
//                     >
//                       {isRecording ? (
//                         <Square className="h-5 w-5 text-white" />
//                       ) : (
//                         <Mic className="h-5 w-5 text-gray-500" />
//                       )}
//                     </button>
                    
//                     {/* Recording Timer */}
//                     {isRecording && (
//                       <span className="text-sm text-red-500 font-medium">
//                         {formatTime(recordingTime)}
//                       </span>
//                     )}
                    
//                     {/* Text Input */}
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                       placeholder={isRecording ? 'Recording...' : "Type a message..."}
//                       className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                       disabled={sending || isRecording}
//                     />
                    
//                     {/* Send Button */}
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={!newMessage.trim() || sending || isRecording}
//                       className="p-2 bg-brand-orange hover:bg-orange-600 rounded-full transition disabled:opacity-50"
//                     >
//                       <Send className="h-5 w-5 text-white" />
//                     </button>
//                   </div>
                  
//                   {/* Hidden File Inputs */}
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".pdf,.doc,.docx,.txt,.zip,.xlsx,.xls"
//                     onChange={(e) => handleFileUpload(e, 'file')}
//                     className="hidden"
//                   />
//                   <input
//                     ref={imageInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileUpload(e, 'image')}
//                     className="hidden"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//                 <div className="text-center">
//                   <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Messages</h3>
//                   <p className="text-gray-500 dark:text-gray-400 mt-1">Select a conversation or start a new chat</p>
//                   <button 
//                     onClick={() => setShowNewChat(true)}
//                     className="inline-block mt-4 bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
//                   >
//                     + Start New Chat
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserMessages;
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Send, Paperclip, Image, MessageCircle, ArrowLeft, Check, CheckCheck, Plus, ChevronLeft, Mic, Square, Trash2, MoreVertical, WifiOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import chatService from '../../services/chat';
import { usersService } from '../../services/users';
import toast from 'react-hot-toast';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UserMessages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [microphoneError, setMicrophoneError] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const userIdFromUrl = searchParams.get('user');

  // Helper function to get full URL
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

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

  useEffect(() => {
    if (userIdFromUrl && user && !startingConversation && !loading) {
      const timer = setTimeout(() => {
        startConversationWithUser(userIdFromUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userIdFromUrl, user, conversations.length, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      const data = await chatService.getConversations();
      setConversations(Array.isArray(data) ? data : []);
      
      if (data && data.length > 0 && !selectedConversation && !userIdFromUrl) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConnectionError(true);
      toast.error('Connection failed. Check your internet.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const data = await chatService.getMessages(otherUserId);
      setMessages(Array.isArray(data) ? data : []);
      await chatService.markAsRead(otherUserId);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const searchUsersToChat = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await usersService.searchUsers(query);
      setSearchResults(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const startConversationWithUser = async (otherUserId) => {
    if (!otherUserId || startingConversation) return;
    
    if (otherUserId === user?.id) {
      toast.error("You can't message yourself");
      navigate('/dashboard/messages', { replace: true });
      return;
    }
    
    setStartingConversation(true);
    const toastId = toast.loading('Loading conversation...');
    
    try {
      setShowNewChat(false);
      setSearchUsers('');
      setSearchResults([]);
      
      const existingConv = conversations.find(
        conv => conv.other_user_id === otherUserId || 
               conv.other_user?.id === otherUserId ||
               conv.user_id === otherUserId
      );
      
      if (existingConv) {
        setSelectedConversation(existingConv);
        setShowSidebar(false);
        toast.success('Conversation loaded', { id: toastId });
        navigate('/dashboard/messages', { replace: true });
        return;
      }
      
      const newConversation = await chatService.createConversation(otherUserId);
      
      if (newConversation && newConversation.id) {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setShowSidebar(false);
        toast.success('Conversation started!', { id: toastId });
        navigate('/dashboard/messages', { replace: true });
      }
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Could not start conversation', { id: toastId });
    } finally {
      setStartingConversation(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    if (!selectedConversation) {
      toast.error('No conversation selected');
      return;
    }

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const message = await chatService.sendMessage(
        selectedConversation.other_user_id,
        messageText,
        'text'
      );
      setMessages(prev => [...prev, message]);
      
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

  // ========== DELETE HANDLERS ==========
  
  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    
    const confirm = window.confirm(
      `Delete conversation with ${selectedConversation.other_user_name}? This cannot be undone.`
    );
    
    if (!confirm) return;
    
    const toastId = toast.loading('Deleting...');
    
    try {
      await chatService.deleteConversation(selectedConversation.id);
      toast.success('Conversation deleted', { id: toastId });
      
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      setSelectedConversation(null);
      setShowSidebar(true);
      setShowDeleteOptions(false);
      
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  const handleClearMessages = async () => {
    if (!selectedConversation) return;
    
    const confirm = window.confirm(
      `Clear all messages with ${selectedConversation.other_user_name}?`
    );
    
    if (!confirm) return;
    
    const toastId = toast.loading('Clearing...');
    
    try {
      await chatService.clearConversationMessages(selectedConversation.id);
      setMessages([]);
      toast.success('Messages cleared', { id: toastId });
      
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message: null, last_message_time: null }
          : conv
      ));
      
      setShowDeleteOptions(false);
      
    } catch (error) {
      toast.error('Failed to clear', { id: toastId });
    }
  };

  const handleDeleteMessage = async (message, index) => {
    const confirm = window.confirm('Delete this message?');
    if (!confirm) return;
    
    const toastId = toast.loading('Deleting...');
    
    try {
      await chatService.deleteMessage(message.id);
      setMessages(prev => prev.filter((_, i) => i !== index));
      toast.success('Message deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  // ========== FILE UPLOAD HANDLERS ==========
  
  const handleFileUpload = async (e, fileType = 'file') => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = fileType === 'image' ? 5 : 10;
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSize}MB`);
      return;
    }

    const toastId = toast.loading(`Uploading...`);

    try {
      const result = await chatService.sendFileMessage(
        file, 
        selectedConversation.other_user_id, 
        selectedConversation.id
      );
      
      if (result.success) {
        const newMessage = {
          id: result.message.id,
          sender_id: user?.id,
          receiver_id: selectedConversation.other_user_id,
          content: fileType === 'image' ? '📷 Image' : `📎 ${file.name}`,
          message_type: result.message.message_type,
          file_url: result.message.file_url,
          file_metadata: result.message.file_metadata,
          created_at: result.message.created_at,
          read_at: null
        };
        
        setMessages(prev => [...prev, newMessage]);
        toast.success('Sent!', { id: toastId });
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed', { id: toastId });
    }
    
    if (fileType === 'image' && imageInputRef.current) {
      imageInputRef.current.value = '';
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ========== VOICE RECORDING ==========
  
  const startRecording = async () => {
    setMicrophoneError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const toastId = toast.loading('Sending voice...');
        try {
          const result = await chatService.sendVoiceNote(
            audioBlob, 
            selectedConversation.other_user_id, 
            recordingTime,
            selectedConversation.id
          );
          
          if (result.success) {
            const newMessage = {
              id: result.message.id,
              sender_id: user?.id,
              receiver_id: selectedConversation.other_user_id,
              content: '🎤 Voice note',
              message_type: 'audio',
              file_url: result.message.file_url,
              file_metadata: { duration: recordingTime },
              created_at: result.message.created_at,
              read_at: null
            };
            
            setMessages(prev => [...prev, newMessage]);
            toast.success('Voice sent!', { id: toastId });
            setTimeout(scrollToBottom, 100);
          }
        } catch (error) {
          console.error('Voice send failed:', error);
          toast.error('Failed to send voice', { id: toastId });
        }
        
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 60000);
      
    } catch (error) {
      console.error('Microphone error:', error);
      setMicrophoneError(true);
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleNewChat = () => {
    setShowNewChat(true);
    setSearchUsers('');
    setSearchResults([]);
  };

  const renderMessageContent = (msg) => {
    if (msg.message_type === 'image') {
      const imageUrl = getFullUrl(msg.file_url || msg.attachment_url || msg.content);
      return (
        <img 
          src={imageUrl}
          alt="Shared"
          className="max-w-[200px] sm:max-w-[250px] rounded-lg cursor-pointer max-h-48 sm:max-h-64 object-cover"
          onClick={() => window.open(imageUrl, '_blank')}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
          }}
        />
      );
    }
    
    if (msg.message_type === 'audio') {
      const audioUrl = getFullUrl(msg.file_url || msg.attachment_url || msg.content);
      return (
        <audio controls className="max-w-[180px] sm:max-w-[200px]">
          <source src={audioUrl} />
        </audio>
      );
    }
    
    if (msg.message_type === 'file') {
      const fileUrl = getFullUrl(msg.file_url || msg.attachment_url || msg.content);
      const fileName = msg.file_metadata?.filename || 'Download';
      return (
        <a 
          href={fileUrl}
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm"
        >
          <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate max-w-[120px] sm:max-w-[180px]">📎 {fileName}</span>
        </a>
      );
    }
    
    return <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>;
  };

  // Retry connection
  const retryConnection = () => {
    loadConversations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-brand-orange mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-xs mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Connection Error</h2>
          <p className="text-sm text-gray-500 mb-4">Unable to connect. Check your internet.</p>
          <button
            onClick={retryConnection}
            className="px-5 py-2 bg-brand-orange text-white rounded-full text-sm hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-80px)] sm:h-[85vh]">
          <div className="relative flex h-full overflow-hidden">
            
            {/* Sidebar - Responsive */}
            <div
              className={`
                absolute md:relative z-20 w-full md:w-80 
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                flex flex-col h-full
                transition-transform duration-300 ease-in-out
                ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
              `}
            >
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white text-base sm:text-lg">Chats</h2>
                  <button 
                    onClick={handleNewChat}
                    className="p-1.5 sm:p-2 hover:bg-orange-600 rounded-full transition"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* New Chat Modal - Responsive */}
              {showNewChat && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden mx-3">
                    <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                      <button onClick={() => setShowNewChat(false)} className="p-1">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h3 className="font-semibold text-base sm:text-lg">New Chat</h3>
                    </div>
                    <div className="p-3 sm:p-4">
                      <input
                        type="text"
                        value={searchUsers}
                        onChange={(e) => {
                          setSearchUsers(e.target.value);
                          searchUsersToChat(e.target.value);
                        }}
                        placeholder="Search users..."
                        className="w-full px-3 sm:px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                      {searching && <div className="text-center py-4 text-sm">Searching...</div>}
                      {searchResults.length === 0 && !searching && searchUsers && (
                        <div className="text-center py-4 text-sm text-gray-500">No users found</div>
                      )}
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => startConversationWithUser(result.id)}
                          disabled={startingConversation}
                          className="w-full p-2 sm:p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                            {getInitials(result.first_name || result.username)}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm sm:text-base">{result.first_name} {result.last_name}</p>
                            <p className="text-xs text-gray-500">@{result.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Conversations List - Responsive */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-1">Tap + to start a chat</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setShowSidebar(false);
                        setShowDeleteOptions(false);
                      }}
                      className={`w-full p-3 sm:p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 ${
                        selectedConversation?.id === conv.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg">
                          {getInitials(conv.other_user_name)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {conv.other_user_name}
                          </p>
                          {conv.last_message_time && (
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {formatMessageTime(conv.last_message_time)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {conv.last_message || 'Tap to start chatting'}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="w-4 h-4 sm:w-5 sm:h-5 bg-brand-orange rounded-full text-[10px] sm:text-xs text-white flex items-center justify-center flex-shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area - Responsive */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col w-full min-w-0">
                {/* Chat Header - Responsive */}
                <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700 bg-brand-orange">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <button
                        onClick={() => setShowSidebar(true)}
                        className="md:hidden p-1.5 sm:p-2 hover:bg-orange-600 rounded-lg text-white"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <Link 
                        to={`/profile/${selectedConversation.other_user_id}`}
                        className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                          {getInitials(selectedConversation.other_user_name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                            {selectedConversation.other_user_name}
                          </h3>
                          <p className="text-xs text-orange-100">Online</p>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Delete Options Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                        className="p-1.5 sm:p-2 hover:bg-orange-600 rounded-lg text-white transition"
                      >
                        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      
                      {showDeleteOptions && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[160px]">
                          <button
                            onClick={handleClearMessages}
                            className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                          >
                            🗑️ Clear Messages
                          </button>
                          <button
                            onClick={handleDeleteConversation}
                            className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-700"
                          >
                            ⚠️ Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Area - Responsive */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50 dark:bg-gray-900">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Send a message to start!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} relative group`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 rounded-2xl ${
                              isOwn
                                ? 'bg-brand-orange text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm'
                            }`}
                          >
                            {renderMessageContent(msg)}
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] sm:text-xs ${isOwn ? 'text-orange-100' : 'text-gray-400'}`}>
                              <span>{formatMessageTime(msg.created_at)}</span>
                              {isOwn && (
                                msg.read_at ? (
                                  <CheckCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                ) : (
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                )
                              )}
                            </div>
                          </div>
                          
                          {/* Delete button for own messages */}
                          {isOwn && (
                            <button
                              onClick={() => handleDeleteMessage(msg, index)}
                              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition bg-red-500 text-white rounded-full p-0.5 sm:p-1 shadow-md hover:bg-red-600"
                            >
                              <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Responsive */}
                <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Image Button */}
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                      disabled={sending || isRecording}
                    >
                      <Image className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </button>
                    
                    {/* File Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                      disabled={sending || isRecording}
                    >
                      <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </button>
                    
                    {/* Voice Recording Button */}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-1.5 sm:p-2 rounded-full transition ${
                        isRecording 
                          ? 'bg-red-500 animate-pulse' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      disabled={sending || microphoneError}
                    >
                      {isRecording ? (
                        <Square className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      ) : (
                        <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {/* Recording Timer */}
                    {isRecording && (
                      <span className="text-xs sm:text-sm text-red-500 font-medium">
                        {formatTime(recordingTime)}
                      </span>
                    )}
                    
                    {/* Text Input - Takes remaining space */}
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isRecording ? 'Recording...' : "Type a message..."}
                      className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      disabled={sending || isRecording}
                    />
                    
                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending || isRecording}
                      className="p-1.5 sm:p-2 bg-brand-orange hover:bg-orange-600 rounded-full transition disabled:opacity-50 flex-shrink-0"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Hidden File Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.zip,.xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, 'file')}
                    className="hidden"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 sm:h-20 sm:w-20 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Messages</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Select a chat or start new</p>
                  <button 
                    onClick={() => setShowNewChat(true)}
                    className="inline-block mt-3 sm:mt-4 bg-brand-orange text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm hover:bg-orange-600 transition"
                  >
                    + New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
