import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Character, ModelFamily } from "@character/types";
import { BiBot } from "react-icons/bi";
import { TbBrandGoogle, TbBrandOpenai } from "react-icons/tb";

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
                            {character.image ? (
                                <Avatar name={character.name} src={character.image} />
                            ) : character.modelFamily === ModelFamily.GOOGLE_AI ? (
                                <TbBrandGoogle size={48} />
                            ) : character.modelFamily === ModelFamily.OPENAI ? (
                                <TbBrandOpenai size={48} />
                            ) : (
                                <BiBot size={48} />
                            )}
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
