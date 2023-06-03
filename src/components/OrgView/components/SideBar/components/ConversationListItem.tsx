import {
    Avatar,
    AvatarBadge,
    AvatarGroup,
    Box,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Conversation } from "@conversation/types";
import { formatNames } from "@utils/functions";
import { formatRelativeLocale } from "@utils/time";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

interface ConversationListItemProps {
    conversation: Conversation;
    userId: string;
    onClick: () => void;
    isSelected: boolean;
    hasUnread?: boolean;
    onDeleteConversation: (conversationId: string) => void;
    //   onEditConversation?: () => void;
    //   selectedConversationId?: string;
    //   onLeaveConversation?: (conversation: ConversationPopulated) => void;
}

const ConversationListItem: React.FunctionComponent<ConversationListItemProps> = ({
    userId,
    conversation,
    onClick,
    isSelected,
    hasUnread,
    onDeleteConversation,
    //   selectedConversationId,
    //   onEditConversation,
    //   onLeaveConversation,
  }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        if (event.type === "click") {
            onClick();
        } else if (event.type === "contextmenu") {
            event.preventDefault();
            setMenuOpen(true);
        }
    };

    return (
        <Stack
            align="center"
            bg={ isSelected ? "background.700" : "none" }
            borderRadius={4}
            cursor="pointer"
            direction="row"
            _hover={{ bg: "background.800" }}
            justify="space-between"
            p={2}
            position="relative"
            onClick={handleClick}
            onContextMenu={handleClick}
        >
            <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                <MenuList bg="#d2d2d2">
                    <MenuItem
                        icon={<AiOutlineEdit fontSize={20} />}
                        onClick={(event) => {
                        event.stopPropagation();
                        //   onEditConversation();
                        }}
                        bg="#d2d2d2"
                        _hover={{ bg: "whiteAlpha.300" }}
                    >
                        Edit
                    </MenuItem>
                    {conversation.users.length > 2 ? (
                        <MenuItem
                            icon={<BiLogOut fontSize={20} />}
                            onClick={(event) => {
                                event.stopPropagation();
                                // onLeaveConversation(conversation);
                            }}
                        >
                            Leave
                        </MenuItem>
                    ) : (
                        <MenuItem
                            icon={<MdDeleteOutline fontSize={20} />}
                            bg="#d2d2d2"
                            _hover={{ bg: "whiteAlpha.300" }}
                            onClick={(event) => {
                                event.stopPropagation();
                                onDeleteConversation(conversation.id);
                            }}
                        >
                            Delete
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
            <AvatarGroup size="md" max={1}>
                {conversation.characters.map((character, index) => (
                    <Avatar key={character.id} name={character.character.name} src={character.character.image}>
                        {hasUnread && index === 0 && (
                            <AvatarBadge boxSize='1.25em' bg='green.500' />
                        )}
                    </Avatar>
                ))}
            </AvatarGroup>
            <Flex justify="space-between" width="80%" height="100%">
                <Flex direction="column" width="70%" height="100%">
                    <Text
                        fontWeight={600}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {formatNames(conversation.characters, conversation.users, userId)}
                    </Text>
                    {conversation.latestMessage && (
                        <Box width="140%" maxWidth="360px">
                            <Text
                                color="color.700"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {conversation.latestMessage.content}
                            </Text>
                        </Box>
                    )}
                </Flex>
                <Text
                    color="color.400"
                    textAlign="right"
                    position="absolute"
                    right={4}
                >
                    {formatRelative(new Date(conversation.updatedAt), new Date(), {
                        locale: {
                        ...enUS,
                        formatRelative: (token) =>
                            formatRelativeLocale[
                            token as keyof typeof formatRelativeLocale
                            ],
                        },
                    })}
                </Text>
            </Flex>
        </Stack>
    );
};

export default ConversationListItem;
