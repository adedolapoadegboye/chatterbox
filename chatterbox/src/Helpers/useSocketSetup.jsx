import { useEffect, useContext } from "react";
import { accountContext } from "../Components/Context/Context";

const useSocketSetup = (setFriendsList, setMessages, socket) => {
  const { setUser } = useContext(accountContext);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not available");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    // Handle friends list received from the server
    const handleFriendsList = (friendsList) => {
      setFriendsList(friendsList);
    };

    // Handle connection status updates
    const handleConnectionStatus = (status, username) => {
      setFriendsList((prevFriends) => {
        return prevFriends.map((friend) => {
          if (friend.username === username) {
            return { ...friend, connected: status };
          }
          return friend;
        });
      });
    };

    // Handle connection errors with detailed logging
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
      setUser({ loggedIn: false });
    };

    // Handle chat history received from the server
    const handleChatHistory = (messages) => {
      setMessages(messages);
    };

    // Handle incoming messages
    const handleMessages = (message) => {
      console.log("Received message:", message.content);
      setMessages((msgHistory) => [message, ...msgHistory]);
    };

    // Set up socket event listeners
    socket.on("friends", handleFriendsList);
    socket.on("connected", handleConnectionStatus);
    socket.on("connect_error", handleConnectError);
    socket.on("messages", handleChatHistory);
    socket.on("dm", handleMessages);

    // Cleanup function to remove event listeners
    return () => {
      socket.off("friends", handleFriendsList);
      socket.off("connected", handleConnectionStatus);
      socket.off("connect_error", handleConnectError);
      socket.off("messages", handleChatHistory);
      socket.off("dm", handleMessages);
    };
  }, [setUser, setFriendsList, setMessages, socket]);
};

export default useSocketSetup;
