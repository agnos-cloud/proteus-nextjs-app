import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
    const { data: session } = useSession();
    if (session) {
        return (
          <>
            Signed in as {session.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )
    }
    return <div><button onClick={() => signIn("google")}>Sign In</button></div>;
};

export default Home;
