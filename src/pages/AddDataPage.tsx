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
import {
  GestureData,
  useGestureActions,
  useGestureData,
} from "../gestures-hooks";
import { useCallback, useMemo } from "react";

const AddDataPage = () => {
  const intl = useIntl();
  const [gestures] = useGestureData();
  const actions = useGestureActions();
  const isInputConnected = true;

  const noStoredData = useMemo<boolean>(() => {
    const gestureData = gestures.data;
    return (
      gestureData.length !== 0 &&
      gestureData.some((g) => g.recordings.length > 0)
    );
  }, [gestures.data]);

  const handleAddNewGesture = useCallback(() => {
    actions.addNewGesture();
  }, [actions]);

  const handleDatasetDownload = useCallback(() => {
    downloadDataset(gestures.data);
  }, [gestures.data]);

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
        <Button
          variant="primary"
          leftIcon={<RiAddLine />}
          onClick={handleAddNewGesture}
          isDisabled={
            !isInputConnected || gestures.data.some((g) => g.name.length === 0)
          }
        >
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
              <MenuItem
                icon={<RiDownload2Line />}
                onClick={handleDatasetDownload}
              >
                <FormattedMessage id="content.data.controlbar.button.downloadData" />
              </MenuItem>
              <MenuItem
                icon={<RiDeleteBin2Line />}
                onClick={actions.deleteAllGestures}
              >
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

const downloadDataset = (gestures: GestureData[]) => {
  const a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(gestures, null, 2))
  );
  a.setAttribute("download", "dataset");
  a.style.display = "none";
  a.click();
};

export default AddDataPage;
