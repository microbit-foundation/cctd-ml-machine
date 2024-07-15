import { Button, HStack, StackProps } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { createStepPageUrl } from "../urls";
import { useConnectionFlow } from "../connections";
import { ConnEvent } from "../connection-flow";
import { useGestureActions } from "../gestures-hooks";

const StartResumeActions = ({ ...props }: Partial<StackProps>) => {
  const actions = useGestureActions();
  const hasExistingSession = useMemo(() => actions.hasGestures(), [actions]);
  const navigate = useNavigate();
  const { dispatch } = useConnectionFlow();
  // TODO: check input connected
  const isInputConnected = true;

  const handleNavigateToAddData = useCallback(() => {
    navigate(createStepPageUrl("add-data"));
  }, [navigate]);

  const handleNewSession = useCallback(() => {
    if (isInputConnected) {
      handleNavigateToAddData();
    } else {
      dispatch(ConnEvent.Start);
    }
  }, [dispatch, handleNavigateToAddData, isInputConnected]);
  return (
    <HStack w="100%" justifyContent="center" gap={5} {...props}>
      {hasExistingSession && (
        <Button size="lg" variant="primary" onClick={handleNavigateToAddData}>
          <FormattedMessage id="footer.resume" />
        </Button>
      )}
      <Button
        onClick={handleNewSession}
        size="lg"
        variant={hasExistingSession ? "secondary" : "primary"}
      >
        <FormattedMessage id="footer.start" />
      </Button>
    </HStack>
  );
};

export default StartResumeActions;
