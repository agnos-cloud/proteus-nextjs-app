import { Knowledge, KnowledgeSourceType } from "@/features/knowledge/types";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { formatRelativeLocale } from "@utils/time";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useMemo } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { BsBodyText, BsFiletypePdf } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import RawTextForm from "./RawTextForm";

interface KnowledgeListItemProps {
    knowledge: Knowledge;
}

const KnowledgeListItem: React.FC<KnowledgeListItemProps> = ({ knowledge }) => {
    const { openModal, closeModal } = useApp();

    const handleOpenRawTextModal = () => openModal(rawTextModalArgs);

    const handleCloseModal = () => {
        closeModal();
    };

    const rawTextForm = useMemo(() => <RawTextForm text={knowledge.source} />, [knowledge]);

    const rawTextModalArgs: ModalOptions = useMemo(
        () => ({
            title: "Knowledge Source",
            content: rawTextForm,
            size: "full",
            actions: [
                {
                    text: "Close",
                    onClick: () => {
                        handleCloseModal();
                    },
                },
            ],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const bg = knowledge.sourceType === KnowledgeSourceType.PDF_FILE ?
        "orange.900" :
        knowledge.sourceType === KnowledgeSourceType.TEXT ? "background.800" :
        "green.900";

    return (
        <Stack bg={bg} borderRadius="sm" boxShadow="lg" m="4" p="4">
            <Stack alignItems="center" direction="row" justifyContent="space-between">
                <Stack alignItems="center" direction="row">
                    {
                        knowledge.sourceType === KnowledgeSourceType.PDF_FILE ?
                        <BsFiletypePdf /> :
                        knowledge.sourceType === KnowledgeSourceType.TEXT ?
                        <BsBodyText /> :
                        <FiLink />
                    }
                    <Text fontWeight="semibold">{knowledge.name}</Text>
                </Stack>
                <Text color="color.400" fontSize={14}>
                    {formatRelative(new Date(knowledge.createdAt), new Date(), {
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
                    {knowledge.description}
                </Text>
                <Stack direction={{ base: "column", md: "row" }}>
                    {knowledge.sourceType === KnowledgeSourceType.TEXT ? (
                        <Button
                            bg="button.secondary"
                            _hover={{ bg:"button.secondary.hover" }}
                            size="sm"
                            onClick={handleOpenRawTextModal}
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

export default KnowledgeListItem;
