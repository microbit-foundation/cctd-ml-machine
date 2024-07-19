import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

interface TroubleshootingLinkProps {
  textId: string;
}

const TroubleshootingLink = ({ textId }: TroubleshootingLinkProps) => {
  return (
    <Button
      variant="link"
      as="a"
      display="flex"
      gap={1}
      fontSize="lg"
      alignItems="center"
      flexDirection="row"
      href="https://support.microbit.org/a/solutions/articles/19000157495"
      target="_blank"
      rel="noopener"
    >
      <FormattedMessage id={textId} />
      <ExternalLinkIcon />
    </Button>
  );
};

export default TroubleshootingLink;
