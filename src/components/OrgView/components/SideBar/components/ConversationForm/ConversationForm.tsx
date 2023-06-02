import { Button, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import CharactersOps from  "@graphql/character";
import toast from "react-hot-toast";
import next from "next/types";
import { nextTick } from "process";
import { on } from "events";
import { Character, CharactersData, CharactersVariable } from "@character/types";
import CharacterSearchList from "./components/CharacterSearchList";
import Participants from "./components/Participants";

interface ConversationFormProps {
    onChange: (participants: Character[]) => void;
    orgId: string;
}

const ConversationForm: React.FC<ConversationFormProps> = ({ orgId, onChange }) => {
    const [characterName, setCharacterName] = useState<string>("");
    const [participants, setParticipants] = useState<Array<Character>>([]);
    const [characters, { data, loading, error }] =
        useLazyQuery<CharactersData, CharactersVariable>(CharactersOps.Query.characters);

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
                orgId: orgId,
              }
            }
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const addParticipant = (character: Character) => {
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
                    <Button
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                        isLoading={loading}
                        size="sm"
                        type="submit"
                    >
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
