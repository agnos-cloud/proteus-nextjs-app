import { useQuery } from "@apollo/client";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import ConversationsOps from  "@graphql/conversation";
import { formatNames } from "@utils/functions"
// import SkeletonLoader from "../../../common/SkeletonLoader";

interface Conversation {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    characters: Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        character: {
            id: string;
            name: string;
        }
    }>;
    users: Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hasUnread: boolean;
        user: {
            id: string;
            name: string;
        }
    }>;
    org: {
        id: string;
        name: string;
    }
    latestMessage: {
      content: string;
    }
}

interface ConversationsData {
    conversations: Array<Conversation>
}

interface ConversationsInput {
    characters?: Array<string>;
    org: string;
    id?: string;
}

interface ConversationsVars {
    input: ConversationsInput;
}

interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
  org: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
  org
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationsData, ConversationsVars>(
    ConversationsOps.Queries.conversations, {
      variables: {
        input: {
          org,
          // id: conversationId,
        },
      }
    });

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );
  // const conversation = data?.conversation;

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={4}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="blackAlpha.200"
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.push(`/${org}`)
        }
      >
        Back
      </Button>
      {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack direction="row" align="center">
          <Text color="blackAlpha.600">To: </Text>
          {/* <Text fontWeight={600}>
            {formatNames(conversation.characters, conversation.users, userId)}
          </Text> */}
          {conversation.characters.map((character) => (
            <Button key={character.id} onClick={() => router.push(`/${org}/?characterId=${character.id}`)}>{character.character.name}</Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
export default MessagesHeader;