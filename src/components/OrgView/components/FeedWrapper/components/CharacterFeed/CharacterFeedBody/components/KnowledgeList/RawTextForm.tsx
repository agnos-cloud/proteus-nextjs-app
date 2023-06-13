import { Stack, Textarea } from "@chakra-ui/react";

interface RawTextFormProps {
    text: string;
}

const RawTextForm: React.FC<RawTextFormProps> = ({ text }) => {

    return (
        <form>
            <Stack spacing={4}>
                <Textarea
                    bg="background.700"
                    rows={20}
                    value={text}
                    readOnly
                />
            </Stack>
        </form>
    );
};

export default RawTextForm;
