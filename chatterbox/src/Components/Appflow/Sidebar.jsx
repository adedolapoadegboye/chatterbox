import React, { useContext } from "react";
import {
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Tab,
  Text,
  Circle,
  Divider,
  Box,
  Input,
  Avatar,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { FriendContext } from "./Home";
import AddFriendModal from "./AddFriendModal";

const Sidebar = () => {
  const { friendsList, setSelectedFriend } = useContext(FriendContext);
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      py={{ base: "1rem", md: "1.4rem" }}
      w={{ base: "100%", md: "350px" }}
      h="100vh"
      bg={bg}
      color={color}
      spacing={4}
      align="stretch"
      boxShadow="lg"
    >
      <HStack
        justify="space-between"
        w="100%"
        px={{ base: "0.5rem", md: "1rem" }}
      >
        <Avatar name="User" src="https://bit.ly/broken-link" />
        <Button colorScheme="blue" variant="solid" onClick={onOpen}>
          <Text>Add New Friend</Text>
          <ChatIcon ml={2} />
        </Button>
      </HStack>
      <Divider />
      <HStack px={{ base: "0.5rem", md: "1rem" }} w="100%">
        <Input
          placeholder="Search or start new chat"
          variant="filled"
          bg={useColorModeValue("white", "gray.700")}
        />
        <Button colorScheme="blue" variant="ghost">
          <SearchIcon />
        </Button>
      </HStack>
      <Divider />
      <VStack
        w="100%"
        spacing={2}
        px={{ base: "0.5rem", md: "1rem" }}
        align="stretch"
        overflowY="auto"
        flex="1"
      >
        {friendsList.map((friend) => (
          <Box
            as={Tab}
            key={friend.username}
            w="100%"
            p={3}
            borderRadius="md"
            _hover={{ bg: hoverBgColor }}
            onClick={() => setSelectedFriend(friend)}
          >
            <Grid templateColumns="auto 1fr auto" alignItems="center">
              <GridItem>
                <Avatar name={friend.username} src={friend.avatar} />
              </GridItem>
              <GridItem>
                <Text
                  ml={{ base: 2, md: 4 }}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {friend.username}
                </Text>
              </GridItem>
              <GridItem>
                <Circle
                  bg={friend.connected ? "green.500" : "red.500"}
                  w="15px"
                  h="15px"
                  ml={{ base: 2, md: 4 }}
                />
              </GridItem>
            </Grid>
          </Box>
        ))}
      </VStack>
      <Divider />
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};

export default Sidebar;
