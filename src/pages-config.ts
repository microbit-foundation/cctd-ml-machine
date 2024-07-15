import addDataImage from "./images/add_data.svg";
import testModelImage from "./images/test_model_blue.svg";
import trainModelImage from "./images/train_model_blue.svg";
import resourceGetStartedImage from "./images/resource-get-started.jpg";
import resourceIntroducingToolImage from "./images/resource-introducing-tool.jpg";
import AddDataPage from "./pages/AddDataPage";
import TestModelPage from "./pages/TestModelPage";
import TrainModelPage from "./pages/TrainModelPage";
import GetStartedResourcePage from "./pages/GetStartedResourcePage";
import IntroducingToolResourcePage from "./pages/IntroducingToolResourcePage";

export type StepId = "add-data" | "train-model" | "test-model";

export interface StepConfig {
  id: StepId;
  imgSrc: string;
  pageElement: () => JSX.Element;
}

export const addDataConfig: StepConfig = {
  id: "add-data",
  imgSrc: addDataImage,
  pageElement: AddDataPage,
};

export const trainModelConfig: StepConfig = {
  id: "train-model",
  imgSrc: trainModelImage,
  pageElement: TrainModelPage,
};

export const testModelConfig: StepConfig = {
  id: "test-model",
  imgSrc: testModelImage,
  pageElement: TestModelPage,
};

export const stepsConfig: StepConfig[] = [
  addDataConfig,
  trainModelConfig,
  testModelConfig,
];

export type ResourceId =
  | "introducing-the-microbit-machine-learning-tool"
  | "get-started";

export interface ResourceConfig {
  id: ResourceId;
  imgSrc: string;
  videoId: string;
  videoTitleId: string;
  pageElement: () => JSX.Element;
}

export const getStartedResouceConfig: ResourceConfig = {
  id: "get-started",
  imgSrc: resourceGetStartedImage,
  pageElement: GetStartedResourcePage,
  videoId: "XTq0Z3SdbQw",
  videoTitleId: "resources.getStarted.video",
};

export const introducingToolResouceConfig: ResourceConfig = {
  id: "introducing-the-microbit-machine-learning-tool",
  imgSrc: resourceIntroducingToolImage,
  pageElement: IntroducingToolResourcePage,
  videoId: "EArs-Xa7-Ag",
  videoTitleId: "resources.introduction.video",
};

export const resourcesConfig: ResourceConfig[] = [
  introducingToolResouceConfig,
  getStartedResouceConfig,
];
