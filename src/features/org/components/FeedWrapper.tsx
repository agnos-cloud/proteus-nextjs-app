import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./MessagesHeader";

interface IFeedWrapperProps {
  org: string;
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ org, session }) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none" }}
      width="100%"
      direction="column"
    >
      {conversationId ? (
        <Flex
          direction="column"
          justify="space-between"
          overflow="hidden"
          flexGrow={1}
        >
          <MessagesHeader org={org} userId={session.user.id} conversationId={conversationId as string} />
        </Flex>
      ) : (
        <div>No conversation selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
