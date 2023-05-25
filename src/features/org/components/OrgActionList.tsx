import { ModalOptions } from "@types";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@hooks";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import CharactersOps from  "@graphql/character";
import OrgsOps from  "@graphql/org";
import toast from "react-hot-toast";
import { NewCharacterForm } from "@components/character";
import OpenaiApiKeyForm from "./OpenaiApiKeyForm";

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

interface SaveApiKeyData {
  saveOpenaiAPIKey: boolean;
}

interface SaveApiKeyVars {
  id: string;
  key: string;
}

interface IConversationListProps {
  org: string;
  session: Session;
}

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;
let apiKey: string | undefined = undefined;

const OrgActionList: React.FC<IConversationListProps> = ({ org }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const [ createCharacter, { data, loading, error }] = useMutation<CreateCharacterData, CreateCharacterVars>(CharactersOps.Mutations.createCharacter);
  const [ saveOpenaiAPIKey ] = useMutation<SaveApiKeyData, SaveApiKeyVars>(OrgsOps.Mutations.saveOpenaiAPIKey);

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

  const handleOpenaiApiKey = () => openModal(openaiApiKeyModalArgs);

  const handleCreateCharacter = () => openModal(newCharacterModalArgs);

  const handleCharacterFormCloseModal = () => {
      formData = undefined;
      closeModal();
  };
  const handleOpenaiApiKeyFormCloseModal = () => {
    apiKey = undefined;
    closeModal();
};

  const handleCharacterFormSubmit = () => {
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
  const handleOpenaiApiKeyFormSubmit = () => {
    if (!apiKey) return;

    saveOpenaiAPIKey({
        variables: {
            id: org,
            key: apiKey,
        },
    }).catch((e) => toast.error(e.message || String(e)));
  };

  const onCharacterFormChange = (form: FormData) => {
      formData = form;
  };
  const onOpenaiApiKeyFormChange = (key: string) => {
    apiKey = key;
};

  const newCharacterForm = useMemo(() => <NewCharacterForm onChange={onCharacterFormChange} />, []);
  const openaiApiKeyForm = useMemo(() => <OpenaiApiKeyForm onChange={onOpenaiApiKeyFormChange} />, []);

  const newCharacterModalArgs: ModalOptions = useMemo(
    () => ({
      title: "Create Character",
      content: newCharacterForm,
      actions: [
        {
          text: "Cancel",
          onClick: () => {
            handleCharacterFormCloseModal();
          },
        },
        {
          text: "Submit",
          onClick: handleCharacterFormSubmit,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const openaiApiKeyModalArgs: ModalOptions = useMemo(
    () => ({
      title: "OpenAI API Key",
      content: openaiApiKeyForm,
      actions: [
        {
          text: "Cancel",
          onClick: () => {
            handleOpenaiApiKeyFormCloseModal();
          },
        },
        {
          text: "Submit",
          onClick: handleOpenaiApiKeyFormSubmit,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Stack width="100%" spacing={1}>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleOpenaiApiKey}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>OpenAI API Key</Text>
      </Box>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleCreateCharacter}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>Create a Character</Text>
      </Box>
    </Stack>
  );
};

export default OrgActionList;
