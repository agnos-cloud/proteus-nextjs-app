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
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { Character, ModelFamily } from '@character/types';
import { useRouter } from 'next/router';
import { BiBot, BiChevronDown as ChevronDownIcon, BiChevronUp as ChevronUpIcon } from "react-icons/bi";
import { IoArrowBack as BackArrowIcon } from 'react-icons/io5';
import { RxHamburgerMenu as HamburgerIcon } from "react-icons/rx";
import { TbBrandGoogle, TbBrandOpenai } from 'react-icons/tb';
import { TfiClose as CloseIcon } from "react-icons/tfi";

interface CharacterWrapperProps {
    character: Character;
    orgId: string;
}

export default function CharacterWrapper(props: CharacterWrapperProps) {
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
                        <DesktopNav
                            character={character}
                            orgId={orgId}
                        />
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
                        fontSize="sm"
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                    >
                        Plan
                    </Button>
                    <Button
                        display={{ base: "none", md: "flex" }}
                        fontSize="sm"
                        bg="button.secondary"
                        _hover={{ bg: "button.secondary.hover" }}
                    >
                        Choose Plan
                    </Button>
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

  const DesktopNav = (props: CharacterWrapperProps) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
      <Stack direction={'row'} spacing={4}>
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
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

  const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
      <Link
        href={href}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'pink.400' }}
              fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'pink.400'} w={5} h={5} as={ChevronUpIcon} />
          </Flex>
        </Stack>
      </Link>
    );
  };

  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      </Stack>
    );
  };

  const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={Link}
          href={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>

        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => (
                <Link key={child.label} py={2} href={child.href}>
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
      label: 'Inspiration',
      children: [
        {
          label: 'Explore Design Work',
          subLabel: 'Trending Design to inspire you',
          href: '#',
        },
        {
          label: 'New & Noteworthy',
          subLabel: 'Up-and-coming Designers',
          href: '#',
        },
      ],
    },
    {
      label: 'Find Work',
      children: [
        {
          label: 'Job Board',
          subLabel: 'Find your dream design job',
          href: '#',
        },
        {
          label: 'Freelance Projects',
          subLabel: 'An exclusive list for contract work',
          href: '#',
        },
      ],
    },
    {
      label: 'Learn Design',
      href: '#',
    },
    {
      label: 'Hire Designers',
      href: '#',
    },
];
