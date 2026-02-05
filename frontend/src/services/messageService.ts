import http from "../api/http-common";
import type { Message } from "../entities/message";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
}

export const messageService = {
    getMessagesByConversationId: async(conversationId: number, page = 0, size = 20): Promise<PageResponse<Message>> => {
        const response = await http.get(`/conversations/${conversationId}/messages`, {
            params: { page, size }
        });
        return response.data;
    },

    createMessage: async(conversationId: number, messageContent: string): Promise<Message> => {
        const response = await http.post<Message>(`/conversations/${conversationId}/messages`, {
            messageContent
        });
        return response.data;
    },

    getMessageById: async (conversationId: number, messageId: number): Promise<Message> => {
        const response = await http.get<Message>(`/conversations/${conversationId}/messages/${messageId}`);
        return response.data;
    },

    editMessage: async (conversationId: number, messageId: number, messageContent: string): Promise<Message> => {
        const response = await http.patch<Message>(`/conversations/${conversationId}/messages/${messageId}`, {
            messageContent
        });
        return response.data;
    },

    deleteMessage: async (conversationId: number, messageId: number): Promise<void> => {
        await http.delete(`/conversations/${conversationId}/messages/${messageId}`);
    }
};
