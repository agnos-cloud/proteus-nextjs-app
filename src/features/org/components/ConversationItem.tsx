import {
    Avatar,
    Box,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Text,
} from "@chakra-ui/react";
import { formatNames } from "@utils/functions";
import { formatRelativeLocale } from "@utils/time";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";

interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  characters: Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      character: {
          id: string;
          name: string;
      }
  }>;
  users: Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasUnread: boolean;
      user: {
          id: string;
          name: string;
      }
  }>;
  latestMessage: {
    content: string;
  }
}

interface ConversationItemProps {
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

const ConversationItem: React.FunctionComponent<ConversationItemProps> = ({
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
            direction="row"
            align="center"
            justify="space-between"
            p={2}
            cursor="pointer"
            borderRadius={4}
            bg={ isSelected ? "blackAlpha.200" : "none" }
            _hover={{ bg: "blackAlpha.200" }}
            onClick={handleClick}
            onContextMenu={handleClick}
            position="relative"
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
            <Flex position="absolute" left="-6px">
                {hasUnread && (
                    <GoPrimitiveDot fontSize={18} color="#6B46C1" />
                )}
            </Flex>
            <Avatar />
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
                                color="blackAlpha.700"
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
                    color="blackAlpha.700"
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

export default ConversationItem;
