import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import FeedWrapper from "./components/FeedWrapper";
import SideBar from "./components/SideBar";

interface OrgViewProps {
    orgId: string;
    session: Session;
}

const OrgView: React.FC<OrgViewProps> = ({ orgId, session }) => {
  return (
    <Flex height="100vh">
        <SideBar orgId={orgId} session={session} />
        <FeedWrapper orgId={orgId} session={session} />
    </Flex>
  );
};

export default OrgView;
