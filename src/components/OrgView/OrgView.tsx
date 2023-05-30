import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import FeedWrapper from "./components/FeedWrapper";
import SideBar from "./components/SideBar";

interface OrgViewProps {
    org: string;
    session: Session;
}

const OrgView: React.FC<OrgViewProps> = ({ org, session }) => {
  return (
    <Flex height="100vh">
        <SideBar org={org} session={session} />
        <FeedWrapper org={org} session={session} />
    </Flex>
  );
};

export default OrgView;
