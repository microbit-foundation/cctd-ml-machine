import { Button, Heading, Text } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useGestureActions } from "../gestures-hooks";
import { useNavigate } from "react-router";
import { createStepPageUrl } from "../urls";
import TrainingButton from "./TrainingButton";

const TrainingStatusView = () => {
  const navigate = useNavigate();
  const actions = useGestureActions();
  const isSufficientData = actions.isSufficientForTraining();

  const navigateToDataPage = useCallback(() => {
    navigate(createStepPageUrl("add-data"));
  }, [navigate]);

  // TODO: Train
  const handleTrain = useCallback(() => {}, []);

  if (!isSufficientData) {
    return (
      <TrainingStatusSection
        statusId="menu.trainer.notEnoughDataHeader1"
        descriptionId="menu.trainer.notEnoughDataInfoBody"
      >
        <Button variant="primary" onClick={navigateToDataPage}>
          <FormattedMessage id="menu.trainer.addDataButton" />
        </Button>
      </TrainingStatusSection>
    );
  }
  return (
    <TrainingStatusSection statusId="content.trainer.enoughdata.title">
      <TrainingButton onClick={handleTrain} />
    </TrainingStatusSection>
  );
};

interface TrainingStatusSectionProps {
  statusId: string;
  descriptionId?: string;
  children: ReactNode;
}

const TrainingStatusSection = ({
  statusId,
  descriptionId,
  children,
}: TrainingStatusSectionProps) => {
  return (
    <>
      <Heading as="h2" fontSize="lg" fontWeight="semibold">
        <FormattedMessage id={statusId} />
      </Heading>
      {descriptionId && (
        <Text>
          <FormattedMessage id={descriptionId} />
        </Text>
      )}
      {children}
    </>
  );
};

export default TrainingStatusView;
