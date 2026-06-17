import { apiClient } from './api/client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ChatbotAttachment {
  type: 'image' | 'audio' | 'video' | 'file';
  name: string;
  mimeType: string;
  size: number;
}

interface ChatbotConversation {
  _id: string;
}

interface ChatbotMessageResponse {
  response: string;
  conversationId: string;
}

export const aiService = {
  async createChatbotConversation() {
    const res = await apiClient.post<ApiResponse<ChatbotConversation>>('/ai/chatbot/conversations', {});
    return res.data;
  },

  async sendChatbotMessage(conversationId: string, message: string, attachments: ChatbotAttachment[] = []) {
    const endpoint = '/ai/chatbot/conversations/' + conversationId + '/message';
    const res = await apiClient.post<ApiResponse<ChatbotMessageResponse>>(endpoint, { message, attachments });
    return res.data;
  },

  async createMentorConversation() {
    const res = await apiClient.post<ApiResponse<ChatbotConversation>>('/ai/mentor/conversations', {});
    return res.data;
  },

  async sendMentorMessage(conversationId: string, message: string) {
    const endpoint = '/ai/mentor/conversations/' + conversationId + '/message';
    const res = await apiClient.post<ApiResponse<ChatbotMessageResponse>>(endpoint, { message });
    return res.data;
  },

  async createCofounderConversation() {
    const res = await apiClient.post<ApiResponse<ChatbotConversation>>('/ai/cofounder/conversations', {});
    return res.data;
  },

  async sendCofounderMessage(conversationId: string, message: string) {
    const endpoint = '/ai/cofounder/conversations/' + conversationId + '/message';
    const res = await apiClient.post<ApiResponse<ChatbotMessageResponse>>(endpoint, { message });
    return res.data;
  },
};
