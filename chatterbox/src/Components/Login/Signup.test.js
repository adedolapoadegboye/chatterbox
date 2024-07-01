import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Signup from "./Signup";
import { accountContext } from "../Context/Context";

const mockSetUser = jest.fn();

describe("Signup Component", () => {
  test("renders Signup component with correct elements", () => {
    render(
      <Router>
        <ChakraProvider>
          <accountContext.Provider value={{ setUser: mockSetUser }}>
            <Signup />
          </accountContext.Provider>
        </ChakraProvider>
      </Router>
    );

    // Check if the logo is displayed
    expect(screen.getByAltText("Chatterbox Logo")).toBeInTheDocument();
    // Check if the main heading is displayed
    expect(screen.getByText(/Welcome to Chatterbox/i)).toBeInTheDocument();
    // Check if the username input is displayed
    expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
    // Check if the password input is displayed
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    // Check if the retyped password input is displayed
    expect(screen.getByPlaceholderText("Retype Password")).toBeInTheDocument();
    // Check if the sign up button is displayed
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    // Check if the back to login button is displayed
    expect(screen.getByText("Back to Login")).toBeInTheDocument();
  });

  test("validates form inputs and shows error messages", async () => {
    render(
      <Router>
        <ChakraProvider>
          <accountContext.Provider value={{ setUser: mockSetUser }}>
            <Signup />
          </accountContext.Provider>
        </ChakraProvider>
      </Router>
    );

    // Attempt to submit the form with empty inputs
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the validation error messages are displayed
    expect(await screen.findByText("Username required!")).toBeInTheDocument();
    expect(await screen.findByText("Password required!")).toBeInTheDocument();
    expect(
      await screen.findByText("Retyped password required!")
    ).toBeInTheDocument();
  });
});
