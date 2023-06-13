import { useMutation, useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { useApp } from "@hooks";
import OrgsOps from "@org/graphql";
import { OrgData, OrgVars, SaveApiKeyData, SaveApiKeyVars } from "@org/types";
import { ModalOptions } from "@types";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { IoArrowBack, IoSettingsSharp } from "react-icons/io5";
import OrgSettingsForm from "./OrgSettingsForm";

interface OrgActionListProps {
    org: string;
    session: Session;
}

let apiKey: string | undefined = undefined;

const OrgActionList: React.FC<OrgActionListProps> = ({ org }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const router = useRouter();
    const {
        data: orgData,
    } = useQuery<OrgData, OrgVars>(OrgsOps.Query.org, {
        variables: {
            id: org,
        },
    });
    const [
        saveOpenaiAPIKey,
        { data, loading, error }
    ] = useMutation<SaveApiKeyData, SaveApiKeyVars>(OrgsOps.Mutation.saveOpenaiAPIKey);

    useEffect(() => {
        if (data) {
            handleOpenaiApiKeyFormCloseModal();
            toast.success("API key saved!");
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

    const openaiApiKeyForm = useMemo(() => <OrgSettingsForm onChange={onOpenaiApiKeyFormChange} />, []);

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
                isPrimary: true,
                onClick: handleOpenaiApiKeyFormSubmit,
            },
        ],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Stack width="100%" spacing={1}>
            <Flex align="center" py={2} px={4} borderRadius={4} cursor="pointer" justify="space-between">
                <Flex align="center" gap={2}>
                    <IoArrowBack
                        size={20}
                        onClick={() => router.push("/")}
                    />
                    <Text fontWeight={700} size="sm">{orgData?.org.name}</Text>
                </Flex>
                <IoSettingsSharp
                    size={20}
                    onClick={handleOpenaiApiKey}
                />
            </Flex>
        </Stack>
    );
};

export default OrgActionList;
