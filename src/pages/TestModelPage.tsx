import DefaultPageLayout from "../components/DefaultPageLayout";
import LiveGraphPanel from "../components/LiveGraphPanel";
import TabView from "../components/TabView";
import TestModelGridView from "../components/TestModelGridView";
import TrainModelFirstView from "../components/TrainModelFirstView";
import { testModelConfig } from "../steps-config";
import { Stage, useStatus } from "../status-hook";

const TestModelPage = () => {
  const [{ stage }] = useStatus();

  return (
    <DefaultPageLayout titleId={`${testModelConfig.id}-title`}>
      <TabView activeStep={testModelConfig.id} />
      {stage === Stage.TrainingComplete ? (
        <>
          <TestModelGridView />
          <LiveGraphPanel />
        </>
      ) : (
        <TrainModelFirstView />
      )}
    </DefaultPageLayout>
  );
};

export default TestModelPage;
