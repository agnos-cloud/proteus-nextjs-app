import { Box } from "@chakra-ui/react";
import { Home, OrgListView } from "@components";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";

const Index: NextPage = () => {
    const { data: session } = useSession();
    return (
        <Box>
            {session?.user ? <OrgListView session={session} /> : <Home />}
        </Box>
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

export default Index;
