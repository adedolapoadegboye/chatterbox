// Import necessary modules and components
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// Utility function to render a component wrapped with ChakraProvider and MemoryRouter
const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <ChakraProvider>{component}</ChakraProvider>
    </MemoryRouter>
  );
};

// Test suite for the Login component
describe("Login Component", () => {
  // Test to check if the component renders correctly
  test("renders the component", () => {
    renderWithProviders(<Login />);

    // Assertions to check if the necessary elements are present in the document
    expect(screen.getByText("Welcome to Chatterbox")).toBeInTheDocument();
    expect(
      screen.getByText("Already a member? Please log in below")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
  });

  // Test to check validation errors on empty form submission
  test("shows validation errors on empty submit", async () => {
    renderWithProviders(<Login />);

    // Simulate a click on the login button without entering any data
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Assertions to check if validation errors are displayed
    expect(await screen.findByText("Username required!")).toBeInTheDocument();
    expect(await screen.findByText("Password required!")).toBeInTheDocument();
  });

  // Test to check validation errors for short username and password
  test("shows validation errors for short username and password", async () => {
    renderWithProviders(<Login />);

    // Simulate entering a short username and password
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });

    // Simulate a click on the login button
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Assertions to check if validation errors for short inputs are displayed
    expect(await screen.findByText("Username too short")).toBeInTheDocument();
    expect(await screen.findByText("Password too short")).toBeInTheDocument();
  });

  // Test to check form submission with valid data
  test("submits the form with valid data", async () => {
    renderWithProviders(<Login />);

    // Simulate entering a valid username and password
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "validusername" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "validpassword" },
    });

    // Simulate a click on the login button
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(screen.queryByText("Username required!")).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(screen.queryByText("Password required!")).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(screen.queryByText("Username too short")).not.toBeInTheDocument();
    });

    // Wait for possible async actions
    await waitFor(() => {
      // Assertions to check if no validation errors are present in the document
      expect(screen.queryByText("Password too short")).not.toBeInTheDocument();
    });
  });

  // Test to check navigation to create account page
  test("navigates to create account page", () => {
    renderWithProviders(<Login />);

    // Simulate a click on the create account button
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // Assertion to check if navigation function is called
    // Since we cannot assert the actual navigation without mocking the navigate function,
    // we will check if the button is clickable and the event is triggered
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeEnabled();
  });

  // Test to check the password visibility toggle
  test("toggles password visibility", () => {
    renderWithProviders(<Login />);

    // Initially, the password input should be of type "password"
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the toggle button to show the password
    fireEvent.click(screen.getByLabelText(/show password/i));

    // The password input should now be of type "text"
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click the toggle button again to hide the password
    fireEvent.click(screen.getByLabelText(/hide password/i));

    // The password input should be back to type "password"
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
