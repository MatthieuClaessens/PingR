import type { UserAccount } from "./userAccount";

export interface Message {
    messageId: number;
    messageDate: string;
    messageContent: string;
    conversationId: number
    userAccount: {
        accountId: number;
        accountName: string;
        avatarPath: string;
    }
}