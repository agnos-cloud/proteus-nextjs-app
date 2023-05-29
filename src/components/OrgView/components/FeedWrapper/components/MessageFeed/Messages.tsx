import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { SkeletonLoader } from "@components";
import MessagesOps from "@graphql/message";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MessageItem from "./MessageItem";

// enum MessageType {
//     TEXT = "TEXT",
// }
type MessageType = "TEXT";

interface Message {
    id: string;
    createdAt: Date;
    content: string;
    type: MessageType;
    conversationId: string;
    sender: {
        id: string;
        name: string;
    }
}

interface CharacterMessagesData {
    characterMessages: Array<Message>
}

interface UserMessagesData {
    userMessages: Array<Message>
}

interface MessagesInput {
    conversation: string;
}

interface MessagesVars {
    input: MessagesInput;
}

interface MessagesProps {
    conversationId: string;
    userId: string;
}

const Messages: React.FC<MessagesProps> = ({ conversationId, userId }) => {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const {
        data: charMsgsData,
        loading: charMsgsLoading,
        error: charMsgsError,
        subscribeToMore: subscribeToMoreCharMsgs,
    } = useQuery<CharacterMessagesData, MessagesVars>(
        MessagesOps.Queries.characterMessages, {
          variables: {
            input: {
              conversation: conversationId,
            },
          },
          onError: ({ message }) => toast.error(message),
        });
    const {
        data: userMsgsData,
        loading: userMsgsLoading,
        error: userMsgsError,
        subscribeToMore: subscribeToMoreUserMsgs
    } = useQuery<UserMessagesData, MessagesVars>(
        MessagesOps.Queries.userMessages, {
          variables: {
            input: {
              conversation: conversationId,
            },
          },
          onError: ({ message }) => toast.error(message),
        });

    useEffect(() => {
        const combinedMessages = [
            ...(charMsgsData?.characterMessages || []),
            ...(userMsgsData?.userMessages || []),
        ];
        combinedMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const uniqueMessages = combinedMessages.reduce((acc: Message[], curr: Message) => {
            if (acc.find((m) => m.id === curr.id)/* || curr.conversationId !== conversationId*/) {
                return acc;
            }
            return [...acc, curr];
        }, []);
        setMessages(uniqueMessages);
    }, [charMsgsData, userMsgsData, conversationId]);

    const subscribeToNewCharMessages = (conversationId: string) => {
        return subscribeToMoreCharMsgs({
            document: MessagesOps.Subscriptions.characterMessageSent,
            variables: {
                input: {
                    conversation: conversationId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { characterMessageSent: Message } } }) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.characterMessageSent;
                if (prev.characterMessages.find((m) => m.id === newMessage.id)) {
                    return prev;
                }
                return Object.assign({}, prev, {
                    characterMessages: [newMessage, ...prev.characterMessages]
                });
            }
        });
    };

    const subscribeToNewUserMessages = (conversationId: string) => {
        return subscribeToMoreUserMsgs({
            document: MessagesOps.Subscriptions.userMessageSent,
            variables: {
                input: {
                    conversation: conversationId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { userMessageSent: Message } } }) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.userMessageSent;
                if (prev.userMessages.find((m) => m.id === newMessage.id)) {
                    return prev;
                }
                return Object.assign({}, prev, {
                    userMessages: [newMessage, ...prev.userMessages]
                });
            }
        });
    };

    useEffect(() => {
        const unsubFromNewCharMsgs = subscribeToNewCharMessages(conversationId);
        const unsubFromNewUserMsgs = subscribeToNewUserMessages(conversationId);

        return () => {
            unsubFromNewCharMsgs();
            unsubFromNewUserMsgs();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId]);

    if (charMsgsError || userMsgsError) {
        return null;
    }

  return <Flex direction="column" justify="flex-end" overflow="hidden">
    {charMsgsLoading || userMsgsLoading && (
        <Stack spacing={4} px={2}>
            <SkeletonLoader count={4} height="60px" width="full" />
        </Stack>
    )}
    {messages.length > 0 && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
            {messages.map((message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    sentByMe={message.sender.id === userId}
                    isCharacter={charMsgsData?.characterMessages.find((m) => m.id === message.id) !== undefined}
                />
            ))}
        </Flex>
    )}
  </Flex>;
};

export default Messages;
