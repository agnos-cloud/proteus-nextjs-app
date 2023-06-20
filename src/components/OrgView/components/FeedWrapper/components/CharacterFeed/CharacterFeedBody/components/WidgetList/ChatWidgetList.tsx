import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, GridItem, Stack } from "@chakra-ui/react";
import { Character } from "@character/types";
import ChatWidgetOps from "@chat-widget/graphql";
import { ChatWidget, ChatWidgetCreatedSubscriptionPayload, CreateChatWidgetData, CreateChatWidgetVariable, SearchChatWidgetsData, SearchChatWidgetsVariable } from "@chat-widget/types";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import ChatWidgetForm from "./ChatWidgetForm";
import DummyChatWidget from "./DummyChatWidget";

type ChatWidgetToCreate = Pick<ChatWidget, "name" | "description" | "origins" | "primaryColor" | "secondaryColor">;

let chatWidgetToCreate: ChatWidgetToCreate | undefined = undefined;

interface ChatWidgetListProps {
    character: Character;
    orgId: string;
}

const ChatWidgetList: React.FC<ChatWidgetListProps> = ({ character, orgId }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const {
        data: chatWidgetsData,
        loading: chatWidgetsLoading,
        error: chatWidgetsError,
        subscribeToMore: subscribeToMoreChatWidgets
    } =
        useQuery<SearchChatWidgetsData, SearchChatWidgetsVariable>(ChatWidgetOps.Query.chatWidgets, {
        variables: {
            input: {
                characterId: character.id,
            },
        }
    });
    const [ createChatWidget, { data, loading, error }] =
        useMutation<CreateChatWidgetData, CreateChatWidgetVariable>(ChatWidgetOps.Mutation.createChatWidget);

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

    const subscribeToNewChatWidgets = () => {
        subscribeToMoreChatWidgets({
            document: ChatWidgetOps.Subscription.chatWidgetCreated,
            variables: {
                input: {
                    characterId: character.id,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: ChatWidgetCreatedSubscriptionPayload } }) => {
                if (!subscriptionData.data) return prev;
                const newChatWidget = subscriptionData.data.chatWidgetCreated;
                if (prev.chatWidgets.find((k) => k.id === newChatWidget.id)) {
                    return prev;
                }
                return Object.assign({}, prev, {
                    chatWidgets: [newChatWidget, ...prev.chatWidgets]
                });
            }
        });
    };

    useEffect(() => {
        subscribeToNewChatWidgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenChatWidgetModal = () => openModal(newChatWidgetModalArgs);

    const handleCloseModal = () => {
        chatWidgetToCreate = undefined;
        closeModal();
    };

    const handleSubmitKnowledgeFromTextModal = () => {
        if (!chatWidgetToCreate) return;

        createChatWidget({
            variables: {
                input: {
                    name: chatWidgetToCreate.name,
                    characterId: character.id,
                    description: chatWidgetToCreate.description,
                    origins: chatWidgetToCreate.origins,
                    primaryColor: chatWidgetToCreate.primaryColor,
                    secondaryColor: chatWidgetToCreate.secondaryColor,
                }
            },
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const onChange = (chatWidget: ChatWidgetToCreate) => {
        chatWidgetToCreate = chatWidget;
    };

    const newChatWidgetForm = useMemo(
        () => <ChatWidgetForm
                onChange={onChange}
            />,
        []
    );

    const newChatWidgetModalArgs: ModalOptions = useMemo(
        () => ({
            title: "Chat Widget",
            content: newChatWidgetForm,
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
                        onClick={handleOpenChatWidgetModal}
                    >
                        Create a chat widget
                    </Button>
                </Box>

                <Grid
                    gap={2}
                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)", "2xl": "repeat(6, 1fr)" }}
                    overflowY="scroll"
                >
                    {[...(chatWidgetsData?.chatWidgets || [])]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((chatWidget) => (
                            <GridItem key={chatWidget.id} w="auto" h="400">
                                <DummyChatWidget character={character} chatWidget={chatWidget} />
                            </GridItem>
                        ))}
                </Grid>
            </Stack>
        </Stack>
    );
};

export default ChatWidgetList;
