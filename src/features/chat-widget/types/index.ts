import { Character } from "@character/types";

export interface ChatWidget {
    id: string;
    character: Character;
    characterId: string
    createdAt: Date;
    description: string;
    logo: string;
    name: string;
    origins: Array<string>;
    primaryColor: string;
    secondaryColor: string;
    updatedAt: Date;
}

export interface CreateChatWidgetData {
    createChatWidget: ChatWidget;
}

export interface CreateChatWidgetVariable {
    input: {
        name: string;
        characterId: string;
        description: string;
        origins: Array<string>;
        primaryColor: string;
        secondaryColor: string;
    };
}

export interface SearchChatWidgetsData {
    chatWidgets: Array<ChatWidget>
}

export interface SearchChatWidgetsVariable {
    input: {
        characterId: string;
    };
}

export type ChatWidgetCreatedSubscriptionPayload = {
    chatWidgetCreated: ChatWidget;
};

export type ChatWidgetUpdatedSubscriptionPayload = {
    chatWidgetUpdated: ChatWidget;
};

export type ChatWidgetDeletedSubscriptionPayload = {
    chatWidgetDeleted: ChatWidget;
};
