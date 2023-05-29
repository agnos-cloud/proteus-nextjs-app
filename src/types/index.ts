import { JSXElementConstructor, MouseEventHandler, ReactElement } from "react";

export type AppContext = {
    modalActions: ModalAction[];
    modalContent: ReactElement<any, string | JSXElementConstructor<any>> | null;
    modalIsLoading: boolean;
    modalIsOpen: boolean;
    modalTitle: string;
    setModalIsLoading: (_: boolean) => void;
    openModal: (_: ModalOptions) => void;
    closeModal: () => void;
};

export type ModalOptions = {
    title?: string;
    content: ReactElement<any, string | JSXElementConstructor<any>> | null;
    actions?: ModalAction[];
    loading?: boolean;
    size?: ModalSize;
};

export type ModalAction = {
    text: string;
    isPrimary?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
};

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | "3xl" | "4xl" | "5xl" | "6xl";
