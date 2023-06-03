import { Flex, Stack, Text } from "@chakra-ui/react";
import { Character } from "@character/types";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ParticipantsProps {
    participants: Array<Character>;
    removeParticipant: (characterId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
    return (
        <Flex mt={8} gap="10px" flexWrap="wrap">
            {participants.map((participant) => (
                <Stack
                    key={participant.id}
                    align="center"
                    bg="button.secondary"
                    borderRadius={4}
                    direction="row"
                    _hover={{ bg: "button.secondary.hover" }}
                    p={2}
                >
                    <Text>{participant.name}</Text>
                    <IoIosCloseCircleOutline
                        cursor="pointer"
                        size={20}
                        onClick={() => removeParticipant(participant.id)}
                    />
                </Stack>
            ))}
        </Flex>
    );
};

export default Participants;
