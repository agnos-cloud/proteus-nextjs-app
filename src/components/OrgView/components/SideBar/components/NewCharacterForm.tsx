import { Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

interface NewCharacterFormProps {
    onChange: (form: FormData) => void;
}

export type FormData = {
    name: string;
    description?: string;
}

const NewCharacterForm: React.FC<NewCharacterFormProps> = (props) => {
    const { onChange } = props;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        onChange({
            name: event.target.value,
            description,
        });
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
        onChange({
            name,
            description: event.target.value,
        });
    };

    return (
        <form>
            <Stack spacing={4}>
                <Input
                    placeholder="Enter character name"
                    value={name}
                    onChange={handleNameChange}
                />
                <Input
                    placeholder="Enter character description"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </Stack>
        </form>
    );
};

export default NewCharacterForm;
