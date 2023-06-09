import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import { SkeletonLoader } from "@components";
import {
    Conversation,
    ConversationDeletedSubscriptionPayload,
    ConversationUpdatedSubscriptionPayload,
    ConversationUsersInclude,
    MarkConversationAsReadData,
    MarkConversationAsReadVars,
    SearchConversationsData,
    SearchConversationsVariable
} from "@conversation/types";
import ConversationsOps from "@conversation/graphql";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ConversationList from "./ConversationList";

interface ConversationListPanelProps {
    orgId: string;
    session: Session;
}

const ConversationListPanel: React.FC<ConversationListPanelProps> = ({ orgId, session }) => {
    const router = useRouter();
    const { query: { conversationId } } = router;
    const {
        data: conversationsData,
        loading: conversationsLoading,
        error: conversationsError,
        subscribeToMore: subscribeToMoreConversations
    } = useQuery<SearchConversationsData, SearchConversationsVariable>(ConversationsOps.Query.conversations, {
        variables: {
            input: {
                orgId,
            },
        }
    });

    useEffect(() => {
        if (conversationsError) {
            toast.error(conversationsError.message);
        }
    }, [conversationsError]);

    const [ markConversationAsRead ] =
        useMutation<MarkConversationAsReadData, MarkConversationAsReadVars>(ConversationsOps.Mutation.markConversationAsRead);

    useSubscription<ConversationUpdatedSubscriptionPayload, SearchConversationsVariable>(
        ConversationsOps.Subscription.conversationUpdated, {
        variables: {
            input: {
                orgId,
            },
        },
        onData: ({ data }) => {
            const { data: subscriptionData } = data;
            if (!subscriptionData) return;

            const { conversationUpdated: updatedConversation } = subscriptionData;
            const currentlyViewingConversation = updatedConversation.id === conversationId;

            if (currentlyViewingConversation) {
                onViewConversation(updatedConversation.id);
            }
        },
    });

    useSubscription<ConversationDeletedSubscriptionPayload, SearchConversationsVariable>(
        ConversationsOps.Subscription.conversationDeleted, {
        variables: {
            input: {
                orgId,
            },
        },
        onData: ({ client, data }) => {
            const { data: subscriptionData } = data;
            if (!subscriptionData) return;

            const existingConversations = client.readQuery<SearchConversationsData, SearchConversationsVariable>({
                query: ConversationsOps.Query.conversations,
                variables: {
                    input: {
                        orgId,
                    },
                },
            });

            if (!existingConversations) return;

            const { conversations } = existingConversations;
            const { conversationDeleted: deletedConversation } = subscriptionData;

            client.writeQuery<SearchConversationsData, SearchConversationsVariable>({
                query: ConversationsOps.Query.conversations,
                variables: {
                    input: {
                        orgId,
                    },
                },
                data: {
                    conversations: conversations.filter((c) => c.id !== deletedConversation.id),
                },
            });
        },
    });

    const subscribeToNewConversations = () => {
        subscribeToMoreConversations({
            document: ConversationsOps.Subscription.conversationCreated,
            variables: {
                input: {
                    orgId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
                if (!subscriptionData.data) return prev;
                const newConversation = subscriptionData.data.conversationCreated;
                // the below is already checked on the server, but just in case
                if (!newConversation.users.some(u => u.user.id === session.user.id) || newConversation.org.id !== orgId) return prev;
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

    const onViewConversation = async (conversationId: string) => {
        router.push(`/${orgId}/?conversationId=${conversationId}`);

        try {
            await markConversationAsRead({
                variables: {
                    id: conversationId,
                },
                optimisticResponse: {
                    markConversationAsRead: true,
                },
                update: (cache) => {
                const conversationUserFragment = cache.readFragment<{
                    users: ConversationUsersInclude
                }>({
                    id: `Conversation:${conversationId}`,
                    fragment: gql`
                    fragment MarkConversationAsRead on Conversation {
                        users {
                            id
                            hasUnread
                            user {
                                id
                                name
                                image
                            }
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

    return (
        <Stack height="100%">
            {conversationsLoading ? (
                <SkeletonLoader count={7} height="80px" width="350px" />
            ) : (
                <ConversationList
                    orgId={orgId}
                    session={session}
                    conversations={conversationsData?.conversations || []}
                    onViewConversation={onViewConversation}
                />
            )}
        </Stack>
    );
};

export default ConversationListPanel;
