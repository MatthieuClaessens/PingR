import axios from "axios";
import type { Message } from "../../entities/Message";

export interface PageResponse<T> {
    content: T[];          // Les vraies données (messages)
    totalPages: number;    // Combien de pages il y a au total
    totalElements: number; // Le nombre total de messages en base
    last: boolean;         // "true" si on est à la fin du chargement
    size: number;          // Combien de messages on a demandé par page
    number: number;        // Le numéro de la page actuelle (le curseur)
}

const API_URL = "http://localhost:8080/api/conversations";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const messageService = {
    getMessagesByConversationId: async(conversationId: number, page = 0, size = 20): Promise<PageResponse<Message>> => {
        const response = await api.get(`/${conversationId}/messages`, {
            params: { page, size }
    });
    return response.data;
    },

    createMessage: async(conversationId: number, messageContent: string) =>  {
        const response = await api.post<Message>(`/${conversationId}/messages`, {
            messageContent
        });
        return response.data
    },

    getMessageById: async (conversationId: number, messageId: number) => {
        const response = await api.get<Message>(`/${conversationId}/messages/${messageId}`);
            return response.data
    },

    editMessage: async (conversationId: number, messageId: number, updatedContent: string) => {
        const response = await api.patch<Message>(`/${conversationId}/messages/${messageId}`, {
            updatedContent
        });
        return response.data
    },

    deleteMessage: async (conversationId: number, messageId: number) => {
        await api.delete(`/${conversationId}/messages/${messageId}`);
    }
};