import { useQuery } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import { CharactersData, CharactersVars } from "@character/types";
import { SkeletonLoader } from "@components";
import CharactersOps from "@graphql/character";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import CharacterList from "./CharacterList";

interface CharacterListPanelProps {
    org: string;
    session: Session;
}

const CharacterListPanel: React.FC<CharacterListPanelProps> = ({ org, session }) => {
    const router = useRouter();
    const { query: { conversationId } } = router;
    const {
        data: charactersData,
        loading: charactersLoading,
        error: charactersError,
        subscribeToMore: subscribeToMoreCharacters
    } =
        useQuery<CharactersData, CharactersVars>(CharactersOps.Queries.characters, {
        variables: {
            input: {
                org,
            },
        }
    });

    return (
        <Stack height="100%">
            {charactersLoading ? (
                <SkeletonLoader count={7} height="80px" width="350px" />
            ) : (
                <CharacterList
                    org={org}
                    session={session}
                    characters={charactersData?.characters || []}
                />
            )}
        </Stack>
    );
};

export default CharacterListPanel;
