import { Avatar, Button, IconButton, Stack, Text } from "@chakra-ui/react";
import { Conversation } from "@conversation/types";
import { useRouter } from "next/router";
import React from "react";
import { IoArrowBack as BackArrowIcon } from "react-icons/io5";

interface MessagesHeaderProps {
    userId: string;
    conversation: Conversation;
    orgId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
    conversation,
    orgId,
}) => {
    const router = useRouter();

    return (
        <Stack
            align="center"
            borderBottom="1px solid"
            direction="row"
            py={4}
            px={{ base: 4, md: 0 }}
            spacing={{ base: 0, md: 2 }}
        >
            <IconButton
                aria-label="Toggle Navigation"
                icon={<BackArrowIcon size={20} />} display={{ base: "flex", md: "none" }}
                variant="ghost"
                onClick={() => router.push(`/${orgId}`)}
            />
            {conversation && (
                <Stack align="center" direction="row">
                    <Text>To: </Text>
                    {conversation.characters.map((character) => (
                      <Button
                          bg="button.secondary"
                          _hover={{ bg: "button.secondary.hover" }}
                          key={character.id}
                          leftIcon={<Avatar size="xs" name={character.character.name} src={character.character.image} />}
                          onClick={() => router.push(`/${orgId}/?characterId=${character.character.id}`)}
                      >
                          {character.character.name}
                      </Button>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};
export default MessagesHeader;
