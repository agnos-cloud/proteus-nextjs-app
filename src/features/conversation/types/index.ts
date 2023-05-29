export interface Conversation {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    characters: Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        character: {
            id: string;
            name: string;
        }
    }>;
    users: ConversationUsersInclude;
    org: {
        id: string;
        name: string;
    }
    latestMessage: {
      content: string;
    }
}

export type ConversationUsersInclude = Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    hasUnread: boolean;
    user: {
        id: string;
        name: string;
    }
}>;

export interface ConversationsData {
    conversations: Array<Conversation>
}

export interface ConversationsInput {
    characters?: Array<string>;
    org: string;
}

export interface ConversationsVars {
    input: ConversationsInput;
}

export interface CreateConversationData {
    createConversation: {
        id: string;
    }
}

export interface ConversationInput {
    characters: Array<string>;
    org: string;
}

export interface CreateConversationVars {
    input: ConversationInput;
}

export interface DeleteConversationData {
    deleteConversation: boolean;
}

export interface DeleteConversationVars {
    id: string;
}

export interface MarkConversationAsReadData {
    markConversationAsRead: boolean;
}

export interface MarkConversationAsReadVars {
    id: string;
}
