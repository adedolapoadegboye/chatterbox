import React, { useContext } from "react";
import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { FriendContext } from "./Home";

const Chat = () => {
  const { friendsList } = useContext(FriendContext);

  if (friendsList.length > 0) {
    return (
      <TabPanels>
        {friendsList.map((friend) => (
          <TabPanel key={friend.id}>{friend.username}</TabPanel>
        ))}
      </TabPanels>
    );
  } else {
    return (
      <VStack p={"1rem"} h={"100%"} overflowY={"scroll"}>
        <TabPanels>
          <TabPanel>
            <Text>Select a chat to view</Text>
          </TabPanel>
        </TabPanels>
      </VStack>
    );
  }
};

export default Chat;
