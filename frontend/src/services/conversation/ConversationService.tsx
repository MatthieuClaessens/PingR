const API_URL = "http://localhost:8080/api/conversations";

export const conversationService = {
    getConversations: async (token, page = 0, size = 20) => {
        try {
            const response = await fetch(`${API_URL}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Erreur lors de la récupération");

            const data = await response.json();

            return data.content;
        } catch (error) {
            console.error("Service Error:", error);
            return [];
        }
    },

    createConversation: async (token, accountIds) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountIds })
        });
        return await response.json();
    }
};