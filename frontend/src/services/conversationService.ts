import axios from "axios";
import type { Conversation } from "../entities/conversation";

const API_URL = "http://localhost:8080/api/conversations";

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const conversationService = {
    getUserConversations: async (myId: number): Promise<Conversation[]> => {
        const response = await api.get(`/user/${myId}`); 
        return response.data;
    },

    createConversation: async (participantIds: number[], myId: number): Promise<Conversation> => {
        const response = await api.post(`/`, {
            accountIds: participantIds,
            creatorId: myId
        });
        return response.data;
    },

    addParticipant: async (convId: number, targetId: number, myId: number): Promise<Conversation> => {
        const response = await api.post(`/${convId}/participants/${targetId}`, null, {
            params: { requesterId: myId }
        });
        return response.data;
    },

    leaveConversation: async (convId: number, myId: number): Promise<void> => {
        await api.delete(`/${convId}/leave`, {
            params: { accountId: myId }
        });
    }
};