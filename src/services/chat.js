
// // src/services/chat.js
// import api from './api';
// import { supabase } from './supabase';

// const chatService = {
//   // Get all conversations for current user
//   async getConversations() {
//     try {
//       const response = await api.get('/chat/conversations');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get conversations:', error);
//       return [];
//     }
//   },
  
//   // Get messages between current user and another user
//   async getMessages(userId) {
//     try {
//       const response = await api.get(`/chat/messages/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get messages:', error);
//       return [];
//     }
//   },
  
//   // Send a message to another user
//   async sendMessage(receiverId, content, type = 'text') {
//     try {
//       const response = await api.post('/chat/send', {
//         receiver_id: receiverId,
//         content: content,
//         message_type: type,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       throw error;
//     }
//   },
  
//   // Mark all messages from a sender as read
//   async markAsRead(senderId) {
//     try {
//       const response = await api.put(`/chat/mark-read/${senderId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to mark as read:', error);
//       return { success: false };
//     }
//   },
  
//   // Create a new conversation with another user
//   async createConversation(otherUserId) {
//     try {
//       const response = await api.post('/chat/conversations', { 
//         other_user_id: otherUserId 
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create conversation:', error);
      
//       if (error.response?.status === 405) {
//         try {
//           const conversations = await this.getConversations();
//           const existing = conversations.find(conv => 
//             conv.other_user?.id === otherUserId || 
//             conv.user_id === otherUserId ||
//             conv.participant_id === otherUserId
//           );
//           if (existing) {
//             return existing;
//           }
//         } catch (e) {
//           console.error('Failed to find existing conversation:', e);
//         }
//       }
      
//       throw error;
//     }
//   },
  
//   // Alternative: Start conversation (tries multiple approaches)
//   async startConversation(otherUserId) {
//     try {
//       const result = await this.createConversation(otherUserId);
//       return result;
//     } catch (error) {
//       console.log('Create conversation failed, trying to find existing...');
      
//       try {
//         const conversations = await this.getConversations();
//         const existing = conversations.find(conv => {
//           const participantId = conv.other_user?.id || conv.user_id || conv.participant_id || conv.receiver_id;
//           return participantId === otherUserId;
//         });
        
//         if (existing) {
//           return existing;
//         }
//       } catch (getError) {
//         console.error('Failed to get conversations:', getError);
//       }
      
//       console.warn('Using mock conversation - backend chat endpoints may not be configured');
//       return {
//         id: `temp_${Date.now()}`,
//         other_user: { id: otherUserId },
//         is_mock: true
//       };
//     }
//   },
  
//   // ========== NEW: FILE UPLOAD METHODS ==========
  
//   // Upload and send a file (image, video, document)
//   async sendFileMessage(file, receiverId, conversationId = null) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('receiver_id', receiverId);
//     if (conversationId) {
//       formData.append('conversation_id', conversationId);
//     }
    
//     try {
//       const response = await api.post('/chat/upload-file', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to send file:', error);
//       throw error;
//     }
//   },
  
//   // Send a voice note
//   async sendVoiceNote(audioBlob, receiverId, duration, conversationId = null) {
//     const formData = new FormData();
//     formData.append('audio', audioBlob, 'voice-note.webm');
//     formData.append('receiver_id', receiverId);
//     formData.append('duration', duration);
//     if (conversationId) {
//       formData.append('conversation_id', conversationId);
//     }
    
//     try {
//       const response = await api.post('/chat/send-voice', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to send voice note:', error);
//       throw error;
//     }
//   },
  
//   // Legacy upload file (kept for compatibility)
//   async uploadFile(file) {
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const response = await api.post('/chat/upload-file', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload file:', error);
//       throw error;
//     }
//   },
  
//   // Delete a message
//   async deleteMessage(messageId) {
//     try {
//       const response = await api.delete(`/chat/messages/${messageId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete message:', error);
//       throw error;
//     }
//   },
  
//   // Get unread message count
//   async getUnreadCount() {
//     try {
//       const response = await api.get('/chat/unread-count');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get unread count:', error);
//       return { count: 0 };
//     }
//   },
  
//   // Subscribe to new messages via Supabase
//   subscribeToMessages(userId, callback) {
//     const subscription = supabase
//       .channel('chat_messages')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `receiver_id=eq.${userId}`,
//         },
//         (payload) => {
//           callback(payload.new);
//         }
//       )
//       .subscribe();
    
//     return subscription;
//   },
  
//   // Subscribe to message updates for a specific conversation
//   subscribeToMessageUpdates(conversationId, callback) {
//     const subscription = supabase
//       .channel(`chat_${conversationId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `conversation_id=eq.${conversationId}`,
//         },
//         (payload) => {
//           callback(payload.new);
//         }
//       )
//       .subscribe();
    
//     return subscription;
//   },
  
//   // Check if chat endpoints are available
//   async checkChatAvailability() {
//     try {
//       const response = await api.get('/chat/health');
//       return { available: true, data: response.data };
//     } catch (error) {
//       console.warn('Chat endpoints not available:', error.message);
//       return { available: false, error: error.message };
//     }
//   }
// };

// export default chatService;

// src/services/chat.js
import api from './api';
import { supabase } from './supabase';

const chatService = {
  // Get all conversations for current user
  async getConversations() {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      return [];
    }
  },
  
  // Get messages between current user and another user
  async getMessages(userId) {
    try {
      const response = await api.get(`/chat/messages/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  },
  
  // Send a message to another user
  async sendMessage(receiverId, content, type = 'text') {
    try {
      const response = await api.post('/chat/send', {
        receiver_id: receiverId,
        content: content,
        message_type: type,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
  
  // Mark all messages from a sender as read
  async markAsRead(senderId) {
    try {
      const response = await api.put(`/chat/mark-read/${senderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark as read:', error);
      return { success: false };
    }
  },
  
  // Create a new conversation with another user
  async createConversation(otherUserId) {
    try {
      const response = await api.post('/chat/conversations', { 
        other_user_id: otherUserId 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      
      if (error.response?.status === 405) {
        try {
          const conversations = await this.getConversations();
          const existing = conversations.find(conv => 
            conv.other_user?.id === otherUserId || 
            conv.user_id === otherUserId ||
            conv.participant_id === otherUserId
          );
          if (existing) {
            return existing;
          }
        } catch (e) {
          console.error('Failed to find existing conversation:', e);
        }
      }
      
      throw error;
    }
  },
  
  // Alternative: Start conversation (tries multiple approaches)
  async startConversation(otherUserId) {
    try {
      const result = await this.createConversation(otherUserId);
      return result;
    } catch (error) {
      console.log('Create conversation failed, trying to find existing...');
      
      try {
        const conversations = await this.getConversations();
        const existing = conversations.find(conv => {
          const participantId = conv.other_user?.id || conv.user_id || conv.participant_id || conv.receiver_id;
          return participantId === otherUserId;
        });
        
        if (existing) {
          return existing;
        }
      } catch (getError) {
        console.error('Failed to get conversations:', getError);
      }
      
      console.warn('Using mock conversation - backend chat endpoints may not be configured');
      return {
        id: `temp_${Date.now()}`,
        other_user: { id: otherUserId },
        is_mock: true
      };
    }
  },
  
  // ========== FILE UPLOAD METHODS ==========
  
  // Upload and send a file (image, video, document)
  async sendFileMessage(file, receiverId, conversationId = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('receiver_id', receiverId);
    if (conversationId) {
      formData.append('conversation_id', conversationId);
    }
    
    try {
      const response = await api.post('/chat/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send file:', error);
      throw error;
    }
  },
  
  // Send a voice note
  async sendVoiceNote(audioBlob, receiverId, duration, conversationId = null) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-note.webm');
    formData.append('receiver_id', receiverId);
    formData.append('duration', duration);
    if (conversationId) {
      formData.append('conversation_id', conversationId);
    }
    
    try {
      const response = await api.post('/chat/send-voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send voice note:', error);
      throw error;
    }
  },
  
  // Legacy upload file (kept for compatibility)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/chat/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  },
  
  // ========== DELETE METHODS ==========
  
  // Delete entire conversation
  async deleteConversation(conversationId) {
    try {
      const response = await api.delete(`/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  },
  
  // Clear all messages in a conversation (keep conversation)
  async clearConversationMessages(conversationId) {
    try {
      const response = await api.delete(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear messages:', error);
      throw error;
    }
  },
  
  // Delete a single message
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/chat/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },
  
  // ========== UTILITY METHODS ==========
  
  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return { count: 0 };
    }
  },
  
  // Check if chat endpoints are available
  async checkChatAvailability() {
    try {
      const response = await api.get('/chat/health');
      return { available: true, data: response.data };
    } catch (error) {
      console.warn('Chat endpoints not available:', error.message);
      return { available: false, error: error.message };
    }
  },
  
  // ========== SUPABASE REAL-TIME SUBSCRIPTIONS ==========
  
  // Subscribe to new messages via Supabase
  subscribeToMessages(userId, callback) {
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
    
    return subscription;
  },
  
  // Subscribe to message updates for a specific conversation
  subscribeToMessageUpdates(conversationId, callback) {
    const subscription = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
    
    return subscription;
  }
};

export default chatService;
