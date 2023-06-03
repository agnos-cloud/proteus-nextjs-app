import { Flex, Stack, Text } from "@chakra-ui/react";
import { Character } from "@character/types";
import { useRouter } from "next/router";
import Instruction from "./components/Instruction";

enum Tab {
    INSTRUCTION = "instruction",
    KNOWLEDGE = "knowledge",
};

interface CharacterFeedBodyProps {
    character: Character;
    orgId: string;
}

const CharacterFeedBody: React.FC<CharacterFeedBodyProps> = ({ character, orgId }) => {
    const router = useRouter();
    const { query: { tab } } = router;

    return <Flex direction="column" overflow="hidden" flex={1}>
        <Instruction
            character={character}
            orgId={orgId}
            visible={!tab || tab === Tab.INSTRUCTION}
        />
        {tab === Tab.KNOWLEDGE && (
            <Stack spacing={4} px={2}>
                <Text>Knowledge</Text>
            </Stack>
        )}
    </Flex>;
};

export default CharacterFeedBody;
