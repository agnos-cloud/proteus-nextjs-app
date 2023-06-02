import { Avatar, Button, Divider, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import CharacterListPanel from "./components/CharacterListPanel";
import ConversationListPanel from "./components/ConversationListPanel";
import OrgActionList from "./components/OrgActionList";

interface SideBarProps {
    orgId: string;
    session: Session;
}

const SideBar: React.FC<SideBarProps> = ({ orgId, session }) => {
    const router = useRouter();
    const { query: { characterId, conversationId } } = router;

    return (
        <Stack
            display={{ base: characterId || conversationId ? "none" : "flex", md: "flex" }}
            px={3}
            py={6}
            width={{ base: "100%", md: "400px" }}
        >
            <Stack height="100%" justify="space-between" width="100%">
                <Stack overflow="hidden" flexGrow={1} justify="space-between">
                    <Stack>
                        <OrgActionList org={orgId} session={session} />
                        <Divider orientation="horizontal" />
                    </Stack>
                    <Stack overflow="hidden" flexGrow={1}>
                        <Tabs colorScheme="tab" height="100%" isFitted isLazy>
                            <TabList color="color.400">
                                <Tab>Conversations</Tab>
                                <Tab>Characters</Tab>
                            </TabList>

                            <TabPanels height="92%">
                                <TabPanel height="100%" p={1}>
                                    <ConversationListPanel orgId={orgId} session={session} />
                                </TabPanel>
                                <TabPanel height="100%" p={1}>
                                    <CharacterListPanel orgId={orgId} session={session} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Stack>
                </Stack>
                <Flex gap={1} align="center" justify="space-between">
                    <Flex gap={1} align="center">
                        {session.user.image && <Avatar src={session.user.image} size="sm" />}
                        <Text fontWeight={600}>{session.user.name}</Text>
                    </Flex>
                    <Button size="sm" bg="button.secondary" _hover={{ bg: "button.secondary.hover" }} onClick={() => signOut()}>
                        Log Out
                    </Button>
                </Flex>
            </Stack>
        </Stack>
    );
};

export default SideBar;
