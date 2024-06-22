import React, { createContext, useState } from "react";
import { Grid, GridItem, Tabs, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Chat from "./Chat"; // Assuming you have a Chat component

export const FriendContext = createContext();

const Home = () => {
  const [friendsList, setFriendsList] = useState([
    { username: "Ade", connected: false },
    { username: "Fatimah", connected: true },
    { username: "Aminah", connected: false },
  ]);
  // Adjust column span based on screen size
  const sidebarColSpan = useBreakpointValue({ base: 10, md: 3 });
  const chatColSpan = useBreakpointValue({ base: 10, md: 7 });

  return (
    <FriendContext.Provider value={{ friendsList, setFriendsList }}>
      <Grid templateColumns={"repeat(10, 1fr)"} h={"100vh"} as={Tabs}>
        <GridItem colSpan={sidebarColSpan} borderRight={"1px"} bg={"gray.50"}>
          <Sidebar />
        </GridItem>
        <GridItem colSpan={chatColSpan}>
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
