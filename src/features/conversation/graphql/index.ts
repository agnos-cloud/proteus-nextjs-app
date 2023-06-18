import { MessageFields } from "@message/graphql";
import { gql } from "@apollo/client";

const ConversationFields = `
id
state
org {
    id
    name
}
characters {
    id
    character {
        id
        name
        image
        modelFamily
    }
}
users {
    id
    hasUnread
    user {
        id
        name
        image
    }
}
latestMessage {
    ${MessageFields}
}
updatedAt
`;

const GQL = {
    Query: {
        conversations: gql`
            query Conversations($input: ConversationSearchInput!) {
                conversations(input: $input) {
                    ${ConversationFields}
                }
            }
        `,
    },
    Mutation: {
        createConversation: gql`
            mutation CreateConversation($input: ConversationInput!) {
                createConversation(input: $input) {
                    id
                }
            }
        `,
        deleteConversation: gql`
            mutation DeleteConversation($id: ID!) {
                deleteConversation(id: $id)
            }
        `,
        markConversationAsRead: gql`
            mutation MarkConversationAsRead($id: ID!) {
                markConversationAsRead(id: $id)
            }
        `,
        setConversationState: gql`
            mutation SetConversationState($input: ConversationStateInput!) {
                setConversationState(input: $input)
            }
        `,
    },
    Subscription: {
        conversationCreated: gql`
            subscription ConversationCreated($input: ConversationSearchInput!) {
                conversationCreated(input: $input) {
                    ${ConversationFields}
                }
            }
        `,
        conversationDeleted: gql`
            subscription ConversationDeleted($input: ConversationSearchInput!) {
                conversationDeleted(input: $input) {
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
