import {
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

interface WebUsbBluetoothUnsupportedDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebUsbBluetoothUnsupportedDialog = ({
  isOpen,
  onClose,
}: WebUsbBluetoothUnsupportedDialogProps) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="none"
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      isCentered
    >
      <ModalOverlay>
        <ModalContent p={8}>
          <ModalBody>
            <VStack width="100%" alignItems="left" gap={5}>
              <Heading as="h2" fontSize="xl" fontWeight="bold">
                <FormattedMessage id="popup.compatibility.header" />
              </Heading>
              <VStack gap={5} textAlign="left" w="100%">
                <Text w="100%">
                  <FormattedMessage id="popup.compatibility.explain" />
                </Text>
                <Text w="100%">
                  <FormattedMessage id="popup.compatibility.advice" />
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="end" p={0}>
            <HStack gap={5}>
              <Button onClick={onClose} variant="primary" size="lg">
                <FormattedMessage id="close-action" />
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default WebUsbBluetoothUnsupportedDialog;
