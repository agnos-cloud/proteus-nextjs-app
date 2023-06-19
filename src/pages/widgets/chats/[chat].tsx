import { Text } from "@chakra-ui/react";
import { Home, OrgView } from "@components";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Chat: NextPage = () => {
    /*
    * Query the org details:
    *   Use ".Query.org" from "@org/graphql" (see: src/components/OrgView/components/SideBar/components/OrgActionList.tsx)
    * Query the chat widget details
    */
    const { data: session } = useSession();
    const location = useRouter();

    const { chat, orgId } = location.query;
    console.log(chat);
    return (
        <Text>
            You are viewing chat: {chat} with queries: {orgId}
        </Text>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}

export default Chat;
