import {
    Box,
    Button,
    Flex,
    HStack,
    Heading,
    List,
    ListIcon,
    ListItem,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BiBot, BiMemoryCard } from "react-icons/bi";
import { SiKnowledgebase } from "react-icons/si";
import { IconType } from "react-icons";
import { VscGithubAction } from "react-icons/vsc";
import { MdUpdate } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { GiBookshelf } from "react-icons/gi";
import { ImBooks } from "react-icons/im";
import { MdOutlineWidgets } from "react-icons/md";

type FormData = { name: string; description?: string; };

export interface PricingFormProps {
    onChange: (form: FormData) => void;
}

type PricingInfo = Record<string, Record<string, string[]>>;

const pricingInfo: PricingInfo = {
    basic: {
        actions: ["can send text, email messages"],
        "knowledge base": ["1000 text characters"],
        "knowledge update": ["manual knowledge update"],
        memory: ["remembers only last prompt"],
        models: ["OpenAI models"],
        widgets: ["web UI chat widgets"],
    },
    professional: {
        actions: [
            "can send text, email messages",
        ],
        "knowledge base": [
            "1000 text characters",
            "20MB of your uploaded files",
            "20MB of your website data",
        ],
        "knowledge update": [
            "manual knowledge update",
            "automatic knowledge update",
            "updates at fixed intervals",
        ],
        memory: ["remembers last 20 messages"],
        models: ["OpenAI models"],
        widgets: [
            "web UI chat widgets",
            "web UI dashboard widgets",
        ],
    },
    advanced: {
        actions: [
            "can send text, email messages",
            "can perform custom actions",
        ],
        "knowledge base": [
            "1000 text characters",
            "50MB of your uploaded files",
            "50MB of your website data",
            "50MB of your database data",
            "50MB of your API data",
        ],
        "knowledge update": [
            "manual knowledge update",
            "automatic knowledge update",
            "updates at custom intervals",
        ],
        memory: ["remembers last 50 messages"],
        models: ["OpenAI, Google AI models"],
        widgets: [
            "web UI chat widgets",
            "web UI dashboard widgets",
            "custom web UI widgets",
        ],
    },
};

function getList(plan: string, feature: string, Icon: IconType) {
    return (
        <>
            <Flex align="center" color="color.500" fontSize="md" gap={1}>
                <Icon />
                <Text>{feature}</Text>
            </Flex>
            <List spacing={3} textAlign="start" px={12}>
                {pricingInfo.advanced[feature].map((_, index) => {
                    const feat = pricingInfo[plan][feature][index];
                    if (feat) {
                        return (
                            <ListItem key={`${plan}-${index}`}>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                {feat}
                            </ListItem>
                        );
                    }
                    return (
                        <ListItem key={`basic-${index}`} display={{ base: "none", md: "block" }}>
                            <br />
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}

function PriceWrapper({ children }: { children: ReactNode }) {
    return (
        <Box
            mb={4}
            shadow="base"
            borderWidth="1px"
            alignSelf={{ base: 'center', lg: 'flex-start' }}
            borderColor={useColorModeValue('gray.200', 'color.500')}
            borderRadius={'xl'}
        >
            {children}
        </Box>
    );
}

export default function PricingForm(props: PricingFormProps) {
    const [showMore, setShowMore] = useState(false);

    const showMoreBtn = (
        <Button variant="link" colorScheme="blue" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show less" : "Show more"}
        </Button>
    );

    return (
        <Box py={12}>
            <VStack spacing={2} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                    Plans that fit your need
                </Heading>
                <Text fontSize="lg" color={'color.500'}>
                    Start with 14-day free trial. No credit card needed. Cancel at anytime.
                </Text>
                <Text fontSize="lg" color={'color.500'}>
                    Need something more custom? <Button variant="link" colorScheme="blue">Contact us</Button>
                </Text>
            </VStack>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                justify="center"
                py={10}
                spacing={{ base: 4, lg: 10 }}
                textAlign="center"
            >
                <PriceWrapper>
                    <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                            Basic
                        </Text>
                        <HStack justifyContent="center">
                            <Text fontSize="3xl" fontWeight="600">
                                $
                            </Text>
                            <Text fontSize="5xl" fontWeight="900">
                                20
                            </Text>
                            <Text fontSize="3xl" color="color.500">
                                /month
                            </Text>
                        </HStack>
                    </Box>
                    <VStack
                        bg={useColorModeValue('color.50', 'color.700')}
                        borderBottomRadius={'xl'}
                        py={4}
                    >
                        {getList("basic", "memory", BiMemoryCard)}
                        {getList("basic", "knowledge base", ImBooks)}
                        {getList("basic", "knowledge update", MdUpdate)}
                        {getList("basic", "actions", VscGithubAction)}
                        {showMore && getList("basic", "widgets", MdOutlineWidgets)}
                        {showMore && getList("basic", "models", BiBot)}
                        {showMoreBtn}
                        <Box w="80%" pt={7}>
                            <Button
                                bg="button.secondary"
                                _hover={{ bg: "button.secondary.hover" }}
                                variant="outline"
                                w="full"
                            >
                                Start trial
                            </Button>
                        </Box>
                    </VStack>
                </PriceWrapper>

                <PriceWrapper>
                    <Box position="relative">
                        <Box
                            position="absolute"
                            top="-16px"
                            left="50%"
                            style={{ transform: 'translate(-50%)' }}
                        >
                            <Text
                                textTransform="uppercase"
                                bg="button.primary"
                                px={3}
                                py={1}
                                color="background.900"
                                fontSize="sm"
                                fontWeight="600"
                                rounded="xl"
                            >
                                Most Popular
                            </Text>
                        </Box>
                        <Box py={4} px={12}>
                            <Text fontWeight="500" fontSize="2xl">
                                Professional
                            </Text>
                            <HStack justifyContent="center">
                                <Text fontSize="3xl" fontWeight="600">
                                    $
                                </Text>
                                <Text fontSize="5xl" fontWeight="900">
                                    50
                                </Text>
                                <Text fontSize="3xl" color="color.500">
                                    /month
                                </Text>
                            </HStack>
                        </Box>
                        <VStack
                            bg={useColorModeValue('color.50', 'color.700')}
                            py={4}
                            borderBottomRadius={'xl'}
                        >
                            {getList("professional", "memory", BiMemoryCard)}
                            {getList("professional", "knowledge base", ImBooks)}
                            {getList("professional", "knowledge update", MdUpdate)}
                            {getList("professional", "actions", VscGithubAction)}
                            {showMore && getList("professional", "widgets", MdOutlineWidgets)}
                            {showMore && getList("professional", "models", BiBot)}
                            {showMoreBtn}
                            <Box w="80%" pt={7}>
                                <Button
                                    bg="button.primary"
                                    _hover={{ bg: "button.primary.hover" }}
                                    variant="outline"
                                    w="full"
                                >
                                    Start trial
                                </Button>
                            </Box>
                        </VStack>
                    </Box>
                </PriceWrapper>
                <PriceWrapper>
                    <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                            Advanced
                        </Text>
                        <HStack justifyContent="center">
                            <Text fontSize="3xl" fontWeight="600">
                                $
                            </Text>
                            <Text fontSize="5xl" fontWeight="900">
                                100
                            </Text>
                            <Text fontSize="3xl" color="color.500">
                                /month
                            </Text>
                        </HStack>
                    </Box>
                    <VStack
                        bg={useColorModeValue('color.50', 'color.700')}
                        py={4}
                        borderBottomRadius={'xl'}
                    >
                        {getList("advanced", "memory", BiMemoryCard)}
                        {getList("advanced", "knowledge base", ImBooks)}
                        {getList("advanced", "knowledge update", MdUpdate)}
                        {getList("advanced", "actions", VscGithubAction)}
                        {showMore && getList("advanced", "widgets", MdOutlineWidgets)}
                        {showMore && getList("advanced", "models", BiBot)}
                        {showMoreBtn}
                        <Box w="80%" pt={7}>
                            <Button
                                bg="button.secondary"
                                _hover={{ bg: "button.secondary.hover" }}
                                variant="outline"
                                w="full"
                            >
                                Start trial
                            </Button>
                        </Box>
                    </VStack>
                </PriceWrapper>
            </Stack>
        </Box>
    );
}