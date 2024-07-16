import { Button, HStack, StackProps, useDisclosure } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { ConnEvent } from "../connection-flow";
import { useConnectionFlow } from "../connections";
import { useGestureActions } from "../gestures-hooks";
import { createStepPageUrl } from "../urls";
import StartOverWarningDialog from "./StartOverWarningDialog";

const StartResumeActions = ({ ...props }: Partial<StackProps>) => {
  const actions = useGestureActions();
  const hasExistingSession = useMemo(() => actions.hasGestures(), [actions]);
  const startOverWarningDialogDisclosure = useDisclosure();
  const navigate = useNavigate();
  const { dispatch } = useConnectionFlow();
  // TODO: check input connected
  const isInputConnected = true;

  const handleNavigateToAddData = useCallback(() => {
    navigate(createStepPageUrl("add-data"));
  }, [navigate]);

  const handleStartNewSession = useCallback(() => {
    actions.deleteAllGestures();
    if (isInputConnected) {
      handleNavigateToAddData();
    } else {
      dispatch(ConnEvent.Start);
    }
  }, [actions, dispatch, handleNavigateToAddData, isInputConnected]);

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
