export interface Knowledge {
    id: string;
    character: KnowledgeCharacterInclude;
    characterId: string;
    createdAt: Date;
    description?: string;
    // embeddings: Array<string>;
    name: string;
    source: string;
    sourceType: KnowledgeSourceType;
    updatedAt: Date;
}

export enum KnowledgeSourceType {
    PDF_FILE = "PDF_FILE",
    TEXT = "TEXT",
    WEB_LINK = "WEB_LINK",
}

export type KnowledgeCharacterInclude = {
    id: string;
    name: string;
    orgId: string;
    org: {
        id: string;
        name: string;
    }
};

export interface KnowledgesData {
    knowledges: Array<Knowledge>
}

export interface KnowledgesVariable {
    input: {
        characterId: string;
    };
}

export interface CreateKnowledgeFromTextData {
    createKnowledgeFromText: Knowledge;
}

export interface CreateKnowledgeFromTextVariable {
    input: {
        characterId: string;
        content: string;
    };
}

export interface SearchKnowledgeVariable {
    input: {
        characterId: string;
    };
}

export type KnowledgeCreatedSubscriptionPayload = {
    knowledgeCreated: Knowledge;
};

export type KnowledgeDeletedSubscriptionPayload = {
    knowledgeDeleted: Knowledge;
};

export type KnowledgeUpdatedSubscriptionPayload = {
    knowledgeUpdated: Knowledge;
};
