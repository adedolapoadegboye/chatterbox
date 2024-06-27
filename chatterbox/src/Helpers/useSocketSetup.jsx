import { useEffect, useContext } from "react";
import socket from "./socket";
import { accountContext } from "../Components/Context/Context";

const useSocketSetup = (setFriendsList) => {
  const { setUser } = useContext(accountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friendsList) => {
      // console.log(friendsList);
      setFriendsList(friendsList);
    });
    socket.on("connected", (status, username) => {
      setFriendsList((prevFriends) => {
        const friends = [...prevFriends];
        return friends.map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setUser, setFriendsList]);
};

export default useSocketSetup;
