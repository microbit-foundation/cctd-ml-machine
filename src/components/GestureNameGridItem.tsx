import {
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  GridItem,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useGestureActions } from "../gestures-hooks";

interface GestureNameGridItemProps {
  name: string;
  onCloseClick?: () => void;
  onSelectRow?: () => void;
  id: number;
  selected?: boolean;
  readOnly: boolean;
}

const gestureNameMaxLength = 18;

const GestureNameGridItem = ({
  name,
  onCloseClick,
  onSelectRow,
  id,
  selected = false,
  readOnly = false,
}: GestureNameGridItemProps) => {
  const intl = useIntl();
  const toast = useToast();
  const toastId = "name-too-long-toast";
  const actions = useGestureActions();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.value.trim();
      // Validate gesture name length
      if (name.length >= gestureNameMaxLength && !toast.isActive(toastId)) {
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
        return;
      }
      actions.setGestureName(id, name);
    },
    [actions, id, intl, toast]
  );

  return (
    <GridItem>
      <Card
        p={2}
        h="120px"
        display="flex"
        borderColor="brand.500"
        borderWidth={selected ? 1 : 0}
        onClick={onSelectRow}
      >
        {!readOnly && (
          <CardHeader p={0} display="flex" justifyContent="end" h="24px">
            {onCloseClick && (
              <CloseButton
                onClick={onCloseClick}
                size="sm"
                aria-label={intl.formatMessage(
                  { id: "content.data.deleteAction" },
                  { action: name }
                )}
              />
            )}
          </CardHeader>
        )}
        <CardBody
          pt={readOnly ? undefined : 0}
          pr={2}
          pl={2}
          alignContent="center"
        >
          <Input
            isTruncated
            readOnly={readOnly}
            defaultValue={name}
            borderWidth={0}
            {...(readOnly
              ? { bgColor: "transparent", size: "lg" }
              : { bgColor: "gray.25", size: "sm" })}
            _placeholder={{ opacity: 0.8, color: "gray.900" }}
            placeholder={intl.formatMessage({
              id: "content.data.classPlaceholderNewClass",
            })}
            onChange={onChange}
          />
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default GestureNameGridItem;
