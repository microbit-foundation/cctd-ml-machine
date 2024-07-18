import { Button, HStack, StackProps, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { useConnectionFlow, useConnections } from "../connection-hooks";
import { useGestureActions } from "../gestures-hooks";
import { createStepPageUrl } from "../urls";
import StartOverWarningDialog from "./StartOverWarningDialog";

const StartResumeActions = ({ ...props }: Partial<StackProps>) => {
  const gestureActions = useGestureActions();
  const hasExistingSession = useMemo(
    () => gestureActions.hasGestures(),
    [gestureActions]
  );
  const startOverWarningDialogDisclosure = useDisclosure();
  const navigate = useNavigate();
  const { actions: connectionActions } = useConnectionFlow();
  const { isInputConnected } = useConnections();

  const handleNavigateToAddData = useCallback(() => {
    navigate(createStepPageUrl("add-data"));
  }, [navigate]);

  const handleStartNewSession = useCallback(() => {
    gestureActions.deleteAllGestures();
    if (isInputConnected) {
      handleNavigateToAddData();
    } else {
      connectionActions.start();
    }
  }, [
    gestureActions,
    connectionActions,
    handleNavigateToAddData,
    isInputConnected,
  ]);

  const onClickStartNewSession = useCallback(() => {
    if (hasExistingSession) {
      startOverWarningDialogDisclosure.onOpen();
    } else {
      handleStartNewSession();
    }
  }, [
    handleStartNewSession,
    hasExistingSession,
    startOverWarningDialogDisclosure,
  ]);

  return (
    <>
      <StartOverWarningDialog
        isOpen={startOverWarningDialogDisclosure.isOpen}
        onClose={startOverWarningDialogDisclosure.onClose}
        onStart={handleStartNewSession}
      />
      <HStack w="100%" justifyContent="center" gap={5} {...props}>
        {hasExistingSession && (
          <Button size="lg" variant="primary" onClick={handleNavigateToAddData}>
            <FormattedMessage id="footer.resume" />
          </Button>
        )}
        <Button
          onClick={onClickStartNewSession}
          size="lg"
          variant={hasExistingSession ? "secondary" : "primary"}
        >
          <FormattedMessage id="footer.start" />
        </Button>
      </HStack>
    </>
  );
};

export default StartResumeActions;
