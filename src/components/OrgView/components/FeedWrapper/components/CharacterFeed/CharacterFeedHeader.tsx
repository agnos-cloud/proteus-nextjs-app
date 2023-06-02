import {
    Avatar,
    Box,
    Button,
    Collapse,
    Flex,
    Icon,
    IconButton,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';
import { Character, ModelFamily } from '@character/types';
import { useRouter } from 'next/router';
import { BiBot, BiChevronDown as ChevronDownIcon } from "react-icons/bi";
import { IoArrowBack as BackArrowIcon } from 'react-icons/io5';
import { RxHamburgerMenu as HamburgerIcon } from "react-icons/rx";
import { TbBrandGoogle, TbBrandOpenai } from 'react-icons/tb';
import { TfiClose as CloseIcon } from "react-icons/tfi";

interface CharacterFeedHeaderProps {
    character: Character;
    orgId: string;
}

export default function CharacterFeedHeader(props: CharacterFeedHeaderProps) {
    const { character, orgId } = props;
    const { isOpen, onToggle } = useDisclosure();
    const router = useRouter();

    return (
        <Box>
            <Flex
                align="center"
                borderBottom={1}
                borderStyle="solid"
                minH="72px"
                py={{ base: 2 }}
                px={{ base: 4 }}
            >
                <Flex
                    display={{ base: 'flex', md: 'none' }}
                    // flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                >
                    <IconButton
                        aria-label="Toggle Navigation"
                        icon={<BackArrowIcon size={20} />}
                        variant="ghost"
                        onClick={() => router.push(`/${orgId}`)}
                    />
                </Flex>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <IconButton
                        aria-label="Toggle Navigation"
                        icon={
                            isOpen ? <CloseIcon size={16} /> : <HamburgerIcon size={16} />
                        }
                        variant="ghost"
                        onClick={onToggle}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Flex gap={1}>
                        {character.image ? (
                            <Avatar name={character.name} src={character.image} />
                        ) : character.modelFamily === ModelFamily.GOOGLE_AI ? (
                            <TbBrandGoogle size={24} />
                        ) : character.modelFamily === ModelFamily.OPENAI ? (
                            <TbBrandOpenai size={24} />
                        ) : (
                            <BiBot size={24} />
                        )}
                        <Text
                            textAlign={useBreakpointValue({ base: "center", md: "left" })}
                            fontFamily="heading"
                        >
                            {character.name}
                            {" "}
                            <sup style={{ color: "RGBA(255, 255, 255, 0.36)" }}>{String(character.plan).toLowerCase()}</sup>
                        </Text>
                    </Flex>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav {...props} />
                    </Flex>
                </Flex>

                <Stack
                    align="center"
                    direction="row"
                    flex={{ base: 1, md: 0 }}
                    justify="flex-end"
                >
                    <Button
                        display={{ base: "flex", md: "none" }}
                        size="sm"
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                    >
                        Plan
                    </Button>
                    <Button
                        display={{ base: "none", md: "flex" }}
                        size="sm"
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                    >
                        Choose Plan
                    </Button>
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav {...props} />
            </Collapse>
        </Box>
    );
}

const DesktopNav = (props: CharacterFeedHeaderProps) => {
    const { character, orgId } = props;
    const router = useRouter();
    const { query: { tab } } = router;

    return (
        <Stack direction="row" spacing={4}>
            {NAV_ITEMS.map((navItem, index) => (
                <Box key={navItem.label}>
                    <Popover trigger="hover" placement="bottom-start">
                        <PopoverTrigger>
                            <Link
                                color={
                                    navItem.href === tab || (!tab && index === 0) || (navItem.children?.find((c) => c.href === tab))
                                    ? "color.900"
                                    : "color.500"
                                }
                                _hover={{
                                    color: "color.700",
                                    textDecoration: "none",
                                }}
                                fontSize="sm"
                                fontWeight={500}
                                p={2}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (navItem.href && !navItem.children) {
                                        router.push(`/${orgId}?characterId=${character.id}&tab=${navItem.href}`);
                                    }
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow="xl"
                                bg="background.900"
                                minW="sm"
                                p={4}
                                rounded="xl"
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} {...props} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel, orgId, character }: NavItem & CharacterFeedHeaderProps) => {
    const router = useRouter();
    const { query: { tab } } = router;

    return (
        <Link
            bg={href === tab ? "background.700" : "none"}
            color={href === tab ? "color.900" : "color.500"}
            display="block"
            _hover={{ bg: "background.800", color: "color.700" }}
            role="group"
            p={2}
            rounded="md"
            onClick={(e) => {
                e.preventDefault();
                if (href) {
                    router.push(`/${orgId}?characterId=${character.id}&tab=${href}`);
                }
            }}
        >
            <Stack align="center" direction="row">
                <Box>
                    <Text
                        fontWeight={500}
                    >
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
            </Stack>
        </Link>
    );
};

const MobileNav = (props: CharacterFeedHeaderProps) => {
    return (
        <Stack
            bg="background.900"
            p={4}
            display={{ md: "none" }}>
            {NAV_ITEMS.map((navItem, index) => (
                <MobileNavItem key={navItem.label} index={index} {...navItem} {...props} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({
    character,
    children,
    href,
    label,
    orgId,
    index
}: NavItem & CharacterFeedHeaderProps & { index: number }) => {
    const { isOpen, onToggle } = useDisclosure();
    const router = useRouter();
    const { query: { tab } } = router;

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                align="center"
                as={Link}
                color={
                    href === tab || (!tab && index === 0) || (children?.find((c) => c.href === tab))
                    ? "color.900"
                    : "color.500"
                }
                _hover={{
                    color: "color.700",
                    textDecoration: "none",
                }}
                py={2}
                justify="space-between"
                onClick={(e) => {
                    e.preventDefault();
                    if (href && !children) {
                        router.push(`/${orgId}?characterId=${character.id}&tab=${href}`);
                    }
                }}
            >
                <Text
                    fontWeight={600}
                    // color={useColorModeValue('gray.600', 'gray.200')}
                >
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition="all .25s ease-in-out"
                        transform={isOpen ? "rotate(180deg)" : ""}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
                <Stack
                    align="start"
                    borderLeft={1}
                    borderStyle="solid"
                    // borderColor={useColorModeValue('gray.200', 'gray.700')}
                    mt={2}
                    pl={4}
                >
                    {children && children.map((child) => (
                        <Link
                            key={child.label}
                            bg={child.href === tab ? "background.700" : "none"}
                            color={child.href === tab ? "color.900" : "color.500"}
                            _hover={{ bg: "background.800" }}
                            py={2}
                            onClick={(e) => {
                                e.preventDefault();
                                if (href) {
                                    router.push(`/${orgId}?characterId=${character.id}&tab=${child.href}`);
                                }
                            }}
                        >
                            {child.label}
                        </Link>
                    ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

  const NAV_ITEMS: Array<NavItem> = [
    {
      label: "Instruction",
      href: "instruction", // show how many tokens they consume
    },
    {
      label: "Knowledge",
      href: "knowledge",
    },
    {
      label: "Fine-Tuning",
      href: "fine-tuning",
    },
    {
      label: "Integrations",
      href: "integrations",
      children: [
        {
          label: "Actions",
          subLabel: "Send text messages, emails, and more",
          href: "actions",
        },
        {
          label: "Chat Bots",
          subLabel: "Create chat bots for WhatsApp, Slack, and more",
          href: "chat-bots",
        },
        {
          label: "Widgets",
          subLabel: "Create chat widgets, dashboard widgets, and more",
          href: "widgets",
        },
      ],
    },
];
