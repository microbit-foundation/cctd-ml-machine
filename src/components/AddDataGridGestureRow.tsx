import { useCallback } from "react";
import { useIntl } from "react-intl";
import { GestureData, useGestureActions } from "../gestures-hooks";
import AddDataGestureRecordingGridItem from "./AddDataGestureRecordingGridItem";
import AddDataGestureNameGridItem from "./AddDataGestureNameGridItem";
import { GridItem } from "@chakra-ui/react";

interface AddDataGridGestureRowProps {
  gesture: GestureData;
  selected: boolean;
  onSelectRow: () => void;
}

const AddDataGridGestureRow = ({
  gesture,
  selected,
  onSelectRow,
}: AddDataGridGestureRowProps) => {
  const intl = useIntl();
  const actions = useGestureActions();

  const handleDeleteGesture = useCallback(() => {
    const confirmationText = intl.formatMessage(
      { id: "alert.deleteGestureConfirm" },
      { action: gesture.name }
    );
    if (!window.confirm(confirmationText)) {
      return;
    }
    actions.deleteGesture(gesture.ID);
  }, [actions, gesture.ID, gesture.name, intl]);

  return (
    <>
      <AddDataGestureNameGridItem
        gestureId={gesture.ID}
        name={gesture.name}
        onCloseClick={handleDeleteGesture}
        onSelectRow={onSelectRow}
        selected={selected}
      />
      {gesture.name.length > 0 || gesture.recordings.length > 0 ? (
        <AddDataGestureRecordingGridItem
          gesture={gesture}
          selected={selected}
          onSelectRow={onSelectRow}
        />
      ) : (
        // Empty grid item to fill column space
        <GridItem />
      )}
    </>
  );
};

export default AddDataGridGestureRow;
