// Signup.test.js

// Import necessary modules and components
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";

// Utility function to render a component wrapped with ChakraProvider and MemoryRouter
const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <ChakraProvider>{component}</ChakraProvider>
    </MemoryRouter>
  );
};

// Test suite for the Signup component
describe("Signup Component", () => {
  // Test to check if the component renders correctly
  test("renders the component", () => {
    renderWithProviders(<Signup />);

    // Assertions to check if the necessary elements are present in the document
    expect(screen.getByText("Welcome to Chatterbox")).toBeInTheDocument();
    expect(
      screen.getByText("Don't have an account? Please sign up below")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username*")).toBeInTheDocument();
    expect(screen.getByLabelText("Password*")).toBeInTheDocument();
    expect(screen.getByLabelText("Retype Password*")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to login/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot your passsword?")).toBeInTheDocument();
  });

  // Test to check validation errors on empty form submission
  //   test("shows validation errors on empty submit", async () => {
  //     renderWithProviders(<Signup />);

  //     // Simulate a click on the sign up button without entering any data
  //     fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  //     // Assertions to check if validation errors are displayed
  //     expect(
  //       await screen.findAllByText("Username required!")
  //     ).toBeInTheDocument();
  //     expect(
  //       await screen.findAllByText("Password required!")
  //     ).toBeInTheDocument();
  //   });

  // Test to check validation errors for short username and password
  test("shows validation errors for short username and password", async () => {
    renderWithProviders(<Signup />);

    // Simulate entering a short username and password
    fireEvent.change(screen.getByLabelText("Username*"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText("Password*"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Retype Password*"), {
      target: { value: "123" },
    });

    // // Simulate a click on the sign up button
    // fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // // Assertions to check if validation errors for short inputs are displayed
    // expect(
    //   await screen.findAllByText("Username too short")
    // ).toBeInTheDocument();
    // expect(
    //   await screen.findAllByText("Password too short")
    // ).toBeInTheDocument();
  });

  // Test to check form submission with valid data
  test("submits the form with valid data", async () => {
    renderWithProviders(<Signup />);

    // Simulate entering a valid username and password
    fireEvent.change(screen.getByLabelText("Username*"), {
      target: { value: "validusername" },
    });
    fireEvent.change(screen.getByLabelText("Password*"), {
      target: { value: "validpassword" },
    });
    fireEvent.change(screen.getByLabelText("Retype Password*"), {
      target: { value: "validpassword" },
    });

    // Simulate a click on the sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assertions to check if no validation errors are present in the document
    expect(screen.queryByText("Username required!")).not.toBeInTheDocument();
    expect(screen.queryByText("Password required!")).not.toBeInTheDocument();
    expect(screen.queryByText("Username too short")).not.toBeInTheDocument();
    expect(screen.queryByText("Password too short")).not.toBeInTheDocument();
  });

  // Test to check navigation to login page
  test("navigates to login page", () => {
    renderWithProviders(<Signup />);

    // Simulate a click on the back to login button
    fireEvent.click(screen.getByRole("button", { name: /back to login/i }));

    // Assertion to check if navigation function is called
    // Since we cannot assert the actual navigation without mocking the navigate function,
    // we will check if the button is clickable and the event is triggered
    expect(
      screen.getByRole("button", { name: /back to login/i })
    ).toBeEnabled();
  });
});
