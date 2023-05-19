import { Box } from "@chakra-ui/react";
import { Auth } from "@components/auth";
import { OrgsGridView } from "@components/org";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";

const Home: NextPage = () => {
    const { data: session } = useSession();
    return (
        <Box>
            {session?.user ? <OrgsGridView /> : <Auth />}
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

export default Home;
