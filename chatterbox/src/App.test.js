// App.test.js

// Import necessary modules and components
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import ToggleColorMode from "./Components/ToggleColorMode";
import Views from "./Components/Views";

// Utility function to render a component wrapped with ChakraProvider
const renderWithChakra = (component) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

// Mock the ToggleColorMode and Views components
jest.mock("./Components/ToggleColorMode.jsx");
jest.mock("./Components/Views.jsx");

describe("App Component", () => {
  // Mock implementations for the mocked components
  beforeEach(() => {
    ToggleColorMode.mockImplementation(() => <div>Toggle Color Mode</div>);
    Views.mockImplementation(() => <div>Views Component</div>);
  });

  // Test to check if the App component renders correctly
  test("renders the App component with ToggleColorMode and Views", () => {
    renderWithChakra(<App />);

    // Assertions to check if the mocked components are present in the document
    expect(screen.getByText("Toggle Color Mode")).toBeInTheDocument();
    expect(screen.getByText("Views Component")).toBeInTheDocument();
  });
});
