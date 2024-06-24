import { useEffect, useContext } from "react";
import socket from "./socket";
import { accountContext } from "../Components/Context/Context";

const useSocketSetup = () => {
  const { setUser } = useContext(accountContext);
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setUser]);
};

export default useSocketSetup;
