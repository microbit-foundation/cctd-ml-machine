import {
  Button,
  Grid,
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
import {
  RiAddLine,
  RiDeleteBin2Line,
  RiDownload2Line,
  RiUpload2Line,
} from "react-icons/ri";
import { FormattedMessage, useIntl } from "react-intl";
import ConnectFirstView from "../components/ConnectFirstView";
import DefaultPageLayout from "../components/DefaultPageLayout";
import LiveGraphPanel from "../components/LiveGraphPanel";
import TabView from "../components/TabView";
import { addDataConfig } from "../steps-config";

const AddDataPage = () => {
  const intl = useIntl();
  const noStoredData = true;
  const isInputConnected = false;
  return (
    <DefaultPageLayout titleId={`${addDataConfig.id}-title`}>
      <TabView activeStep={addDataConfig.id} />
      <VStack flexGrow={1} bgColor="gray.25">
        {noStoredData && !isInputConnected ? (
          <ConnectFirstView />
        ) : (
          <Grid>TODO: Grid layout!</Grid>
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
              <MenuItem icon={<RiUpload2Line />}>
                <FormattedMessage id="content.data.controlbar.button.uploadData" />
              </MenuItem>
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
