import React from "react";
import {
  VStack,
  ButtonGroup,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username required!")
        .min(6, "Username too short")
        .max(128, "Username too long"),
      password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short")
        .max(128, "Password too long"),
    }),
    onSubmit: (values, actions) => {
      alert(JSON.stringify(values, null, 2));
      actions.resetForm();
    },
  });
  return (
    <>
      {" "}
      <VStack
        as="form"
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="2rem"
        onSubmit={formik.handleSubmit}
      >
        <Heading fontSize={40}>
          {" "}
          Welcome to Chatterboxx <ChatIcon />
        </Heading>
        <Heading fontSize={20}> Please log in below</Heading>
        <FormControl
          isInvalid={formik.errors.username && formik.errors.username}
        >
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Enter Username"
            autoComplete="off"
            fontSize="lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.password && formik.touched.password}
        >
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            autoComplete="off"
            fontSize="lg"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>
        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            {" "}
            Log In{" "}
          </Button>
          <Button>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </>
  );
};

export default Login;
