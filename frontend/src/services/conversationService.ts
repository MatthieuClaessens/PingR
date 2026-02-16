import http from "../api/http-common";
import type { Conversation } from "../entities/conversation";

export const conversationService = {
    

    getUserConversations: async (): Promise<Conversation[]> => {
        const response = await http.get<Conversation[]>(`/conversations/user`); 
        return response.data;
    },

    createConversation: async (participantIds: number[]): Promise<Conversation> => {
        const response = await http.post<Conversation>(`/conversations`, {
            accountIds: participantIds
        });
        return response.data;
    },

    addParticipant: async (convId: number, targetId: number): Promise<Conversation> => {
        const response = await http.post<Conversation>(
            `/conversations/${convId}/participants/${targetId}`
        );
        return response.data;
    },

    leaveConversation: async (convId: number): Promise<void> => {
        await http.delete(`/conversations/${convId}/leave`);
    }
};