import {
    Button,
    ButtonProps,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger
} from '@chakra-ui/react';
import { BiChevronDown as ChevronDownIcon } from "react-icons/bi";

interface DropDownButtonProps extends ButtonProps {
    children?: any;
    text: string;
    subtext?: string;
}

const DropDownButton: React.FunctionComponent<DropDownButtonProps> = ({ children, text, subtext, ...rest }) => {
    return (
        /**
         * You may move the Popover outside Flex.
         */
        <Flex>
            <Popover placement="bottom" isLazy>
            <PopoverTrigger>
                <Button
                    bg="button.primary"
                    _hover={{ bg: "button.primary.hover" }}
                    rightIcon={<ChevronDownIcon />}
                    w="fit-content"
                >
                    {text}
                </Button>
            </PopoverTrigger>
            <PopoverContent bg="background.900" _focus={{ boxShadow: 'none' }}>
                <PopoverArrow bg="background.900" />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">{subtext || text}</PopoverHeader>
                <PopoverBody w="full">
                    {children}
                </PopoverBody>
            </PopoverContent>
            </Popover>
        </Flex>
    );
};

export default DropDownButton;
