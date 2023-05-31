import { useMutation, useQuery } from "@apollo/client";
import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import { SkeletonLoader } from "@components";
import ConversationsOps from "@graphql/conversation";
import { useApp } from "@hooks";
import OrgsOps from "@org/graphql";
import { CreateOrgData, CreateOrgInput, CreateOrgVars, Org, OrgsData } from "@org/types";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import CreateOrgForm from "./components/CreateOrgForm";
import OrgListIem from "./components/OrgListItem";

interface OrgListProps {
    session: Session;
}

interface ConversationInput {
    characters: Array<string>;
    org: string;
}

interface CreateConversationVars {
    input: ConversationInput;
}

interface DeleteConversationData {
    deleteConversation: boolean;
}

interface DeleteConversationVars {
    id: string;
}

let orgInput: CreateOrgInput | undefined = undefined;

const ConversationList: React.FC<OrgListProps> = ({ session }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const router = useRouter();

    const {
        data: orgListData,
        loading: orgListLoading,
        error: orgListError,
        subscribeToMore: subscribeToMoreOrgs
    } = useQuery<OrgsData>(OrgsOps.Query.orgs);

    useEffect(() => {
        if (orgListError) {
            toast.error(orgListError.message);
        }
    }, [orgListError]);

    const [
        createOrg, {
            data: createOrgData,
            loading: createOrgLoading,
        }
    ] = useMutation<CreateOrgData, CreateOrgVars>(OrgsOps.Mutation.createOrg);

    const [ deleteConversation ] =
        useMutation<DeleteConversationData, DeleteConversationVars>(ConversationsOps.Mutations.deleteConversation);

    useEffect(() => {
        if (createOrgData) {
            const orgId = createOrgData.createOrg.id;
            handleCloseModal();
            router.push(`/${orgId}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createOrgData]);

    useEffect(() => {
        setModalIsLoading(createOrgLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createOrgLoading]);

    const subscribeToNewOrgs = () => {
        subscribeToMoreOrgs({
          document: OrgsOps.Subscription.orgCreated,
          updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { orgCreated: Org } } }) => {
            if (!subscriptionData.data) return prev;
            const newOrg = subscriptionData.data.orgCreated;
            // the below is already checked on the server, but just in case
            if (!newOrg.members.some(m => m.userId === session.user.id)) return prev;
            if (prev.orgs.find((o) => o.id === newOrg.id)) {
              return prev;
            }
            return Object.assign({}, prev, {
              orgs: [...prev.orgs, newOrg].sort((a, b) => a.name.localeCompare(b.name)),
            });
          }
        });
    };

    useEffect(() => {
        subscribeToNewOrgs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = () => openModal(createOrgModalArgs);

    const handleCloseModal = () => {
        orgInput = undefined;
        closeModal();
    };

    const handleSubmit = () => {
        if (orgInput) {
            createOrg({
                variables: {
                    input: {
                        name: orgInput.name,
                        description: orgInput.description,
                    }
                },
            }).catch((e) => toast.error(e.message || String(e)));
        }
    };

    const onChange = (o: CreateOrgInput) => {
        orgInput = o;
    };

    const createOrgForm = useMemo(() => <CreateOrgForm onChange={onChange} />, []);

    const createOrgModalArgs: ModalOptions = useMemo(
        () => ({
            title: "New account",
            content: createOrgForm,
            actions: [
                {
                    text: "Cancel",
                    onClick: () => {
                        handleCloseModal();
                    },
                },
                {
                    text: "Create",
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
        <Flex align="center" direction="column" height="100vh" justify="space-between" p={4}>
            <Flex
                direction="column"
                flexGrow={1}
                gap={1}
                justify="flex-end"
                overflow="hidden"
                width={{ base: "100%", md: "500px" }}
            >
                <Button
                    bg="button.primary"
                    _hover={{ bg: "button.primary.hover" }}
                    width="100%"
                    onClick={handleOpenModal}
                >
                    Create new account
                </Button>
                <Flex direction="column" gap={1} height="100%" overflowY="scroll">
                    {orgListLoading ? (
                        <SkeletonLoader count={7} height="80px" width="full" />
                        ) : (
                            [...(orgListData?.orgs || [])]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((org, i) => (
                                <OrgListIem
                                    key={org.id + i.toString()}
                                    org={org}
                                    onClick={() => router.push(`/${org.id}`)}
                                    userId={session.user.id}
                                    // onDeleteConversation={onDeleteConversation}
                                />
                            ))
                        )}
                </Flex>
            </Flex>
            <Flex align="center" gap={1} justify="space-between" width={{ base: "100%", md: "500px" }}>
                <Flex align="center" gap={1}>
                    {session.user.image && <Avatar src={session.user.image} size="sm" />}
                    <Text fontWeight={600}>{session.user.name}</Text>
                </Flex>
                <Button bg="button.secondary" _hover={{ bg: "button.secondary.hover" }} size="sm" onClick={() => signOut()}>
                    Log Out
                </Button>
            </Flex>
        </Flex>
    );
};

export default ConversationList;
