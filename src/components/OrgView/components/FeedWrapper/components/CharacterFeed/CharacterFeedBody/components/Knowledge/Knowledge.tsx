import { useMutation } from "@apollo/client";
import { Button, Grid, Stack } from "@chakra-ui/react";
import CharactersOps from "@character/graphql";
import { Character, SaveCharacterInstructionData, SaveCharacterInstructionVariable } from "@character/types";
import { DropDownButton } from "@components";
import { EmbSet, EmbSource } from "@embset/types";
import rules from "@rules";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsBodyText, BsFiletypePdf } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import EmbSetItem from "./EmbSetItem";
import { useApp } from "@hooks";

let textToEmbed: string | undefined = undefined;

interface KnowledgeProps {
    character: Character;
    orgId: string;
    visible?: boolean;
}

const Knowledge: React.FC<KnowledgeProps> = ({ character, orgId, visible }) => {
    const { openModal, closeModal, setModalIsLoading } = useApp();
    const [embSets, setEmbSets] = useState<EmbSet[]>([{
        id: "1",
        title: "Raw Text",
        source: EmbSource.TEXT,
        description: "Lepaya is a provider of Power Skills training that combines online and offline learning." +
            "Founded by René Janssen and Peter Kuperus in 2018 with the perspective that the right training, at the right time, " +
            "focused on the right skill, makes organizations more productive. Lepaya has trained thousands of employees.",
        createdAt: new Date("2023/06/06"),
        updatedAt: new Date("2023/06/06"),
    }, {
        id: "2",
        title: "PDF File Upload",
        source: EmbSource.PDF_FILE,
        description: "As a challenger in a crowded training market, Lepaya responds to the needs of Europe's " +
            "fastest growing tech companies, such as Mollie, Takeaway, and Picnic, amongst others. " +
            "By combining hard skills with soft skills, offered together as Power Skills, the Amsterdam-based company is " +
            "growing faster in a market in which the demand for reskilling and upskilling continues to increase all over the world.",
        createdAt: new Date("2023/05/06"),
        updatedAt: new Date("2023/05/06"),
    }, {
        id: "3",
        title: "www.lepaya.com",
        source: EmbSource.WEB_LINK,
        description: "In 2020, Lepaya independently acquired Smartenup, a training company that supports professionals to work " +
            "better, faster, and smarter with data. The scale-up focuses on the Dutch, Belgian, German, and Swedish markets and " +
            "serves its customers worldwide. Lepaya is backed by Target Global, Mediahuis Ventures, and Tablomonto. " +
            "The company has raised USD 47 million to date. ",
        createdAt: new Date("2023/04/06"),
        updatedAt: new Date("2023/04/06"),
    }]);
    const [instruction, setInstruction] = useState(character.instruction || "");
    useEffect(() => {
        setInstruction(character.instruction || "");
    }, [character]);
    const [
        saveInstruction,
        { data, loading, error }
    ] = useMutation<SaveCharacterInstructionData, SaveCharacterInstructionVariable>(CharactersOps.Mutation.saveInstruction);
    useEffect(() => {
        if (data?.saveInstruction) {
            toast.success("Instruction saved!");
        }
    }, [data]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let inputValue = e.target.value
        setInstruction(inputValue)
    }

    const handleSave = () => {
        if (!instruction) return;

        saveInstruction({
            variables: {
                input: {
                    id: character.id,
                    orgId,
                    instruction,
                },
            },
        }).catch((e) => toast.error(e.message || String(e)));
    };

    const maxLength = rules.maxInstructionLength(character.plan);

    return (
        <Stack
            display= {visible ? "flex" : "none"}
            p={4}
            spacing={4}
        >
            <Stack spacing={2}>
                <DropDownButton text="Add Knowledge" subtext="Add new source of knowledge">
                    <Grid gap={2}>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<BsBodyText />}
                            onClick={handleSave}
                        >
                            Raw Text
                        </Button>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<BsFiletypePdf />}
                            onClick={handleSave}
                        >
                            PDF File
                        </Button>
                        <Button
                            bg="button.secondary"
                            _hover={{ bg: "button.secondary.hover" }}
                            leftIcon={<FiLink />}
                            onClick={handleSave}
                        >
                            Web Link
                        </Button>
                    </Grid>
                </DropDownButton>

                {embSets.map((embSet) => <EmbSetItem key={embSet.id} embset={embSet} />)}
            </Stack>
        </Stack>
    );
};

export default Knowledge;
