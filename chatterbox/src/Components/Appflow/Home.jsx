// src/Home.js

import React, { createContext, useState } from "react";
import {
  Grid,
  GridItem,
  Tabs,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

export const FriendContext = createContext();

const Home = () => {
  const [friendsList, setFriendsList] = useState([
    { username: "Adedolapo", connected: false, id: "1" },
    { username: "Fatimah", connected: true, id: "2" },
    { username: "Aminah", connected: false, id: "3" },
  ]);

  const sidebarColSpan = useBreakpointValue({ base: 12, md: 4 });
  const chatColSpan = useBreakpointValue({ base: 12, md: 8 });
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <FriendContext.Provider value={{ friendsList, setFriendsList }}>
      <Grid templateColumns={"repeat(12, 1fr)"} h={"100vh"} as={Tabs}>
        <GridItem
          colSpan={sidebarColSpan}
          borderRight={{ base: "none", md: "1px" }}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          bg={bgColor}
          p={{ base: 2, md: 4 }}
        >
          <Sidebar />
        </GridItem>
        <GridItem colSpan={chatColSpan} bg={bgColor} p={{ base: 2, md: 4 }}>
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
