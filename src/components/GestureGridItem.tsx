import {
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  GridItem,
  Input,
} from "@chakra-ui/react";
import { useIntl } from "react-intl";

interface GestureGridItemProps {
  name: string;
  onCloseClick: () => void;
}

const GestureGridItem = ({ name, onCloseClick }: GestureGridItemProps) => {
  const intl = useIntl();
  return (
    <GridItem>
      <Card p={2} h="120px" display="flex">
        <CardHeader p={0} display="flex" justifyContent="end">
          <CloseButton
            onClick={onCloseClick}
            size="sm"
            aria-label={intl.formatMessage(
              { id: "content.data.deleteAction" },
              { action: name }
            )}
          />
        </CardHeader>
        <CardBody pt={0} pr={2} pl={2} alignContent="center">
          <Input
            defaultValue={name}
            borderWidth={0}
            bgColor="gray.25"
            _placeholder={{ opacity: 0.8, color: "gray.900" }}
            placeholder={intl.formatMessage({
              id: "content.data.classPlaceholderNewClass",
            })}
            size="sm"
          />
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default GestureGridItem;
