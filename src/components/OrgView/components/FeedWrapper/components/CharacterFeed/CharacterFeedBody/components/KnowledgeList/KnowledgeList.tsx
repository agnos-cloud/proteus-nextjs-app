import { useMutation, useQuery } from "@apollo/client";
import { Button, Grid, Stack } from "@chakra-ui/react";
import { Character } from "@character/types";
import { DropDownButton } from "@components";
import { useApp } from "@hooks";
import KnowledgeOps from "@knowledge/graphql";
import {
    CreateKnowledgeFromTextData,
    CreateKnowledgeFromTextVariable,
    KnowledgesData,
    KnowledgesVariable
} from "@knowledge/types";
import { ModalOptions } from "@types";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { BsBodyText, BsFiletypePdf } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import KnowledgeListItem from "./KnowledgeListItem";
import NewKnowledgeFromTextForm from "./NewKnowledgeFromTextForm";

let rawText: string | undefined = undefined;

interface KnowledgeListProps {
    character: Character;
    orgId: string;
    visible?: boolean;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ character, orgId, visible }) => {
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
            display= {visible ? "flex" : "none"}
            p={4}
            spacing={4}
        >
            <Stack spacing={2}>
                <DropDownButton text="Add Knowledge" subtext="Add new source of knowledge">
                    <Grid gap={2}>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<BsBodyText />}
                            onClick={handleOpenKnowledgeFromTextModal}
                        >
                            Raw Text
                        </Button>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<BsFiletypePdf />}
                            onClick={handleOpenKnowledgeFromTextModal}
                        >
                            PDF File
                        </Button>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<FiLink />}
                            onClick={handleOpenKnowledgeFromTextModal}
                        >
                            Web Link
                        </Button>
                    </Grid>
                </DropDownButton>

                {[...(knowledgesData?.knowledges || [])]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((knowledge) => (
                        <KnowledgeListItem
                            key={knowledge.id}
                            knowledge={knowledge}
                        />
                    ))}
            </Stack>
        </Stack>
    );
};

export default KnowledgeList;
