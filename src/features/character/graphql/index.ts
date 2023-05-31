import { gql } from "@apollo/client";

const CharacterFields = `
id
createdAt
name
description
image
plan
planExpiresAt
updatedAt
`;

const GQL = {
    Query: {
        character: gql`
            query Character($id: ID!) {
                character(id: $id) {
                    ${CharacterFields}
                }
            }
        `,
        characters: gql`
            query Characters($input: CharacterSearchInput!) {
                characters(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
    },
    Mutation: {
        createCharacter: gql`
            mutation CreateCharacter($input: CharacterInput!) {
                createCharacter(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
    },
    Subscription: {
        characterCreated: gql`
            subscription CharacterCreated($input: CharacterSearchInput!) {
                characterCreated(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
        characterDeleted: gql`
            subscription CharacterDeleted($input: CharacterSearchInput!) {
                characterDeleted(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
        characterUpdated: gql`
            subscription CharacterUpdated($input: CharacterSearchInput!) {
                characterUpdated(input: $input) {
                    ${CharacterFields}
                }
            }
        `,
    },
}

export default GQL;
