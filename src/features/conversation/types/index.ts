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

export interface SearchConversationsData {
    conversations: Array<Conversation>
}

export interface SearchConversationsVariable {
    input: {
        characterIds?: Array<string>;
        orgId: string;
    };
}

export interface CreateConversationData {
    createConversation: {
        id: string;
    }
}

export type ConversationUpdatedSubscriptionPayload = {
    conversationUpdated: Conversation;
};

export type ConversationDeletedSubscriptionPayload = {
    conversationDeleted: Conversation;
};

export interface CreateConversationVars {
    input: {
        characterIds: Array<string>;
        orgId: string;
    };
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
