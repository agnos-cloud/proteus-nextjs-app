import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";

type SearchedCharacter = {
    id: string;
    name: string;
    description?: string;
};

interface CharacterSearchListProps {
    characters: Array<SearchedCharacter>;
    addCharacters: (character: SearchedCharacter) => void;
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
                            direction="row"
                            align="center"
                            spacing={4}
                            py={2}
                            px={2}
                            borderRadius={4}
                            _hover={{ bg: "blackAlpha.200" }}
                        >
                            <Avatar />
                            <Flex justify="space-between" align="center" width="100%">
                                <Text>{character.name}</Text>
                                <Button
                                    size="sm"
                                    bg="brand.200"
                                    _hover={{ bg: "brand.200" }}
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
