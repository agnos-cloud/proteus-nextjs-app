import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { BiBorderRadius } from "react-icons/bi";

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

const formatRelativeLocale = {
    lastWeek: "eeee 'at' p",
    yesterday: "'Yesterday at' p",
    today: "p",
    other: "MM/dd/yy",
};

interface MessageItemProps {
    message: Message;
    sentByMe: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack
        direction="row"
        p={4}
        spacing={4}
        _hover={{ bg: "blackAlpha.200" }}
        justify={sentByMe ? "flex-end" : "flex-start"}
        wordBreak="break-word"
    >
        {!sentByMe && (
            <Flex align="flex-end">
                <Avatar size="sm" />
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
                    <Text fontSize={14} color="blackAlpha.700">
                        {formatRelative(new Date(message.createdAt), new Date(), {
                            locale: {
                                ...enUS,
                                formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                            },
                        })}
                    </Text>
                </Stack>
                <Flex justify={sentByMe ? "flex-end" : "flex-start"}>
                    <Box
                        bg={sentByMe ? "brand.200" : "blackAlpha.300"}
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
