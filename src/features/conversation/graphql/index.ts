import { gql } from "@apollo/client";

const GQL = {
    Queries: {
        conversations: gql`
            query Conversations($input: ConversationSearchInput!) {
                conversations(input: $input) {
                    id
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
    },
    Subscriptions: {},
}

export default GQL;
