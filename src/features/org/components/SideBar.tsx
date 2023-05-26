import { Avatar, Box, Button, Divider, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import ConversationList from "./ConversationList";
import OrgActionList from "./OrgActionList";
import ConversationsOps from  "@graphql/conversation";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SkeletonLoader } from "@components";
import { CharacterList } from "@components/character";

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

interface MarkConvoData {
  markConversationAsRead: boolean;
}

interface MarkConvoVars {
  id: string;
}

interface ISideBarProps {
  org: string;
  session: Session;
}

const SideBar: React.FC<ISideBarProps> = ({ org, session }) => {
  const router = useRouter();
  const { query: { conversationId } } = router;
  const { data, loading, error, subscribeToMore } = useQuery<ConversationsData, ConversationsVars>(ConversationsOps.Queries.conversations, {
    variables: {
      input: {
        org,
      },
    }
  });

  const [ markConversationAsRead ] =
    useMutation<MarkConvoData, MarkConvoVars>(ConversationsOps.Mutations.markConversationAsRead);

  useSubscription<{ conversationUpdated: Conversation }, { input: { org: string } }>(ConversationsOps.Subscriptions.conversationUpdated, {
    variables: {
      input: {
        org,
      },
    },
    onData: ({ client, data }) => {
      const { data: subscriptionData } = data;
      if (!subscriptionData) return;

      const { conversationUpdated: updatedConversation } = subscriptionData;
      const currentlyViewingConversation = updatedConversation.id === conversationId;

      if (currentlyViewingConversation) {
        onViewConversation(updatedConversation.id);
      }
    },
  });

  useSubscription<{ conversationDeleted: Conversation }, { input: { org: string } }>(ConversationsOps.Subscriptions.conversationDeleted, {
    variables: {
      input: {
        org,
      },
    },
    onData: ({ client, data }) => {
      const { data: subscriptionData } = data;
      if (!subscriptionData) return;

      const existingConversations = client.readQuery<ConversationsData, ConversationsVars>({
        query: ConversationsOps.Queries.conversations,
        variables: {
          input: {
            org,
          },
        },
      });

      if (!existingConversations) return;

      const { conversations } = existingConversations;
      const { conversationDeleted: deletedConversation } = subscriptionData;

      client.writeQuery<ConversationsData, ConversationsVars>({
        query: ConversationsOps.Queries.conversations,
        variables: {
          input: {
            org,
          },
        },
        data: {
          conversations: conversations.filter((c) => c.id !== deletedConversation.id),
        },
      });
    },
  });

  const onViewConversation = async (conversationId: string) => {
    router.push(`/${org}/?conversationId=${conversationId}`);

    try {
      await markConversationAsRead({
        variables: {
          id: conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const conversationUserFragment = cache.readFragment<{ users: Array<{ id: string; hasUnread: boolean; user: { id: string; name: string; } }> }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment MarkConversationAsRead on Conversation {
                users {
                  id
                  user {
                    id
                    name
                  }
                  hasUnread
                }
              }`
          });

          if (!conversationUserFragment) return;

          const users = [...conversationUserFragment.users];
          const userIndex = users.findIndex(u => u.user.id === session.user.id);
          if (userIndex === -1) return;

          const user = users[userIndex];
          users[userIndex] = {
            ...user,
            hasUnread: false,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment MarkConversationAsRead on Conversation {
                users
              }`,
            data: {
              users,
            }
          });
        }
      });
    }
    catch (e) {
      console.error(e);
    }
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
      bg="whiteAlpha.50"
      py={6}
      px={3}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
    >
      <Stack width="100%" height="100%" justify="space-between">
        <Stack overflow="hidden" flexGrow={1} justify="space-between">
          <Stack>
            <OrgActionList org={org} session={session} />
            <Divider orientation="horizontal" />
          </Stack>
          <Stack overflow="hidden" flexGrow={1}>
            <Tabs variant="enclosed" isFitted height="100%">
              <TabList>
                <Tab>Conversations</Tab>
                <Tab>Characters</Tab>
              </TabList>

              <TabPanels height="92%">
                <TabPanel height="100%">
                  <Stack
                    height="100%"
                  >
                    {loading ? (
                      <SkeletonLoader count={7} height="80px" />
                    ) : (
                      <ConversationList
                        org={org}
                        session={session}
                        conversations={data?.conversations || []}
                        onViewConversation={onViewConversation}
                      />
                    )}
                  </Stack>
                </TabPanel>
                <TabPanel height="100%">
                  <CharacterList org={org} session={session} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Stack>
        <Flex gap={1} align="center" justify="space-between">
          <Flex gap={1} align="center">
            {session.user.image && <Avatar src={session.user.image} size="sm" />}
            <Text fontWeight={600}>{session.user.name}</Text>
          </Flex>
          <Button size="sm" onClick={() => signOut()}>Log Out</Button>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default SideBar;
