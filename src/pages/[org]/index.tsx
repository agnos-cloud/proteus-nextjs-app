import { Box } from "@chakra-ui/react";
import { Auth } from "@components/auth";
import { OrgView } from "@components/org";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Org: NextPage = () => {
    const { data: session } = useSession();
    const location = useRouter();

    const { org } = location.query;
    return (
        <Box>
            {session?.user ? <OrgView org={org as string} session={session} /> : <Auth />}
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

export default Org;
