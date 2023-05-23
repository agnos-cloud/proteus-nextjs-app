import { Button, Divider, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import ConversationList from "./ConversationList";
import OrgActionList from "./OrgActionList";
import ConversationsOps from  "@graphql/conversation";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

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

interface ISideBarProps {
  org: string;
  session: Session;
}

const SideBar: React.FC<ISideBarProps> = ({ org, session }) => {
  const { data, loading, error, subscribeToMore } = useQuery<ConversationsData, ConversationsVars>(ConversationsOps.Queries.conversations, {
    variables: {
      input: {
        org,
      },
    }
  });
  const router = useRouter();
  const { query: { conversationId } } = router;

  const onViewConversation = async (conversationId: string) => {
    router.push(`/${org}/?conversationId=${conversationId}`);
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOps.Subscriptions.conversationCreated,
      variables: {
        input: {
          org,
        },
      },
      updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        // the below is already checked on the server, but just in case
        if (!newConversation.users.some(u => u.user.id === session.user.id) || newConversation.org.id !== org) return prev;
        if (prev.conversations.find((c) => c.id === newConversation.id)) {
          return prev;
        }
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations]
        });
      }
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      width={{ base: "100%", md: "400px" }}
      // height="100vh"
      bg="whiteAlpha.50"
      py={6}
      px={3}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
    >
        <Stack width="100%" height="100%" justify="space-between">
          <Stack>
            <OrgActionList org={org} session={session} />
            <Divider orientation="horizontal" />
            <ConversationList
              org={org}
              session={session}
              conversations={data?.conversations || []}
              onViewConversation={onViewConversation}
            />
          </Stack>
          <Button onClick={() => signOut()}>Log Out</Button>
        </Stack>
    </Stack>
  );
};

export default SideBar;
