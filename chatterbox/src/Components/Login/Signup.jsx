import React from "react";
import { useNavigate } from "react-router-dom";

import {
  VStack,
  ButtonGroup,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, ChatIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
  // Initialize toast for notifications
  const toast = useToast();
  const navigate = useNavigate();

  // Set up formik for form handling and validation
  const formik = useFormik({
    initialValues: { username: "", password: "", retypePassword: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username required!")
        .min(6, "Username too short")
        .max(128, "Username too long"),
      password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short")
        .max(128, "Password too long"),
      retypePassword: Yup.string()
        .required("Password retype required!")
        .min(6, "Retyped Password too short")
        .max(128, "Retyped Password too long"),
    }),
    onSubmit: (values, actions) => {
      const vals = { ...values };
      actions.resetForm();
      fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vals),
      })
        .catch((err) => {
          return;
        })
        .then((res) => {
          if (!res || !res.ok || res.status >= 400) {
            return;
          }
          toast({
            title: "Sign up successful!",
            description: "Welcome to Chatterboxx!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return res.json();
        })
        .then((data) => {
          if (!data) return;
          console.log(data);
        });
    },
  });

  return (
    <VStack
      as="form"
      w={{ base: "90%", md: "400px", lg: "600px" }}
      m="auto"
      justify="center"
      h="100vh"
      spacing="2rem"
      onSubmit={formik.handleSubmit}
      p="2rem"
      // bg="white"
      // borderRadius="lg"
      // boxShadow="lg"
    >
      {/* Main heading with gradient text */}
      <Heading
        fontSize={{ base: "32px", md: "40px" }}
        bgGradient="linear(to-r, pink.400, purple.500, blue.600)"
        bgClip="text"
        textAlign="center"
      >
        Welcome to Chatterbox
      </Heading>
      {/* Chat icon */}
      <ChatIcon w={12} h={12} color="purple.500" />
      {/* Subheading */}
      <Heading
        fontSize={{ base: "18px", md: "20px" }}
        color="gray.500"
        textAlign="center"
      >
        Don't have an account? Please sign up below
      </Heading>
      {/* Username input field */}
      <FormControl
        isInvalid={formik.errors.username && formik.touched.username}
      >
        <FormLabel>Username*</FormLabel>
        <Input
          name="username"
          label="username"
          placeholder="Enter Username"
          autoComplete="off"
          fontSize="lg"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          bg="gray.700"
          _focus={{ bg: "gray.700", borderColor: "purple.500" }}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>
      {/* Password input field */}
      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel>Password*</FormLabel>
        <Input
          name="password"
          type="password"
          label="password"
          placeholder="Enter Password"
          autoComplete="off"
          fontSize="lg"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          bg="gray.700"
          _focus={{ bg: "gray.700", borderColor: "purple.500" }}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel>Retype Password*</FormLabel>
        <Input
          name="password"
          type="password"
          label="password"
          placeholder="Enter Password"
          autoComplete="off"
          fontSize="lg"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.retypePassword}
          bg="gray.700"
          _focus={{ bg: "gray.700", borderColor: "purple.500" }}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>
      {/* Button group for login and create account */}
      <ButtonGroup pt="1rem">
        <Button colorScheme="purple" type="submit">
          Sign Up
        </Button>
        <Button
          onClick={() => navigate("/login")}
          colorScheme="teal"
          variant="outline"
          leftIcon={<ArrowBackIcon></ArrowBackIcon>}
        >
          Back to Login
        </Button>
      </ButtonGroup>
      {/* Additional text for new users */}
      <Text fontSize="sm" color="gray.500">
        Forgot your passsword?{" "}
        <Text as="span" color="purple.500">
          Reset your password!
        </Text>
      </Text>
    </VStack>
  );
};

export default Signup;
