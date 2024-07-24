import { ReactNode, useCallback } from "react";
import { ResourceId } from "../../pages-config";
import DefaultPageLayout from "../DefaultPageLayout";
import {
  AspectRatio,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { createHomePageUrl } from "../../urls";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./styles.module.css";
import StartResumeActions from "../StartResumeActions";

interface ResourcePageLayoutProps {
  id: ResourceId;
  videoTitleId: string;
  videoId: string;
  children: ReactNode;
}

const ResourcePageLayout = ({
  id,
  videoId,
  videoTitleId,
  children,
}: ResourcePageLayoutProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const handleNavigateToHome = useCallback(
    () => navigate(createHomePageUrl()),
    [navigate]
  );
  const titleId = `${id}-title`;
  return (
    <DefaultPageLayout titleId={titleId}>
      <Container
        maxW={{ base: "80%", lg: "75%", xl: "1084px" }}
        p={10}
        gap={5}
        flexDirection="column"
        display="flex"
      >
        <VStack alignItems="start" gap={5}>
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={handleNavigateToHome}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink>
                <FormattedMessage id={titleId} />
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Heading as="h1" fontSize="4xl" fontWeight="bold">
            <FormattedMessage id={titleId} />
          </Heading>
        </VStack>
        <VStack>
          <AspectRatio w={{ lg: "75%", md: "full" }} ratio={16 / 9}>
            <iframe
              title={intl.formatMessage({ id: videoTitleId })}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          </AspectRatio>
        </VStack>
        <Card w="full" p="30px" rounded="lg" shadow="xl">
          <CardBody maxW={{ lg: "75%" }} className={styles.content}>
            {children}
            <StartResumeActions justifyContent="start" mt={8} />
          </CardBody>
        </Card>
      </Container>
    </DefaultPageLayout>
  );
};

export default ResourcePageLayout;
