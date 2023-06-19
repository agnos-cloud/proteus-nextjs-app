import { Flex } from "@chakra-ui/react";
import { Character } from "@character/types";
import { useRouter } from "next/router";
import Instruction from "./components/Instruction";
import KnowledgeList from "./components/KnowledgeList";
import WidgetList from "./components/WidgetList";

enum Tab {
    INSTRUCTION = "instruction",
    KNOWLEDGE = "knowledge",
    WIDGETS = "widgets",
};

interface CharacterFeedBodyProps {
    character: Character;
    orgId: string;
}

const CharacterFeedBody: React.FC<CharacterFeedBodyProps> = ({ character, orgId }) => {
    const router = useRouter();
    const { query: { tab } } = router;

    return <Flex direction="column" overflow="hidden" overflowY="scroll" flex={1}>
        {(!tab || tab === Tab.INSTRUCTION) && <Instruction
            character={character}
            orgId={orgId}
        />}
        {tab === Tab.KNOWLEDGE && (
            <KnowledgeList
                character={character}
                orgId={orgId}
            />
        )}
        {tab === Tab.WIDGETS && (
            <WidgetList
                character={character}
                orgId={orgId}
            />
        )}
    </Flex>;
};

export default CharacterFeedBody;
