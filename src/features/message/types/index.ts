export enum MessageType {
    TEXT = "TEXT",
    ERROR_MESSAGE = "ERROR_MESSAGE",
}

export interface Message {
    id: string;
    createdAt: Date;
    content: string;
    type: MessageType;
    conversationId: string;
    senderId: string;
    sender: {
        id: string;
        name: string;
        image?: string;
    }
    updatedAt: Date;
}

export interface MessagesVariable {
    input: {
        conversationId: string;
    };
}

export interface CharacterMessagesData {
    characterMessages: Array<Message>
}

export interface UserMessagesData {
    userMessages: Array<Message>
}

export type CharacterMessageSentSubscriptionPayload = {
    characterMessageSent: Message;
};

export type UserMessageSentSubscriptionPayload = {
    userMessageSent: Message;
};

export interface SendUserMessageData {
    sendUserMessage: boolean;
}

export interface SendMessageVariable {
    input: {
        id: string;
        content: string;
        conversationId: string;
        senderId: string;
        type: MessageType;
    };
}

export interface UserMessagesData {
    userMessages: Array<Message>
}
