import { gql } from "@apollo/client";

const ChatWidgetFields = `
id
characterId
createdAt
description
logo
name
origins
primaryColor
secondaryColor
tertiaryColor
updatedAt
character {
    id
    name
    description
    image
}
`;

const GQL = {
    Query: {
        chatWidgets: gql`
            query ChatWidgets($input: ChatWidgetSearchInput!) {
                chatWidgets(input: $input) {
                    ${ChatWidgetFields}
                }
            }
        `,
    },
    Mutation: {
        createChatWidget: gql`
            mutation CreateChatWidget($input: ChatWidgetInput!) {
                createChatWidget(input: $input) {
                    id
                }
            }
        `,
    },
    Subscription: {
        chatWidgetCreated: gql`
            subscription ChatWidgetCreated($input: ChatWidgetSearchInput!) {
                chatWidgetCreated(input: $input) {
                    ${ChatWidgetFields}
                }
            }
        `,
        chatWidgetDeleted: gql`
            subscription ChatWidgetDeleted($input: ChatWidgetSearchInput!) {
                chatWidgetDeleted(input: $input) {
                    ${ChatWidgetFields}
                }
            }
        `,
        chatWidgetUpdated: gql`
            subscription ChatWidgetUpdated($input: ChatWidgetSearchInput!) {
                chatWidgetUpdated(input: $input) {
                    ${ChatWidgetFields}
                }
            }
        `,
    },
}

export default GQL;
