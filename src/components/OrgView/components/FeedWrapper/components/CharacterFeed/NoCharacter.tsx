import { Flex, Stack, Text } from "@chakra-ui/react";
import { VscSearchStop } from "react-icons/vsc";

interface NoCharacterProps {}

const NoCharacter: React.FC<NoCharacterProps> = ({}) => {
    const text = "Cannot find this character 😓";

    return (
        <Flex align="center" height="100%" justify="center">
            <Stack align="center" spacing={10}>
                <Stack align="center" spacing={1}>
                    <Text fontSize={50} textAlign="center">{text}</Text>
                    <Text color="color.700" fontSize={20} textAlign="center">
                        The character may have been deleted or the character ID may be wrong.
                    </Text>
                </Stack>
                <VscSearchStop fontSize={90} />
            </Stack>
        </Flex>
    );
};

export default NoCharacter;
