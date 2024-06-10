import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  ButtonGroup,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
  useToast,
  IconButton,
  Box,
  Image,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ChatIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
  // Initialize toast for notifications
  const toast = useToast();
  const navigate = useNavigate();

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);

  // Set up formik for form handling and validation
  const formik = useFormik({
    initialValues: { username: "", password: "", retypedPassword: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required!")
        .min(6, "Username is too short")
        .max(128, "Username is too long"),
      password: Yup.string()
        .required("Password is required!")
        .min(6, "Password is too short")
        .max(128, "Password is too long"),
      retypedPassword: Yup.string()
        .required("Password retype is required!")
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .min(6, "Retyped Password is too short")
        .max(128, "Retyped Password is too long"),
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
    >
      <Box textAlign="center">
        <Image
          src="./chatterbox_logo.png"
          alt="Chatterbox Logo"
          mx="auto"
          mb={4}
          borderRadius="full"
          boxSize={{ base: "100px", md: "150px" }}
          bgGradient="linear(to-r, green.400, cyan.500, teal.600)"
          bgClip="text"
          fallbackSrc="https://via.placeholder.com/150"
        />
      </Box>
      {/* Main heading with gradient text */}
      <Heading
        fontSize={{ base: "32px", md: "40px" }}
        bgGradient="linear(to-r, green.400, cyan.500, teal.600)"
        bgClip="text"
        textAlign="center"
      >
        {" "}
        Welcome to Chatterbox {/* Chat icon */}
        <ChatIcon w={9} h={9} color="teal.500" />
      </Heading>

      {/* Subheading */}
      <Heading
        fontSize={{ base: "18px", md: "20px" }}
        color="gray.500"
        textAlign={"center"}
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
          placeholder="Enter Username"
          autoComplete="off"
          fontSize="lg"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          bg="gray.200"
          textColor="black"
          _focus={{ bg: "gray.300", borderColor: "purple.500" }}
          _placeholder={{ color: "gray.500" }} // Change placeholder text color here
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>
      {/* Password input field */}
      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel>Password*</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            autoComplete="off"
            fontSize="lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            bg="gray.200"
            textColor="black"
            _focus={{ bg: "gray.300", borderColor: "purple.500" }}
            _placeholder={{ color: "gray.500" }} // Change placeholder text color here
          />
          <InputRightElement>
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>
      {/* Retype Password input field */}
      <FormControl
        isInvalid={
          formik.errors.retypedPassword && formik.touched.retypedPassword
        }
      >
        <FormLabel>Retype Password*</FormLabel>
        <InputGroup>
          <Input
            name="retypedPassword"
            type={showRetypedPassword ? "text" : "password"}
            placeholder="Retype Password"
            autoComplete="off"
            fontSize="lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.retypedPassword}
            bg="gray.200"
            textColor="black"
            _focus={{ bg: "gray.300", borderColor: "purple.500" }}
            _placeholder={{ color: "gray.500" }} // Change placeholder text color here
          />
          <InputRightElement>
            <IconButton
              aria-label={
                showRetypedPassword ? "Hide password" : "Show password"
              }
              icon={showRetypedPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowRetypedPassword(!showRetypedPassword)}
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formik.errors.retypedPassword}</FormErrorMessage>
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
          leftIcon={<ArrowBackIcon />}
        >
          Back to Login
        </Button>
      </ButtonGroup>
      {/* Additional text for new users */}
      <Text fontSize="sm" color="gray.500">
        Forgot your password?{" "}
        <Text as="span" color="purple.500">
          Reset your password!
        </Text>
      </Text>
    </VStack>
  );
};

export default Signup;
