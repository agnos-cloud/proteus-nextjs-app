import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useEffect, useMemo } from "react";
import ConversationForm from "./ConversationForm";
import ConversationsOps from  "@graphql/conversation";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import ConversationItem from "./ConversationItem";

interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  characters: Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      character: {
          id: string;
          name: string;
      }
  }>;
  users: Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasUnread: boolean;
      user: {
          id: string;
          name: string;
      }
  }>;
  latestMessage: {
    content: string;
  }
}

interface IConversationListProps {
  org: string;
  session: Session;
  conversations: Array<Conversation>;
  onViewConversation: (conversationId: string) => void;
}

interface CreateConversationData {
  createConversation: {
      id: string;
  }
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

type SearchedCharacter = {
  id: string;
  name: string;
  description?: string;
};

let participants: SearchedCharacter[] | undefined = undefined;

const ConversationList: React.FC<IConversationListProps> = ({ conversations, org, session, onViewConversation }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const router = useRouter();

  const [ createConversation, { data, loading, error }] =
    useMutation<CreateConversationData, CreateConversationVars>(ConversationsOps.Mutations.createConversation);

  const [ deleteConversation ] =
    useMutation<DeleteConversationData, DeleteConversationVars>(ConversationsOps.Mutations.deleteConversation);

  useEffect(() => {
      if (data) {
          const conversationId = data.createConversation.id;
          router.push(`/${org}/?conversationId=${conversationId}`);
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
                characters: participants?.map((p) => p.id) || [],
                org,
            }
        },
    }).catch((e) => toast.error(e.message || String(e)));
  };

  const onChange = (p: SearchedCharacter[]) => {
      participants = p;
      if (participants.length > 0) {
          setModalIsLoading(false);
      } else {
          setModalIsLoading(true);
      }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const conversationForm = useMemo(() => <ConversationForm org={org} onChange={onChange} />, [org]);

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
            router.push(`/${org}`);
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
    <Flex direction="column" justify="flex-end" overflow="hidden" gap={1} width={{ base: "100%", md: "400px" }} flexGrow={1}>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleOpenModal}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>Create a conversation</Text>
      </Box>
      <Flex direction="column" overflowY="scroll" height="100%">
        {[...conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map((conversation) => {
          const hasUnread = !!conversation.users.find((u) => u.user.id === session.user.id)?.hasUnread;
          return (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() => onViewConversation(conversation.id)}
              isSelected={router.query.conversationId === conversation.id}
              userId={session.user.id}
              hasUnread={hasUnread}
              onDeleteConversation={onDeleteConversation}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default ConversationList;
