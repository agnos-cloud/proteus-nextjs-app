import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";

interface MessageFeedProps {
    conversationId: string;
    org: string;
    session: Session;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ conversationId, org, session }) => {
    return (
        <>
            <Flex
                direction="column"
                justify="space-between"
                overflow="hidden"
                flexGrow={1}
            >
                <MessagesHeader org={org} userId={session.user.id} conversationId={conversationId as string} />
                <Messages conversationId={conversationId as string} userId={session.user.id} />
            </Flex>
            <MessageInput org={org} session={session} conversationId={conversationId as string} />
        </>
    );
};

export default MessageFeed;
