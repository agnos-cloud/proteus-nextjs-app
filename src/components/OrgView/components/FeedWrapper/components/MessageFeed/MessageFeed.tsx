import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { NotFound, SkeletonLoader } from "@components";
import { ConversationsData, ConversationsVariable } from "@conversation/types";
import ConversationsOps from "@graphql/conversation";
import { Session } from "next-auth";
import { VscSearchStop } from "react-icons/vsc";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";

interface MessageFeedProps {
    conversationId: string;
    orgId: string;
    session: Session;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ conversationId, orgId, session }) => {
    const { data, loading } = useQuery<ConversationsData, ConversationsVariable>(
        ConversationsOps.Query.conversations, {
            variables: {
                input: {
                    orgId,
                    // id: conversationId,
                },
            }
        }
    );

    const conversation = data?.conversations.find(
        (conversation) => conversation.id === conversationId && conversation.org.id === orgId
    );
    // const conversation = data?.conversation;

    return (
        loading ? (
            <Flex
                direction="column"
                justify="flex-end"
                overflow="hidden"
                flexGrow={1}
            >
                <Stack spacing={4} px={2} py={20}>
                    <SkeletonLoader count={4} height="60px" width="full" />
                </Stack>
            </Flex>
        ) : conversation ? (<>
            <Flex
                direction="column"
                justify="space-between"
                overflow="hidden"
                flexGrow={1}
            >
                <MessagesHeader orgId={orgId} userId={session.user.id} conversation={conversation} />
                <Messages conversationId={conversationId} userId={session.user.id} />
            </Flex>
            <MessageInput orgId={orgId} session={session} conversationId={conversationId} />
        </>) : (
            <Flex
                direction="column"
                justify="space-between"
                overflow="hidden"
                flexGrow={1}
            >
                <NotFound
                    text={"Cannot find this conversation 😓"}
                    subtext="The conversation may have been deleted or the conversation ID may be wrong."
                    Icon={VscSearchStop}
                    returnUrl={`/${orgId}`}
                />
            </Flex>
        )
    );
};

export default MessageFeed;
