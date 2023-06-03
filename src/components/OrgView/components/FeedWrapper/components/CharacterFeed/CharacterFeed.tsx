import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import { CharacterData, CharacterVars, Plan } from "@character/types";
import { NotFound, SkeletonLoader } from "@components";
import CharactersOps from "@graphql/character";
import { useApp } from "@hooks";
import { ModalOptions } from "@types";
import { differenceInDays } from "date-fns";
import { Session } from "next-auth";
import { useMemo } from "react";
import { VscSearchStop } from "react-icons/vsc";
import CharacterFeedBody from "./CharacterFeedBody";
import CharacterFeedHeader from "./CharacterFeedHeader";
import Expired from "./Expired";
import PricingForm from "./PricingForm";

type FormData = { name: string; description?: string; };

let formData: FormData | undefined = undefined;

interface CharacterFeedProps {
    characterId: string;
    orgId: string;
    session: Session;
}

const CharacterFeed: React.FC<CharacterFeedProps> = ({ characterId, orgId, session }) => {
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
            <NotFound
                text={"Cannot find this character 😓"}
                subtext="The character may have been deleted or the character ID may be wrong."
                Icon={VscSearchStop}
                returnUrl={`/${orgId}`}
            />
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
            <CharacterFeedHeader
                character={characterData?.character}
                orgId={orgId}
            />
            <CharacterFeedBody
                character={characterData?.character}
                orgId={orgId}
            />
        </Flex>
    );
};

export default CharacterFeed;
