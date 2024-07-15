import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Stage, useStatus } from "../status-hook";

const TrainingButton = (props: ButtonProps) => {
  const [{ stage }] = useStatus();

  // TODO: disable when isTraining
  return (
    <Button
      variant="primary"
      isDisabled={
        stage === Stage.TrainingInProgress || stage === Stage.InsufficientData
      }
      {...props}
    >
      <FormattedMessage id="menu.trainer.trainModelButton" />
    </Button>
  );
};

export default TrainingButton;
