import { useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { BiMessageSquareDots } from "react-icons/bi";
import ConversationsOps from  "@graphql/conversation";

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
  }

  interface ConversationsVars {
    input: ConversationsInput;
  }

interface NoConversationSelectedProps {
    org: string;
}

const NoConversationSelected: React.FC<NoConversationSelectedProps> = ({ org }) => {
    const { data, loading, error } = useQuery<ConversationsData, ConversationsVars>(ConversationsOps.Queries.conversations, {
        variables: {
          input: {
            org,
          },
        }
    });

      if (!data?.conversations || loading || error) return null;

      const { conversations } = data;

      const hasConversations = conversations.length;

      const text = hasConversations
        ? "Select a Conversation"
        : "Welcome to Proteus AI 🥳";

      return (
        <Flex height="100%" justify="center" align="center">
          <Stack spacing={10} align="center">
            <Text fontSize={50} textAlign="center">{text}</Text>
            <BiMessageSquareDots fontSize={90} />
          </Stack>
        </Flex>
      );
};

export default NoConversationSelected;
