import {
  AspectRatio,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import DefaultPageLayout from "../components/DefaultPageLayout";
import YoutubeVideoEmbed from "../components/YoutubeVideoEmbed";
import addDataImage from "../images/add_data.svg";
import testModelImage from "../images/test_model_blue.svg";
import trainModelImage from "../images/train_model_blue.svg";
import ResourceCard from "../components/ResourceCard";
import ResourceCardPlaceholder from "../components/ResourceCardPlaceholder";
import { useNavigate } from "react-router";
import { createSessionPageUrl } from "../urls";
import { SessionPageId } from "../pages-config";

const HomePage = () => {
  const navigate = useNavigate();
  const handleGetStarted = useCallback(() => {
    // This isn't right, need existing session etc.
    navigate(createSessionPageUrl(SessionPageId.DataSamples));
  }, [navigate]);
  return (
    <DefaultPageLayout
      toolbarItemsRight={
        <Button variant="toolbar" onClick={handleGetStarted}>
          Get started
        </Button>
      }
    >
      <Stack gap={16} p={8} w="100%">
        <HStack w="100%" h="100%" alignItems="flex-start" gap={5}>
          <VStack flex="1" alignItems="flex-start" gap={5} h="100%">
            <Heading as="h1" fontSize="4xl" fontWeight="bold">
              <FormattedMessage id="homepage-title" />
            </Heading>
            <Text fontSize="md" fontWeight="bold">
              Create AI on your BBC micro:bit using movement and machine
              learning
            </Text>
            <Text fontSize="md">
              Train a machine learning model on your own movement data.
            </Text>
            <Text fontSize="md">
              Add code to use your model in real-world projects.
            </Text>
            <Button size="lg" variant="primary" onClick={handleGetStarted}>
              Get started
            </Button>
          </VStack>
          <Box flex="1">
            <YoutubeVideoEmbed
              youtubeId="ZhUtuuQemFc"
              alt="Introductory video"
            />
          </Box>
        </HStack>
        <VStack>
          <Heading as="h2" textAlign="center">
            Step by step
          </Heading>
          <VStack gap={5} maxW="container.md">
            <Step
              title={<FormattedMessage id="add-data-title" />}
              imgSrc={addDataImage}
              description={<FormattedMessage id="add-data-intro-description" />}
            />
            <Step
              title={<FormattedMessage id="train-model-title" />}
              imgSrc={trainModelImage}
              description={
                <FormattedMessage id="train-model-intro-description" />
              }
            />
            <Step
              title={<FormattedMessage id="test-model-title" />}
              imgSrc={testModelImage}
              description={
                <FormattedMessage id="test-model-intro-description" />
              }
            />
          </VStack>
        </VStack>
        <VStack gap={8}>
          <Heading as="h2" textAlign="center">
            Projects
          </Heading>
          <HStack gap={5}>
            <ResourceCard
              title="Simple AI activity timer"
              url="https://www.example.com"
              imgSrc="https://cdn.sanity.io/images/ajwvhvgo/production/1aaac1553237900c774216aad17475ef34f8fe48-800x600.jpg?fit=max&w=1200&h=1200"
            />
            <ResourceCardPlaceholder />
          </HStack>
        </VStack>
      </Stack>
    </DefaultPageLayout>
  );
};

interface StepProps {
  title: ReactNode;
  imgSrc: string;
  description: ReactNode;
}

const Step = ({ title, imgSrc, description }: StepProps) => (
  <HStack w="100%" justifyContent="space-between">
    <VStack gap={2} alignItems="flex-start">
      <Heading as="h2" textAlign="center" fontSize="xl">
        {title}
      </Heading>
      <Text maxW="md">{description}</Text>
    </VStack>
    <AspectRatio ratio={288 / 172} width="200px">
      <Image src={imgSrc} alt="" />
    </AspectRatio>
  </HStack>
);

export default HomePage;
