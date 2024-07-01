import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FriendContext, SocketContext } from "./Home";

// Validation schema using Yup
const validationSchema = Yup.object({
  newFriendName: Yup.string()
    .required("Username required!")
    .min(6, "Username too short")
    .max(128, "Username too long"),
});

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const { setFriendsList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const initialValues = { newFriendName: "" };

  // Submit handler
  const handleSubmit = (values, actions) => {
    setError(null); // Clear previous errors
    socket.emit(
      "add_friend",
      values.newFriendName,
      ({ done, addError, newFriend }) => {
        if (done) {
          setFriendsList((prevFriends) => [newFriend, ...prevFriends]);
          onClose(); // Close the modal on success
        } else {
          setError(addError); // Set error message
        }
        actions.setSubmitting(false); // Stop the loading animations
        actions.resetForm();
      }
    );
  };

  // Color mode values
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const inputFocusBg = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("black", "white");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} maxW={["90%", "80%", "60%"]}>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Add a Friend
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <ModalBody>
                {isSubmitting && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="purple.500"
                    size="xl"
                    display="block"
                    mx="auto"
                    my="4"
                  />
                )}
                {error && (
                  <Text as="p" color="red.500" textAlign="center" mt={4}>
                    {error}
                  </Text>
                )}
                <FormControl
                  isInvalid={errors.newFriendName && touched.newFriendName}
                  mt={4}
                >
                  <FormLabel>Enter Friend's Username</FormLabel>
                  <Field
                    as={Input}
                    name="newFriendName"
                    placeholder="Enter Friend's Username"
                    autoComplete="off"
                    fontSize="sm"
                    bg={inputBg}
                    textColor={textColor}
                    _focus={{ bg: inputFocusBg, borderColor: "purple.500" }}
                    _placeholder={{ color: "gray.500" }}
                  />
                  <FormErrorMessage>{errors.newFriendName}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => {
                    onClose();
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Add Friend
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
