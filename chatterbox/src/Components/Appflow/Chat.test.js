// Chat.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Chat from "./Chat";
import { FriendContext, MessagesContext } from "./Home";
import { ChakraProvider } from "@chakra-ui/react";

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ChakraProvider>
      <FriendContext.Provider value={providerProps.friendContext}>
        <MessagesContext.Provider value={providerProps.messagesContext}>
          {ui}
        </MessagesContext.Provider>
      </FriendContext.Provider>
    </ChakraProvider>,
    renderOptions
  );
};

describe("Chat", () => {
  const providerProps = {
    friendContext: {
      selectedFriend: { username: "john_doe", avatar: "avatar_url" },
      setSelectedFriend: jest.fn(),
      friendsList: [
        { username: "john_doe", userid: "123", avatar: "avatar_url" },
      ],
    },
    messagesContext: {
      messages: [
        { to: "123", from: "456", content: "Hello John!" },
        { to: "456", from: "123", content: "Hi there!" },
      ],
    },
  };

  test("renders Chat component without selected friend", () => {
    renderWithProviders(<Chat userid="123" />, {
      providerProps: {
        ...providerProps,
        friendContext: { ...providerProps.friendContext, selectedFriend: null },
      },
    });

    expect(
      screen.getByText(/Hey there! Pick a friend to start the magic!/i)
    ).toBeInTheDocument();
  });

  test("renders Chat component with selected friend", () => {
    renderWithProviders(<Chat userid="123" />, { providerProps });

    expect(screen.getByText(/john_doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello John!/i)).toBeInTheDocument();
    expect(screen.getByText(/Hi there!/i)).toBeInTheDocument();
  });

  test("handles going back to the friends list", () => {
    renderWithProviders(<Chat userid="123" />, { providerProps });

    fireEvent.click(screen.getByLabelText(/Go back/i));

    expect(providerProps.friendContext.setSelectedFriend).toHaveBeenCalledWith(
      null
    );
  });
});
