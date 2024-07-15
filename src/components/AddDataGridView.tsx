import { Grid, GridProps } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useGestureData } from "../gestures-hooks";
import AddDataGridRow from "./AddDataGridRow";
import AddDataGridWalkThrough from "./AddDataGridWalkThrough";
import HeadingGrid from "./HeadingGrid";

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 1fr",
  gap: 3,
  px: 10,
  py: 2,
  w: "100%",
};

const headings = [
  {
    titleId: "content.data.classification",
    descriptionId: "content.data.classHelpBody",
  },
  {
    titleId: "content.data.data",
    descriptionId: "content.data.dataDescription",
  },
];

const AddDataGridView = () => {
  const [gestures] = useGestureData();
  const [selected, setSelected] = useState<number>(0);
  const showWalkThrough = useMemo<boolean>(
    () =>
      gestures.data.length === 0 ||
      (gestures.data.length === 1 && gestures.data[0].recordings.length === 0),
    [gestures.data]
  );

  return (
    <>
      <HeadingGrid
        position="sticky"
        top={0}
        {...gridCommonProps}
        headings={headings}
      />
      <Grid
        {...gridCommonProps}
        alignItems="start"
        autoRows="max-content"
        overflow="auto"
        flexGrow={1}
        h={0}
      >
        {showWalkThrough ? (
          <AddDataGridWalkThrough gesture={gestures.data[0]} />
        ) : (
          gestures.data.map((g, idx) => (
            <AddDataGridRow
              key={g.ID}
              gesture={g}
              selected={selected === idx}
              onSelectRow={() => setSelected(idx)}
            />
          ))
        )}
      </Grid>
    </>
  );
};

export default AddDataGridView;
