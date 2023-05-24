import { Skeleton } from "@chakra-ui/react";

interface SkeletonLoaderProps {
    count: number;
    height: string;
    width?: string;
}

const SkeletonLoader: React.FunctionComponent<SkeletonLoaderProps> = ({ count, height, width }) => {
  return (
    <>
        {[...Array(count)].map((_, index) => (
            <Skeleton
                key={index}
                startColor="whiteAlpha.300"
                endColor="blackAlpha.400"
                height={height}
                width={{ base: "full" }}
                borderRadius={4}
            />
        ))}
    </>
  );
};

export default SkeletonLoader;
