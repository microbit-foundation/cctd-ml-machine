import {
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import { MdMoreVert } from "react-icons/md";
import { RiAddLine, RiDeleteBin2Line, RiDownload2Line } from "react-icons/ri";
import { FormattedMessage, useIntl } from "react-intl";
import AddDataGridView from "../components/AddDataGridView";
import ConnectFirstView from "../components/ConnectFirstView";
import DefaultPageLayout from "../components/DefaultPageLayout";
import LiveGraphPanel from "../components/LiveGraphPanel";
import TabView from "../components/TabView";
import UploadDataSamplesMenuItem from "../components/UploadDataSamplesMenuItem";
import { addDataConfig } from "../steps-config";
import { useGestureData } from "../gestures-hooks";
import { useMemo } from "react";

const AddDataPage = () => {
  const intl = useIntl();
  const [gestures] = useGestureData();
  const noStoredData = useMemo<boolean>(() => {
    const gestureData = gestures.data;
    return (
      gestureData.length !== 0 &&
      gestureData.some((g) => g.recordings.length > 0)
    );
  }, [gestures.data]);
  const isInputConnected = true;

  return (
    <DefaultPageLayout titleId={`${addDataConfig.id}-title`}>
      <TabView activeStep={addDataConfig.id} />
      <VStack flexGrow={1} bgColor="gray.25">
        {noStoredData && !isInputConnected ? (
          <ConnectFirstView />
        ) : (
          <AddDataGridView />
        )}
      </VStack>
      <HStack
        justifyContent="space-between"
        px={10}
        py={2}
        borderBottomWidth={3}
        borderTopWidth={3}
        borderColor="gray.200"
        alignItems="center"
      >
        <Button variant="primary" leftIcon={<RiAddLine />}>
          <FormattedMessage id="content.data.addAction" />
        </Button>
        <HStack gap={2} alignItems="center">
          <Button>
            <FormattedMessage id="menu.trainer.trainModelButton" />
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label={intl.formatMessage({
                id: "content.data.controlbar.button.menu",
              })}
              variant="ghost"
              icon={<Icon as={MdMoreVert} boxSize={10} color="brand.500" />}
              isRound
            />
            <MenuList>
              <UploadDataSamplesMenuItem />
              <MenuItem icon={<RiDownload2Line />}>
                <FormattedMessage id="content.data.controlbar.button.downloadData" />
              </MenuItem>
              <MenuItem icon={<RiDeleteBin2Line />}>
                <FormattedMessage id="content.data.controlbar.button.clearData" />
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
      <LiveGraphPanel />
    </DefaultPageLayout>
  );
};

export default AddDataPage;
