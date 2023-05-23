import { ModalOptions } from "@types";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@hooks";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import CharactersOps from  "@graphql/character";
import toast from "react-hot-toast";
import { NewCharacterForm } from "@components/character";

interface CreateCharacterData {
    createCharacter: {
        id: string;
        name: string;
        description?: string;
    }
}

interface CharacterInput {
    name: string;
    description?: string;
    org: string;
}

interface CreateCharacterVars {
    input: CharacterInput;
}

interface IConversationListProps {
  org: string;
  session: Session;
}

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

const OrgActionList: React.FC<IConversationListProps> = ({ org }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const [ createCharacter, { data, loading, error }] = useMutation<CreateCharacterData, CreateCharacterVars>(CharactersOps.Mutations.createCharacter);

  useEffect(() => {
    if (data) {
        toast.success("Character created!");
    }
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

  const handleOpenModal = () => openModal(newCharacterModalArgs);

  const handleCloseModal = () => {
      formData = undefined;
      closeModal();
  };

  const handleSubmit = () => {
    if (!formData?.name) return;

    createCharacter({
        variables: {
            input: {
                name: formData.name,
                description: formData.description,
                org,
            }
        },
    }).catch((e) => toast.error(e.message || String(e)));
  };

  const onChange = (form: FormData) => {
      formData = form;
  };

  const newCharacterForm = useMemo(() => <NewCharacterForm onChange={onChange} />, []);

  const newCharacterModalArgs: ModalOptions = useMemo(
    () => ({
      title: "Create Character",
      content: newCharacterForm,
      actions: [
        {
          text: "Cancel",
          onClick: () => {
            handleCloseModal();
          },
        },
        {
          text: "Submit",
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
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>OpenAI API Key</Text>
      </Box>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleOpenModal}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>Create a Character</Text>
      </Box>
    </Stack>
  );
};

export default OrgActionList;
