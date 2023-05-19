import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface IOrgsGridViewProps {
}

const OrgsGridView: React.FC<IOrgsGridViewProps> = (props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const onSubmit = async () => {
        try {
            //
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <Center height="100vh">
        <Stack spacing={8} align="center">
            <Text fontSize="3xl">Create an Organization</Text>
            <Input
                placeholder="Organization Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={onSubmit} width="100%">Save</Button>
            <Button onClick={() => signOut()}>Logout</Button>
        </Stack>
    </Center>
  );
};

export default OrgsGridView;
