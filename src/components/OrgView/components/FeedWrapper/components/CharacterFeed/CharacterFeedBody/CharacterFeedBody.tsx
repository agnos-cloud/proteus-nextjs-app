import { Flex } from "@chakra-ui/react";
import { Character } from "@character/types";
import { useRouter } from "next/router";
import Instruction from "./components/Instruction";
import Knowledge from "./components/Knowledge";

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

    return <Flex direction="column" overflow="hidden" overflowY="scroll" flex={1}>
        <Instruction
            character={character}
            orgId={orgId}
            visible={!tab || tab === Tab.INSTRUCTION}
        />
        {tab === Tab.KNOWLEDGE && (
            <Knowledge
                character={character}
                orgId={orgId}
                visible={tab === Tab.KNOWLEDGE}
            />
        )}
    </Flex>;
};

export default CharacterFeedBody;
