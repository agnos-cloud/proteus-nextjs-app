import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import CharactersOps from "@graphql/character";
import { CharacterData, CharacterVars, Plan } from "@character/types";
import { differenceInDays } from "date-fns";
import { SkeletonLoader } from "@components";
import Expired from "./Expired";
import { useApp } from "@hooks";
import { useMemo } from "react";
import PricingForm from "./PricingForm";
import { ModalOptions } from "@types";
import NoCharacter from "./NoCharacter";
import CharacterWrapper from "./CharacterWrapper";

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

interface TrainingFeedProps {
    characterId: string;
    orgId: string;
    session: Session;
}

const TrainingFeed: React.FC<TrainingFeedProps> = ({ characterId, orgId, session }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const {
        data: characterData,
        loading: characterLoading,
    } = useQuery<CharacterData, CharacterVars>(CharactersOps.Query.character, {
        variables: {
            id: characterId,
        },
    });

    const handleOpenModal = () => openModal(pricingModalArgs);

    const handleCloseModal = () => {
        formData = undefined;
        closeModal();
    };

    const handleSubmit = () => {
        // if (!formData?.name) return;

        // createCharacter({
        //     variables: {
        //         input: {
        //             name: formData.name,
        //             description: formData.description,
        //             orgId,
        //         }
        //     },
        // }).catch((e) => toast.error(e.message || String(e)));
    };

    const onChange = (form: FormData) => {
        formData = form;
    };

    const pricingForm = useMemo(() => <PricingForm onChange={onChange} />, []);

    const pricingModalArgs: ModalOptions = useMemo(
        () => ({
            title: "Choose Plan",
            content: pricingForm,
            size: "full",
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

    const isFreePlan = !characterData?.character.plan || characterData?.character.plan === Plan.FREE;
    const isExpired = characterData?.character.planExpiresAt
        ? new Date(characterData?.character.planExpiresAt).getTime() < new Date().getTime()
        : isFreePlan && characterData?.character.createdAt
        ? differenceInDays(new Date(), new Date(characterData?.character.createdAt)) > 14
        : true;

    return characterLoading ? (
        <Flex align="center" direction="column" gap={1} height="100%">
            <SkeletonLoader count={4} height="80px" width="100%" />
        </Flex>
    ) : !characterData?.character ? (
        <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
        >
            <NoCharacter />
        </Flex>
    ) : isExpired ? (
        <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
        >
            <Expired character={characterData?.character} onChoosePlan={handleOpenModal} />
        </Flex>
    ) : (
        <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
        >
            <CharacterWrapper
                character={characterData?.character}
                orgId={orgId}
            />
        </Flex>
    );
};

export default TrainingFeed;
