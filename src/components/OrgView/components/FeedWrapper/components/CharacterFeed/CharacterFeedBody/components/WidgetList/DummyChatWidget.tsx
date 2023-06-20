import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Character } from "@character/types";
import { ChatWidget } from "@chat-widget/types";
import { CgClose } from "react-icons/cg";

interface DummyChatWidgetProps {
    character: Character;
    chatWidget: ChatWidget;
}

const DummyChatWidget: React.FC<DummyChatWidgetProps> = ({ character, chatWidget }) => {
    return (
        <Stack height="100%" justify="space-between" width="100%">
            <Stack flexGrow={1} justify="space-between" spacing={0}>
                <Stack>
                    <Box bg={chatWidget.primaryColor} borderTopRadius={10} height="80px" px={2} py={7} width="100%">
                        <Flex align="flex-end" gap={1} justify="flex-start">
                            <Avatar name={character.name} src={character.image} size="xs" />
                            <Text>{character.name}</Text>
                        </Flex>
                    </Box>
                </Stack>
                <Stack bg="white" flexGrow={1} justify="flex-end" overflow="hidden" p={1}>
                    <Flex align="flex-end" gap={1} justify="flex-start">
                        <Avatar name={character.name} src={character.image} size="xs" />
                        <Box bg="grey" borderRadius={10} height="40px" width="70%"></Box>
                    </Flex>
                    <Flex justify="flex-end">
                        <Box bg={chatWidget.secondaryColor} borderRadius={10} height="40px" width="70%"></Box>
                    </Flex>
                </Stack>
                <Text
                    bg="background.700"
                    border="1px solid"
                    borderBottomRadius={5}
                    color="color.500"
                    px={4}
                    py={2}
                >
                    Send message...
                </Text>
            </Stack>
            <Flex justify="flex-end">
                <Button bg={chatWidget.primaryColor} borderRadius={50} p={0}>
                    <CgClose size="25" />
                </Button>
            </Flex>
        </Stack>
    );
};

export default DummyChatWidget;
