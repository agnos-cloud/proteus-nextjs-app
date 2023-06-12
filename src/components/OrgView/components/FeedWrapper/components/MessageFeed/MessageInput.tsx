import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import MessagesOps from  "@message/graphql";
import { ObjectID } from "bson";
import { MessagesVariable, SendUserMessageData, SendMessageVariable, UserMessagesData, MessageType } from "@message/types";

interface MessageInputProps {
    conversationId: string;
    session: Session;
    orgId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, session }) => {
    const [message, setMessage] = useState("");
    const [ sendMessage ] =
        useMutation<SendUserMessageData, SendMessageVariable>(MessagesOps.Mutation.sendUserMessage);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        try {
            const messageId = new ObjectID().toString();
            const { data, errors } = await sendMessage({
                variables: {
                    input: {
                        id: messageId,
                        conversationId,
                        senderId: session.user.id,
                        content: message,
                        type: MessageType.TEXT,
                    }
                },
                optimisticResponse: {
                    sendUserMessage: true,
                },
                update: (cache) => {
                    const existing = cache.readQuery<UserMessagesData, MessagesVariable>({
                        query: MessagesOps.Query.userMessages,
                        variables: {
                            input: {
                                conversationId,
                            },
                        },
                    });

                    cache.writeQuery<UserMessagesData, MessagesVariable>({
                        query: MessagesOps.Query.userMessages,
                        variables: {
                            input: {
                                conversationId,
                            },
                        },
                        data: {
                            ...existing,
                            userMessages: [
                                {
                                    id: messageId,
                                    conversationId,
                                    senderId: session.user.id,
                                    sender: {
                                        id: session.user.id,
                                        name: session.user.name!,
                                        image: session.user.image as string|undefined,
                                    },
                                    content: message,
                                    type: MessageType.TEXT,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                ...(existing?.userMessages || []),
                            ],
                        },
                    });
                }
            });

            if (!data?.sendUserMessage || errors) {
                throw new Error("Failed to send message");
            }

            // setMessage("");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || String(error));
        }
    };

    return (
        <Box px={4} py={6}>
            <form onSubmit={onSubmit}>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message..."
                    size="md"
                    resize="none"
                    bg="background.700"
                    _focus={{
                        boxShadow: "none",
                        border: "1px solid",
                        borderColor: "blackAlpha.300",
                    }}
                />
            </form>
        </Box>
    );
};

export default MessageInput;
