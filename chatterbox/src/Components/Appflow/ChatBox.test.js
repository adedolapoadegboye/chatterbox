import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ChatBox from "./ChatBox";
import { MessagesContext, SocketContext } from "./Home";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ChakraProvider>
      <MessagesContext.Provider value={providerProps.messagesContext}>
        <SocketContext.Provider value={providerProps.socketContext}>
          {ui}
        </SocketContext.Provider>
      </MessagesContext.Provider>
    </ChakraProvider>,
    renderOptions
  );
};

describe("ChatBox", () => {
  const providerProps = {
    messagesContext: {
      setMessages: jest.fn(),
    },
    socketContext: {
      socket: {
        emit: jest.fn(),
      },
    },
  };

  test("renders ChatBox component", () => {
    renderWithProviders(<ChatBox userid="123" />, { providerProps });

    expect(
      screen.getByPlaceholderText(/Type a message.../i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send message/i })
    ).toBeInTheDocument();
  });

  test("handles message input and submission", async () => {
    renderWithProviders(<ChatBox userid="123" />, { providerProps });

    const input = screen.getByPlaceholderText(/Type a message.../i);
    const button = screen.getByRole("button", { name: /Send message/i });

    userEvent.type(input, "Hello World!");
    fireEvent.click(button);

    expect(providerProps.socketContext.socket.emit).toHaveBeenCalledWith("dm", {
      to: "123",
      from: null,
      content: "Hello World!",
    });

    expect(providerProps.messagesContext.setMessages).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  test("displays validation error for empty message", async () => {
    renderWithProviders(<ChatBox userid="123" />, { providerProps });

    const button = screen.getByRole("button", { name: /Send message/i });
    fireEvent.click(button);

    expect(screen.getByRole("textbox")).toHaveClass("chakra-input--invalid");
  });
});
