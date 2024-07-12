import {
  Card,
  CardBody,
  GridItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage, useIntl } from "react-intl";
import PercentageMeter from "./PercentageMeter";

interface CertaintyThresholdGridItemProps {
  requiredConfidence?: number;
  currentConfidence?: number;
  onThresholdChange: (val: number) => void;
  isTriggered: boolean;
}

const CertaintyThresholdGridItem = ({
  requiredConfidence = 0,
  currentConfidence = 0,
  onThresholdChange,
  isTriggered,
}: CertaintyThresholdGridItemProps) => {
  const intl = useIntl();
  const barWidth = 240;
  return (
    <GridItem>
      <Card
        py={2}
        px={4}
        h="120px"
        display="flex"
        flexDirection="row"
        width="fit-content"
        borderWidth={1}
        borderColor="transparent"
      >
        <CardBody
          display="flex"
          flexDirection="column"
          p={1}
          gap={1}
          justifyContent="center"
        >
          <PercentageMeter
            meterBarWidthPx={barWidth}
            percentage={currentConfidence * 100}
            w="100%"
            colorScheme={isTriggered ? "green.500" : undefined}
          />
          <VStack alignItems="left" gap={1}>
            <Text fontSize="sm" textColor="gray.600">
              <FormattedMessage id="content.model.output.recognitionPoint" />
            </Text>
            <Slider
              onChange={onThresholdChange}
              aria-label={intl.formatMessage({
                id: "content.model.output.recognitionPoint",
              })}
              defaultValue={requiredConfidence * 100}
              w={`${barWidth}px`}
            >
              <SliderTrack h="8px" rounded="full">
                <SliderFilledTrack bg="gray.600" />
              </SliderTrack>
              <SliderThumb bg="gray.600" />
            </Slider>
          </VStack>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default CertaintyThresholdGridItem;
