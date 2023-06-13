import { gql } from "@apollo/client";

const KnowledgeFields = `
id
character {
    id
    name
    orgId
    org {
        id
        name
    }
}
characterId
createdAt
description
name
source
sourceType
updatedAt
`;

const GQL = {
    Query: {
        knowledges: gql`
            query Knowledges($input: KnowledgeSearchInput!) {
                knowledges(input: $input) {
                    ${KnowledgeFields}
                }
            }
        `,
    },
    Mutation: {
        createKnowledgeFromText: gql`
            mutation CreateKnowledgeFromText($input: KnowledgeFromTextInput!) {
                createKnowledgeFromText(input: $input) {
                    ${KnowledgeFields}
                }
            }
        `,
    },
    Subscription: {
        knowledgeCreated: gql`
            subscription KnowledgeCreated($input: KnowledgeSearchInput!) {
                knowledgeCreated(input: $input) {
                    ${KnowledgeFields}
                }
            }
        `,
        knowledgeDeleted: gql`
            subscription KnowledgeDeleted($input: KnowledgeSearchInput!) {
                knowledgeDeleted(input: $input) {
                    ${KnowledgeFields}
                }
            }
        `,
        knowledgeUpdated: gql`
            subscription KnowledgeUpdated($input: KnowledgeSearchInput!) {
                knowledgeUpdated(input: $input) {
                    ${KnowledgeFields}
                }
            }
        `,
    },
}

export default GQL;
