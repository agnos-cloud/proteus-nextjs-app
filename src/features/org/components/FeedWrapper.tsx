import { Session } from "next-auth";

interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = (props) => {
  return <div>Hello</div>;
};

export default FeedWrapper;
