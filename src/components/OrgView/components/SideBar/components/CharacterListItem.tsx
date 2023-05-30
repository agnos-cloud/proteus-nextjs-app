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
import { BiBot } from "react-icons/bi";

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
            {character.image ? (
                <Avatar name={character.name} src={character.image} />
            ) : (
                <BiBot size={48} />
            )}
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
                            color="color.700"
                            textOverflow="ellipsis"
                            overflow="hidden"
                            whiteSpace="nowrap"
                        >
                            {character.description}
                        </Text>
                    </Box>
                </Flex>
                <Text
                    color="color.400"
                    position="absolute"
                    right={4}
                    textAlign="right"
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
            </Flex>
        </Stack>
    );
};

export default CharacterListItem;
