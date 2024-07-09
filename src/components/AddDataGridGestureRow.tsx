import { useCallback } from "react";
import { useIntl } from "react-intl";
import { GestureData, useGestureActions } from "../gestures-hooks";
import AddDataGestureRecordingGridItem from "./AddDataGestureRecordingGridItem";
import AddDataGestureNameGridItem from "./AddDataGestureNameGridItem";

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
      <AddDataGestureRecordingGridItem
        gesture={gesture}
        selected={selected}
        onSelectRow={onSelectRow}
      />
    </>
  );
};

export default AddDataGridGestureRow;
