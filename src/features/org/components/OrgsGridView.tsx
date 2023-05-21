import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import OrgsOps from  "@graphql/org";
import { toast } from "react-hot-toast";

interface IOrgsGridViewProps {
}

interface CreateOrgData {
    createOrg: {
        id: string;
        name: string;
        description?: string;
    }
}

interface OrgInput {
    name: string;
    description?: string;
}

interface CreateOrgVars {
    input: OrgInput;
}

const OrgsGridView: React.FC<IOrgsGridViewProps> = (props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [ createOrg, { data, loading, error }] = useMutation<CreateOrgData, CreateOrgVars>(OrgsOps.Mutations.createOrg);

    useEffect(() => {
        if (data) {
            toast.success("Organization created!");
        }
    }, [data]);
    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const onSubmit = async () => {
        if (!name) return;

        await createOrg({
            variables: {
                input: {
                    name,
                    description,
                }
            },
        }).catch((e) => toast.error(e.message || String(e)));
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
            <Button onClick={onSubmit} isLoading={loading} width="100%">Save</Button>
            <Button onClick={() => signOut()}>Logout</Button>
        </Stack>
    </Center>
  );
};

export default OrgsGridView;
