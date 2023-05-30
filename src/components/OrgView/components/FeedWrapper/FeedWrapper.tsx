import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageFeed from "./components/MessageFeed";
import EmptyFeed from "./components/EmptyFeed";
import TrainingFeed from "./components/TrainingFeed";

interface IFeedWrapperProps {
    org: string;
    session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ org, session }) => {
    const router = useRouter();

    const { characterId, conversationId } = router.query;

    return (
        <Flex
            display={{ base: characterId || conversationId ? "flex" : "none", md: "flex" }}
            width="100%"
            direction="column"
            bg="background.800"
        >
        {characterId ? (
            <TrainingFeed
                characterId={characterId as string}
                org={org}
                session={session}
            />
        ) : conversationId ? (
            <MessageFeed
                conversationId={conversationId as string}
                org={org}
                session={session}
            />
        ) : (
            <EmptyFeed org={org} />
        )}
        </Flex>
    );
};

export default FeedWrapper;
