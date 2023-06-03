import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

interface NotFoundProps {
    Icon: IconType;
    returnUrl?: string;
    subtext?: string;
    text: string;
}

const NotFound: React.FC<NotFoundProps> = ({ Icon, returnUrl, text, subtext }) => {
    const router = useRouter();

    return (
        <Flex align="center" height="100%" justify="center">
            <Stack align="center" spacing={10}>
                <Stack align="center" spacing={1}>
                    <Text fontSize={50} textAlign="center">{text}</Text>
                    {subtext && <Text color="color.700" fontSize={20} textAlign="center">
                        {subtext}
                    </Text>}
                </Stack>
                <Icon fontSize={90} />
                {returnUrl && (
                    <Button
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                        display={{ base: "flex", md: "none" }}
                        size="sm"
                        onClick={() => router.push(returnUrl)}
                    >
                        Go Back
                    </Button>
                )}
            </Stack>
        </Flex>
    );
};

export default NotFound;
