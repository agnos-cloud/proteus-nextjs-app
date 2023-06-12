import { useMutation } from "@apollo/client";
import { Button, Flex } from "@chakra-ui/react";
import { Character, CreateCharacterData, CreateCharacterVars } from "@character/types";
import CharactersOps from "@character/graphql";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import CharacterListItem from "./CharacterListItem";
import NewCharacterForm from "./NewCharacterForm";

interface CharacterListProps {
    orgId: string;
    session: Session;
    characters: Array<Character>;
    onViewCharacter: (characterId: string) => void;
}

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

const CharacterList: React.FC<CharacterListProps> = ({ characters, orgId, session, onViewCharacter }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const router = useRouter();
    const [ createCharacter, { data, loading, error }] =
        useMutation<CreateCharacterData, CreateCharacterVars>(CharactersOps.Mutation.createCharacter);

    useEffect(() => {
        if (data) {
            const characterId = data.createCharacter.id;
            router.push(`/${orgId}/?characterId=${characterId}`);
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
                    orgId,
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
                    isPrimary: true,
                    onClick: handleSubmit,
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
                width="100%"
                onClick={handleOpenModal}
            >
                Create a character
            </Button>
            <Flex direction="column" overflowY="scroll" height="100%">
                {[...characters].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((character) => (
                        <CharacterListItem
                            key={character.id}
                            character={character}
                            onClick={() => onViewCharacter(character.id)}
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
