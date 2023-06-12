import { useMutation } from "@apollo/client";
import { Box, Button, Stack, Text, Textarea } from "@chakra-ui/react";
import { Character, SaveCharacterInstructionData, SaveCharacterInstructionVariable } from "@character/types";
import CharactersOps from "@character/graphql";
import rules from "@rules";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface InstructionProps {
    character: Character;
    orgId: string;
    visible?: boolean;
}

const Instruction: React.FC<InstructionProps> = ({ character, orgId, visible }) => {
    const [instruction, setInstruction] = useState(character.instruction || "");
    useEffect(() => {
        setInstruction(character.instruction || "");
    }, [character]);
    const [
        saveInstruction,
        { data, loading, error }
    ] = useMutation<SaveCharacterInstructionData, SaveCharacterInstructionVariable>(CharactersOps.Mutation.saveInstruction);
    useEffect(() => {
        if (data?.saveInstruction) {
            toast.success("Instruction saved!");
        }
    }, [data]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let inputValue = e.target.value
        setInstruction(inputValue)
    }

    const handleSave = () => {
        if (!instruction) return;

        saveInstruction({
            variables: {
                input: {
                    id: character.id,
                    orgId,
                    instruction,
                },
            },
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const maxLength = rules.maxInstructionLength(character.plan);

    return (
        <Stack
            display= {visible ? "flex" : "none"}
            p={4}
            spacing={4}
        >
            <Stack spacing={0}>
                <Text mb="8px">Instruction:</Text>
                <Textarea
                    bg="background.700"
                    // bg={
                    //     (maxLength - value.length) === 0 ? "#9B2C2C"
                    //     : (maxLength - value.length) <= 5 ? "#9C4221"
                    //     : (maxLength - value.length) <= 10 ? "#975A16"
                    //     : "background.700"
                    // }
                    // isInvalid={maxLength - value.length <= 10}
                    maxLength={maxLength}
                    placeholder={
                        "You can give your AI character instructions or context here. For instance:\n\n" +
                        "You are a restaurant AI. You can recommend meals to customers based on their budgets.\n" +
                        "Here is the menu:\n" +
                        "1. Chicken: $10\n" +
                        "2. Beef: $12\n" +
                        "3. Pork: $8\n" +
                        "4. Fish: $15\n" +
                        "5. Vegetarian: $10\n" +
                        "6. Vegan: $10\n" +
                        "7. Gluten-free: $10\n" +
                        "8. Dairy-free: $10\n" +
                        "9. Low-carb: $10\n" +
                        "10. Low-fat: $10"
                    }
                    rows={20}
                    value={instruction}
                    onChange={handleInputChange}
                />
            </Stack>
            <Box>
                <Button
                    bg="button.primary"
                    _hover={{ bg: "button.primary.hover" }}
                    isLoading={loading}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Box>
        </Stack>
    );
};

export default Instruction;
