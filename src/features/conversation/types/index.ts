import { ModelFamily } from "@character/types";

export interface Conversation {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    characters: ConversationCharactersInclude;
    users: ConversationUsersInclude;
    org: {
        id: string;
        name: string;
    }
    latestMessage: {
      content: string;
    }
}

export type ConversationCharactersInclude = Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    character: {
        id: string;
        name: string;
        image?: string;
        modelFamily: ModelFamily;
    }
}>;

export type ConversationUsersInclude = Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    hasUnread: boolean;
    user: {
        id: string;
        name: string;
        image?: string;
    }
}>;

export interface ConversationsData {
    conversations: Array<Conversation>
}

export interface ConversationsVariable {
    input: {
        characterIds?: Array<string>;
        orgId: string;
        id?: string;
    };
}

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
