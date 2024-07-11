import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useGestureActions } from "../gestures-hooks";

const TrainingButton = (props: ButtonProps) => {
  const actions = useGestureActions();

  // TODO: disable when isTraining
  return (
    <Button
      variant="primary"
      isDisabled={!actions.isSufficientForTraining()}
      {...props}
    >
      <FormattedMessage id="menu.trainer.trainModelButton" />
    </Button>
  );
};

export default TrainingButton;
