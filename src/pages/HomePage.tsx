import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Stack,
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
import blockImage from "../images/block.png";
import xyzGraph from "../images/xyz-graph.png";
import { SessionPageId } from "../pages-config";
import { createSessionPageUrl } from "../urls";
import PercentageMeter from "../components/PercentageMeter";
import PercentageDisplay from "../components/PercentageDisplay";
import { ArrowDownIcon } from "@chakra-ui/icons";
import RecordingGraph from "../components/RecordingGraph";

const graphData = {
  x: [
    0.4, 0.152, -0.008, 0.056, -0.324, 1.604, 2.04, 0.92, 1.844, 1.872, 2.04,
    2.04, 2.04, 2.04, 0.196, -1.004, 0.928, 0.624, -0.052, -0.38, 0.08, -0.136,
    0.156, 0.316, -0.264, -0.28, 2.04, 2.04, 1.896, 2.04, 2.04, 2.04, 2.04,
    2.04, 1.484, -0.408, -0.424, 0.988, 0.412, -0.528, -0.568, 0.428, 0.44,
    0.364, 0.004, -0.028, -0.304, 2.04, 2.004, 0.98, 2.04, 2.04, 1.368, 2.04,
    2.04, 1.472, -1.328, 0.4, 0.904, -0.392, -0.2, 0.06, -0.044, -0.172, 0.076,
    -0.044, -0.316, 0.692, 2.04, 2.04, 2.04, 1.148, 1.1, 2.04, 2.04, 2.04,
    0.952, -0.68, 0.032, 0.48, -0.08, -0.068, 0.024, 0.336, 0.204, -0.1, -0.244,
    0.04, 1.168,
  ],
  y: [
    -0.752, -1.192, -1.212, -1.456, -0.972, -0.42, 0.292, 1.68, 0.544, -0.66,
    -1.148, -0.224, -0.784, -1.196, -0.888, 0.472, 1.172, -0.776, -0.86, 0.476,
    0.324, 0.228, 0.576, 0.68, 0.904, 0.708, -0.9, 0.02, 0.752, 0.424, -1.012,
    -0.44, -0.144, -0.032, -0.072, 0.764, 1.228, 0.872, 0.436, 0.616, 0.324,
    0.26, -0.416, -1.748, -2.04, -1.036, 0.596, 0.788, 0.46, 0.02, 0.676,
    -1.332, -1.112, -0.48, -0.548, -1.16, 0.516, 0.264, -0.72, -0.8, 0.488,
    0.868, 0.836, 0.404, 0.36, 0.276, 0.244, 0.348, 0.88, 1.468, -0.596, -1.248,
    -0.864, 0.068, -0.512, 0.092, 0.592, -0.024, 1.008, 0.432, 0.508, 0.76,
    0.568, 0.14, -0.348, -1.192, -1.528, -1.496, 0.38,
  ],
  z: [
    -0.408, -0.152, 0.06, -0.044, 2.04, -0.7, -1.548, 0.58, 0.62, 0.932, 0.764,
    0.408, 0.132, -1.004, 0.324, 2.04, 1.156, 0.156, 0.076, -0.232, -0.244,
    0.036, 0.056, 0.024, 1.044, 2.04, -2.012, 0.644, -0.44, 0.42, 0.672, 0.604,
    0.132, -0.432, 0, 1.176, 2.04, 0.152, 0.04, -0.544, 0.072, 0.116, 0.208,
    0.868, 0.816, 0.324, 2.04, -2.04, 1.536, -0.044, 0.444, 0.552, 0.784,
    -0.004, -0.604, -0.008, 2.04, 1.764, 0.044, 0.068, -0.02, -0.052, -0.052,
    0.024, -0.196, 0.28, 2.04, 0.704, -0.576, 0.432, 0.788, 0.88, 0.872, 0.22,
    0.288, -0.516, 0.348, 2.04, 1.892, 0.12, -0.04, -0.464, -0.104, -0.088,
    -0.084, 0.22, 0.74, 2.04, -0.096,
  ],
};

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
        <HStack
          gap={5}
          flexDir={{ base: "column", lg: "row" }}
          w={{ base: "100%", lg: "unset" }}
        >
          <VStack
            flex="1"
            alignItems="flex-start"
            gap={5}
            w={{ base: "100%", lg: "unset" }}
          >
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
              mt={5}
            >
              Get started
            </Button>
          </VStack>
          <Box flex="1" position="relative">
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
        <VStack gap={8}>
          <Heading as="h2" textAlign="center">
            Step by step
          </Heading>
          <VStack gap={5} maxW="container.md">
            <Step
              title="Collect data"
              image={
                <HStack w="200px" borderRadius="md" position="relative" mb="5">
                  <RecordingGraph data={graphData} bgColor="white" w="158px" />
                  <RecordingGraph
                    data={graphData}
                    bgColor="white"
                    w="158px"
                    position="absolute"
                    left="20px"
                    top="10px"
                  />
                  <RecordingGraph
                    data={graphData}
                    bgColor="white"
                    w="158px"
                    position="absolute"
                    left="40px"
                    top="20px"
                  />
                </HStack>
              }
              description="Connect a micro:bit to collect data samples of the actions you would like your model to recognise (e.g. ‘waving’ and ‘clapping’)."
            />
            {/* micro:bit AI creator trains a machine learning model to recognise the actions. */}

            <Step
              title="Test your model"
              image={
                <VStack
                  w="200px"
                  bgColor="white"
                  borderRadius="md"
                  aspectRatio={288 / 172}
                  justifyContent="space-evenly"
                  alignItems="stretch"
                  p={3}
                >
                  <PercentageDisplay value={0.8} alignSelf="center" />
                  <PercentageMeter value={0.8} />
                </VStack>
              }
              description={
                "Try each action by moving your data collection micro:bit. Does the model detect your actions? Add more data to improve your model."
              }
            />
            <Step
              title="Code"
              image={
                <Image
                  src={blockImage}
                  alt=""
                  aspectRatio={288 / 172}
                  width="200px"
                />
              }
              description={
                "Use Microsoft MakeCode to download the program and machine learning model to your micro:bit. Add more blocks to create your own programs using your model."
              }
            />
          </VStack>
        </VStack>
        <VStack gap={8}>
          <Heading as="h2" textAlign="center">
            Projects
          </Heading>
          <HStack gap={5} flexDir={{ base: "column", lg: "row" }}>
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
  image: ReactNode;
  description: ReactNode;
}

const Step = ({ title, image, description }: StepProps) => (
  <HStack
    w="100%"
    justifyContent="space-between"
    flexDir={{ base: "column", lg: "row" }}
  >
    <VStack gap={2} alignItems="flex-start">
      <Heading as="h2" textAlign="center" fontSize="xl">
        {title}
      </Heading>
      <Text maxW="md">{description}</Text>
    </VStack>
    {image}
  </HStack>
);

export default HomePage;
