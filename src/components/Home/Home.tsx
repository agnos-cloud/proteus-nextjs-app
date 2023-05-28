import { Box, Button, Center, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { Feature, Footer, Steps } from "./components";

const Home: React.FC = () => {
  return (
    <Flex direction="column" minH="100vh">
        <Center>
            <Stack
                align="center"
                p={8}
                pt={20}
                spacing={0}
            >
                <Image alt="Proteus logo" height="200px" src="/images/logo.png" />
                <Text
                    fontSize={{ base: "7xl", md: "9xl"}}
                    textAlign="center"
                >
                    Proteus AI
                </Text>
                <Text
                    color="color.700"
                    fontSize={{ base: "1xl", md: "2xl"}}
                    pb={10}
                    textAlign="center"
                >
                    Create and train your own <Text as="del" color="color.400" display="inline"><em>dragons</em></Text>{" "}
                    AI assistants using your own data!
                </Text>
                <Button
                    bg="button.primary"
                    _hover={{ bg: "button.primary.hover" }}
                    leftIcon={<Image height="20px" src="/images/googlelogo.png" alt="Google logo" />}
                    onClick={() => signIn("google")}
                >
                    Sign in with Google
                </Button>
            </Stack>
        </Center>
        <Box p={50} bg="background.800">
            <Steps />
        </Box>
        <Box p={50} bg="background.700">
            <Feature
                tag="Endless possibilities 🚀"
            /> {/* talk about different use cases */}
        </Box>
        <Box p={50} bg="background.800">
            empower your customers (ai can respond to their questions, etc and also perform actions on their behalf)
        </Box>
        <Box p={50} bg="background.700">
            testimonials
        </Box>
        <Footer />
    </Flex>
  );
};

export default Home;
