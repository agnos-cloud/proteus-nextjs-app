import { useQuery, useSubscription } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import {
    CharacterCreatedSubscriptionPayload,
    CharacterUpdatedSubscriptionPayload,
    CharactersData,
    CharactersVars,
    SearchCharacterVars
} from "@character/types";
import { SkeletonLoader } from "@components";
import CharactersOps from "@graphql/character";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import CharacterList from "./CharacterList";

interface CharacterListPanelProps {
    orgId: string;
    session: Session;
}

const CharacterListPanel: React.FC<CharacterListPanelProps> = ({ orgId, session }) => {
    const router = useRouter();
    const { query: { characterId } } = router;
    const {
        data: charactersData,
        loading: charactersLoading,
        error: charactersError,
        subscribeToMore: subscribeToMoreCharacters
    } =
        useQuery<CharactersData, CharactersVars>(CharactersOps.Query.characters, {
        variables: {
            input: {
                orgId,
            },
        }
    });

    useEffect(() => {
        if (charactersError) {
            toast.error(charactersError.message);
        }
    }, [charactersError]);

    useSubscription<CharacterUpdatedSubscriptionPayload, SearchCharacterVars>(CharactersOps.Subscription.characterUpdated, {
        variables: {
            input: {
                orgId,
            },
        },
        onData: ({ client, data }) => {
            const { data: subscriptionData } = data;
            if (!subscriptionData) return;

            const { characterUpdated } = subscriptionData;
            const currentlyViewingCharacter = characterUpdated.id === characterId;

            if (currentlyViewingCharacter) {
                onViewCharacter(characterUpdated.id);
            }
        },
    });

    const subscribeToNewCharacters = () => {
        subscribeToMoreCharacters({
            document: CharactersOps.Subscription.characterCreated,
            variables: {
                input: {
                    orgId,
                },
            },
            updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: CharacterCreatedSubscriptionPayload } }) => {
                if (!subscriptionData.data) return prev;
                const newCharacter = subscriptionData.data.characterCreated;
                if (prev.characters.find((c) => c.id === newCharacter.id)) {
                    return prev;
                }
                return Object.assign({}, prev, {
                    characters: [newCharacter, ...prev.characters]
                });
            }
        });
    };

    useEffect(() => {
        subscribeToNewCharacters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onViewCharacter = async (characterId: string) => {
        router.push(`/${orgId}/?characterId=${characterId}`);
    };

    return (
        <Stack height="100%">
            {charactersLoading ? (
                <SkeletonLoader count={7} height="80px" width="350px" />
            ) : (
                <CharacterList
                    orgId={orgId}
                    session={session}
                    characters={charactersData?.characters || []}
                    onViewCharacter={onViewCharacter}
                />
            )}
        </Stack>
    );
};

export default CharacterListPanel;
