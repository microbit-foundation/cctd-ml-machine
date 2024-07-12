import { Grid, GridItem, GridProps, HStack, Text } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import InfoToolTip, { InfoToolTipProps } from "./InfoToolTip";

type GridColumnHeadingItemProps = InfoToolTipProps;

interface HeadingGridProps extends Omit<GridProps, "children"> {
  headings: GridColumnHeadingItemProps[];
}

const HeadingGrid = ({ headings, ...props }: HeadingGridProps) => {
  return (
    <Grid
      {...props}
      flexShrink={0}
      h="3.25rem"
      alignItems="center"
      borderTopWidth={3}
      borderBottomWidth={3}
      borderColor="gray.200"
    >
      {headings.map((props, idx) => (
        <GridColumnHeadingItem {...props} key={idx} />
      ))}
    </Grid>
  );
};

const GridColumnHeadingItem = (props: GridColumnHeadingItemProps) => {
  return (
    <GridItem>
      <HStack opacity={0.7}>
        <Text>
          <FormattedMessage id={props.titleId} />
        </Text>
        <InfoToolTip {...props}></InfoToolTip>
      </HStack>
    </GridItem>
  );
};

export default HeadingGrid;
