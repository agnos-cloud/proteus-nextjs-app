import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";

interface TrainingFeedProps {
    characterId: string;
    org: string;
    session: Session;
}

const TrainingFeed: React.FC<TrainingFeedProps> = ({ characterId, org, session }) => {
    return (
        <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
        >
            <div>Header goes here</div>
            <div>Body goes here</div>
        </Flex>
    );
};

export default TrainingFeed;
