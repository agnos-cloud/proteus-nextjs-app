import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import FeedWrapper from "./FeedWrapper";
import SideBar from "./SideBar";

interface IOrgViewProps {
    org: string;
    session: Session;
}

const OrgView: React.FC<IOrgViewProps> = ({ org, session }) => {
  return (
    <Flex height="100vh">
        <SideBar org={org} session={session} />
        <FeedWrapper session={session} />
    </Flex>
  );
};

export default OrgView;
