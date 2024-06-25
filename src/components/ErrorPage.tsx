import { Heading, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = { title: string; children: ReactNode };

const ErrorPage = ({ title, children }: Props) => (
  <VStack
    as="main"
    spacing={10}
    minH="100vh"
    w="100%"
    alignItems="center"
    bgColor="whitesmoke"
  >
    <Heading mt="33vh" as="h1">
      {title}
    </Heading>
    <VStack>{children}</VStack>
  </VStack>
);

export default ErrorPage;
