import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./Login";
import { accountContext } from "../Context/Context";

const mockSetUser = jest.fn();

describe("Login Component", () => {
  test("renders Login component with correct elements", () => {
    render(
      <Router>
        <ChakraProvider>
          <accountContext.Provider value={{ setUser: mockSetUser }}>
            <Login />
          </accountContext.Provider>
        </ChakraProvider>
      </Router>
    );

    // Check if the logo is displayed
    expect(screen.getByAltText("Chatterbox Logo")).toBeInTheDocument();
    // Check if the main heading is displayed
    expect(screen.getByText(/Welcome to Chatterbox/i)).toBeInTheDocument();
    // Check if the subheading is displayed
    expect(screen.getByText(/Already a member/i)).toBeInTheDocument();
    // Check if the username input is displayed
    expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
    // Check if the password input is displayed
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    // Check if the Log In button is displayed
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    // Check if the Create Account button is displayed
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when form is submitted with empty fields", async () => {
    render(
      <Router>
        <ChakraProvider>
          <accountContext.Provider value={{ setUser: mockSetUser }}>
            <Login />
          </accountContext.Provider>
        </ChakraProvider>
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    expect(await screen.findByText(/Username required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password required/i)).toBeInTheDocument();
  });
});
