import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Character } from "@character/types";
import { BsChatSquareText, BsSearch } from "react-icons/bs";
import ChatWidgetList from "./ChatWidgetList";

interface WidgetListProps {
    character: Character;
    orgId: string;
}

const WidgetList: React.FC<WidgetListProps> = ({ character, orgId }) =>  {
    return (
        <Stack
            display="flex"
            // flexGrow={1}
            height="full"
            overflow="hidden"
            p={2}
            width="full"
        >
            <Tabs
                colorScheme="tab"
                height="100%"
                // isFitted
                isLazy
            >
                <TabList color="color.400">
                    <Tab>
                        <BsChatSquareText />
                        <Text display={{ base: "none", md: "flex" }}>&nbsp;Chat Widgets</Text>
                    </Tab>
                    <Tab>
                        <BsSearch />
                        <Text display={{ base: "none", md: "flex" }}>&nbsp;Search Pages</Text>
                    </Tab>
                </TabList>

                <TabPanels
                    height="95%"
                >
                    <TabPanel height="100%" p={1}>
                        <ChatWidgetList
                            character={character}
                            orgId={orgId}
                        />
                    </TabPanel>
                    <TabPanel height="100%" p={1}><Text>Hello 2</Text></TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    );
}

export default WidgetList;