import { MessageFields } from "@graphql/message";
import { gql } from "@apollo/client";

const ConversationFields = `
id
org {
    id
    name
}
characters {
    id
    character {
        id
        name
    }
}
users {
    id
    hasUnread
    user {
        id
        name
    }
}
latestMessage {
    ${MessageFields}
}
updatedAt
`;

const GQL = {
    Queries: {
        conversation: gql`
            query Conversation($input: ConversationSearchInput!) {
                conversation(input: $input) {
                    ${ConversationFields}
                }
            }
        `,
        conversations: gql`
        query Conversations($input: ConversationSearchInput!) {
            conversations(input: $input) {
                ${ConversationFields}
            }
        }
    `,
    },
    Mutations: {
        createConversation: gql`
            mutation CreateConversation($input: ConversationInput!) {
                createConversation(input: $input) {
                    id
                }
            }
        `,
        markConversationAsRead: gql`
            mutation MarkConversationAsRead($id: ID!) {
                markConversationAsRead(id: $id)
            }
        `,
    },
    Subscriptions: {
        conversationCreated: gql`
            subscription ConversationCreated($input: ConversationSearchInput!) {
                conversationCreated(input: $input) {
                    ${ConversationFields}
                }
            }
        `,
        conversationUpdated: gql`
            subscription ConversationUpdated($input: ConversationSearchInput!) {
                conversationUpdated(input: $input) {
                    ${ConversationFields}
                }
            }
        `,
    },
}

export default GQL;
