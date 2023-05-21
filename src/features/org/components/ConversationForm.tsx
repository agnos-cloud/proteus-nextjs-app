import { CharacterSearchList, Participants } from "@components/character";
import { Button, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import CharactersOps from  "@graphql/character";
import toast from "react-hot-toast";
import next from "next/types";
import { nextTick } from "process";
import { on } from "events";

interface CharactersData {
  characters: Array<SearchedCharacter>
}

interface CharactersInput {
  name?: string;
  org: string;
}

interface CharactersVars {
  input: CharactersInput;
}

interface IConversationFormProps {
    onChange: (participants: SearchedCharacter[]) => void;
    org: string;
}

type SearchedCharacter = {
    id: string;
    name: string;
    description?: string;
};

export type FormData = {
    characterName: string;
}

const ConversationForm: React.FC<IConversationFormProps> = (props) => {
    const { org, onChange } = props;
    const [characterName, setCharacterName] = useState<string>("");
    const [participants, setParticipants] = useState<Array<SearchedCharacter>>([]);
    const [characters, { data, loading, error }] = useLazyQuery<CharactersData, CharactersVars>(CharactersOps.Queries.characters);

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterName(event.target.value);
    };

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        characters({
            variables: {
              input: {
                name: characterName,
                org,
              }
            }
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const addParticipant = (character: SearchedCharacter) => {
        setParticipants((prev) => {
            if (prev.find((p) => p.id === character.id)) {
                onChange(prev);
                return prev;
            }
            onChange([...prev, character]);
            return [...prev, character];
        });
        setCharacterName("");
    };

    const removeParticipant = (id: string) => {
        setParticipants((prev) => {
            const p = prev.filter((p) => p.id !== id);
            onChange(p);
            return p;
        });
    };

    return (
        <>
            <form onSubmit={handleSearch}>
                <Stack spacing={4}>
                    <Input
                        placeholder="Enter character name"
                        value={characterName}
                        onChange={handleNameChange}
                    />
                    <Button type="submit" isLoading={loading}>
                        Search
                    </Button>
                </Stack>
            </form>
            {
                data?.characters
                && <CharacterSearchList
                    characters={data?.characters}
                    addCharacters={addParticipant}
                />
            }
            {participants.length !== 0 && <Participants participants={participants} removeParticipant={removeParticipant} />}
        </>
    );
};

export default ConversationForm;
