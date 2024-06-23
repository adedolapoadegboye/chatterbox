import React, { useContext } from "react";
import {
  TabPanel,
  TabPanels,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FriendContext } from "./Home";

const Chat = () => {
  const { friendsList } = useContext(FriendContext);
  const panelBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");

  if (friendsList.length > 0) {
    return (
      <TabPanels>
        {friendsList.map((friend, index) => (
          <TabPanel
            key={index}
            bg={panelBgColor}
            borderRadius="md"
            p={4}
            boxShadow="md"
          >
            <Text color={textColor}>{friend.username}</Text>
          </TabPanel>
        ))}
      </TabPanels>
    );
  } else {
    return (
      <VStack
        p={"1rem"}
        h={"100%"}
        overflowY={"scroll"}
        bg={panelBgColor}
        borderRadius="md"
        boxShadow="md"
      >
        <TabPanels>
          <TabPanel>
            <Text color={textColor}>Select a chat to view</Text>
          </TabPanel>
        </TabPanels>
      </VStack>
    );
  }
};

export default Chat;
