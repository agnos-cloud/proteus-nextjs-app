import { useMutation } from "@apollo/client";
import { Button, Flex } from "@chakra-ui/react";
import { Character } from "@character/types";
import { Conversation, CreateConversationData, CreateConversationVars, DeleteConversationData, DeleteConversationVars } from "@conversation/types";
import ConversationsOps from "@conversation/graphql";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import ConversationForm from "./ConversationForm";
import ConversationListItem from "./ConversationListItem";

interface ConversationListProps {
    orgId: string;
    session: Session;
    conversations: Array<Conversation>;
    onViewConversation: (conversationId: string) => void;
}

let participants: Character[] | undefined = undefined;

const ConversationList: React.FC<ConversationListProps> = ({ conversations, orgId, session, onViewConversation }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const router = useRouter();

    const [ createConversation, { data, loading, error }] =
        useMutation<CreateConversationData, CreateConversationVars>(ConversationsOps.Mutation.createConversation);

    const [ deleteConversation ] =
        useMutation<DeleteConversationData, DeleteConversationVars>(ConversationsOps.Mutation.deleteConversation);

    useEffect(() => {
        if (data) {
            const conversationId = data.createConversation.id;
            router.push(`/${orgId}/?conversationId=${conversationId}`);
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

    const handleOpenModal = () => openModal(conversationsModalArgs);

    const handleCloseModal = () => {
        participants = undefined;
        closeModal();
    };

    const handleSubmit = () => {
        createConversation({
            variables: {
                input: {
                    characterIds: participants?.map((p) => p.id) || [],
                    orgId,
                }
            },
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const onChange = (p: Character[]) => {
        participants = p;
        if (participants.length > 0) {
            setModalIsLoading(false);
        } else {
            setModalIsLoading(true);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const conversationForm = useMemo(() => <ConversationForm orgId={orgId} onChange={onChange} />, [orgId]);

    const conversationsModalArgs: ModalOptions = useMemo(
        () => ({
            title: "Conversations",
            content: conversationForm,
            loading: true,
            actions: [
                {
                    text: "Cancel",
                    onClick: () => {
                        handleCloseModal();
                    },
                },
                {
                    text: "Create Conversation",
                    isPrimary: true,
                    onClick: handleSubmit,
                },
            ],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const onDeleteConversation = async (conversationId: string) => {
        try {
        toast.promise(
            deleteConversation({
                variables: {
                    id: conversationId,
                },
                update: () => {
                    router.push(`/${orgId}`);
                }
            }), {
                loading: "Deleting conversation...",
                success: "Conversation deleted",
                error: "Could not delete conversation",
            }
        );
        } catch (e: any) {
            toast.error(e.message || String(e));
        }
    };

    return (
        <Flex
            direction="column"
            flexGrow={1}
            gap={1}
            justify="flex-end"
            overflow="hidden"
            width={{ base: "100%", md: "350px" }}
        >
            <Button
                bg="button.primary"
                _hover={{ bg: "button.primary.hover" }}
                onClick={handleOpenModal}
            >
                Create a conversation
            </Button>
            <Flex direction="column" height="100%" overflowY="scroll">
                {[...conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((conversation) => {
                        const hasUnread = !!conversation.users.find((u) => u.user.id === session.user.id)?.hasUnread;
                        return (
                            <ConversationListItem
                                key={conversation.id}
                                conversation={conversation}
                                onClick={() => onViewConversation(conversation.id)}
                                isSelected={router.query.conversationId === conversation.id}
                                userId={session.user.id}
                                hasUnread={hasUnread}
                                onDeleteConversation={onDeleteConversation}
                            />
                        );
                    }
                )}
            </Flex>
        </Flex>
    );
};

export default ConversationList;
