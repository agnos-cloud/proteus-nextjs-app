import { ModalAction, ModalSize } from "@types";
import {
  Button,
  Modal as ChakraModal,
  Flex,
  ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

interface IModalProps {
  actions: ModalAction[];
  children?: any;
  isOpen: boolean;
  loading?: boolean;
  size?: ModalSize;
  title?: string;
  onClose: () => void;
}

const Modal: React.FunctionComponent<IModalProps> = (props) => {
  const { actions, children, isOpen, loading, size, title, onClose } = props;
  return (
    <>
      <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent pb={4} bg="background.900" color="color.900">
          <ModalHeader>{title || "Modal"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          {actions.length > 0 && <ModalFooter>
            <Flex gap="10px">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  bg={action.isPrimary ? "button.primary" : "button.secondary"}
                  _hover={{ bg: action.isPrimary ? "button.primary.hover" : "button.secondary.hover" }}
                  isDisabled={loading}
                  onClick={action.onClick}
                >
                  {action.text}
                </Button>
              ))}
            </Flex>
          </ModalFooter>}
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export default Modal;
