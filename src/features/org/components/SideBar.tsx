import { Box, Button, Divider, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import ConversationList from "./ConversationList";
import { useMutation } from "@apollo/client";
import OrgActionList from "./OrgActionList";

interface ISideBarProps {
  org: string;
  session: Session;
}

const SideBar: React.FC<ISideBarProps> = ({ org, session }) => {
  return (
    <Stack width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <OrgActionList org={org} session={session} />
      <Divider orientation="horizontal" />
      <ConversationList org={org} session={session} />
      <Divider orientation="horizontal" />
      <Button onClick={() => signOut()}>Log Out</Button>
    </Stack>
  );
};

export default SideBar;
