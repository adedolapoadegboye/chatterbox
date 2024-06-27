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
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import socket from "../../Helpers/socket";
import { FriendContext } from "./Home";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const initialValues = { newFriendName: "" };
  const { setFriendsList } = useContext(FriendContext);
  const validationSchema = Yup.object({
    newFriendName: Yup.string()
      .required("Username required!")
      .min(6, "Username too short")
      .max(128, "Username too long"),
  });
  const handleSubmit = async (values, actions) => {
    setError(null); // Clear previous errors
    try {
      socket.emit(
        "add_friend",
        values.newFriendName,
        ({ done, addError, newFriend }) => {
          console.log(done, addError);
          if (done) {
            setFriendsList((c) => [newFriend, ...c]);
            setError("Friend Request Sent!");
            onClose();
          } else {
            setError(addError);
          }
        }
      );
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      actions.setSubmitting(false); // Stop the loading animations
      actions.resetForm();
    }
  };

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
          {(formik) => (
            <Form>
              <ModalBody>
                {formik.isSubmitting && (
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
                <Text as="p" color="red.500" textAlign="center">
                  {error}
                </Text>
                <FormControl
                  isInvalid={
                    formik.errors.newFriendName && formik.touched.newFriendName
                  }
                  mt={4}
                >
                  <FormLabel>Enter Friend's Username</FormLabel>
                  <Input
                    name="newFriendName"
                    placeholder="Enter Friend's Username"
                    autoComplete="off"
                    fontSize="sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newFriendName}
                    bg={inputBg}
                    textColor={textColor}
                    _focus={{ bg: inputFocusBg, borderColor: "purple.500" }}
                    _placeholder={{ color: "gray.500" }}
                  />
                  <FormErrorMessage>
                    {formik.errors.newFriendName}
                  </FormErrorMessage>
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
                  isLoading={formik.isSubmitting}
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
