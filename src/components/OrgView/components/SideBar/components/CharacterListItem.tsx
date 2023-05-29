import { Character } from "@character/types";
import {
    Avatar,
    Box,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Text
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";

const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
};

interface CharacterListItemProps {
    character: Character;
    userId: string;
    onClick: () => void;
    isSelected: boolean;
    onDeleteCharacter: (characterId: string) => void;
    //   onEditConversation?: () => void;
    //   selectedConversationId?: string;
    //   onLeaveConversation?: (conversation: ConversationPopulated) => void;
}

const CharacterListItem: React.FunctionComponent<CharacterListItemProps> = ({
    userId,
    character,
    onClick,
    isSelected,
    onDeleteCharacter,
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
            direction="row"
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
                    <MenuItem
                        icon={<MdDeleteOutline fontSize={20} />}
                        bg="#d2d2d2"
                        _hover={{ bg: "whiteAlpha.300" }}
                        onClick={(event) => {
                            event.stopPropagation();
                            onDeleteCharacter(character.id);
                        }}
                    >
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
            <Avatar />
            <Flex justify="space-between" width="80%" height="100%">
                <Flex direction="column" width="70%" height="100%">
                    <Text
                        fontWeight={600}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {character.name}
                    </Text>
                    <Box width="140%" maxWidth="360px">
                        <Text
                            color="blackAlpha.700"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                        >
                            {formatRelative(new Date(character.updatedAt), new Date(), {
                                locale: {
                                ...enUS,
                                formatRelative: (token) =>
                                    formatRelativeLocale[
                                    token as keyof typeof formatRelativeLocale
                                    ],
                                },
                            })}
                        </Text>
                    </Box>
                </Flex>
                {/* <Text
                    color="blackAlpha.700"
                    textAlign="right"
                    position="absolute"
                    right={4}
                >
                    {formatRelative(new Date(character.updatedAt), new Date(), {
                        locale: {
                        ...enUS,
                        formatRelative: (token) =>
                            formatRelativeLocale[
                            token as keyof typeof formatRelativeLocale
                            ],
                        },
                    })}
                </Text> */}
            </Flex>
        </Stack>
    );
};

export default CharacterListItem;
