import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AddFriendModal from "./AddFriendModal";
import { FriendContext, SocketContext } from "./Home";
import { ChakraProvider } from "@chakra-ui/react";

// Mock contexts
const mockSetFriendsList = jest.fn();
const mockSocket = {
  emit: jest.fn(),
};

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ChakraProvider>
      <FriendContext.Provider value={providerProps.friendContext}>
        <SocketContext.Provider value={providerProps.socketContext}>
          {ui}
        </SocketContext.Provider>
      </FriendContext.Provider>
    </ChakraProvider>,
    renderOptions
  );
};

describe("AddFriendModal", () => {
  const providerProps = {
    friendContext: { setFriendsList: mockSetFriendsList },
    socketContext: { socket: mockSocket },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders AddFriendModal and submits form successfully", async () => {
    renderWithProviders(<AddFriendModal isOpen={true} onClose={jest.fn()} />, {
      providerProps,
    });

    // Check if modal is rendered
    expect(screen.getByText(/Add a Friend/i)).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter Friend's Username/i), {
      target: { value: "newfriend" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Add Friend/i));

    // Mock socket response
    const emitCallback = mockSocket.emit.mock.calls[0][2];
    emitCallback({
      done: true,
      addError: "",
      newFriend: { username: "newfriend", userid: "123", connected: true },
    });

    // Check if the modal is closed and friend is added
    await waitFor(() => {
      expect(mockSetFriendsList).toHaveBeenCalledWith(expect.any(Function));
    });

    // Check if the form is reset
    expect(screen.getByPlaceholderText(/Enter Friend's Username/i).value).toBe(
      ""
    );
  });

  test("shows error message when form submission fails", async () => {
    renderWithProviders(<AddFriendModal isOpen={true} onClose={jest.fn()} />, {
      providerProps,
    });

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter Friend's Username/i), {
      target: { value: "newfriend" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Add Friend/i));

    // Mock socket response with error
    const emitCallback = mockSocket.emit.mock.calls[0][2];
    emitCallback({ done: false, addError: "User not found" });

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/User not found/i)).toBeInTheDocument();
    });
  });
});
