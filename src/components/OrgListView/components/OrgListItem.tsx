import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Org, Role } from "@org/types";
import { useState } from "react";
import { CgOrganisation } from "react-icons/cg";
import { RiMapPinUserFill, RiShieldUserFill, RiUser3Fill } from "react-icons/ri";

interface OrgListIemProps {
    org: Org;
    userId: string;
    onClick: () => void;
}

const OrgListIem: React.FunctionComponent<OrgListIemProps> = ({ org, userId, onClick }) => {
    const role = org.members.find((member) => member.userId === userId)?.role;
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
            _hover={{ bg: "background.800" }}
            onClick={handleClick}
            onContextMenu={handleClick}
            position="relative"
        >
            <CgOrganisation size={32} />
            <Flex justify="space-between" width="80%" height="100%">
                <Flex direction="column" width="70%" height="100%">
                    <Text
                        color="color.900"
                        fontWeight={600}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {org.name}
                    </Text>
                    {org.description && (
                        <Box width="140%" maxWidth="360px">
                            <Text
                                color="color.700"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {org.description}
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
                    {
                        role === Role.GUEST ? <RiUser3Fill size={24} /> :
                        role === Role.MEMBER ? <RiMapPinUserFill size={24} /> :
                        <RiShieldUserFill size={24} />
                    }
                </Text>
            </Flex>
        </Stack>
    );
};

export default OrgListIem;
