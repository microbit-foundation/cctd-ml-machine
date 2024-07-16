import { Button, HStack, Portal, Text } from "@chakra-ui/react";
import { MdBolt } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import InfoToolTip from "./InfoToolTip";
import LiveGraph from "./LiveGraph";
import { useCallback, useRef } from "react";
import { useConnectionFlow } from "../connections";
import { ConnEvent } from "../connection-flow";

const LiveGraphPanel = () => {
  const { dispatch } = useConnectionFlow();
  const parentPortalRef = useRef(null);

  // TODO: replace with hook
  const isConnected = false;

  const handleConnect = useCallback(() => {
    // TODO: Handle incompatibility dialog and reconnection
    dispatch(ConnEvent.Start);
  }, [dispatch]);
  return (
    <HStack
      position="relative"
      h={160}
      width="100%"
      bgColor="white"
      ref={parentPortalRef}
    >
      <Portal containerRef={parentPortalRef}>
        <HStack
          justifyContent="space-between"
          position="absolute"
          top={0}
          left={0}
          right={0}
          px={7}
          py={4}
        >
          <HStack gap={4}>
            <LiveIndicator />
            {isConnected ? (
              <Button variant="primary" size="sm">
                <FormattedMessage id="footer.disconnectButton" />
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleConnect}>
                <FormattedMessage id="footer.connectButton" />
              </Button>
            )}
          </HStack>
          <InfoToolTip
            titleId="footer.helpHeader"
            descriptionId="footer.helpContent"
          />
        </HStack>
      </Portal>
      <HStack position="absolute" width="100%" height="100%">
        <LiveGraph />
      </HStack>
    </HStack>
  );
};

const LiveIndicator = () => (
  <HStack gap={2}>
    <MdBolt size={24} />
    <Text fontWeight="bold">LIVE</Text>
  </HStack>
);

export default LiveGraphPanel;
