import { useEffect, useContext } from "react";
import socket from "./socket";
import { accountContext } from "../Components/Context/Context";

const useSocketSetup = (setFriendsList) => {
  const { setUser } = useContext(accountContext);

  useEffect(() => {
    // Connect to the socket server
    socket.connect();

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

    // Handle connection errors
    const handleConnectError = () => {
      setUser({ loggedIn: false });
    };

    // Set up socket event listeners
    socket.on("friends", handleFriendsList);
    socket.on("connected", handleConnectionStatus);
    socket.on("connect_error", handleConnectError);

    // Cleanup function to remove event listeners
    return () => {
      socket.off("friends", handleFriendsList);
      socket.off("connected", handleConnectionStatus);
      socket.off("connect_error", handleConnectError);
    };
  }, [setUser, setFriendsList]);
};

export default useSocketSetup;
