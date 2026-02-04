import type { UserAccount } from "./UserAccount";
import type { Message } from "./Message";

export interface Conversation {
    conversationId: number;
    conversationType: "SINGLE" | "GROUP";
    creatorId?: number;
    userAccounts: UserAccount[];
    messages: Message[];
}