import { HStack, StackProps, Text } from "@chakra-ui/react";

interface PercentageMeterProps extends StackProps {
  percentage: number;
  colorScheme?: string;
  meterBarWidthPx?: number;
}

const PercentageMeter = ({
  percentage,
  colorScheme = "gray.600",
  meterBarWidthPx,
  ...props
}: PercentageMeterProps) => {
  const height = 3;
  const numTicks = 9;
  return (
    <HStack gap={5} {...props}>
      <HStack
        w={`${meterBarWidthPx}px`}
        h={height}
        rounded="full"
        bgColor="gray.200"
        overflow="hidden"
        position="relative"
      >
        <HStack
          w={`${percentage}%`}
          h={height}
          rounded="full"
          bgColor={colorScheme}
        />
        <HStack
          display="inline-flex"
          w="full"
          h={height}
          position="absolute"
          justifyContent="space-between"
        >
          {
            //  Adding 2 transparent ticks for each end
            // so that it can be justified using space-between
            Array(numTicks + 2)
              .fill(0)
              .map((_, i) => (
                <HStack
                  key={i}
                  bgColor={i === 0 || i === numTicks + 1 ? undefined : "white"}
                  w={0.5}
                  h={height}
                  zIndex={1}
                />
              ))
          }
        </HStack>
      </HStack>
      <HStack>
        <Text
          bgColor={colorScheme}
          color="white"
          rounded="md"
          textAlign="center"
          fontSize="xl"
          w="60px"
        >{`${Math.round(percentage)}%`}</Text>
      </HStack>
    </HStack>
  );
};

export default PercentageMeter;
