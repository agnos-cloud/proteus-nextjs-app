import { useMutation } from "@apollo/client";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { NewCharacterForm } from "@components/character";
import CharactersOps from "@graphql/character";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import CharacterItem from "./CharacterItem";
import { useRouter } from "next/router";

interface Character {
    id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

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
  characters: Array<Character>;
}

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

const CharacterList: React.FC<CharacterListProps> = ({ characters, org, session }) => {
  const { openModal, closeModal, setModalIsLoading } = useApp();
  const router = useRouter();
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

  const onDeleteCharacter = async (characterId: string) => {
    try {
    //   toast.promise(
    //     deleteConversation({
    //       variables: {
    //         id: characterId,
    //       },
    //       update: () => {
    //         router.push(`/${org}`);
    //       }
    //     }), {
    //       loading: "Deleting conversation...",
    //       success: "Conversation deleted",
    //       error: "Could not delete conversation",
    //     }
    //   );
    } catch (e: any) {
      toast.error(e.message || String(e));
    }
  };

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden" gap={1} width={{ base: "100%", md: "400px" }} flexGrow={1}>
      <Box py={2} px={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={handleCreateCharacter}>
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>Create a Character</Text>
      </Box>
      <Flex direction="column" overflowY="scroll" height="100%">
      {[...characters].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map((character) => (
            <CharacterItem
              key={character.id}
              character={character}
              onClick={() => {}}
              isSelected={router.query.characterId === character.id}
              userId={session.user.id}
              onDeleteCharacter={onDeleteCharacter}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default CharacterList;
