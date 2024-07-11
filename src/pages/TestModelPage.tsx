import DefaultPageLayout from "../components/DefaultPageLayout";
import TabView from "../components/TabView";
import TrainModelFirstView from "../components/TrainModelFirstView";
import { testModelConfig } from "../steps-config";
import { TrainingStatus, useTrainingStatus } from "../training-status-hook";

const TestModelPage = () => {
  const [trainingStatus] = useTrainingStatus();

  return (
    <DefaultPageLayout titleId={`${testModelConfig.id}-title`}>
      <TabView activeStep={testModelConfig.id} />
      {trainingStatus === TrainingStatus.Complete ? (
        <></>
      ) : (
        <TrainModelFirstView />
      )}
    </DefaultPageLayout>
  );
};

export default TestModelPage;
