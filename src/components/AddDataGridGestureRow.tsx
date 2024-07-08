import {
  Card,
  CardBody,
  CloseButton,
  GridItem,
  HStack,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { GestureData } from "../gestures";
import RecordIcon from "../images/record-icon.svg?react";
import GestureGridItem from "./GestureGridItem";
import RecordingGraph from "./RecordingGraph";
import RecordingDialog from "./RecordingDialog";

const AddDataGridGestureRow = ({ gesture }: { gesture: GestureData }) => {
  const intl = useIntl();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // TODO: Replace with checking if micro:bit is connected
  const isConnected = false;
  return (
    <>
      <RecordingDialog
        isOpen={isOpen}
        onClose={onClose}
        actionName={gesture.name}
      />
      <GestureGridItem name={gesture.name} onCloseClick={() => {}} />
      <GridItem>
        <Card p={2} h="120px" display="flex" flexDirection="row">
          <CardBody
            display="flex"
            flexDirection="row"
            p={2}
            gap={3}
            alignContent="center"
          >
            <HStack w="8.25rem" justifyContent="center">
              <IconButton
                onClick={onOpen}
                variant="ghost"
                _hover={{ backgroundColor: "transparent" }}
                aria-label={intl.formatMessage(
                  { id: "content.data.recordAction" },
                  { action: gesture.name }
                )}
                isDisabled={!isConnected}
                icon={
                  <Icon
                    as={RecordIcon}
                    boxSize="70px"
                    color="black"
                    opacity={0.2}
                  />
                }
              />
            </HStack>
            {gesture.recordings.map((recording, idx) => (
              <HStack key={idx} w="158px" position="relative">
                <CloseButton
                  position="absolute"
                  top={0}
                  right={0}
                  size="sm"
                  aria-label={intl.formatMessage({
                    id: "content.data.deleteRecording",
                  })}
                />
                <RecordingGraph data={recording.data} />
              </HStack>
            ))}
          </CardBody>
        </Card>
      </GridItem>
    </>
  );
};

export default AddDataGridGestureRow;
