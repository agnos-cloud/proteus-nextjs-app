import { useMutation } from "@apollo/client";
import { Box, Stack, Text } from "@chakra-ui/react";
import OrgsOps from "@org/graphql";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import OpenaiApiKeyForm from "./OpenaiApiKeyForm";

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
  const [ saveOpenaiAPIKey, { data, loading, error } ] = useMutation<SaveApiKeyData, SaveApiKeyVars>(OrgsOps.Mutations.saveOpenaiAPIKey);

  useEffect(() => {
    if (data) {
        toast.success("API key saved!");
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

  const handleOpenaiApiKeyFormCloseModal = () => {
    apiKey = undefined;
    closeModal();
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

  const onOpenaiApiKeyFormChange = (key: string) => {
      apiKey = key;
  };

  const openaiApiKeyForm = useMemo(() => <OpenaiApiKeyForm onChange={onOpenaiApiKeyFormChange} />, []);

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
    </Stack>
  );
};

export default OrgActionList;
