import { BoxProps, Text } from "@chakra-ui/react";

interface PercentageDisplayProps extends BoxProps {
  value: number;
  colorScheme?: string;
}

const PercentageDisplay = ({
  value,
  colorScheme = "gray.600",
  ...rest
}: PercentageDisplayProps) => {
  return (
    <Text
      bgColor={colorScheme}
      color="white"
      rounded="md"
      textAlign="center"
      fontSize="xl"
      w="60px"
      {...rest}
    >{`${Math.round(value * 100)}%`}</Text>
  );
};

export default PercentageDisplay;
