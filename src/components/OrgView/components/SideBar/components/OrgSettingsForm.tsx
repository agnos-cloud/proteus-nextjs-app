import { Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

interface OrgSettingsFormProps {
    onChange: (key: string) => void;
}

const OrgSettingsForm: React.FC<OrgSettingsFormProps> = (props) => {
    const { onChange } = props;
    const [key, setKey] = useState<string>("");

    const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKey(event.target.value);
        onChange(event.target.value);
    };

    return (
        <form>
            <Stack spacing={4}>
                <Input
                    placeholder="Enter OpenAI API key"
                    value={key}
                    onChange={handleKeyChange}
                />
            </Stack>
        </form>
    );
};

export default OrgSettingsForm;
