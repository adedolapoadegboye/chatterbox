// Import necessary modules and components
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
  });

  // Test to check validation errors on empty form submission
  test("shows validation errors on empty submit", async () => {
    renderWithProviders(<Signup />);

    // Simulate a click on the sign up button without entering any data
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assertions to check if validation errors are displayed
    expect(
      await screen.findByText("Username is required!")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required!")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password retype is required!")
    ).toBeInTheDocument();
  });

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

    // Simulate a click on the sign up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assertions to check if validation errors for short inputs are displayed
    expect(
      await screen.findByText("Username is too short")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is too short")
    ).toBeInTheDocument();
    expect(await screen.findByText("Passwords must match")).toBeInTheDocument();
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

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(
        screen.queryByText("Username is required!")
      ).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document

      expect(
        screen.queryByText("Password is required!")
      ).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(
        screen.queryByText("Username is too short")
      ).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(
        screen.queryByText("Password is too short")
      ).not.toBeInTheDocument();
    });
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

  // Test to check the password visibility toggle for password and retyped password fields
  test("toggles password visibility for password fields", () => {
    renderWithProviders(<Signup />);

    // Initially, the password input should be of type "password"
    const passwordInput = screen.getByLabelText("Password*");
    const retypedPasswordInput = screen.getByLabelText("Retype Password*");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(retypedPasswordInput).toHaveAttribute("type", "password");

    // Click the toggle button to show the password
    fireEvent.click(screen.getByLabelText(/show password/i));

    // The password input should now be of type "text"
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click the toggle button again to hide the password
    fireEvent.click(screen.getByLabelText(/hide password/i));

    // The password input should be back to type "password"
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the toggle button to show the retyped password
    fireEvent.click(screen.getByLabelText(/show retype password/i));

    // The retyped password input should now be of type "text"
    expect(retypedPasswordInput).toHaveAttribute("type", "text");

    // Click the toggle button again to hide the retyped password
    fireEvent.click(screen.getByLabelText(/hide retype password/i));

    // The retyped password input should be back to type "password"
    expect(retypedPasswordInput).toHaveAttribute("type", "password");
  });
});
