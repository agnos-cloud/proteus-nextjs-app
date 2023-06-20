import { Input, Stack } from "@chakra-ui/react";
import { ChatWidget } from "@chat-widget/types";
import { useState } from "react";

interface NewChatWidgetFormProps {
    onChange: (chatWidget: Pick<ChatWidget, "name" | "description" | "origins" | "primaryColor" | "secondaryColor" | "tertiaryColor">) => void;
}

const NewChatWidgetForm: React.FC<NewChatWidgetFormProps> = ({ onChange }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [primaryColor, setPrimaryColor] = useState<string>("");
    const [secondaryColor, setSecondaryColor] = useState<string>("");
    const [tertiaryColor, setTertiaryColor] = useState<string>("");
    const [origins, setOrigins] = useState<string>("");

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case "name":
                setName(event.target.value);
                break;
            case "description":
                setDescription(event.target.value);
                break;
            case "primaryColor":
                setPrimaryColor(event.target.value);
                break;
            case "secondaryColor":
                setSecondaryColor(event.target.value);
                break;
            case "tertiaryColor":
                setTertiaryColor(event.target.value);
                break;
            case "origins":
                setOrigins(event.target.value);
                break;
        }
        onChange({
            name: event.target.name === "name" ? event.target.value : name,
            description: event.target.name === "description" ? event.target.value : description,
            origins: event.target.name === "origins" ? event.target.value.split(",").map((origin) => origin.trim()) : origins.split(",").map((origin) => origin.trim()),
            primaryColor: event.target.name === "primaryColor" ? event.target.value : primaryColor,
            secondaryColor: event.target.name === "secondaryColor" ? event.target.value : secondaryColor,
            tertiaryColor: event.target.name === "tertiaryColor" ? event.target.value : tertiaryColor,
        });
    };

    return (
        <form>
            <Stack spacing={4}>
                <Input
                    name="name"
                    placeholder="Enter widget name"
                    value={name}
                    onChange={handleFieldChange}
                />
                <Input
                    name="description"
                    placeholder="Enter character description"
                    value={description}
                    onChange={handleFieldChange}
                />
                <Input
                    name="primaryColor"
                    placeholder="Enter primary color"
                    value={primaryColor}
                    onChange={handleFieldChange}
                />
                <Input
                    name="secondaryColor"
                    placeholder="Enter secondary color"
                    value={secondaryColor}
                    onChange={handleFieldChange}
                />
                <Input
                    name="tertiaryColor"
                    placeholder="Enter tertiary color"
                    value={tertiaryColor}
                    onChange={handleFieldChange}
                />
                <Input
                    name="origins"
                    placeholder="Enter comma-separated URLs"
                    value={origins}
                    onChange={handleFieldChange}
                />
            </Stack>
        </form>
    );
};

export default NewChatWidgetForm;
