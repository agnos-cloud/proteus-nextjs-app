import { Button, Divider, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import ConversationList from "./ConversationList";
import OrgActionList from "./OrgActionList";
import ConversationsOps from  "@graphql/conversation";
import { useQuery } from "@apollo/client";

interface Conversation {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    characters: Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        character: {
            id: string;
            name: string;
        }
    }>;
    users: Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hasUnread: boolean;
        user: {
            id: string;
            name: string;
        }
    }>;
    // latestMessage: null
}

interface ConversationsData {
  conversations: Array<Conversation>
}

interface ConversationsInput {
  characters?: Array<string>;
  org: string;
}

interface ConversationsVars {
  input: ConversationsInput;
}

interface ISideBarProps {
  org: string;
  session: Session;
}

const SideBar: React.FC<ISideBarProps> = ({ org, session }) => {
  const { data, loading, error } = useQuery<ConversationsData, ConversationsVars>(ConversationsOps.Queries.conversations, {
    variables: {
      input: {
        org,
      },
    }
  });
  return (
    <Stack width={{ base: "100%", md: "400px" }} height="100vh" bg="whiteAlpha.50" py={6} px={3}>
        <Stack width="100%" height="100%" justify="space-between">
          <Stack>
            <OrgActionList org={org} session={session} />
            <Divider orientation="horizontal" />
            <ConversationList org={org} session={session} />
          </Stack>
          <Button onClick={() => signOut()}>Log Out</Button>
        </Stack>
    </Stack>
  );
};

export default SideBar;
