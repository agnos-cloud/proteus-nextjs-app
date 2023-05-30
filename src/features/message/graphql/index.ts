import { gql } from "@apollo/client";

export const MessageFields = `
id
conversationId
senderId
sender {
    id
    name
    image
}
content
createdAt
updatedAt
`;

const GQL = {
    Queries: {
        characterMessages: gql`
            query CharacterMessages($input: MessageSearchInput!) {
                characterMessages(input: $input) {
                    ${MessageFields}
                }
            }
        `,
        userMessages: gql`
            query UserMessages($input: MessageSearchInput!) {
                userMessages(input: $input) {
                    ${MessageFields}
                }
            }
        `,
    },
    Mutations: {
        sendCharacterMessage: gql`
            mutation SendCharacterMessage($input: MessageInput!) {
                sendCharacterMessage(input: $input)
            }
        `,
        sendUserMessage: gql`
            mutation SendUserMessage($input: MessageInput!) {
                sendUserMessage(input: $input)
            }
        `,
    },
    Subscriptions: {
        characterMessageSent: gql`
            subscription CharacterMessageSent($input: MessageSearchInput!) {
                characterMessageSent(input: $input) {
                    ${MessageFields}
                }
            }
        `,
        userMessageSent: gql`
            subscription UserMessageSent($input: MessageSearchInput!) {
                userMessageSent(input: $input) {
                    ${MessageFields}
                }
            }
        `,
    },
}

export default GQL;
