import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import DefaultPageLayout from "../components/DefaultPageLayout";
import ResourceCard from "../components/ResourceCard";
import ResourceCardPlaceholder from "../components/ResourceCardPlaceholder";
import YoutubeVideoEmbed from "../components/YoutubeVideoEmbed";
import addDataImage from "../images/add_data.svg";
import testModelImage from "../images/test_model_blue.svg";
import xyzGraph from "../images/xyz-graph.png";
import { SessionPageId } from "../pages-config";
import { createSessionPageUrl } from "../urls";

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
      <Container centerContent gap={16} p={8} maxW="container.lg">
        <HStack gap={5}>
          <VStack flex="1" alignItems="flex-start" gap={5}>
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
            <Button
              size="lg"
              variant="primary"
              onClick={handleGetStarted}
              mt={12}
            >
              Get started
            </Button>
          </VStack>
          <Box flex="1" position="relative" mb={12}>
            <Image src={xyzGraph} borderRadius="md" bgColor="white" pr={1} />
          </Box>
        </HStack>
        <VStack spacing={8} w="100%" maxW="container.md">
          <Heading as="h2" textAlign="center">
            How it works
          </Heading>
          <Box w="100%">
            <YoutubeVideoEmbed
              youtubeId="ZhUtuuQemFc"
              alt="Introductory video"
            />
          </Box>
          <Text fontSize="md">
            Watch the video to learn how to use the micro:bit AI creator.
          </Text>
        </VStack>
        <VStack>
          <Heading as="h2" textAlign="center">
            Step by step
          </Heading>
          <VStack gap={5} maxW="container.md">
            <Step
              title="Collect data"
              imgSrc={addDataImage}
              description="Connect a micro:bit and collect data samples of the actions you would like your model to recognise (e.g. ‘waving’ and ‘clapping’)."
            />
            <Step
              title="Train & test"
              imgSrc={testModelImage}
              description={
                "micro:bit AI creator will uses your data to train a machine learning model to recognise the actions. Does the model detect your actions?"
              }
            />
            <Step
              title="Code"
              imgSrc={testModelImage}
              description={
                "Open your project in MakeCode to download the program and your machine learning model to a micro:bit. You can add more blocks to create your own programs using your model."
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
      </Container>
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
