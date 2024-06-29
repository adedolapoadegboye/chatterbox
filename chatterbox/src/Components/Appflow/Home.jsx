import React, { createContext, useState } from "react";
import {
  Grid,
  GridItem,
  Tabs,
  useBreakpointValue,
  useColorModeValue,
  Box,
  Text,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import useSocketSetup from "../../Helpers/useSocketSetup";

export const FriendContext = createContext();
export const MessagesContext = createContext();

const Home = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendIndex, setFriendIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  useSocketSetup(setFriendsList, setMessages);
  const isMdOrLarger = useBreakpointValue({ base: false, md: true });
  const sidebarColSpan = useBreakpointValue({ base: 12, md: 4 });
  const chatColSpan = useBreakpointValue({ base: 12, md: 8 });
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const color = useColorModeValue("gray.600", "gray.300");

  return (
    <FriendContext.Provider
      value={{ friendsList, setFriendsList, selectedFriend, setSelectedFriend }}
    >
      <Grid
        templateColumns={"repeat(12, 1fr)"}
        h={"100vh"}
        w={"100vw"}
        as={Tabs}
        onChange={(index) => setFriendIndex(index)}
      >
        {(isMdOrLarger || !selectedFriend) && (
          <GridItem
            colSpan={sidebarColSpan}
            borderRight={{ base: "none", md: "1px" }}
            borderColor={borderColor}
            bg={bgColor}
            p={{ base: 2, md: 4 }}
            overflow="hidden"
          >
            <Sidebar />
          </GridItem>
        )}

        {(isMdOrLarger || selectedFriend) && (
          <GridItem
            colSpan={chatColSpan}
            bg={bgColor}
            p={{ base: 2, md: 4 }}
            h={"100vh"}
            overflow="hidden"
          >
            <MessagesContext.Provider value={{ messages, setMessages }}>
              {friendsList[friendIndex] ? (
                <Chat userid={friendsList[friendIndex]?.userid} />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  animation="fly 2s infinite"
                >
                  <Text fontSize="lg" fontWeight="bold" color={color}>
                    Looks like you're flying solo! Refresh the page to load your
                    friends.
                  </Text>
                </Box>
              )}
            </MessagesContext.Provider>
          </GridItem>
        )}
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
