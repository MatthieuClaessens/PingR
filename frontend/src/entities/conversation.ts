export interface AccountShortInfo {
    accountId: number;
    accountName: string;
}

export interface Conversation {
    conversationId: number;
    conversationType: "SINGLE" | "GROUP";
    creatorId: number;
    accountIds: number[];
    participants: AccountShortInfo[];
}