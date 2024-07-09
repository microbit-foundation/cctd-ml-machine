import {
  Card,
  CardBody,
  CardHeader,
  CardProps,
  CloseButton,
  GridItem,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useIntl } from "react-intl";

interface GestureGridItemProps extends CardProps {
  name: string;
  onCloseClick: () => void;
  onSelectRow: () => void;
  onNameChange: (newName: string) => void;
}

const gestureNameMaxLength = 18;

const GestureGridItem = ({
  name,
  onCloseClick,
  onSelectRow,
  onNameChange,
  ...cardProps
}: GestureGridItemProps) => {
  const intl = useIntl();
  const toast = useToast();
  const toastId = "name-too-long-toast";

  const handleNameChange: React.FocusEventHandler<HTMLInputElement> =
    useCallback((e) => onNameChange(e.target.value), [onNameChange]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      // Validate gesture name
      if (
        e.target.value.trim().length >= gestureNameMaxLength &&
        !toast.isActive(toastId)
      ) {
        toast({
          id: toastId,
          position: "top",
          duration: 5_000,
          title: intl.formatMessage(
            { id: "alert.data.classNameLengthAlert" },
            { maxLen: gestureNameMaxLength }
          ),
          variant: "subtle",
          status: "error",
        });
      }
    },
    [intl, toast]
  );

  return (
    <GridItem>
      <Card p={2} h="120px" display="flex" {...cardProps} onClick={onSelectRow}>
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
            onBlur={handleNameChange}
            onChange={onChange}
            size="sm"
          />
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default GestureGridItem;
