import { useQuery } from "@apollo/client";
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { SkeletonLoader } from "@components";
import MessagesOps from "@message/graphql";
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
let timeout: NodeJS.Timeout | null = null;

interface MessagesProps {
    conversationId: string;
    userId: string;
}

const Messages: React.FC<MessagesProps> = ({ conversationId, userId }) => {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [waitingForResponse, setWaitingForResponse] = useState(true);
    const [waitingForTooLong, setWaitingForTooLong] = useState(false);
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

        // if the last message is not from a user, show loading indicator
        if (uniqueMessages.length > 0 && (userMsgsData?.userMessages || []).includes(uniqueMessages[0])) {
            // toast.loading("Waiting for response...");
            setWaitingForResponse(true);
            setWaitingForTooLong(false);
            timeout = setTimeout(() => {
                if (waitingForResponse) {
                    setWaitingForTooLong(true);
                }
            }, 30000);
        } else {
            // toast.dismiss();
            setWaitingForResponse(false);
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {/* {!charMsgsLoading && !userMsgsLoading && waitingForResponse && (
                <Flex direction="column-reverse" overflowY="scroll" height="100%">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
            )} */}
            {/* {messages.length > 0 && (
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
            )} */}
            <Flex direction="column-reverse" overflowY="scroll" height="100%">
                {!charMsgsLoading && !userMsgsLoading && !waitingForTooLong && waitingForResponse && (
                    <Flex align="center" justify="center" width="100%">
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="button.secondary"
                            color="button.primary"
                            size="lg"
                        />
                    </Flex>
                )}
                {waitingForTooLong && (
                    <Flex align="center" justify="center" width="100%">
                        <Text>You may have new messages. You may want to refresh the page.</Text>
                    </Flex>
                )}
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
        </Flex>
    );
};

export default Messages;
