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
    },
    Subscriptions: {},
}

export default GQL;
