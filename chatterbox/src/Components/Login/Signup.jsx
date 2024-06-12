import React, { useContext, useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ChatIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { accountContext } from "../Context/Context";

const Signup = () => {
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useContext(accountContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "", retypedPassword: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username required!")
        .min(6, "Username too short")
        .max(128, "Username too long"),
      password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short")
        .max(128, "Password too long"),
      retypedPassword: Yup.string()
        .required("Retyped password required!")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values, actions) => {
      setError(null); // Clear previous errors
      try {
        const response = await fetch("http://localhost:4000/auth/signup", {
          method: "POST",
          credentials: "include", // Important to include cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.status || "Invalid credentials, please try again!");
          actions.setSubmitting(false); // Stop the loading animation on error
          return;
        }
        if (!data.loggedIn) {
          setError(data.status);
          actions.setSubmitting(false); // Stop the loading animation if login failed
          return;
        }
        toast({
          title: "Sign up successful!",
          description: "Welcome to Chatterboxx!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUser({ ...data });
        navigate("/home");
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        actions.setSubmitting(false); // Stop the loading animation
        actions.resetForm();
      }
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
      <Heading
        fontSize={{ base: "32px", md: "40px" }}
        bgGradient="linear(to-r, green.400, cyan.500, teal.600)"
        bgClip="text"
        textAlign="center"
      >
        {" "}
        Welcome to Chatterbox <ChatIcon w={9} h={9} color="teal.500" />
      </Heading>
      <Heading
        fontSize={{ base: "18px", md: "20px" }}
        color="gray.500"
        textAlign={"center"}
      >
        Don't have an account? Please sign up below
      </Heading>
      <>
        {formik.isSubmitting && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="purple.500"
            size="xl"
          />
        )}
        <Text as="p" color="red.500">
          {error}
        </Text>
      </>
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
      <ButtonGroup pt="1rem">
        <Button
          colorScheme="purple"
          type="submit"
          isLoading={formik.isSubmitting}
        >
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
