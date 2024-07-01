import React, { useContext, useLayoutEffect, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Heading,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  TabPanels,
  TabPanel,
  keyframes,
  Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon, StarIcon, ChatIcon } from "@chakra-ui/icons";
import { FriendContext, MessagesContext, SocketContext } from "./Home";
import ChatBox from "./ChatBox";

// Create animation keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const Chat = ({ userid }) => {
  const { selectedFriend, setSelectedFriend } = useContext(FriendContext);
  const { friendsList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const chatContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const isMdOrLarger = useBreakpointValue({ base: false, md: true });
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("gray.50", "gray.900");

  if (!selectedFriend) {
    return (
      <VStack
        w="100%"
        h="100vh"
        bg={bgColor}
        color={textColor}
        justify="center"
        align="center"
        spacing={4}
        p={4}
      >
        <HStack spacing={4}>
          <Icon
            as={StarIcon}
            boxSize={{ base: "50px", md: "70px" }}
            color="teal.400"
            animation={`${spin} infinite 2s linear`}
          />
          <Icon
            as={ChatIcon}
            boxSize={{ base: "50px", md: "70px" }}
            color="purple.400"
            animation={`${bounce} infinite 1.5s ease-in-out`}
          />
          <Icon
            as={StarIcon}
            boxSize={{ base: "50px", md: "70px" }}
            color="teal.400"
            animation={`${spin} infinite 2s linear`}
            animationDelay="1s"
          />
        </HStack>
        <Text fontSize={{ base: "lg", md: "2xl" }} textAlign="center" mt={4}>
          Hey there! Pick a friend to start the magic!
        </Text>
      </VStack>
    );
  }

  return (
    <VStack
      w="100%"
      h="100vh"
      bg={bgColor}
      color={textColor}
      position="relative"
    >
      <HStack
        justify="space-between"
        align="center"
        w={{ base: "100%", md: "calc(100% / (12/8))" }}
        p={{ base: 2, md: 4 }}
        borderBottom="1px"
        borderColor={borderColor}
        bg={bg}
        position="fixed"
        top={0}
        zIndex={1}
      >
        {!isMdOrLarger && (
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedFriend(null)}
            variant="ghost"
            aria-label="Go back"
          />
        )}
        <HStack spacing={4} flex="1" justify="center">
          <Avatar name={selectedFriend.username} src={selectedFriend.avatar} />
          <Heading size="md" isTruncated>
            {selectedFriend.username}
          </Heading>
        </HStack>
        {isMdOrLarger && <Box w="48px" />}{" "}
        {/* Placeholder to balance the layout */}
      </HStack>
      <VStack
        ref={chatContainerRef}
        w="100%"
        flex="1"
        pt="60px"
        pb="60px"
        justify="flex-end"
        overflowY="auto"
      >
        <TabPanels flex="1" w="100%" p={4}>
          {friendsList.map((friend) => (
            <VStack
              flexDir={"column-reverse"}
              as={TabPanel}
              key={`chat:${friend.username}`}
              w={"100%"}
              p={{ base: 2, md: 10 }}
            >
              {messages
                .filter(
                  (msg) =>
                    msg.to === friend.userid || msg.from === friend.userid
                )
                .map((message, index) => (
                  <Text
                    m={
                      message.to === friend.userid
                        ? "1rem 0 0 auto !important"
                        : "1rem auto 0 0 !important"
                    }
                    maxWidth={"47%"}
                    key={`msg:${friend.username}.${index}`}
                    fontSize={"lg"}
                    bg={message.to === friend.userid ? "green.500" : "blue.500"}
                    borderRadius="10px"
                    p={{ base: 2, md: 4 }}
                  >
                    {message.content}
                  </Text>
                ))}
            </VStack>
          ))}
        </TabPanels>
        <Box
          w={{ base: "100%", md: "calc(100% / (12/8))" }}
          // p={{ base: 2, md: 4 }}
          bg={bgColor}
          position="fixed"
          bottom={0}
          right={0}
          zIndex={1}
        >
          <ChatBox userid={userid} />
        </Box>
      </VStack>
    </VStack>
  );
};

export default Chat;
