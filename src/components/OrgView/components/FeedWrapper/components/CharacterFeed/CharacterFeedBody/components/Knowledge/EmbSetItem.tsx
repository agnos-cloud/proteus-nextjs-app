import { Button, Stack, Text } from "@chakra-ui/react";
import { EmbSet, EmbSource } from "@embset/types";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { BiLinkExternal } from "react-icons/bi";
import { BsBodyText, BsFiletypePdf } from "react-icons/bs";
import { FiLink } from "react-icons/fi";

const formatRelativeLocale = {
    lastWeek: "eeee 'at' p",
    yesterday: "'Yesterday at' p",
    today: "p",
    other: "MM/dd/yy",
};

interface EmbSetItemProps {
    embset: EmbSet;
}

const EmbSetItem: React.FC<EmbSetItemProps> = ({ embset }) => {
    const bg = embset.source === EmbSource.PDF_FILE ?
        "orange.900" :
        embset.source === EmbSource.TEXT ? "background.800" :
        "green.900";

    return (
        <Stack bg={bg} borderRadius="sm" boxShadow="lg" m="4" p="4">
            <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Stack alignItems="center" direction="row">
                    {
                        embset.source === EmbSource.PDF_FILE ?
                        <BsFiletypePdf /> :
                        embset.source === EmbSource.TEXT ?
                        <BsBodyText /> :
                        <FiLink />
                    }
                    <Text fontWeight="semibold">{embset.title}</Text>
                </Stack>
                <Text color="color.400" fontSize={14}>
                    {formatRelative(new Date(embset.createdAt), new Date(), {
                        locale: {
                            ...enUS,
                            formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                        },
                    })}
                </Text>
            </Stack>

            <Stack
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
            >
                <Text fontSize={{ base: "sm" }} maxW="4xl" textAlign="left">
                    {embset.description}
                </Text>
                <Stack direction={{ base: "column", md: "row" }}>
                    {embset.source === EmbSource.TEXT ? (
                        <Button
                            bg="button.secondary"
                            _hover={{ bg:"button.secondary.hover" }}
                            size="sm"
                        >
                            View Source
                        </Button>
                    ) : (
                        <Button
                            as="a"
                            bg={bg}
                            color="blue.400"
                            cursor="pointer"
                            _hover={{ color: "blue.300", textDecoration: "underline" }}
                            rightIcon={<BiLinkExternal />}
                            size="sm"
                        >
                            View Source
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default EmbSetItem;
