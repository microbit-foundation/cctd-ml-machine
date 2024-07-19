import {
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

interface ConnectionLostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reconnect: () => void;
}

const ConnectionLostDialog = ({
  isOpen,
  onClose,
}: ConnectionLostDialogProps) => {
  return (
    <Modal
      motionPreset="none"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
    >
      <ModalOverlay>
        <ModalContent p={8}>
          <ModalBody>
            <ModalCloseButton />
            <VStack width="100%" alignItems="left" gap={5}>
              <Heading as="h2" fontSize="xl" fontWeight="bold">
                <FormattedMessage id="content.trainer.failure.header" />
              </Heading>
              <VStack gap={3} textAlign="left" w="100%">
                <Text w="100%">
                  <FormattedMessage id="content.trainer.failure.body" />
                </Text>
                <Text w="100%" fontWeight="bold">
                  <FormattedMessage id="content.trainer.failure.todo" />
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between" p={0}>
            {onLinkClick && linkTextId && (
              <Button onClick={onLinkClick} variant="link" size="lg">
                <FormattedMessage id={linkTextId} />
              </Button>
            )}
            <HStack gap={5}>
              <Button onClick={onBackClick} variant="secondary" size="lg">
                <FormattedMessage id="back-action" />
              </Button>
              <Button onClick={onNextClick} variant="primary" size="lg">
                <FormattedMessage id="connectMB.nextButton" />
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ConnectionLostDialog;
