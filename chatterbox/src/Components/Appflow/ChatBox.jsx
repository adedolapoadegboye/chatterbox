import React, { useContext } from "react";
import { HStack, Input, IconButton, useColorModeValue } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import socket from "../../Helpers/socket";
import { MessagesContext } from "./Home";

const ChatBox = ({ userid }) => {
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const inputFocusBg = useColorModeValue("gray.300", "gray.600");
  const { setMessages } = useContext(MessagesContext);

  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({ message: Yup.string().min(1).max(1024) })}
      onSubmit={(values, actions) => {
        const message = { to: userid, from: null, content: values.message };
        // console.log(message);
        socket.emit("dm", message);
        setMessages((prevMsgs) => [message, ...prevMsgs]);
        actions.resetForm();
      }}
    >
      <HStack w="100%" p={4} spacing={2} as={Form}>
        <Input
          as={Field}
          placeholder="Type a message..."
          name="message"
          variant="filled"
          bg={inputBg}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          size={"lg"}
          _focus={{ bg: inputFocusBg }}
          flex="1"
        />
        <IconButton
          type="submit"
          size={"lg"}
          icon={<ArrowForwardIcon />}
          colorScheme="teal"
          aria-label="Send message"
        />
      </HStack>
    </Formik>
  );
};

export default ChatBox;
