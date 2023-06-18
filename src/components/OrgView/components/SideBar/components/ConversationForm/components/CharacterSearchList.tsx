import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Character } from "@character/types";

interface CharacterSearchListProps {
    characters: Array<Character>;
    addCharacters: (character: Character) => void;
}

const CharacterSearchList: React.FC<CharacterSearchListProps> = ({ characters, addCharacters }) => {
    return (
        <>
            {characters.length === 0 ? (
                <Flex mt={6} justify="center">
                    <Text>No characters found</Text>
                </Flex>
            ) : (
                <Stack mt={6}>
                    {characters.map((character) => (
                        <Stack
                            key={character.id}
                            align="center"
                            direction="row"
                            _hover={{ bg: "background.800" }}
                            p={2}
                            spacing={4}
                        >
                            <Avatar name={character.name} src={character.image} />
                            <Flex justify="space-between" align="center" width="100%">
                                <Text>{character.name}</Text>
                                <Button
                                    size="sm"
                                    bg="button.secondary"
                                    _hover={{ bg: "button.secondary.hover" }}
                                    onClick={() => addCharacters(character)}
                                >
                                    Select
                                </Button>
                            </Flex>
                        </Stack>
                    ))}
                </Stack>
            )}
        </>
    );
};

export default CharacterSearchList;
