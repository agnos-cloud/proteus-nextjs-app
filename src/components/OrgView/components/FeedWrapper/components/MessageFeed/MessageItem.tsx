import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Message, MessageType } from "@message/types";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { BiBot } from "react-icons/bi";
import { MdDangerous } from "react-icons/md";

const formatRelativeLocale = {
    lastWeek: "eeee 'at' p",
    yesterday: "'Yesterday at' p",
    today: "p",
    other: "MM/dd/yy",
};

interface MessageItemProps {
    bg?: string;
    message: Message;
    sentByMe: boolean;
    isCharacter: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ bg, message, sentByMe, isCharacter }) => {
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
                    {isCharacter && !message.sender.image ? (
                        <BiBot size={24} />
                    ) : (
                        <Avatar size="xs" name={message.sender.name} src={message.sender.image} />
                    )}
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
                            bg={bg || "background.900"}
                            border={message.type === MessageType.ERROR_MESSAGE ? "1px solid red" : "none"}
                            px={2}
                            py={1}
                            borderRadius={12}
                            maxWidth="65%"
                        >
                            <Text>{message.content}</Text>
                        </Box>
                    </Flex>
            </Stack>
        </Stack>
    );
};

export default MessageItem;
