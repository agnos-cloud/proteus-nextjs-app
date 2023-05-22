import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none" }}
      width="100%"
      direction="column"
    >
      {conversationId ? (
        <Flex height="100vh">{conversationId}</Flex>
      ) : (
        <div>No conversation selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
