import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageFeed from "./components/MessageFeed";
import EmptyFeed from "./components/EmptyFeed";
import CharacterFeed from "./components/CharacterFeed";

interface IFeedWrapperProps {
    orgId: string;
    session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ orgId, session }) => {
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
            <CharacterFeed
                characterId={characterId as string}
                orgId={orgId}
                session={session}
            />
        ) : conversationId ? (
            <MessageFeed
                conversationId={conversationId as string}
                org={orgId}
                session={session}
            />
        ) : (
            <EmptyFeed orgId={orgId} />
        )}
        </Flex>
    );
};

export default FeedWrapper;
