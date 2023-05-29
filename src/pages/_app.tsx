import { theme } from "@/chakra/theme";
import { client } from "@/graphql/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Modal } from "@components";
import { AppProvider } from "@hooks";
import { ModalAction, ModalOptions, ModalSize } from "@types";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { JSXElementConstructor, ReactElement, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    const [modalActions, setModalActions] = useState<ModalAction[]>([]);
    const [modalContent, setModalContent] = useState<ReactElement<
        any,
        string | JSXElementConstructor<any>
    > | null>(null);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalSize, setModalSize] = useState<ModalSize>("md");
    const [modalTitle, setModalTitle] = useState("");

    const app = useMemo(
        () => ({
            modalActions,
            modalContent,
            modalIsLoading,
            modalIsOpen,
            modalTitle,
            setModalIsLoading,
            openModal: (options: ModalOptions) => {
                setModalIsLoading(options.loading || false);
                setModalTitle(options.title || "Modal");
                setModalContent(options.content);
                setModalActions(options.actions || []);
                setModalSize(options.size || "md");
                setModalIsOpen(true);
            },
            closeModal: () => {
                setModalIsOpen(false);
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const states = {
        modalActions,
        modalContent,
        modalIsLoading,
        modalIsOpen,
        modalTitle,
    };

    return (
        <>
        <Head>
            <title>Proteus AI</title>
            <meta name="description" content="Proteus AI" />
            <link rel="icon" href="/images/logo.png" />
        </Head>
        <ApolloProvider client={client}>
            <SessionProvider session={session}>
                <ChakraProvider theme={theme}>
                    <AppProvider value={{ ...app, ...states }}>
                        <Component {...pageProps} />
                        <Toaster />
                        <Modal
                            actions={modalActions}
                            isOpen={modalIsOpen}
                            loading={modalIsLoading}
                            size={modalSize}
                            title={modalTitle}
                            onClose={() => setModalIsOpen(false)}
                        >
                            {modalContent}
                        </Modal>
                    </AppProvider>
                </ChakraProvider>
            </SessionProvider>
        </ApolloProvider>
        </>
    );
};

export default App;
