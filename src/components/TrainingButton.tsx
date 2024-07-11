import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { TrainingStatus, useTrainingStatus } from "../training-hook";

const TrainingButton = (props: ButtonProps) => {
  const [trainingStatus] = useTrainingStatus();

  // TODO: disable when isTraining
  return (
    <Button
      variant="primary"
      isDisabled={
        trainingStatus === TrainingStatus.InProgress ||
        trainingStatus === TrainingStatus.InsufficientData
      }
      {...props}
    >
      <FormattedMessage id="menu.trainer.trainModelButton" />
    </Button>
  );
};

export default TrainingButton;
