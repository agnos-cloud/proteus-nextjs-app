export interface Character {
    id: string;
    createdAt: Date;
    name: string;
    description?: string;
    image?: string;
    instruction?: string;
    modelFamily: ModelFamily;
    plan: Plan;
    planExpiresAt?: Date;
    updatedAt: Date;
}

export enum ModelFamily {
    GOOGLE_AI = "GOOGLE_AI",
    OPENAI = "OPENAI",
}

export enum Plan {
    ADVANCED = "ADVANCED",
    BASIC = "BASIC",
    FREE = "FREE",
    PRO = "PRO",
}

export interface CharacterData {
    character: Character
}

export interface CharacterVars {
    id: string;
}

export interface CharactersData {
    characters: Array<Character>
}

export interface CharactersVariable {
    input: {
        name?: string;
        orgId: string;
    };
}

export type CharacterCreatedSubscriptionPayload = {
    characterCreated: Character;
};

export type CharacterDeletedSubscriptionPayload = {
    characterDeleted: Character;
};

export type CharacterUpdatedSubscriptionPayload = {
    characterUpdated: Character;
};

export interface CreateCharacterData {
    createCharacter: {
        id: string;
        name: string;
        description?: string;
    }
}

export interface CreateCharacterVariable {
    input: {
        name: string;
        description?: string;
        orgId: string;
    };
}

export interface SearchCharacterVariable {
    input: {
        name?: string;
        orgId: string;
    };
}

export interface SaveCharacterInstructionVariable {
    input: {
        id: string;
        instruction: string;
        orgId: string;
    };
}

export interface SaveCharacterInstructionData {
    saveInstruction: boolean;
}
