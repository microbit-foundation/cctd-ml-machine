import { Tab, TabIndicator, TabList, Tabs, VStack } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { StepId, stepsConfig } from "../pages-config";
import { createStepPageUrl } from "../urls";
import { useNavigate } from "react-router";

interface TabViewProps {
  activeStep: StepId;
}
const TabView = ({ activeStep }: TabViewProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const activeIndex = stepsConfig.findIndex((s) => s.id === activeStep);
  return (
    <VStack justifyContent="center" w="100%" bgColor="white">
      <Tabs
        isManual
        variant="unstyled"
        defaultIndex={activeIndex}
        bgColor="white"
      >
        <TabList>
          {stepsConfig.map((step, idx) => (
            <Tab
              onClick={() => navigate(createStepPageUrl(step.id))}
              key={step.id}
              fontSize="lg"
              fontWeight="bold"
              px={12}
              opacity={0.55}
              _selected={{ opacity: 1 }}
            >
              {`${idx + 1}. ${intl.formatMessage({ id: `${step.id}-title` })}`}
            </Tab>
          ))}
        </TabList>
        <TabIndicator mt="-4px" height="4px" bg="green.500" />
      </Tabs>
    </VStack>
  );
};

export default TabView;