import {
  HStack,
  VStack,
  Heading,
  Button,
  useColorModeValue,
  Tab,
  Text,
  Circle,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { FriendContext } from "./Home";

const Sidebar = () => {
  const { friendsList } = useContext(FriendContext);
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");

  return (
    <VStack py={"1.4rem"} w={"100%"} h={"100%"} bg={bg} color={color}>
      <HStack justify={"space-between"} w={"100%"} px={"1rem"}>
        <Heading size="md">Add Friends</Heading>
        <Button>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
      {friendsList.map((friend) => {
        return (
          <HStack as={Tab}>
            <Circle
              bg={friend.connected ? "green.500" : "red.500"}
              w="15px"
              h="15px"
            />
            <Text>{friend.username}</Text>
          </HStack>
        );
      })}
    </VStack>
  );
};

export default Sidebar;
