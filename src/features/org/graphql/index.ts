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
    Query: {
        org: gql`
            query Org($id: ID!) {
                org(id: $id) {
                    ${OrgFields}
                }
            }
        `,
        orgs: gql`
            query Orgs {
                orgs {
                    ${OrgFields}
                }
            }
        `,
    },
    Mutation: {
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
    Subscription: {
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
