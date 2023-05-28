import { gql } from "@apollo/client";

const OrgFields = `
id
name
description
createdAt
updatedAt
members {
    role
    userId
}
`;

const GQL = {
    Queries: {
        orgs: gql`
            query Orgs {
                orgs {
                    ${OrgFields}
                }
            }
        `,
    },
    Mutations: {
        createOrg: gql`
            mutation CreateOrg($input: CreateOrgInput!) {
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
    Subscriptions: {
        orgCreated: gql`
            subscription OrgCreated {
                orgCreated {
                    ${OrgFields}
                }
            }
        `,
    },
}

export default GQL;
