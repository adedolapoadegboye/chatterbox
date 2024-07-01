import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { ChakraProvider } from "@chakra-ui/react";
import { accountContext } from "../Context/Context";

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ChakraProvider>
      <accountContext.Provider value={providerProps.accountContext}>
        {ui}
      </accountContext.Provider>
    </ChakraProvider>,
    renderOptions
  );
};

describe("Home", () => {
  const providerProps = {
    accountContext: {
      user: { token: "test-token" },
    },
  };

  test("renders Home component with sidebar and chat box", () => {
    renderWithProviders(<Home />, { providerProps });

    expect(
      screen.getByText(/Looks like you're flying solo!/i)
    ).toBeInTheDocument();
  });
});
