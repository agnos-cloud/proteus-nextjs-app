import { Character, ModelFamily } from "@character/types";
import { BiBot } from "react-icons/bi";
import { TbBrandGoogle, TbBrandOpenai } from "react-icons/tb";

interface CharacterIconProps {
    character: Pick<Character, "id" | "name" | "image" | "modelFamily">;
    size: number;
}

const CharacterIcon: React.FunctionComponent<CharacterIconProps> = ({ character, size }) => {
    return character.modelFamily === ModelFamily.GOOGLE_AI ? (
            <TbBrandGoogle size={size} />
        ) : character.modelFamily === ModelFamily.OPENAI ? (
            <TbBrandOpenai size={size} />
        ) : (
            <BiBot size={size} />
        );
};

export default CharacterIcon;
