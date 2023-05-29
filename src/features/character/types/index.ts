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

export type SearchedCharacter = {
    id: string;
    name: string;
    description?: string;
};
