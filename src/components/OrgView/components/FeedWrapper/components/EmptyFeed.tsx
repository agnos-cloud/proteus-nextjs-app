import { useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { SearchConversationsData, SearchConversationsVariable } from "@conversation/types";
import ConversationsOps from "@conversation/graphql";
import OrgsOps from "@org/graphql";
import { OrgData, OrgVars } from "@org/types";
import { BiMessageSquareDots } from "react-icons/bi";

interface EmptyFeedProps {
    orgId: string;
}

const EmptyFeed: React.FC<EmptyFeedProps> = ({ orgId }) => {
    const { data, loading, error } = useQuery<SearchConversationsData, SearchConversationsVariable>(ConversationsOps.Query.conversations, {
        variables: {
          input: {
            orgId: orgId,
          },
        }
    });
    const {
        data: orgData,
    } = useQuery<OrgData, OrgVars>(OrgsOps.Query.org, {
        variables: {
            id: orgId,
        },
    });

    if (!data?.conversations || loading || error) return null;

    const { conversations } = data;

    const hasConversations = conversations.length;

    const text = hasConversations
        ? "Select a Conversation"
        : `Welcome to ${orgData?.org?.name || "Proteus AI"} 🥳`;

    return (
        <Flex align="center" height="100%" justify="center">
            <Stack align="center" spacing={10}>
                <Stack align="center" spacing={1}>
                    <Text fontSize={50} textAlign="center">{text}</Text>
                    {!hasConversations &&
                        <Text color="color.700" fontSize={20} textAlign="center">
                            Harness the Power of Data! Engage with pre-trained AI characters in Conversations or create your own in the Characters tab.
                        </Text>
                    }
                </Stack>
                <BiMessageSquareDots fontSize={90} />
            </Stack>
        </Flex>
    );
};

export default EmptyFeed;
