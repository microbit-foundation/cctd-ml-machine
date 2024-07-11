import addDataImage from "./images/add_data.svg";
import testModelImage from "./images/test_model_blue.svg";
import trainModelImage from "./images/train_model_blue.svg";
import AddDataPage from "./pages/AddDataPage";
import TestModelPage from "./pages/TestModelPage";
import TrainModelPage from "./pages/TrainModelPage";

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
