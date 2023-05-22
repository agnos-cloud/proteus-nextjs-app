import { gql } from "@apollo/client";

const ConversationFields = `
conversations(input: $input) {
    id
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
        id
        sender {
            id
            name
        }
        content
        createdAt
    }
    updatedAt
}
`;

const GQL = {
    Queries: {
        conversations: gql`
            query Conversations($input: ConversationSearchInput!) {
                ${ConversationFields}
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
    },
    Subscriptions: {},
}

export default GQL;
