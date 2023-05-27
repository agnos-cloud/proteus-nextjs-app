import { gql } from "@apollo/client";

const CharacterFields = `
id
name
description
image
createdAt
updatedAt
`;

const GQL = {
    Queries: {
        characters: gql`
            query Characters($input: CharacterSearchInput!) {
                characters(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
    },
    Mutations: {
        createCharacter: gql`
            mutation CreateCharacter($input: CharacterInput!) {
                createCharacter(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
    },
    Subscriptions: {},
}

export default GQL;
