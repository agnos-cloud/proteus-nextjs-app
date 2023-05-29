export interface Character {
    id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CharactersData {
    characters: Array<Character>
}

export interface CharactersInput {
    name?: string;
    org: string;
}

export interface CharactersVars {
    input: CharactersInput;
}

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
    org: string;
}

export interface CreateCharacterVars {
    input: CharacterInput;
}


export type SearchedCharacter = {
    id: string;
    name: string;
    description?: string;
};
