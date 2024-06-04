import { Button, useColorMode } from "@chakra-ui/react";
import React from "react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      onClick={() => toggleColorMode()}
      position="absolute"
      top="0"
      right="0"
      margin="1rem"
    >
      {colorMode === "dark" ? (
        <SunIcon color={"orange"} />
      ) : (
        <MoonIcon color={"darkblue"} />
      )}
    </Button>
  );
};

export default ToggleColorMode;
