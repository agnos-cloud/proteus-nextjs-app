import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import MessagesOps from  "@graphql/message";
import { ObjectID } from "bson";

type MessageType = "TEXT";

interface Message {
    id: string;
    createdAt: Date;
    content: string;
    type: MessageType;
    sender: {
        id: string;
        name: string;
    }
}

interface SendMessageData {
    sendUserMessage: boolean;
}

interface MessagesInput {
    id: string;
    content: string;
    conversation: string;
    sender: string;
    type: MessageType;
}

interface SendMessageVars {
    input: MessagesInput;
}

interface MessageInputProps {
    conversationId: string;
    session: Session;
    org: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, session }) => {
    const [message, setMessage] = useState("");
    const [ sendMessage ] =
        useMutation<SendMessageData, SendMessageVars>(MessagesOps.Mutations.sendUserMessage);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const { data, errors } = await sendMessage({
                variables: {
                    input: {
                        id: new ObjectID().toString(),
                        conversation: conversationId,
                        sender: session.user.id,
                        content: message,
                        type: "TEXT",
                    }
                },
            });

            if (!data?.sendUserMessage || errors) {
                throw new Error("Failed to send message");
            }

            setMessage("");
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
