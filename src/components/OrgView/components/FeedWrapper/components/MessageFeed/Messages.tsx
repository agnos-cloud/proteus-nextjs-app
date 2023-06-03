import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { SkeletonLoader } from "@components";
import MessagesOps from "@graphql/message";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MessageItem from "./MessageItem";
import {
    CharacterMessageSentSubscriptionPayload,
    CharacterMessagesData,
    Message,
    MessagesVariable,
    UserMessageSentSubscriptionPayload,
    UserMessagesData
} from "@message/types";

const bgs = ["#2B6CB0", "#1A365D", "#2F855A", "#1C4532", "#00A3C4", "#065666"];
const bgsMap: { [key: string]: string } = {};

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
    } = useQuery<CharacterMessagesData, MessagesVariable>(
        MessagesOps.Query.characterMessages, {
            variables: {
                input: {
                    conversationId,
                },
            },
            onError: ({ message }) => toast.error(message),
        });
    const {
        data: userMsgsData,
        loading: userMsgsLoading,
        error: userMsgsError,
        subscribeToMore: subscribeToMoreUserMsgs
    } = useQuery<UserMessagesData, MessagesVariable>(
        MessagesOps.Query.userMessages, {
            variables: {
                input: {
                    conversationId,
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
            document: MessagesOps.Subscription.characterMessageSent,
            variables: {
                input: {
                    conversationId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: CharacterMessageSentSubscriptionPayload } }) => {
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
            document: MessagesOps.Subscription.userMessageSent,
            variables: {
                input: {
                    conversationId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: UserMessageSentSubscriptionPayload } }) => {
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
        return null; // TODO: handle error
    }

    return (
        <Flex direction="column" justify="flex-end" overflow="hidden">
            {charMsgsLoading || userMsgsLoading && (
                <Stack spacing={4} px={2}>
                    <SkeletonLoader count={4} height="60px" width="full" />
                </Stack>
            )}
            {messages.length > 0 && (
                <Flex direction="column-reverse" overflowY="scroll" height="100%">
                    {messages.map((message) => {
                        if (!bgsMap[message.sender.id]) {
                            bgsMap[message.sender.id] = bgs[Math.floor(Math.random() * bgs.length)];
                        }
                        return (
                            <MessageItem
                                key={message.id}
                                bg={message.sender.id === userId ? "#6B46C1" : bgsMap[message.sender.id]}
                                message={message}
                                sentByMe={message.sender.id === userId}
                                isCharacter={charMsgsData?.characterMessages.find((m) => m.id === message.id) !== undefined}
                            />
                        );
                    })}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;
