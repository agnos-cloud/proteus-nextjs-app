import { Input, Stack, Textarea } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import rules from "@rules";
import { Character } from "@character/types";

interface NewKnowledgeFromTextFormProps {
    character: Character;
    onChange: (text: string) => void;
}

const NewKnowledgeFromTextForm: React.FC<NewKnowledgeFromTextFormProps> = (props) => {
    const { character, onChange } = props;
    const [text, setText] = useState<string>("");

    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
        onChange(event.target.value);
    };

    const maxLength = rules.maxKnowledgeTextLength(character.plan);

    return (
        <form>
            <Stack spacing={4}>
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
                        "You can give your AI character knowledge or context here. For instance, " +
                        "you can paste your company or product info here so that your AI character " +
                        "can answer questions about it."
                    }
                    rows={20}
                    value={text}
                    onChange={handleTextChange}
                />
            </Stack>
        </form>
    );
};

export default NewKnowledgeFromTextForm;
