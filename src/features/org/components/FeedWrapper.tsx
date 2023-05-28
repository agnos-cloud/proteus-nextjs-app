import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./MessagesHeader";
import { MessageChannel } from "worker_threads";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import NoConversationSelected from "./NoConversationSelected";

interface IFeedWrapperProps {
  org: string;
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ org, session }) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
      bg="background.800"
    >
      {conversationId ? (
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
      ) : (
        <NoConversationSelected org={org} />
      )}
    </Flex>
  );
};

export default FeedWrapper;
