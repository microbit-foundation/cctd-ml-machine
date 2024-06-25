import { As, Divider, Heading, HStack } from "@chakra-ui/react";
import MicrobitLogo from "./MicrobitLogo";

const AppLogo = ({
  color = "#FFF",
  name,
  as,
}: {
  color?: string;
  beta?: boolean;
  as?: As;
  name: string;
}) => (
  <HStack
    as={as}
    spacing={4}
    userSelect="none"
    transform="scale(0.93)"
    transformOrigin="left"
  >
    <MicrobitLogo fill={color} alt="micro:bit" />
    <Divider
      aria-hidden
      borderColor={color}
      orientation="vertical"
      h="33px"
      borderWidth="1px"
    />
    <HStack color={color} spacing={2.5}>
      <Heading
        as="span"
        fontWeight="normal"
        fontSize="26px"
        letterSpacing=".833px"
        whiteSpace="nowrap"
      >
        {name}
      </Heading>
    </HStack>
  </HStack>
);

export default AppLogo;
