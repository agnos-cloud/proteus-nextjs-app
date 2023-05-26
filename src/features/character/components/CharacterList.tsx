import { useMutation } from "@apollo/client";
import { Box, Stack, Text } from "@chakra-ui/react";
import { NewCharacterForm } from "@components/character";
import CharactersOps from "@graphql/character";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

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

interface CharacterListProps {
  org: string;
  session: Session;
}

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

const CharacterList: React.FC<CharacterListProps> = ({ org }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const [ createCharacter, { data, loading, error }] =
    useMutation<CreateCharacterData, CreateCharacterVars>(CharactersOps.Mutations.createCharacter);

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

  const handleCreateCharacter = () => openModal(newCharacterModalArgs);

  const handleCharacterFormCloseModal = () => {
      formData = undefined;
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

  const onCharacterFormChange = (form: FormData) => {
      formData = form;
  };

  const newCharacterForm = useMemo(() => <NewCharacterForm onChange={onCharacterFormChange} />, []);

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

  return (
    <Stack width="100%" spacing={1}>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleCreateCharacter}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>Create a Character</Text>
      </Box>
    </Stack>
  );
};

export default CharacterList;
