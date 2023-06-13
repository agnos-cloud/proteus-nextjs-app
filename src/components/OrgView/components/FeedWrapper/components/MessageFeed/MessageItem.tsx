import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Message, MessageType } from "@message/types";
import { formatRelativeLocale } from "@utils/time";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { MdDangerous } from "react-icons/md";

interface MessageItemProps {
    bg?: string;
    message: Message;
    sentByMe: boolean;
    isCharacter: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ bg, message, sentByMe }) => {
    let messageContent: object | string = "";
    let messageComponent = null;

    try {
        messageContent = JSON.parse(message.content);
    } catch (e) {
        messageContent = message.content;
    }

    if (typeof messageContent === "string") {
        messageComponent = <Text>{messageContent}</Text>;
    } else if (typeof messageContent === "object" && (messageContent as any)["type"] === "message_button") {
        messageComponent = (
            <Button
                bg="button.secondary"
                _hover={{ bg: "button.secondary.hover" }}
                onClick={() => {}}
            >
                {(messageContent as any)["text"]}
            </Button>
        );
    } else {
        messageComponent = <Text>{message.content}</Text>;
    }

    return (
        <Stack
            direction="row"
            p={4}
            spacing={4}
            _hover={{ bg: "background.800" }}
            justify={sentByMe ? "flex-end" : "flex-start"}
            wordBreak="break-word"
        >
            {!sentByMe && (
                <Flex align="flex-end">
                    <Avatar size="xs" name={message.sender.name} src={message.sender.image} />
                </Flex>
            )}
            <Stack spacing={1} width="100%">
                <Stack
                    direction="row"
                    align="center"
                    justify={sentByMe ? "flex-end" : "flex-start"}
                >
                        {!sentByMe && (
                            <Text fontWeight={500} textAlign="left">{message.sender.name}</Text>
                        )}
                        <Text fontSize={14} color="color.400">
                            {formatRelative(new Date(message.createdAt), new Date(), {
                                locale: {
                                    ...enUS,
                                    formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                                },
                            })}
                        </Text>
                        {message.type === MessageType.ERROR_MESSAGE && <MdDangerous fontSize={20} color="red" />}
                    </Stack>
                    <Flex justify={sentByMe ? "flex-end" : "flex-start"}>
                        <Box
                            bg={typeof messageContent === "string" ? bg || "background.900" : "none"}
                            border={message.type === MessageType.ERROR_MESSAGE ? "1px solid red" : "none"}
                            px={2}
                            py={1}
                            borderRadius={12}
                            maxWidth="65%"
                        >
                            {messageComponent}
                        </Box>
                    </Flex>
            </Stack>
        </Stack>
    );
};

export default MessageItem;
