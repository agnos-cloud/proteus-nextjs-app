export interface Character {
    id: string;
    createdAt: Date;
    name: string;
    description?: string;
    image?: string;
    plan?: Plan;
    planExpiresAt?: Date;
    updatedAt: Date;
}

export enum Plan {
    ADVANCED = "ADVANCED",
    BASIC = "BASIC",
    FREE = "FREE",
    PRO = "PRO"
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

export interface CharactersInput {
    name?: string;
    orgId: string;
}

export interface CharactersVars {
    input: CharactersInput;
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

export interface CharacterInput {
    name: string;
    description?: string;
    orgId: string;
}

export interface CreateCharacterVars {
    input: CharacterInput;
}

export interface SearchCharacterInput {
    name?: string;
    orgId: string;
}

export interface SearchCharacterVars {
    input: SearchCharacterInput;
}
