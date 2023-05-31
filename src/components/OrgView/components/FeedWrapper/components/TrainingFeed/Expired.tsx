import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Character, Plan } from "@character/types";

interface ExpiredProps {
    character?: Character;
    onChoosePlan: () => void;
}

const Expired: React.FC<ExpiredProps> = ({ character, onChoosePlan }) => {
    const isFreePlan = !character?.plan || character.plan === Plan.FREE;

    const text = isFreePlan
        ? "Your free plan has expired ⌛"
        : "Your existing plan has expired ⌛";

    return (
        <Flex align="center" height="100%" justify="center">
            <Stack align="center" spacing={10}>
                <Stack align="center" spacing={1}>
                    <Text fontSize={50} textAlign="center">{text}</Text>
                    <Text color="color.700" fontSize={20} textAlign="center">
                        Select a suitable plan based on your preferences and requirements.
                    </Text>
                </Stack>
                <Button
                    bg="button.primary"
                    _hover={{ bg: "button.primary.hover" }}
                    // width="100%"
                    onClick={onChoosePlan}
                >
                    Choose plan
                </Button>
            </Stack>
        </Flex>
    );
};

export default Expired;
