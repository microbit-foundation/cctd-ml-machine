import { StackProps, Text } from "@chakra-ui/react";

interface PercentageDisplayProps extends StackProps {
  value: number;
  colorScheme?: string;
}

const PercentageDisplay = ({
  value,
  colorScheme = "gray.600",
}: PercentageDisplayProps) => {
  return (
    <Text
      bgColor={colorScheme}
      color="white"
      rounded="md"
      textAlign="center"
      fontSize="xl"
      w="60px"
    >{`${Math.round(value * 100)}%`}</Text>
  );
};

export default PercentageDisplay;
