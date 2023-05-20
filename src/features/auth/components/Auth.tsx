import { Button, Center, Image, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

interface IAuthProps {}

const Auth: React.FC<IAuthProps> = (props) => {
  return <Center height="100vh">
    <Stack spacing={8} align="center">
        <Text fontSize="9xl">Proteus AI</Text>
        <Button
            onClick={() => signIn("google")}
            leftIcon={<Image height="20px" src="/images/googlelogo.png" alt="Google logo" />}
        >
            Continue with Google
        </Button>
    </Stack>
  </Center>;
};

export default Auth;
