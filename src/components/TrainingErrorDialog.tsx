import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

interface TrainingErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrainingErrorDialog = ({ isOpen, onClose }: TrainingErrorDialogProps) => {
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
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default TrainingErrorDialog;
