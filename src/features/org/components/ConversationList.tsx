import { Box, Stack, Text } from "@chakra-ui/react";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useEffect, useMemo } from "react";
import ConversationForm from "./ConversationForm";
import ConversationsOps from  "@graphql/conversation";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface IConversationListProps {
  org: string;
  session: Session;
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

type SearchedCharacter = {
  id: string;
  name: string;
  description?: string;
};

let participants: SearchedCharacter[] | undefined = undefined;

const ConversationList: React.FC<IConversationListProps> = ({ org }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const router = useRouter();

  const [ createConversation, { data, loading, error }] = useMutation<CreateConversationData, CreateConversationVars>(ConversationsOps.Mutations.createConversation);

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

  return (
    <Stack width="100%" spacing={1}>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleOpenModal}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>Find or start a conversation</Text>
      </Box>
    </Stack>
  );
};

export default ConversationList;
