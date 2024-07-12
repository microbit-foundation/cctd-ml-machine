import { Grid, GridProps } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useGestureData } from "../gestures-hooks";
import { useMlActions } from "../ml-actions";
import CertaintyThresholdGridItem from "./CertaintyThresholdGridItem";
import GestureNameGridItem from "./GestureNameGridItem";
import HeadingGrid from "./HeadingGrid";

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 1fr",
  gap: 3,
  px: 10,
  py: 2,
  w: "100%",
};

const TestModelGridView = () => {
  const [gestures] = useGestureData();
  const actions = useMlActions();
  const predicted = useMemo(() => actions.getPredicted(), [actions]);

  return (
    <>
      <HeadingGrid
        {...gridCommonProps}
        headings={[
          {
            titleId: "content.model.output.action.descriptionTitle",
            descriptionId: "content.model.output.action.descriptionBody",
          },
          {
            titleId: "content.model.output.certainty.descriptionTitle",
            descriptionId: "content.model.output.certainty.descriptionBody",
          },
        ]}
      />
      <Grid
        {...gridCommonProps}
        alignItems="start"
        autoRows="max-content"
        overflow="auto"
        flexGrow={1}
        h={0}
      >
        {gestures.data.map(({ ID, name, confidence }, idx) => (
          <React.Fragment key={idx}>
            <GestureNameGridItem id={ID} name={name} readOnly={true} />
            <CertaintyThresholdGridItem
              onThresholdChange={() => {}}
              {...confidence}
              isTriggered={predicted?.ID === ID}
            />
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

export default TestModelGridView;
