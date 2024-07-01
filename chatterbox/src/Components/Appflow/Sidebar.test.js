import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { ChakraProvider } from "@chakra-ui/react";
import { FriendContext } from "./Home";

// Mock Friends Data
const friendsList = [
  {
    username: "john_doe",
    avatar: "https://bit.ly/broken-link",
    connected: true,
  },
  {
    username: "jane_doe",
    avatar: "https://bit.ly/broken-link",
    connected: false,
  },
];

// Mock Context Providers
const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ChakraProvider>
      <FriendContext.Provider value={providerProps}>
        {ui}
      </FriendContext.Provider>
    </ChakraProvider>,
    renderOptions
  );
};

describe("Sidebar", () => {
  const providerProps = {
    friendsList: friendsList,
    setSelectedFriend: jest.fn(),
  };

  test("renders Sidebar component with friends list", () => {
    renderWithProviders(<Sidebar />, { providerProps });

    // Check if the friends list is displayed
    friendsList.forEach((friend) => {
      expect(screen.getByText(friend.username)).toBeInTheDocument();
    });
  });

  test("opens AddFriendModal on button click", () => {
    renderWithProviders(<Sidebar />, { providerProps });

    // Click the Add New Friend button
    fireEvent.click(screen.getByText(/Add New Friend/i));

    // Check if the modal is displayed
    expect(screen.getByText(/Add a Friend/i)).toBeInTheDocument();
  });
});
