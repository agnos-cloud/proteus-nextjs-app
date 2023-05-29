import { CreateOrgInput } from "@org/types";
import { Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

interface CreateOrgFormProps {
    onChange: (data: CreateOrgInput) => void;
}

const CreateOrgForm: React.FC<CreateOrgFormProps> = ({ onChange }) => {
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
                    placeholder="Enter account name"
                    value={name}
                    onChange={handleNameChange}
                />
                <Input
                    placeholder="Enter account description"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </Stack>
        </form>
    );
};

export default CreateOrgForm;
