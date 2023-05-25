import { gql } from "@apollo/client";

const GQL = {
    Queries: {},
    Mutations: {
        createOrg: gql`
            mutation CreateOrg($input: OrgInput!) {
                createOrg(input: $input) {
                    id
                    name
                }
            }
        `,
        deleteOpenaiAPIKey: gql`
            mutation DeleteOpenaiAPIKey($id: ID!) {
                deleteOpenaiAPIKey(id: $id)
            }
        `,
        saveOpenaiAPIKey: gql`
            mutation SaveOpenaiAPIKey($id: ID! $key: String!) {
                saveOpenaiAPIKey(id: $id key: $key)
            }
        `,
    },
    Subscriptions: {},
}

export default GQL;
