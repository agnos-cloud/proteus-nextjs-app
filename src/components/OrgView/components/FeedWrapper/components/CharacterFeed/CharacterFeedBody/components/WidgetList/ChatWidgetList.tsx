import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, GridItem, Stack } from "@chakra-ui/react";
import { Character } from "@character/types";
import { DropDownButton } from "@components";
import { useApp } from "@hooks";
import KnowledgeOps from "@knowledge/graphql";
import {
    CreateKnowledgeFromTextData,
    CreateKnowledgeFromTextVariable,
    KnowledgeCreatedSubscriptionPayload,
    KnowledgesData,
    KnowledgesVariable
} from "@knowledge/types";
import { ModalOptions } from "@types";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { BsBodyText, BsFiletypePdf } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import KnowledgeListItem from "../KnowledgeList/KnowledgeListItem";
import NewKnowledgeFromTextForm from "../KnowledgeList/NewKnowledgeFromTextForm";

let rawText: string | undefined = undefined;

interface ChatWidgetListProps {
    character: Character;
    orgId: string;
}

const ChatWidgetList: React.FC<ChatWidgetListProps> = ({ character, orgId }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const {
        data: knowledgesData,
        loading: knowledgesLoading,
        error: knowledgesError,
        subscribeToMore: subscribeToMoreKnowledges
    } =
        useQuery<KnowledgesData, KnowledgesVariable>(KnowledgeOps.Query.knowledges, {
        variables: {
            input: {
                characterId: character.id,
            },
        }
    });
    const [ createKnowledgeFromText, { data, loading, error }] =
        useMutation<CreateKnowledgeFromTextData, CreateKnowledgeFromTextVariable>(KnowledgeOps.Mutation.createKnowledgeFromText);

    useEffect(() => {
        if (data) {
            handleCloseModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    useEffect(() => {
        setModalIsLoading(loading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const subscribeToNewKnowledges = () => {
        subscribeToMoreKnowledges({
            document: KnowledgeOps.Subscription.knowledgeCreated,
            variables: {
                input: {
                    characterId: character.id,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: KnowledgeCreatedSubscriptionPayload } }) => {
                if (!subscriptionData.data) return prev;
                const newKnowledge = subscriptionData.data.knowledgeCreated;
                if (prev.knowledges.find((k) => k.id === newKnowledge.id)) {
                    return prev;
                }
                return Object.assign({}, prev, {
                    knowledges: [newKnowledge, ...prev.knowledges]
                });
            }
        });
    };

    useEffect(() => {
        subscribeToNewKnowledges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenKnowledgeFromTextModal = () => openModal(newKnowledgeFromTextModalArgs);

    const handleCloseModal = () => {
        rawText = undefined;
        closeModal();
    };

    const handleSubmitKnowledgeFromTextModal = () => {
        if (!rawText) return;

        createKnowledgeFromText({
            variables: {
                input: {
                    characterId: character.id,
                    content: rawText,
                }
            },
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const onChangeKnowledgeFromTextModal = (text: string) => {
        rawText = text;
    };

    const newKnowledgeFromTextForm = useMemo(
        () => <NewKnowledgeFromTextForm
                character={character}
                onChange={onChangeKnowledgeFromTextModal}
            />,
        [character]
    );

    const newKnowledgeFromTextModalArgs: ModalOptions = useMemo(
        () => ({
            title: "Create Knowledge from Text",
            content: newKnowledgeFromTextForm,
            size: "full",
            actions: [
                {
                    text: "Cancel",
                    onClick: () => {
                        handleCloseModal();
                    },
                },
                {
                    text: "Submit",
                    isPrimary: true,
                    onClick: handleSubmitKnowledgeFromTextModal,
                },
            ],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Stack
            height="100%"
            spacing={4}
        >
            <Stack spacing={1} height="100%">
                <Box>
                    <Button
                        bg="button.primary"
                        _hover={{ bg: "button.primary.hover" }}
                        size="md"
                        onClick={handleOpenKnowledgeFromTextModal}
                    >
                        Create a chat widget
                    </Button>
                </Box>

                <Grid
                    gap={2}
                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    overflowY="scroll"
                >
                    <GridItem w="auto" h="400" bg='blue.500' />
                    <GridItem w="auto" h="400" bg='blue.500' />
                    <GridItem w="auto" h="400" bg='blue.500' />
                    <GridItem w="auto" h="400" bg='blue.500' />
                    <GridItem w="auto" h="400" bg='blue.500' />
                </Grid>
            </Stack>
        </Stack>
    );
};

export default ChatWidgetList;
