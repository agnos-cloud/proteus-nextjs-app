import { gql } from "@apollo/client";

const GQL = {
    Queries: {
        characters: gql`
            query Characters($input: CharacterSearchInput!) {
                characters(input: $input) {
                    id
                    name
                }
            }
        `,
    },
    Mutations: {
        createCharacter: gql`
            mutation CreateCharacter($input: CharacterInput!) {
                createCharacter(input: $input) {
                    id
                    name
                }
            }
        `,
    },
    Subscriptions: {},
}

export default GQL;
